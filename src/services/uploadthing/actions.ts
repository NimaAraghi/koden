"use server";

import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export async function deleteImage(fileKey: string) {
  try {
    const response = await utapi.deleteFiles(fileKey);

    if (response.success)
      return { error: false, message: "image deleted successfully" };

    console.log(fileKey);

    return { error: true, message: "something went wrong" };
  } catch (error) {
    const err = error as Error;
    return { error: true, message: err.message };
  }
}
