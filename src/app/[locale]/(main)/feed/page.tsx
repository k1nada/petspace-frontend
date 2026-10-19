import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { FeedLayout } from "@/app/features/feed/FeedLayout/FeedLayout";

interface FeedPageProps {
  params: Promise<{ locale: string }>;
}

export const generateMetadata = async ({
  params,
}: FeedPageProps): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return {
    title: t("metadata.feed.title"),
    description: t("metadata.feed.description"),
  };
};

const FeedPage = () => {
  return <FeedLayout />;
};

export default FeedPage;
