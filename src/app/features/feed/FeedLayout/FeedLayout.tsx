"use client";

import styles from "./FeedLayout.module.scss";
import { useTranslations } from "next-intl";
import { Sidebar } from "@/app/components/Sidebar/Sidebar";
import { Tip } from "@/app/uikit/feedback/Tip/Tip";
import { Postwall } from "@/app/features/profile/feed/Postwall/Postwall";
import { MOCK_POSTS } from "@/utils/profile";

export const FeedLayout = () => {
  const t = useTranslations();

  return (
    <div className={styles.layout}>
      <div className={styles.sidebar}>
        <Sidebar />
      </div>
      <div className={styles.content}>
        <Postwall posts={MOCK_POSTS} onRefresh={() => {}} />
      </div>
      <div className={styles.rightColumn}>
        <Tip
          title={t("feedTip.title")}
          text={t("feedTip.text")}
          appearance="secondary"
        />
      </div>
    </div>
  );
};
