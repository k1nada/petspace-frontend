"use server";

import { updateTag } from "next/cache";

export const revalidateFollows = async () => {
  updateTag("follows");
};
