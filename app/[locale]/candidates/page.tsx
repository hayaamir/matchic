"use client";
import { CandidateCard } from "@/components/CandidateCard";
import { useGetCandidatesByUserId } from "@/hooks/candidate";

const Candidates = () => {
  const candidates = useGetCandidatesByUserId();

  if (candidates === undefined) return <div>Loading...</div>;

  return (
    // <ul>
    //   {candidates.map((c) => (
    //     <li key={c._id}>{c.firstName}</li>
    //   ))}
    // </ul>

    <CandidateCard status="active" full_name={"Haya Amir"} />
  );
};

export default Candidates;
