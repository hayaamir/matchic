"use server";
import { z } from "zod";
import { registerUser } from "@/lib/dal/auth/registerUser.dal";

const registerSchema = z.object({
  email: z.string().email("כתובת אימייל לא תקינה"),
  password: z.string().min(6, "סיסמה חייבת להכיל לפחות 6 תווים"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export const registerAction = async (prevState: unknown, formData: FormData) => {
  const validated = registerSchema.safeParse(Object.fromEntries(formData));
  if (!validated.success) return { error: validated.error.flatten().fieldErrors };

  try {
    await registerUser(validated.data);
    return { success: true };
  } catch (e) {
    if (e instanceof Error && e.message === "EMAIL_IN_USE") {
      return { error: "כתובת האימייל כבר רשומה במערכת" };
    }
    return { error: "שגיאת שרת" };
  }
};
