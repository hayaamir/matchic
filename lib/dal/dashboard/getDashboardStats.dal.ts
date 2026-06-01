import "server-only";
import { prisma } from "@/lib/prisma";

export async function getDashboardStats(userId: string) {
  const userCandidates = await prisma.userCandidate.findMany({
    where: { userId },
    include: { candidate: true },
    orderBy: { candidate: { createdAt: "desc" } },
  });

  const candidates = userCandidates.map((uc) => uc.candidate);

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const byStatus = {
    active:      candidates.filter((c) => c.status === "active").length,
    in_date:     candidates.filter((c) => c.status === "in_date").length,
    found_match: candidates.filter((c) => c.status === "found_match").length,
    on_hold:     candidates.filter((c) => c.status === "on_hold").length,
  };

  const newThisWeek = candidates.filter(
    (c) => new Date(c.createdAt) >= weekAgo
  );

  // Age distribution from dateOfBirth
  const ageGroups = { "18-23": 0, "24-26": 0, "27-29": 0, "30-32": 0, "33+": 0 };
  candidates.forEach((c) => {
    if (!c.dateOfBirth) return;
    const dob = new Date(c.dateOfBirth);
    if (isNaN(dob.getTime())) return;
    let age = now.getFullYear() - dob.getFullYear();
    const m = now.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
    if (age <= 23) ageGroups["18-23"]++;
    else if (age <= 26) ageGroups["24-26"]++;
    else if (age <= 29) ageGroups["27-29"]++;
    else if (age <= 32) ageGroups["30-32"]++;
    else ageGroups["33+"]++;
  });

  // Monthly additions (last 6 months)
  const monthlyData: { month: string; count: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const next = new Date(d.getFullYear(), d.getMonth() + 1, 1);
    const hebrewMonths = ["ינו׳", "פבר׳", "מרץ", "אפר׳", "מאי", "יוני", "יולי", "אוג׳", "ספט׳", "אוק׳", "נוב׳", "דצמ׳"];
    monthlyData.push({
      month: hebrewMonths[d.getMonth()],
      count: candidates.filter((c) => {
        const t = new Date(c.createdAt);
        return t >= d && t < next;
      }).length,
    });
  }

  return {
    total: candidates.length,
    byStatus,
    newThisWeek: newThisWeek.slice(0, 4),
    ageGroups,
    monthlyData,
  };
}
