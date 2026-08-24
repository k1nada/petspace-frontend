export const ROUTES = {
  signup: "/signup",
  signin: "/signin",
  registrationSteps: "/registration-steps",
  registrationStepsAvatar: "/registration-steps/avatar",
  profile: (username: string) => `/${username}`,
  editProfile: (username: string) => `/${username}/edit`,
  editInterests: (username: string) => `/${username}/interests`,
  feed: "/feed",
  friends: (username: string) => `/${username}/friends`,
  photos: (username: string) => `/${username}/photos`,
  messages: (currentUsername: string, targetUsername?: string) =>
    targetUsername
      ? `/${currentUsername}/messages?user=${targetUsername}`
      : `/${currentUsername}/messages`,
  familyTree: (username: string) => `/${username}/family`,
} as const;
