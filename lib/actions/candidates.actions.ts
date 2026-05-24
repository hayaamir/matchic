"use server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { createCandidate } from "@/lib/dal/candidates/createCandidate.dal";
import { updateCandidate } from "@/lib/dal/candidates/updateCandidate.dal";

const createSchema = z.object({
  firstName: z.string().min(2, "שדה חובה"),
  lastName: z.string().min(2, "שדה חובה"),
  gender: z.enum(["male", "female"]),
  idNumber: z.string().length(9).regex(/^\d+$/, "תעודת זהות חייבת להכיל 9 ספרות"),
  phone: z.string().min(9, "מספר טלפון לא תקין"),
  dateOfBirth: z.string().min(1, "שדה חובה"),
  sector: z.enum(["chabad"]).default("chabad"),
  status: z.enum(["active", "in_date", "found_match", "on_hold"]).default("active"),
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
    const candidate = await createCandidate(session.user.id, validated.data);
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
