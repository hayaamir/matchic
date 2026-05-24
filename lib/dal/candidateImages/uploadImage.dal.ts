import "server-only";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";

export async function uploadCandidateImage(candidateId: string, file: File) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), "public", "uploads", candidateId);
  await mkdir(uploadDir, { recursive: true });

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const fileName = `${Date.now()}-${safeName}`;
  await writeFile(path.join(uploadDir, fileName), buffer);

  return prisma.candidateImage.create({
    data: {
      candidateId,
      url: `/uploads/${candidateId}/${fileName}`,
      format: file.type || "image",
    },
  });
}
