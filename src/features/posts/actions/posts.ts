"use server";

import z from "zod";
import { getPostBySlug, insertPost } from "../db/posts";
import { generateSlug } from "../lib/utils";
import { fullPostSchema } from "../schemas/postForm";

export async function createPost(unsafeData: z.infer<typeof fullPostSchema>) {
  const { data, success } = fullPostSchema.safeParse(unsafeData);
  if (!success) return { error: true, message: "Invalid data provided" };

  let slug: string = "";

  for (let attemps = 0; attemps <= 5; attemps++) {
    slug = generateSlug(data.title);

    const existingSlug = await getPostBySlug(slug);

    if (!existingSlug) break;

    if (attemps === 5)
      return { error: true, message: "failed to generate a unique slug" };
  }

  const newPost = await insertPost({ ...data, slug });

  return { error: false, message: "Post created successfully" };
}
