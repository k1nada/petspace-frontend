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
  photos: (username: string) => `/${username}/photos`,
  places: "/places",
  notifications: "/notifications",
  messages: (username: string) => `/${username}/messages`,
  familyTree: (username: string) => `/${username}/family`
} as const;
