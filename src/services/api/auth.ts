import api from "@/config/axios";
import { SignInData, SignUpData } from "@/types";

export const signIn = async (data: SignInData) => {
  const response = await api.post("/signin", data);
  return response.data;
};

export const signUp = async (data: SignUpData) => {
  const response = await api.post("/signup", data);
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
  onboardingCompleted?: boolean;
}

export const updateRegistrationSteps = async (
  data: RegistrationStepsData,
): Promise<void> => {
  await api.patch("/registration-steps", data);
};
