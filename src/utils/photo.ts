import { CLOUD_NAME } from "@/config/env";
import { Photo } from "@/types";

const MODAL_TRANSFORM = "c_limit,w_1600,f_auto,q_auto";

export const getPhotoUrl = (photo: Pick<Photo, "publicId">) =>
  `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${photo.publicId}`;

export const getModalPhotoUrl = (url: string) =>
  url.replace("/image/upload/", `/image/upload/${MODAL_TRANSFORM}/`);
