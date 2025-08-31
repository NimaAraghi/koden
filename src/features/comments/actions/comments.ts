import z from "zod";
import { fullCommentFormSchema } from "../schemas/commentForm";
import {
  insertComment,
  deleteComment as deleteCommentDB,
} from "../db/comments";

export async function createComment(
  unsafeData: z.infer<typeof fullCommentFormSchema>
) {
  const { success, data } = fullCommentFormSchema.safeParse(unsafeData);
  if (!success) return { error: true, message: "Invalid data provided" };

  const newPost = insertComment(data);

  return { error: false, message: "Comment created successfully" };
}

export async function deleteComment(commentId: string) {
  const deletedComment = deleteCommentDB(commentId);

  return { error: false, message: "Comment deleted successfully" };
}
