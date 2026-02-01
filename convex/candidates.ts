"use server";
import { ConvexError, v } from "convex/values";
import { getManyViaOrThrow } from "convex-helpers/server/relationships";
import { paginationOptsValidator } from "convex/server";
import { stream } from "convex-helpers/server/stream";
import { faker } from "@faker-js/faker";

import { internalMutation } from "./_generated/server";
import { mutation, query } from "./_generated/server";
import { vCandidateStatus, vGender, vSector } from "./enums";
import schema from "./schema";

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

export const getPaginatedCandidates = query({
  args: {
    paginationOpts: paginationOptsValidator,
    gender: v.optional(vGender),
  },
  handler: async (ctx, { paginationOpts, gender }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const clerkUserId = identity.subject;

    const user = await ctx.db
      .query("users")
      .withIndex("byClerkUserId", (q) => q.eq("clerkUserId", clerkUserId))
      .unique();

    if (!user) throw new Error("User document not found for this Clerk user");

    const result = await stream(ctx.db, schema)
      .query("userCandidates")
      .withIndex("byUserId", (q) => q.eq("userId", user._id))
      .map(async (userCandidate) => {
        const candidate = await ctx.db.get(userCandidate.candidateId);
        return { ...userCandidate, candidate };
      })

      .filterWith(async (doc) => {
        if (!gender) return true;
        return doc.candidate?.gender === gender;
      })
      .paginate(paginationOpts);

    return {
      ...result,
      page: result.page
        .map((item) => item.candidate)
        .filter((c): c is NonNullable<typeof c> => c !== null),
    };
  },
});

export const createFakeCandidates = internalMutation(async (ctx) => {
  faker.seed();
  const statuses = ["active", "in_date", "found_match", "on_hold"] as const;
  const genders = ["male", "female"] as const;

  for (let i = 0; i < 20; i++) {
    const now = Date.now();
    await ctx.db.insert("candidates", {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      gender: genders[Math.floor(Math.random() * genders.length)],
      idNumber: faker.string.numeric(9),
      phone: faker.phone.number(),
      dateOfBirth: faker.date.past({ years: 30 }).toISOString(),
      sector: "chabad",
      status: statuses[Math.floor(Math.random() * statuses.length)],
      createdAt: now,
      updatedAt: now,
    });
  }
});

export const LinkAllCandidatesToUser = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const allCandidates = await ctx.db.query("candidates").collect();

    for (const candidate of allCandidates) {
      await ctx.db.insert("userCandidates", {
        userId,
        candidateId: candidate._id,
      });
    }
  },
});
