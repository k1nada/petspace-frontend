"use client";

import { SuggestedFriends } from "@/app/features/feed/SuggestedFriends/SuggestedFriends";
import { SuggestedFriendsSkeleton } from "@/app/features/feed/SuggestedFriends/SuggestedFriendsSkeleton";

export default function PreviewPage() {
  return (
    <div style={{ display: "flex", gap: 40, padding: 40, background: "var(--bg-page)" }}>
      <div style={{ width: 300 }}>
        <SuggestedFriends />
      </div>
      <div style={{ width: 300 }}>
        <SuggestedFriendsSkeleton />
      </div>
    </div>
  );
}
