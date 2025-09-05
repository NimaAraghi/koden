import z from "zod";

export const commentFormSchema = z.object({
  content: z.string().min(1, "You need to write something"),
});

export const statusEnum = z.enum(["approved", "rejected"]);

export const fullCommentFormSchema = commentFormSchema.extend({
  postSlug: z.string().min(1, "Post slug is required"),
  parentId: z.string().optional(),
  statues: statusEnum.default("approved").optional(),
});
