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

//url params
