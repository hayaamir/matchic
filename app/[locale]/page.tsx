import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Login from "./login";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();

  if (session?.user) {
    redirect(`/${locale}/questionnaire`);
  }

  return <Login />;
}
