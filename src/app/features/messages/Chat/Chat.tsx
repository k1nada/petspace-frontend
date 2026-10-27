"use client";

import { Fragment, useState, useEffect, useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";
import socket from "@/services/socket";
import styles from "./Chat.module.scss";
import { Avatar } from "@/app/uikit/user/Avatar/Avatar";
import { Button } from "@/app/uikit/form/Button/Button";
import { SubmitTextarea } from "@/app/uikit/form/SubmitTextarea/SubmitTextarea";
import { useLocale, useTranslations } from "next-intl";
import { ROUTES } from "@/routes/routes";
import {
  ChatContact,
  Message,
  SendMessageAck,
  SharedPhoto,
  User,
} from "@/types";
import { ChatMessage } from "../ChatMessage/ChatMessage";
import { PhotoModal } from "@/app/features/photos/PhotoModal/PhotoModal";
import { Link } from "@/app/uikit/navigation/Link/Link";
import { formatChatDayLabel, formatTime } from "@/utils/dateFormatters";
import {
  MAX_MESSAGE_LENGTH,
  SEND_TIMEOUT_MS,
  SOCKET_EVENTS,
  getRoomId,
} from "@/utils/chat";
import { ChatMessagesSkeleton, ChatSkeleton } from "./ChatSkeleton";
import { getMessages } from "@/services/api/conversations";
import { useMessagesStore } from "@/app/hooks/messages/useMessagesStore";
import { useChatMessagesStore } from "@/app/hooks/messages/useChatMessagesStore";
import {
  useLastSeenText,
  useUserPresence,
} from "@/app/hooks/shared/useUserPresence";
import {
  getSentMessages,
  syncRoomMessages,
} from "@/app/hooks/messages/syncRoomMessages";
import { FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";

const NEAR_BOTTOM_PX = 80;
const LOAD_OLDER_PX = 100;

const NO_MESSAGES: Message[] = [];
const SKELETON_DELAY_MS = 300;

const isSameDay = (a: string, b: string) =>
  new Date(a).toDateString() === new Date(b).toDateString();

const GROUP_GAP_MS = 3 * 60 * 1000;

const isSameGroup = (first: Message, second: Message) =>
  first.sender?.id === second.sender?.id &&
  isSameDay(first.createdAt, second.createdAt) &&
  Math.abs(
    new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime(),
  ) <= GROUP_GAP_MS;

const createTempId = () =>
  `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;

interface ChatProps {
  conversations: ChatContact[];
  user: User;
  conversationsLoading?: boolean;
  selectedChat?: ChatContact;
  isChatPending?: boolean;
  isUserNotFound?: boolean;
  onMessagesLoaded?: () => void;
  onBack?: () => void;
}

export const Chat = ({
  user,
  conversations,
  conversationsLoading,
  selectedChat,
  isChatPending,
  isUserNotFound,
  onMessagesLoaded,
  onBack,
}: ChatProps) => {
  const t = useTranslations();
  const locale = useLocale();
  const [message, setMessage] = useState("");
  const [loadFailed, setLoadFailed] = useState(false);
  const [hasNewBelow, setHasNewBelow] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [openedPhoto, setOpenedPhoto] = useState<SharedPhoto | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const isNearBottomRef = useRef(true);
  const lastMessageIdRef = useRef<string | null>(null);
  const distanceFromBottomRef = useRef<number | null>(null);
  const setActiveRoomId = useMessagesStore((state) => state.setActiveRoomId);
  const addNewMessages = useChatMessagesStore((state) => state.addNewMessages);
  const addOlderMessages = useChatMessagesStore(
    (state) => state.addOlderMessages,
  );
  const setLoadingOlder = useChatMessagesStore(
    (state) => state.setLoadingOlder,
  );
  const confirmMessage = useChatMessagesStore((state) => state.confirmMessage);
  const setMessageStatus = useChatMessagesStore(
    (state) => state.setMessageStatus,
  );
  const presence = useUserPresence(selectedChat);
  const lastSeenText = useLastSeenText(presence.lastSeen);

  const roomId = selectedChat ? getRoomId(user.id, selectedChat.id) : null;
  const room = useChatMessagesStore((state) =>
    roomId ? state.rooms[roomId] : undefined,
  );
  const messages = room?.messages ?? NO_MESSAGES;
  const messagesLoading = !!roomId && !room?.isLoaded && !loadFailed;
  const isListShown =
    !!selectedChat && !conversationsLoading && !messagesLoading;
  const [isSlowLoading, setIsSlowLoading] = useState(false);

  const scrollToBottom = () => {
    const list = listRef.current;
    if (!list) return;
    list.scrollTop = list.scrollHeight;
    isNearBottomRef.current = true;
  };

  const handleNewMessagesClick = () => {
    scrollToBottom();
    setHasNewBelow(false);
  };

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;

    if (distanceFromBottomRef.current !== null) {
      list.scrollTop = list.scrollHeight - distanceFromBottomRef.current;
      distanceFromBottomRef.current = null;
      return;
    }

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.id === lastMessageIdRef.current) return;
    lastMessageIdRef.current = lastMessage.id;

    const isOwn = lastMessage.sender?.id === user.id;
    if (isOwn || isNearBottomRef.current) scrollToBottom();
  }, [messages, isListShown, user.id]);

  useEffect(() => {
    if (!roomId) return;
    return useChatMessagesStore.subscribe((state, prevState) => {
      const current = state.rooms[roomId]?.messages ?? NO_MESSAGES;
      const previous = prevState.rooms[roomId]?.messages ?? NO_MESSAGES;
      const last = current[current.length - 1];
      const previousLast = previous[previous.length - 1];
      if (!last || last.id === previousLast?.id) return;
      if (last.sender?.id === user.id || isNearBottomRef.current) return;
      setHasNewBelow(true);
    });
  }, [roomId, user.id]);

  useEffect(() => {
    if (!roomId) return;

    setActiveRoomId(roomId);

    let cancelled = false;

    if (useChatMessagesStore.getState().rooms[roomId]?.isLoaded) {
      onMessagesLoaded?.();
    }

    syncRoomMessages(roomId)
      .catch(() => {
        if (cancelled) return;
        toast.error(t("toasts.error"));
        setLoadFailed(true);
      })
      .finally(() => {
        if (!cancelled) onMessagesLoaded?.();
      });

    return () => {
      cancelled = true;
      setActiveRoomId(null);
    };
  }, [roomId, onMessagesLoaded, setActiveRoomId, t]);

  useEffect(() => {
    if (!messagesLoading) return;
    const timer = setTimeout(() => setIsSlowLoading(true), SKELETON_DELAY_MS);
    return () => {
      clearTimeout(timer);
      setIsSlowLoading(false);
    };
  }, [messagesLoading]);

  useEffect(() => {
    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, []);

  const retryLoad = () => {
    if (!roomId) return;
    setLoadFailed(false);
    syncRoomMessages(roomId).catch(() => {
      toast.error(t("toasts.error"));
      setLoadFailed(true);
    });
  };

  const loadOlder = () => {
    if (!roomId) return;
    const currentRoom = useChatMessagesStore.getState().rooms[roomId];
    const oldest = currentRoom
      ? getSentMessages(currentRoom.messages)[0]
      : null;
    if (!currentRoom?.hasMore || currentRoom.isLoadingOlder || !oldest) return;

    setLoadingOlder(roomId, true);
    getMessages(roomId, { before: oldest.id })
      .then((page) => {
        const list = listRef.current;
        if (list && page.messages.length > 0) {
          distanceFromBottomRef.current = list.scrollHeight - list.scrollTop;
        }
        addOlderMessages(roomId, page.messages, page.hasMore);
      })
      .catch(() => {
        setLoadingOlder(roomId, false);
        toast.error(t("toasts.error"));
      });
  };

  const handleScroll = () => {
    const list = listRef.current;
    if (!list) return;

    const distanceFromBottom =
      list.scrollHeight - list.scrollTop - list.clientHeight;
    isNearBottomRef.current = distanceFromBottom < NEAR_BOTTOM_PX;
    if (isNearBottomRef.current) setHasNewBelow(false);

    if (list.scrollTop < LOAD_OLDER_PX) loadOlder();
  };

  const sendToServer = (tempId: string, text: string) => {
    if (!roomId) return;
    if (!socket.connected) {
      setMessageStatus(roomId, tempId, "failed");
      return;
    }
    socket
      .timeout(SEND_TIMEOUT_MS)
      .emit(
        SOCKET_EVENTS.MESSAGE,
        { roomId, text, tempId },
        (err: Error | null, response?: SendMessageAck) => {
          if (err || !response?.message) {
            setMessageStatus(roomId, tempId, "failed");
            return;
          }
          confirmMessage(roomId, tempId, response.message);
        },
      );
  };

  const handleSend = () => {
    const text = message.trim();
    if (!text || !roomId) return;

    const tempId = createTempId();
    addNewMessages(roomId, [
      {
        id: tempId,
        tempId,
        roomId,
        text,
        createdAt: new Date().toISOString(),
        sender: user,
        post: null,
        status: "sending",
      },
    ]);
    setMessage("");
    sendToServer(tempId, text);
  };

  const handleRetry = (failed: Message) => {
    if (!roomId || !failed.tempId) return;
    setMessageStatus(roomId, failed.tempId, "sending");
    sendToServer(failed.tempId, failed.text);
  };

  if (conversationsLoading || isChatPending) return <ChatSkeleton />;

  if (!selectedChat && isUserNotFound) {
    return (
      <section className={styles.container}>
        {onBack && (
          <Button
            appearance="ghost"
            className={styles.backButton}
            onClick={onBack}
          >
            <FaArrowLeft size={18} />
          </Button>
        )}
        <div className={styles.emptyMessages}>
          <p className={styles.emptyTitle}>{t("chat.userNotFound")}</p>
        </div>
      </section>
    );
  }

  if (!selectedChat && conversations.length > 0) {
    return (
      <section className={styles.container}>
        <div className={styles.emptyMessages}>
          <p className={styles.emptyTitle}>{t("chat.selectFriend")}</p>
        </div>
      </section>
    );
  }

  if (!selectedChat) {
    return (
      <section className={styles.container}>
        <div className={styles.emptyMessages}>
          <p className={styles.emptyTitle}>{t("chat.noBarks")}</p>
          <p className={styles.emptyText}>{t("chat.emptyInbox")}</p>
        </div>
      </section>
    );
  }

  let statusText = lastSeenText ?? t("common.offline");
  if (presence.isOnline) statusText = t("common.online");

  return (
    <section className={styles.container}>
      <div className={styles.userInfo}>
        <div className={styles.user}>
          {onBack && (
            <Button
              appearance="ghost"
              className={styles.backButton}
              onClick={onBack}
            >
              <FaArrowLeft size={18} />
            </Button>
          )}
          <Link href={ROUTES.profile(selectedChat.username)}>
            <Avatar src={selectedChat.avatar} size={45} />
          </Link>
          <div className={styles.info}>
            <span className={styles.name}>{selectedChat.name}</span>
            <span className={presence.isOnline ? styles.online : styles.status}>
              {statusText}
            </span>
          </div>
        </div>
      </div>
      {!isConnected && (
        <div className={styles.connectionBanner}>{t("chat.noConnection")}</div>
      )}
      <ul className={styles.list} ref={listRef} onScroll={handleScroll}>
        {messagesLoading && isSlowLoading && <ChatMessagesSkeleton />}
        {loadFailed && messages.length === 0 && (
          <li className={styles.emptyMessages}>
            <p className={styles.emptyTitle}>{t("chat.loadFailed")}</p>
            <Button appearance="primary" onClick={retryLoad}>
              {t("chat.retry")}
            </Button>
          </li>
        )}
        {!loadFailed && room?.isLoaded && messages.length === 0 && (
          <li className={styles.emptyMessages}>
            <p className={styles.emptyText}>{t("chat.firstMessage")}</p>
          </li>
        )}
        {room?.isLoadingOlder && (
          <li className={styles.loadingOlder}>{t("chat.loadingOlder")}</li>
        )}
        {messages.map((msg, index) => {
          const previous = messages[index - 1];
          const next = messages[index + 1];
          const isNewDay =
            !previous || !isSameDay(previous.createdAt, msg.createdAt);
          const isGroupStart = !previous || !isSameGroup(previous, msg);
          const isGroupEnd = !next || !isSameGroup(msg, next);
          return (
            <Fragment key={msg.tempId ?? msg.id}>
              {isNewDay && (
                <li className={styles.dayDivider}>
                  <span>
                    {formatChatDayLabel(
                      msg.createdAt,
                      locale,
                      t("dates.today"),
                      t("dates.yesterday"),
                    )}
                  </span>
                </li>
              )}
              <ChatMessage
                text={msg.text}
                post={msg.post}
                photo={msg.photo}
                onOpenPhoto={() => setOpenedPhoto(msg.photo ?? null)}
                time={formatTime(msg.createdAt, locale)}
                isOwn={msg.sender?.id === user.id}
                status={msg.status}
                isGroupStart={isGroupStart}
                isGroupEnd={isGroupEnd}
                onRetry={() => handleRetry(msg)}
              />
            </Fragment>
          );
        })}
      </ul>
      {hasNewBelow && (
        <Button
          appearance="secondary"
          className={styles.newMessagesButton}
          onClick={handleNewMessagesClick}
        >
          {t("chat.newMessages")}
        </Button>
      )}
      <div className={styles.input}>
        <SubmitTextarea
          value={message}
          onChange={setMessage}
          onSubmit={handleSend}
          placeholder={t("chat.placeholder")}
          maxLength={MAX_MESSAGE_LENGTH}
        />
      </div>
      {openedPhoto &&
        createPortal(
          <PhotoModal
            photo={openedPhoto}
            author={{
              avatar: openedPhoto.user.avatar,
              name: openedPhoto.user.name,
              username: openedPhoto.user.username,
            }}
            onClose={() => setOpenedPhoto(null)}
          />,
          document.body,
        )}
    </section>
  );
};
