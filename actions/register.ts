"use server";

import { prisma } from "@/lib/prisma";
import { RegisterSchema } from "@/lib/validations/auth";
import bcrypt from "bcryptjs";
import { success } from "zod";

export default async function RegisterUser(data: {
  identifier: string;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}) {
  console.log("register user called");
  const result = RegisterSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { identifier, name, email, password } = result.data;

  const existingUsername = await prisma.user.findFirst({
    where: {
      username : identifier,
    },
  });

  if (existingUsername) {
    return {
      success: false,
      errors: {
        identifier: ["Username is already taken"],
      },
    };
  }

  const existingEmail = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (existingEmail) {
    return {
      success: false,
      errors: {
        email: ["Email is already taken"],
      },
    };
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      username : identifier,
      name,
      email,
      password: hashedPassword,
    },
  });

  return {
    success: true,
  };
}
