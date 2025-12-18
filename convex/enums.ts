import { v, Infer } from "convex/values";

export const vGender = v.union(v.literal("male"), v.literal("female"));
export type Gender = Infer<typeof vGender>;

export const vSector = v.union(v.literal("chabad"));
export type Sector = Infer<typeof vSector>;

export const vCandidateStatus = v.union(
  v.literal("active"),
  v.literal("in_date"),
  v.literal("found_match"),
  v.literal("on_hold")
);
export type CandidateStatus = Infer<typeof vCandidateStatus>;

export const vMatchStatus = v.union(
  v.literal("active"),
  v.literal("not_match"),
  v.literal("matched")
);
export type MatchStatus = Infer<typeof vMatchStatus>;

export const vSubscriptionPlan = v.union(
  v.literal("basic"),
  v.literal("premium"),
  v.literal("pro")
);
export type SubscriptionPlan = Infer<typeof vSubscriptionPlan>;

export const vSubscriptionStatus = v.union(
  v.literal("active"),
  v.literal("expired"),
  v.literal("trial")
);
export type SubscriptionStatus = Infer<typeof vSubscriptionStatus>;
