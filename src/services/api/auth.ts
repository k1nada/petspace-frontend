import api from "@/config/axios";
import { AuthResponse, SignInData, SignUpData } from "@/types";

export const signIn = async (data: SignInData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/signin", data);
  return response.data;
};

export const signUp = async (data: SignUpData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/signup", data);
  return response.data;
};

export const signOut = async (): Promise<void> => {
  await api.post("/signout");
};

interface RegistrationStepsData {
  sex?: string;
  birthDate?: number;
  country?: string;
  city?: string;
  breed?: string;
  registrationCompleted?: boolean;
}

export const updateRegistrationSteps = async (
  data: RegistrationStepsData,
): Promise<void> => {
  await api.patch("/registration-steps", data);
};
