import api from "@/config/axios";

interface SignUpData {
  name: string;
  username: string;
  email: string;
  password: string;
}

export const signUp = async (data: SignUpData) => {
  const { data: response } = await api.post("/signup", data);
  return response;
};