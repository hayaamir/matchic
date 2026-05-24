import type { Candidate } from "@prisma/client";
import { CandidateCard } from "./CandidateCard";

type CandidatesSectionProps = {
  candidates: Candidate[];
};

export const CandidatesSection = ({ candidates }: CandidatesSectionProps) => {
  return (
    <div className="p-4 w-full overflow-x-hidden overflow-y-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-4 gap-y-9">
        {candidates.map((c) => (
          <CandidateCard
            key={c.id}
            status={c.status}
            fullName={c.firstName + " " + c.lastName}
            createdAt={new Date(c.createdAt).getTime()}
          />
        ))}
      </div>
    </div>
  );
};
