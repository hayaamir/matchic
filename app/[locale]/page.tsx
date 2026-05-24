import { auth } from "@/auth";
import { redirect } from "next/navigation";

const Home = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  const session = await auth();

  if (session?.user) {
    redirect(`/${locale}/questionnaire`);
  }

  redirect(`/${locale}/login`);
};

export default Home;
