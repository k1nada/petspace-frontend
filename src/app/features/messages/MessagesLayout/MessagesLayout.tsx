"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import cn from "classnames";
import styles from "./MessagesLayout.module.scss";
import { Chat } from "../Chat/Chat";
import { ChatContact, Message, User } from "@/types";
import { ContactList } from "../ContactList/ContactList";
import {
  getConversations,
  markMessagesRead,
} from "@/services/api/conversations";
import { useConversationsStore } from "@/app/hooks/messages/useConversationsStore";
import { useMessagesStore } from "@/app/hooks/messages/useMessagesStore";
import { useChatMessagesStore } from "@/app/hooks/messages/useChatMessagesStore";
import { usePresenceStore } from "@/app/hooks/shared/usePresenceStore";
import { syncRoomMessages } from "@/app/hooks/messages/syncRoomMessages";
import { getUserByUsername } from "@/services/api/userClient";
import socket from "@/services/socket";
import { SOCKET_EVENTS, getRoomId } from "@/utils/chat";
import { useAuthStore } from "@/app/hooks/auth/useAuthStore";
import { useRouter } from "@/i18n/navigation";
import { ROUTES } from "@/routes/routes";
import { ContactListSkeleton } from "../ContactList/ContactListSkeleton";
import { ChatSkeleton } from "../Chat/ChatSkeleton";

interface MessagesLayoutProps {
  username: string;
  initialSelectedChat?: ChatContact;
}

interface MessagesContentProps {
  user: User;
  initialSelectedChat?: ChatContact;
}

const addSelectedChat = (
  conversations: ChatContact[],
  selectedChat?: ChatContact,
) => {
  if (!selectedChat) return conversations;
  if (conversations.some((conv) => conv.id === selectedChat.id)) {
    return conversations;
  }
  return [selectedChat, ...conversations];
};

