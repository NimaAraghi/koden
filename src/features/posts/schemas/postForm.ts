import z from "zod";

export const postFormSchema = z.object({
  title: z.string().min(8, "Title is too short"),
  tags: z.array(z.string()).max(4).optional(),
  content: z.string(),
});

export const statusEnum = z.enum(["published", "draft"]);

export const fullPostSchema = postFormSchema.extend({
  image: z.string(),
  status: statusEnum.default("draft"),
});
