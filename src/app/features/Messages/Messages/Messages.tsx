"use client";

import { useState } from "react";
import styles from "./Messages.module.scss";
import { Avatar } from "@/app/uikit/user/Avatar/Avatar";
import { SubmitTextarea } from "@/app/uikit/form/SubmitTextarea/SumbitTextarea";
import { useTranslations } from "next-intl";
import { User, Friend } from "@/types";
import { Button } from "@/app/uikit/form/Button/Button";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/routes/routes";

interface MessagesProps {
  friends: Friend[];
  user: User;
}

export const Messages = ({ user, friends }: MessagesProps) => {
  const t = useTranslations();
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSend = () => {
    setMessage("");
  };

  const findFriends = () => {
    router.push(ROUTES.friends(user.username));
  };

  return (
    <section className={styles.container}>
      {friends.length > 0 ? (
        <>
          {/* <div className={styles.userInfo}>
            <div className={styles.user}>
              <Avatar size={45} />
              <div className={styles.info}>
                <strong className={styles.name}>Max</strong>
                <span className={styles.status}>Online</span>
              </div>
            </div>
          </div>
          <ul className={styles.list}></ul>
          <div className={styles.input}>
            <SubmitTextarea
              value={message}
              onChange={setMessage}
              onSubmit={handleSend}
              placeholder={t("messages.placeholder")}
            />
          </div> */}
        </>
      ) : (
        <div className={styles.emptyMessages}>
          <p className={styles.emptyTitle}>No barks yet</p>
          <p className={styles.emptyText}>
            Your inbox is quieter than a sleeping puppy.
            <br />
            Find a dog and start chatting!
          </p>
          <div>
            <Button appearance="primary" onClick={findFriends}>
              Find a dog
            </Button>
          </div>
        </div>
      )}
    </section>
  );
};
