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
  bio?: string;
  sex?: string;
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

export interface Friend {
  id: string;
  username: string;
  name: string;
  avatar?: string;
  breed?: string;
  isOnline?: boolean;
  lastSeen?: string;
  friendsCount?: number;
}

export interface FriendRequest {
  id: string;
  from: User;
  to: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: Date;
}

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

export interface ConversationMessage {
  id: string;
  text: string;
  createdAt: string;
}

export interface ChatContact {
  id: string;
  username: string;
  name: string;
  avatar?: string;
  isOnline?: boolean;
  lastSeen?: string;
  lastMessage?: ConversationMessage;
  unreadCount?: number;
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
