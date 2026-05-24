import "server-only";
import { prisma } from "@/lib/prisma";

export async function createCandidate(
  userId: string,
  data: {
    firstName: string;
    lastName: string;
    gender: "male" | "female";
    idNumber: string;
    phone: string;
    dateOfBirth: string;
    sector?: string;
    status?: string;
  }
) {
  const existing = await prisma.candidate.findUnique({
    where: { idNumber: data.idNumber },
  });
  if (existing) throw new Error("CANDIDATE_ALREADY_EXISTS");

  return prisma.candidate.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      fullName: `${data.firstName} ${data.lastName}`,
      gender: data.gender,
      idNumber: data.idNumber,
      phone: data.phone,
      dateOfBirth: data.dateOfBirth,
      sector: (data.sector as any) ?? "chabad",
      status: (data.status as any) ?? "active",
      userCandidates: {
        create: { userId },
      },
    },
  });
}
