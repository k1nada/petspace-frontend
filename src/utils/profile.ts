import AvatarImg from "@/public/avatar.jpg";
import Img1 from "@/public/img1.jpg";
import Img2 from "@/public/img2.jpg";
import Img3 from "@/public/img3.jpg";
import Img4 from "@/public/img4.jpg";
import Img5 from "@/public/img5.jpg";

export const MOCK_PROFILE = {
  avatar: AvatarImg,
  name: "Vova",
  username: "Luthirija",
  breed: "Dachshund",
  age: "1 year",
  city: "Warsaw",
  bio: "Still learning to type with paws...",
  friendsCount: 5,
  photosCount: 10,
  placesCount: 16,
} as const;

export const MOCK_PHOTOS = {
  img1: Img1,
  img2: Img2,
  img3: Img3,
  img4: Img4,
  img5: Img5,
  img6: Img5,
};

export const MOCK_POSTS = [
  {
    id: "mock-1",
    user: {
      username: "luthirija",
      name: "Vova",
      breed: "Dachshund",
    },
    content:
      "Finally convinced the humans to let me have a second breakfast. Living my best life.",
    likesCount: 12,
    liked: true,
    reposts: 2,
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    comments: [
      {
        id: "mock-comment-1",
        user: {
          username: "bella",
          name: "Bella",
        },
        content: "Second breakfast is a human right, honestly.",
        likesCount: 3,
        liked: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 20),
      },
    ],
  },
  {
    id: "mock-2",
    user: {
      username: "bella",
      name: "Bella",
      breed: "Golden Retriever",
    },
    content:
      "Chased a squirrel today. Did not catch it. 10/10 would chase again.",
    likesCount: 8,
    liked: false,
    reposts: 0,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
  },
  {
    id: "mock-3",
    user: {
      username: "max",
      name: "Max",
      breed: "Corgi",
    },
    content: "New haircut, who dis.",
    likesCount: 21,
    liked: false,
    reposts: 4,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26),
  },
];

//url params
