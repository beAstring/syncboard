"use-server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { title } from "process";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().nullable(),
  projectId: z.string(),
  deadline: z.date().optional().nullable(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).default("TODO"),
});

export async function createTask(data: z.infer<typeof taskSchema>) {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Unauthorized" };

  const member = await prisma.projectMember.findFirst({
    where: { projectId: data.projectId, userId },
  });

  if (!member)
    return { success: false, error: "Forbidden: Not a project member" };

  try {
    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        projectId: data.projectId,
        deadline: data.deadline,
        status: data.status,
      },
    });

    revalidatePath(`/projects/${data.projectId}`);
    return { success: true, task };
  } catch (e) {
    return { success: false, error: "Failed to create task" };
  }
}

export async function getProjectTasks(projectId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const member = await prisma.projectMember.findFirst({
    where: { projectId, userId },
  });

  if (!member) throw new Error("Access Denied");

  return await prisma.task.findMany({
    where: { projectId },
    include: {
      assignee: true,
    },
    orderBy: { createdAt: "desc" },
  });
}
