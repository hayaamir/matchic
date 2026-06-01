import type { Candidate } from "@prisma/client";
import { CandidateCard } from "./CandidateCard";
import { CandidateStatus } from "@/lib/types";

type CandidatesSectionProps = {
  candidates: Candidate[];
};

const PORTRAIT_TONES = ["blush", "warm", "sand", "moss", "dusk", "rose", "sky"] as const;

export const CandidatesSection = ({ candidates }: CandidatesSectionProps) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: 24,
        rowGap: 32,
      }}
    >
      {candidates.map((c, i) => (
        <CandidateCard
          key={c.id}
          id={c.id}
          status={c.status as CandidateStatus}
          fullName={c.firstName + " " + c.lastName}
          sector={c.sector ?? undefined}
          dateOfBirth={c.dateOfBirth ?? undefined}
          createdAt={c.createdAt}
          tone={PORTRAIT_TONES[i % PORTRAIT_TONES.length]}
        />
      ))}
    </div>
  );
};
