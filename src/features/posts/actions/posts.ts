"use server";

import z from "zod";
import { getPostBySlug, insertPost } from "../db/posts";
import { generateSlug } from "../lib/utils";
import { fullPostSchema } from "../schemas/postForm";
import { updatePost as updatePostDB } from "../db/posts";
import { deletePost as deletedPostDB } from "../db/posts";
import { auth } from "@/auth";
import { getPostGlobalTag } from "../db/cache";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { PostTable } from "@/drizzle/schema";

export async function getUserPost(userId: string, slug: string) {
  "use cache";
  cacheTag(getPostGlobalTag());

  const post = await db.query.PostTable.findFirst({
    where: eq(PostTable.slug, slug),
  });

  return post?.authorId === userId;
}

export async function unpublishPost(slug: string) {
  const unpublishedPost = await updatePostDB(slug, { status: "draft" });

  return { error: false, message: "post unpublished" };
}

export async function createPost(unsafeData: z.infer<typeof fullPostSchema>) {
  const session = await auth();

  if (!session?.user)
    return {
      error: true,
      message: "You don't have permission to create a post",
    };

  const authorId = session.user.id || "";

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

  const newPost = await insertPost({ ...data, slug, authorId });

  return { error: false, message: "Post created successfully" };
}

export async function updatePost(
  slug: string,
  unsafeData: z.infer<typeof fullPostSchema>
) {
  const session = await auth();
  if (!session?.user)
    return {
      error: true,
      message: "You don't have permission to update the post",
    };

  const res = getUserPost(session.user.id || "", slug);

  if (!res)
    return {
      error: true,
      message: "You don't have permission to update the post",
    };

  const { data, success } = fullPostSchema.safeParse(unsafeData);
  if (!success) return { error: true, message: "Invalid data provided" };

  const updatedPost = await updatePostDB(slug, data);

  return { error: false, message: "Post created successfully" };
}

export async function deletePost(slug: string) {
  const deletedPost = await deletedPostDB(slug);

  return { error: false, message: "Post deleted successfully" };
}
