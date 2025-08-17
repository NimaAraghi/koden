import z from "zod";
import { getTagByName, insertTag } from "../db/tags";
import { tagSchema } from "../schemas/tag";

export async function createTag(unsafeData: z.infer<typeof tagSchema>) {
  const { data, success } = tagSchema.safeParse(unsafeData);

  if (!success) return { error: true, message: "Invalid data provided" };

  const existingTag = await getTagByName(data.name);

  if (existingTag)
    return { error: false, message: "Tag already exists", tag: existingTag };

  const newTag = await insertTag(data);

  return { error: false, message: "Tag created successfully", tag: newTag };
}
