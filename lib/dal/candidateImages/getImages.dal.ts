import "server-only";
import { prisma } from "@/lib/prisma";

export async function getCandidateImages(candidateId: string) {
  return prisma.candidateImage.findMany({
    where: { candidateId },
    orderBy: { uploadedAt: "asc" },
  });
}
