import api from "@/config/axios";
import { SignUpData } from "@/types";

export const signUp = async (data: SignUpData) => {
  const { data: response } = await api.post("/signup", data);
  return response;
};