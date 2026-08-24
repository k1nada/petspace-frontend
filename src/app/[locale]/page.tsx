import { redirect } from "next/navigation";
import { ROUTES } from "@/routes/routes";

interface LocaleHomePageProps {
  params: Promise<{ locale: string }>;
}

const LocaleHomePage = async ({ params }: LocaleHomePageProps) => {
  const { locale } = await params;
  redirect(`/${locale}${ROUTES.signin}`);
};

export default LocaleHomePage;
