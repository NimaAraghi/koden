"use server";

import { db } from "@/drizzle/db";
import { PostTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { revalidatePostCache } from "./cache";

export async function getPostBySlug(slug: string) {
  const [post] = await db
    .select()
    .from(PostTable)
    .where(eq(PostTable.slug, slug));

  return post ? post : null;
}

export async function insertPost(data: typeof PostTable.$inferInsert) {
  const [newPost] = await db
    .insert(PostTable)
    .values(data)
    .returning()
    .onConflictDoUpdate({
      target: [PostTable.id],
      set: data,
    });

  if (newPost == null) throw new Error("Failed to insert post");

  revalidatePostCache(newPost.slug);

  return newPost;
}

export async function updatePost(
  slug: string,
  data: Partial<typeof PostTable.$inferInsert>
) {
  const [updatedPost] = await db
    .update(PostTable)
    .set(data)
    .where(eq(PostTable.slug, slug))
    .returning();

  if (updatedPost == null) throw new Error("Failed to update post");

  revalidatePostCache(updatedPost.slug);

  return updatedPost;
}

export async function deletePost(slug: string) {
  const [deletedPost] = await db
    .delete(PostTable)
    .where(eq(PostTable.slug, slug))
    .returning();

  if (deletedPost == null) throw new Error("Failed to delete post");

  revalidatePostCache(deletedPost.slug);

  return deletedPost;
}
