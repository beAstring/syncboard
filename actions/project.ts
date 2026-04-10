"use-server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { success, z } from "zod";
import prisma from "@/lib/prisma";

// zod validation
const projectSchema = z.object({
  name: z
    .string()
    .min(1, "Project Name is Required")
    .max(100, "Name is too long"),
  description: z.string().optional().nullable(),
  endDate: z.date().optional().nullable(),
});

export async function createProject(formData: z.infer<typeof projectSchema>) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "Unauthorized: you must be logged in" };
  }

  const validateFields = projectSchema.safeParse(formData);

  if (!validateFields.success) {
    return {
      success: false,
      error: "Invalid input data",
      details: validateFields.error.flatten().fieldErrors,
    };
  }

  const { name, description, endDate } = validateFields.data;

  try {
    const project = await prisma.project.create({
      data: {
        name,
        description,
        endDate,
        creatorId: userId,
        nembers: {
          create: {
            userId: userId,
            role: "ADMIN",
          },
        },
      },
    });

    revalidatePath("/dashboard");

    return { success: true, projectId: project.id };
  } catch (error) {
    console.error("Database error creating project: ", error);
    return { success: false, error: "Failed to create project in database " };
  }
}

export async function getUserProjects() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const projects = await prisma.project.findMany({
      where: {
        members: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        members: true,
        tasks: {
          select: { status: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return projects;
  } catch (error) {
    console.error("Database error fetching projects:", error);
    return [];
  }
}

export async function joinProject(projectId: string) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "UnAuthorized" };
  }

  try {
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });

    if (!project) {
      return { success: false, error: "Project Not Found" };
    }

    const existingUser = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
    });

    if (!existingUser) {
      return {
        success: false,
        error: "You are already member of this project",
      };
    }

    await prisma.projectMember.create({
      data: {
        projectId,
        userId,
        role: "MEMBER",
      },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Join project error : ", error);
    return { success: false, error: "error while joining project" };
  }
}
