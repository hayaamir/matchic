"use server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { uploadCandidateImage } from "@/lib/dal/candidateImages/uploadImage.dal";

const uploadSchema = z.object({
  candidateId: z.string().min(1),
});

export const uploadCandidateImagesAction = async (
  prevState: unknown,
  formData: FormData
) => {
  const session = await auth();
  if (!session?.user?.id) return { error: "לא מורשה" };

  const validated = uploadSchema.safeParse({ candidateId: formData.get("candidateId") });
  if (!validated.success) return { error: "candidateId חסר" };

  const files = formData.getAll("file") as File[];
  const validFiles = files.filter((f) => f.size > 0);
  if (validFiles.length === 0) return { error: "לא נבחרו קבצים" };

  try {
    const images = await Promise.all(
      validFiles.map((file) => uploadCandidateImage(validated.data.candidateId, file))
    );
    revalidatePath(`/candidates/${validated.data.candidateId}`);
    return { success: true, images };
  } catch {
    return { error: "שגיאת העלאה" };
  }
};
