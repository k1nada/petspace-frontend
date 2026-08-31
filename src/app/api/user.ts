import axios from "axios";
import { API_URL } from "@/config/env";
import api from "@/config/axios";
import { Photo } from "@/types";

export const getUser = async (username: string) => {
  try {
    const { data } = await axios.get(`${API_URL}/user/${username}`);
    return data;
  } catch {
    return null;
  }
};

export const getUserPhotos = async (
  username: string,
): Promise<Photo[] | null> => {
  try {
    const { data } = await api.get(`/user/${username}`);
    return data.photos ?? null;
  } catch {
    return null;
  }
};
