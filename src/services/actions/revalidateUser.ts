"use server";

import { updateTag } from "next/cache";

export const revalidateUser = async () => {
  updateTag("user");
};
