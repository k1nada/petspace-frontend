import api from "@/config/axios";
import { UserStatus } from "@/types";

export const getUsersPresence = async (
  userIds: string[],
): Promise<UserStatus[]> => {
  const { data } = await api.get<UserStatus[]>("/users/presence", {
    params: { ids: userIds.join(",") },
  });
  return data;
};
