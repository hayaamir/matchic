"use server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { createCandidate } from "@/lib/dal/candidates/createCandidate.dal";
import { updateCandidate } from "@/lib/dal/candidates/updateCandidate.dal";

const createSchema = z.object({
  firstName: z.string().min(2, "שדה חובה"),
  lastName: z.string().min(2, "שדה חובה"),
  gender: z.union([z.literal("male"), z.literal("female")]).optional(),
  idNumber: z.string().optional(),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  sector: z.union([z.literal("chabad")]).default("chabad"),
  status: z.union([z.literal("active"), z.literal("in_date"), z.literal("found_match"), z.literal("on_hold")]).default("active"),
});

const updateSchema = createSchema.extend({
  id: z.string().min(1),
});

export const createCandidateAction = async (prevState: unknown, formData: FormData) => {
  const session = await auth();
  if (!session?.user?.id) return { error: "לא מורשה" };

  const validated = createSchema.safeParse(Object.fromEntries(formData));
  if (!validated.success) return { error: validated.error.flatten().fieldErrors };

  try {
    const candidate = await createCandidate(session.user.id, {
      ...validated.data,
      gender: validated.data.gender ?? "female",
      idNumber: validated.data.idNumber || crypto.randomUUID(),
      phone: validated.data.phone ?? "",
      dateOfBirth: validated.data.dateOfBirth ?? "",
    });
    revalidatePath("/candidates");
    return { success: true, id: candidate.id };
  } catch (e) {
    if (e instanceof Error && e.message === "CANDIDATE_ALREADY_EXISTS") {
      return { error: { idNumber: ["מועמד עם תעודת זהות זו כבר קיים"] } };
    }
    return { error: "שגיאת שרת" };
  }
};

export const updateCandidateAction = async (prevState: unknown, formData: FormData) => {
  const session = await auth();
  if (!session?.user?.id) return { error: "לא מורשה" };

  const validated = updateSchema.safeParse(Object.fromEntries(formData));
  if (!validated.success) return { error: validated.error.flatten().fieldErrors };

  const { id, ...data } = validated.data;

  try {
    await updateCandidate(id, data);
    revalidatePath("/candidates");
    revalidatePath(`/candidates/${id}`);
    return { success: true };
  } catch {
    return { error: "שגיאת שרת" };
  }
};
