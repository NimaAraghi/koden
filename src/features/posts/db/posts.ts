"use server";

import { db } from "@/drizzle/db";
import { PostTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

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

  return newPost;
}

export async function updateUser(
  { id }: { id: string },
  data: Partial<typeof PostTable.$inferInsert>
) {
  const [updatedPost] = await db
    .update(PostTable)
    .set(data)
    .where(eq(PostTable.id, id))
    .returning();

  if (updatedPost == null) throw new Error("Failed to update post");

  return updatedPost;
}

export async function deleteUser({ id }: { id: string }) {
  const [deletedUser] = await db
    .delete(PostTable)
    .where(eq(PostTable.id, id))
    .returning();

  if (deletedUser == null) throw new Error("Failed to delete post");

  return deletedUser;
}
