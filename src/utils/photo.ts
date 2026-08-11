import { CLOUD_NAME } from "@/config/env";
import { Photo } from "@/types";

export const getPhotoUrl = (photo: Pick<Photo, "publicId">) =>
  `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${photo.publicId}`;
