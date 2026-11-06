"use client";

import { useState } from "react";
import styles from "./FriendRequest.module.scss";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { FriendRequestCard } from "../FriendRequestCard/FriendRequestCard";
import { Card } from "@/app/uikit/layout/Card/Card";
import { CardTitle } from "@/app/uikit/layout/CardTitle/CardTitle";
import { Button } from "@/app/uikit/form/Button/Button";
import { useFriendRequestsStore } from "@/app/hooks/friends/useFriendRequestsStore";
import { useFriendRequestActions } from "@/app/hooks/friends/useFriendRequestActions";
import { FriendRequest as FriendRequestType } from "@/types";

const VISIBLE_REQUESTS_COUNT = 3;

export const FriendRequest = () => {
  const t = useTranslations();
  const requests = useFriendRequestsStore((state) => state.requests);
  const { acceptRequest, rejectRequest } = useFriendRequestActions();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAccept = async (request: FriendRequestType) => {
    try {
      await acceptRequest(request);
      toast.success(t("friendRequest.acceptedSuccess"));
    } catch {
      toast.error(t("toasts.error"));
    }
  };

  const handleReject = async (request: FriendRequestType) => {
    try {
      await rejectRequest(request);
      toast.success(t("friendRequest.rejectedSuccess"));
    } catch {
      toast.error(t("toasts.error"));
    }
  };

  if (!requests.length) return null;

  const hasHiddenRequests =
    !isExpanded && requests.length > VISIBLE_REQUESTS_COUNT;
  const visibleRequests = hasHiddenRequests
    ? requests.slice(0, VISIBLE_REQUESTS_COUNT)
    : requests;

  return (
    <Card as="section" dataCy="friend-requests">
      <CardTitle count={requests.length}>
        {t("friendRequest.blockTitle")}
      </CardTitle>
      <ul className={styles.list}>
        {visibleRequests.map((request) => (
          <FriendRequestCard
            key={request.id}
            request={request}
            onAccept={handleAccept}
            onReject={handleReject}
          />
        ))}
      </ul>
      {hasHiddenRequests && (
        <Button
          appearance="minimal"
          className={styles.seeAll}
          onClick={() => setIsExpanded(true)}
        >
          {t("friendRequest.seeAll", { count: requests.length })}
        </Button>
      )}
    </Card>
  );
};
