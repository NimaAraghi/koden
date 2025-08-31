import { db } from "@/drizzle/db";
import { CommentTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

async function insertComment(data: typeof CommentTable.$inferInsert) {
  const [newComment] = await db.insert(CommentTable).values(data).returning();

  if (newComment == null) throw new Error("Failed to insert comment");

  return newComment;
}

async function deleteComment(commentId: string) {
  const [deletedComment] = await db
    .delete(CommentTable)
    .where(eq(CommentTable.id, commentId))
    .returning();

  if (deletedComment == null) throw new Error("Failed to delete comment");

  return deletedComment;
}
