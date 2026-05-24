import "server-only";
import { prisma } from "@/lib/prisma";
import type { Candidate, UserCandidate } from "@prisma/client";

export async function getCandidates(
  userId: string,
  {
    gender,
    limit,
    cursor,
  }: {
    gender?: "male" | "female" | null;
    limit: number;
    cursor?: string;
  }
) {
  const userCandidates = await prisma.userCandidate.findMany({
    where: {
      userId,
      ...(gender ? { candidate: { gender } } : {}),
    },
    include: { candidate: true },
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    orderBy: { candidate: { createdAt: "desc" } },
  });

  const hasMore = userCandidates.length > limit;
  const page = userCandidates
    .slice(0, limit)
    .map((uc: UserCandidate & { candidate: Candidate }) => uc.candidate);
  const nextCursor = hasMore ? userCandidates[limit - 1].id : null;

  return { page, nextCursor, hasMore };
}
