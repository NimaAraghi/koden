"use server";

import z from "zod";
import { postForm } from "../schemas/postForm";
import { insertPost } from "../db/posts";

async function CreatePost(
  unsafeData: z.infer<typeof postForm>,
  authorId: string
) {
  const { data, success } = postForm.safeParse(unsafeData);
  if (!success) return { error: true, message: "Invalid data provided" };

  //   const slug = createSlug(data.title);

  // const newPost = await insertPost(authorId, )
}
