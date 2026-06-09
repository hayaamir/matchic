import "server-only";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/prisma";

export async function uploadCandidateImage(candidateId: string, file: File) {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const pathname = `candidates/${candidateId}/${Date.now()}-${safeName}`;

  const { url } = await put(pathname, file, { access: "public" });

  return prisma.candidateImage.create({
    data: {
      candidateId,
      url,
      format: file.type || "image",
    },
  });
}
