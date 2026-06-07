export interface User {
  id?: string;
  username: string;
  name: string;
  avatar?: string;
  country?: string;
  city?: string;
  breed?: string;
  isOnline?: boolean;
  lastSeen?: string;
  friendsCount?: number;
  bio?: string;
  gender?: string;
  birthDate?: string;
  interests?: Interests;
  photos?: Photo[];
  avatarPhotos?: Photo[];
  friends?: Friend[];
  achievements?: Achievements;
}

export interface Interests {
  favoriteToys?: string;
  favoriteTreats?: string;
  favoriteActivities?: string;
  crimes?: string;
  guiltyHabits?: string;
  humans?: string;
}

export type Friend = User;

export interface Achievements {
  firstFriend?: boolean;
  firstPost?: boolean;
}

export interface BannerInfo extends User {
  postwallId?: string;
  posts?: Post[];
}

export interface Photo {
  id: string;
  publicId: string;
  createdAt: string;
  likesCount: number;
  liked: boolean;
  comments?: Comment[];
  reposts?: number;
}

export interface Post {
  id: string;
  user: User;
  content: string;
  image?: string;
  likesCount: number;
  liked: boolean;
  comments?: Comment[];
  reposts?: number;
  createdAt: Date;
}

export interface Comment {
  id: string;
  user: User;
  content: string;
  image?: string;
  likesCount: number;
  liked: boolean;
  createdAt: Date;
}

export interface Message {
  id: string;
  text: string;
  createdAt: string;
  sender: User;
}

export interface SignUpData {
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface SignInData {
  email: string;
  password: string;
}
