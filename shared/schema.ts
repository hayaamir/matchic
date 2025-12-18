import { z } from "zod";

export const zGender = z.union([z.literal("male"), z.literal("female")]);

export const zSector = z.union([z.literal("chabad")]);

export const zCandidateStatus = z.union([
  z.literal("active"),
  z.literal("in_date"),
  z.literal("found_match"),
  z.literal("on_hold"),
]);

export const zMatchStatus = z.union([
  z.literal("active"),
  z.literal("not_match"),
  z.literal("matched"),
]);

export const zSubscriptionPlan = z.union([
  z.literal("basic"),
  z.literal("premium"),
  z.literal("pro"),
]);

export const zSubscriptionStatus = z.union([
  z.literal("active"),
  z.literal("expired"),
  z.literal("trial"),
]);

export const zUsersTable = z.object({
  clerkUserId: z.string(),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email({
    message: "כתובת אימייל לא תקינה",
  }),
  phone: z
    .string()
    .min(9)
    .regex(/^[\d\s\-\+\(\)]+$/, {
      message: "not valid",
    }),
  subscriptionPlan: zSubscriptionPlan,
  subscriptionStatus: zSubscriptionStatus,
  subscriptionExpiry: z.number().optional(),
  isActive: z.boolean(),
  profilePicture: z.string().optional(),
  bio: z.string().optional(),
  specializations: z.array(zSector).optional(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export const zCandidatesTable = z.object({
  firstName: z.string().min(2, "at least 2 min"),
  lastName: z.string().min(2, "at least 2 min"),
  gender: zGender,
  idNumber: z.string().length(9).regex(/^\d+$/, {
    message: "ID number must contain exactly 9 digits",
  }),
  phone: z.string().min(9, "Phone number must be at least 9 characters"),
  dateOfBirth: z.string(),
  sector: zSector,
  status: zCandidateStatus,
  createdAt: z.number(),
  updatedAt: z.number(),
});

export const zMatchmakersCandidatesTable = z.object({
  candidateId: z.string(),
  shadchanId: z.string(),
});

export const zmatchesTable = z.object({
  candidateAId: z.string(),
  candidateBId: z.string(),
  shadchanAId: z.string(),
  shadchanBId: z.string(),
  status: zMatchStatus,
  createdAt: z.number(),
  updatedAt: z.number(),
});
