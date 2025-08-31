import z from "zod";

export const commentFormSchema = z.object({
  content: z.string().min(1, "You need to write something"),
});

export const statusEnum = z.enum(["approved", "rejected"]);

export const fullCommentFormSchema = commentFormSchema.extend({
  postId: z.string().min(1, "Post ID is required"),
  authorId: z.string().min(1, "User ID is required"),
  parentId: z.string(),
  statues: statusEnum.default("approved"),
});