export const MessagesLayout = ({
  username,
  initialSelectedChat,
}: MessagesLayoutProps) => {
  const router = useRouter();
  const currentUser = useAuthStore((state) => state.currentUser);
  const isOwner = currentUser?.username === username;

  useEffect(() => {
    if (currentUser && !isOwner) {
      router.replace(ROUTES.messages(currentUser.username));
    }
  }, [currentUser, isOwner, router]);

  if (!currentUser || !isOwner) {
    return (
      <div className={styles.layout}>
        <div className={styles.chat}>
          <div className={styles.contactListWrapper}>
            <ContactListSkeleton />
          </div>
          <div className={cn(styles.chatWrapper, styles.hiddenMobile)}>
            <ChatSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <MessagesContent
      user={currentUser}
      initialSelectedChat={initialSelectedChat}
    />
  );
};

const MessagesContent = ({
  user,
  initialSelectedChat,
}: MessagesContentProps) => {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const conversations = useConversationsStore((state) => state.conversations);
  const hasLoaded = useConversationsStore((state) => state.hasLoaded);
  const setConversations = useConversationsStore(
    (state) => state.setConversations,
  );
  const receiveMessage = useConversationsStore((state) => state.receiveMessage);
  const markContactRead = useConversationsStore(
    (state) => state.markContactRead,
  );
  const addNewMessages = useChatMessagesStore((state) => state.addNewMessages);
  const confirmMessage = useChatMessagesStore((state) => state.confirmMessage);
  const setPresenceFromUsers = usePresenceStore(
    (state) => state.setPresenceFromUsers,
  );
  const conversationsLoading = !hasLoaded;

  const selectedUsername = searchParams.get("user");
  const selectedChat = selectedUsername
    ? (conversations.find((conv) => conv.username === selectedUsername) ??
      (initialSelectedChat?.username === selectedUsername
        ? initialSelectedChat
        : undefined))
    : undefined;
  const selectedChatId = selectedChat?.id;

  const [failedUsername, setFailedUsername] = useState<string | null>(null);
  const [isListFailed, setIsListFailed] = useState(false);
  const [listReloadCount, setListReloadCount] = useState(0);
  const isContactMissing = hasLoaded && !!selectedUsername && !selectedChat;
  const isLookupFailed =
    !!selectedUsername && failedUsername === selectedUsername;
  const isChatPending = !!selectedUsername && !selectedChat && !isLookupFailed;

  const [isFirstChatLoaded, setIsFirstChatLoaded] =
    useState(!initialSelectedChat);
  const handleMessagesLoaded = useCallback(() => {
    setIsFirstChatLoaded(true);
  }, []);
  const isListWaitingForChat =
    !isFirstChatLoaded &&
    !!selectedChatId &&
    selectedChatId === initialSelectedChat?.id;

  const openChat = (contact: ChatContact) => {
    if (contact.username === selectedUsername) return;
    const query = new URLSearchParams({ user: contact.username });
    window.history.pushState(null, "", `?${query}`);
  };

  const closeChat = () => {
    window.history.pushState(null, "", window.location.pathname);
  };

  const retryLoadList = () => {
    setIsListFailed(false);
    setListReloadCount((count) => count + 1);
  };

  useEffect(() => {
    getConversations(user.username)
      .then((data) => {
        const withSelected = addSelectedChat(data, initialSelectedChat);
        setConversations(withSelected);
        setPresenceFromUsers(withSelected);
      })
      .catch(() => {
        setConversations([]);
        setIsListFailed(true);
        toast.error(t("toasts.error"));
      });
  }, [
    user.username,
    initialSelectedChat,
    listReloadCount,
    setConversations,
    setPresenceFromUsers,
    t,
  ]);

  useEffect(() => {
    if (!isContactMissing || !selectedUsername) return;
    let cancelled = false;

    getUserByUsername(selectedUsername)
      .then((found) => {
        if (cancelled) return;
        if (found.id === user.id) {
          setFailedUsername(selectedUsername);
          return;
        }
        const contact: ChatContact = {
          id: found.id,
          username: found.username,
          name: found.name,
          avatar: found.avatar,
          isOnline: found.isOnline,
          lastSeen: found.lastSeen,
        };
        const current = useConversationsStore.getState().conversations;
        setConversations(addSelectedChat(current, contact));
        setPresenceFromUsers([contact]);
      })
      .catch(() => {
        if (!cancelled) setFailedUsername(selectedUsername);
      });

    return () => {
      cancelled = true;
    };
  }, [
    isContactMissing,
    selectedUsername,
    user.id,
    setConversations,
    setPresenceFromUsers,
  ]);

  useEffect(() => {
    if (!hasLoaded || !selectedChatId) return;

    const opened = useConversationsStore
      .getState()
      .conversations.find((conv) => conv.id === selectedChatId);
    const unreadCount = opened?.unreadCount ?? 0;
    if (unreadCount > 0) {
      const total = useMessagesStore.getState().unreadMessagesCount;
      useMessagesStore
        .getState()
        .setUnreadMessagesCount(Math.max(0, total - unreadCount));
    }
    markContactRead(selectedChatId);
    const roomId = getRoomId(user.id, selectedChatId);
    markMessagesRead(roomId).catch((error) => console.error(error));
  }, [hasLoaded, selectedChatId, user.id, markContactRead]);

  useEffect(() => {
    const handleMessage = (message: Message) => {
      const partnerId = message.roomId.split("_").find((id) => id !== user.id);
      if (!partnerId) return;

      if (message.tempId) {
        confirmMessage(message.roomId, message.tempId, message);
      } else {
        addNewMessages(message.roomId, [message]);
      }

      const isOwn = message.sender?.id === user.id;
      const isOpen =
        message.roomId === useMessagesStore.getState().activeRoomId;
      if (isOpen && !isOwn) {
        markMessagesRead(message.roomId).catch((error) => console.error(error));
      }

      const known = useConversationsStore
        .getState()
        .conversations.find((conv) => conv.id === partnerId);

      if (!known && (isOwn || !message.sender)) return;
      const contact = known ?? {
        id: partnerId,
        username: message.sender.username,
        name: message.sender.name,
        avatar: message.sender.avatar,
      };

      receiveMessage(
        contact,
        {
          id: message.id,
          text: message.text,
          createdAt: message.createdAt,
          hasPost: !!message.post,
        },
        !isOwn && !isOpen,
      );
    };

    const handleReconnect = () => {
      const activeRoomId = useMessagesStore.getState().activeRoomId;
      const activePartnerId = activeRoomId
        ?.split("_")
        .find((id) => id !== user.id);
      const activeContact = useConversationsStore
        .getState()
        .conversations.find((conv) => conv.id === activePartnerId);

      getConversations(user.username)
        .then((data) => {
          const withActive = addSelectedChat(data, activeContact);
          setConversations(withActive);
          setPresenceFromUsers(withActive);
          if (activePartnerId) markContactRead(activePartnerId);
        })
        .catch((error) => console.error(error));

      if (activeRoomId) {
        syncRoomMessages(activeRoomId).catch((error) => console.error(error));
        markMessagesRead(activeRoomId).catch((error) => console.error(error));
      }
    };

    socket.on(SOCKET_EVENTS.MESSAGE, handleMessage);
    socket.io.on("reconnect", handleReconnect);
    return () => {
      socket.off(SOCKET_EVENTS.MESSAGE, handleMessage);
      socket.io.off("reconnect", handleReconnect);
    };
  }, [
    user.id,
    user.username,
    addNewMessages,
    confirmMessage,
    receiveMessage,
    markContactRead,
    setConversations,
    setPresenceFromUsers,
  ]);

  return (
    <div className={styles.layout}>
      <div className={styles.chat}>
        <div
          className={cn(styles.contactListWrapper, {
            [styles.hiddenMobile]:
              selectedChat || isChatPending || isLookupFailed,
          })}
        >
          <ContactList
            user={user}
            conversations={conversations}
            activeContactId={selectedChatId}
            loading={conversationsLoading || isListWaitingForChat}
            loadFailed={isListFailed}
            onRetry={retryLoadList}
            onSelectContact={openChat}
          />
        </div>
        <div
          className={cn(styles.chatWrapper, {
            [styles.hiddenMobile]:
              !selectedChat && !isChatPending && !isLookupFailed,
          })}
        >
          <Chat
            key={selectedChatId}
            user={user}
            conversations={conversations}
            conversationsLoading={conversationsLoading}
            selectedChat={selectedChat}
            isChatPending={isChatPending}
            isUserNotFound={isLookupFailed}
            onMessagesLoaded={handleMessagesLoaded}
            onBack={closeChat}
          />
        </div>
      </div>
    </div>
  );
};
