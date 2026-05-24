import "server-only";
import { prisma } from "@/lib/prisma";
import type { Gender, Sector, CandidateStatus } from "@prisma/client";

export async function updateCandidate(
  id: string,
  data: {
    firstName: string;
    lastName: string;
    gender?: Gender;
    idNumber?: string;
    phone?: string;
    dateOfBirth?: string;
    sector?: Sector;
    status?: CandidateStatus;
  },
) {
  return prisma.candidate.update({
    where: { id },
    data: {
      ...data,
      fullName: `${data.firstName} ${data.lastName}`,
    },
  });
}
