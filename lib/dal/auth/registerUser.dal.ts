import "server-only";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function registerUser({
  email,
  password,
  firstName,
  lastName,
}: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error("EMAIL_IN_USE");

  const hashedPassword = await bcrypt.hash(password, 12);

  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      name: [firstName, lastName].filter(Boolean).join(" ") || null,
    },
  });
}
