"use server";

import z from "zod";
import { fullCommentFormSchema } from "../schemas/commentForm";
import {
  insertComment,
  deleteComment as deleteCommentDB,
} from "../db/comments";
import { getPostBySlug } from "@/features/posts/db/posts";
import { auth } from "@/auth";

export async function createComment(
  unsafeData: z.infer<typeof fullCommentFormSchema>
) {
  const { success, data } = fullCommentFormSchema.safeParse(unsafeData);
  if (!success) return { error: true, message: "Invalid data provided" };

  const session = await auth();
  if (!session?.user)
    return { error: true, message: "Unauthorized, Please Login" };

  const existingPost = await getPostBySlug(data.postSlug);

  if (!existingPost) return { error: true, message: "Post Not Found" };

  const newPost = insertComment({
    ...data,
    authorId: session?.user.id || "",
    postId: existingPost.id,
  });

  return { error: false, message: "Comment created successfully" };
}

export async function deleteComment(commentId: string) {
  const deletedComment = deleteCommentDB(commentId);

  return { error: false, message: "Comment deleted successfully" };
}
