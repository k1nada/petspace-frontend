import { Achievements } from "@/types";

export const ACHIEVEMENT_KEYS: (keyof Achievements)[] = [
  "firstFriend",
  "firstPost",
] as const;
