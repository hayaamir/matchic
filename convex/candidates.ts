"use server";
import { ConvexError, v } from "convex/values";
import { getManyViaOrThrow } from "convex-helpers/server/relationships";

import { mutation, query } from "./_generated/server";
import { vCandidateStatus, vGender, vSector } from "./enums";

export const createCandidate = mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    gender: vGender,
    idNumber: v.string(),
    phone: v.string(),
    dateOfBirth: v.string(),
    sector: vSector,
    status: vCandidateStatus,
  },
  handler: async (ctx, args) => {
    const existingCandidate = await ctx.db
      .query("candidates")
      .withIndex("byIdNumber", (q: any) => q.eq("idNumber", args.idNumber))
      .first();

    if (existingCandidate) {
      throw new ConvexError({
        type: "DUPLICATE_ENTRY",
        message: "CANDIDATE_ALREADY_EXISTS",
      });
    }

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const clerkUserId = identity.subject;

    const user = await ctx.db
      .query("users")
      .withIndex("byClerkUserId", (q) => q.eq("clerkUserId", clerkUserId))
      .unique();

    if (!user) {
      throw new Error("User document not found for this Clerk user");
    }

    const now = Date.now();
    const candidateId = await ctx.db.insert("candidates", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.insert("userCandidates", { userId: user._id, candidateId });
    return candidateId;
  },
});

export const updateCandidate = mutation({
  args: {
    id: v.id("candidates"),
    firstName: v.string(),
    lastName: v.string(),
    gender: vGender,
    dateOfBirth: v.string(),
    phone: v.string(),
    sector: vSector,
    status: vCandidateStatus,
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.patch(args.id, {
      ...args,
      updatedAt: now,
    });
  },
});

export const getCandidatesByUserId = query({
  args: {},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const clerkUserId = identity.subject;

    const user = await ctx.db
      .query("users")
      .withIndex("byClerkUserId", (q) => q.eq("clerkUserId", clerkUserId))
      .unique();

    if (!user) {
      throw new Error("User document not found for this Clerk user");
    }

    const candidates = await getManyViaOrThrow(
      ctx.db,
      "userCandidates",
      "candidateId",
      "byUserId",
      user._id,
      "userId"
    );
    return candidates;
  },
});
