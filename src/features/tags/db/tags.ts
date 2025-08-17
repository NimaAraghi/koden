import { db } from "@/drizzle/db";
import { TagTable } from "@/drizzle/schema";
import { getTagGlobalTag, revalidateTagCache } from "./cache";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { eq } from "drizzle-orm";

export async function getTagByName(tagName: string) {
  "use cache";
  cacheTag(getTagGlobalTag());

  return db.query.TagTable.findFirst({
    where: eq(TagTable.name, tagName),
  });
}

export async function insertTag(data: typeof TagTable.$inferInsert) {
  const [newTag] = await db
    .insert(TagTable)
    .values(data)
    .returning()
    .onConflictDoUpdate({
      target: [TagTable.id],
      set: data,
    });

  if (newTag == null) throw new Error("Failed to insert post");

  revalidateTagCache(newTag.id);

  return newTag;
}
