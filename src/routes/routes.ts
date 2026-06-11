export const ROUTES = {
  signup: "/signup",
  signin: "/signin",
  forgotPassword: "/forgot-password",
  registrationSteps: "/registration-steps",
  registrationStepsAvatar: "/registration-steps/avatar",
  profile: (username: string) => `/${username}`,
  editProfile: (username: string) => `/${username}/edit`,
  editInterests: (username: string) => `/${username}/interests`,
  about: "/about",
  feed: "/feed",
  friends: (username: string) => `/${username}/friends`,
  friendRequests: (username: string) => `/${username}/requests`,
  photos: (username: string) => `/${username}/photos`,
  places: "/places",
  notifications: "/notifications",
  messages: (currentUsername: string, targetUsername?: string) =>
    targetUsername
      ? `/${currentUsername}/messages?user=${targetUsername}`
      : `/${currentUsername}/messages`,
  familyTree: (username: string) => `/${username}/family`,
} as const;
