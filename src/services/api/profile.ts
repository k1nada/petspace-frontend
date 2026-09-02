import api from "@/config/axios";

interface UpdateProfileData {
  name: string;
  bio: string;
  sex: string;
  birthDate?: Date | string;
  country: string;
  city: string;
  breed: string;
}

export const updateProfile = (username: string, data: UpdateProfileData) => {
  return api.put(`/user/${username}`, {
    ...data,
  });
};

interface UpdateInterestsData {
  favoriteToys: string;
  favoriteTreats: string;
  favoriteActivities: string;
  crimes: string;
  guiltyHabits: string;
  humans: string;
}

export const updateInterests = async (
  username: string,
  interests: UpdateInterestsData,
): Promise<void> => {
  await api.put(`/user/${username}`, { interests });
};
