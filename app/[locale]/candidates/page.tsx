import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getCandidates } from "@/lib/dal/candidates/getCandidates.dal";
import { CandidatesSection } from "@/components/CandidatesSection";
import { GenderFilter } from "@/components/GenderFilter";

type Props = {
  searchParams: Promise<{ gender?: string }>;
};

export default async function CandidatesPage({ searchParams }: Props) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { gender } = await searchParams;
  const validGender =
    gender === "male" || gender === "female" ? gender : undefined;

  const { page } = await getCandidates(session.user.id, {
    gender: validGender,
    limit: 50,
  });

  return (
    <div className="m-6">
      <GenderFilter />
      {page.length === 0 ? (
        <div className="mt-10 text-center text-gray-500 text-lg font-medium">
          לא נמצאו מועמדים התואמים לחיפוש
        </div>
      ) : (
        <CandidatesSection candidates={page} />
      )}
    </div>
  );
}
