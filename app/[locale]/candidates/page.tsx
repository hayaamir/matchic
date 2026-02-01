"use client";

import { useTranslations } from "next-intl";

import { usePaginatedCandidates } from "@/hooks/candidate";
import { CandidatesSection } from "@/components/CandidatesSection";
import { GenderFilter } from "@/components/GenderFilter";
import { useState } from "react";

const Candidates = () => {
  const t = useTranslations();
  const [selectedGender, setSelectedGender] = useState<
    "male" | "female" | undefined
  >(undefined);

  const {
    results: recentResults,
    status: recentStatus,
    loadMore: loadMoreRecent,
    isLoading: isLoadingRecent,
  } = usePaginatedCandidates(selectedGender);

  if (recentResults.length === 0) {
    return (
      <div className="m-6 text-center">
        <GenderFilter value={selectedGender} onChange={setSelectedGender} />
        <div className="mt-10 text-gray-500 text-lg font-medium">
          לא נמצאו מועמדים התואמים לחיפוש
        </div>
      </div>
    );
  }

  return (
    <div className="m-6">
      <GenderFilter value={selectedGender} onChange={setSelectedGender} />
      <CandidatesSection candidates={recentResults} />;
    </div>
  );
};

export default Candidates;
