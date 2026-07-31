import { Header } from "@/app/components/Header/Header";
import { FeedLayout } from "@/app/features/feed/FeedLayout/FeedLayout";

const FeedPage = () => {
  return (
    <>
      <Header />
      <main>
        <FeedLayout />
      </main>
    </>
  );
};

export default FeedPage;
