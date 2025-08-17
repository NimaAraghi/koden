import { db } from "@/drizzle/db";
import { PostTagTable, TagTable } from "@/drizzle/schema";
import { desc, eq, sql } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import React from "react";
import { getTagGlobalTag } from "../db/cache";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function TagsContainer() {
  const tags = await getTopTags();

  return (
    <div className='p-4 rounded-md border border-gray-200 shadow-md'>
      <h3 className='mt-0'>Popular Tags</h3>
      <div className='flex flex-wrap gap-2'>
        {tags.map((tag) => (
          <Button className='cursor-pointer' key={tag.id} variant='secondary'>
            <Link
              href={`/tag/${tag.name}`}
              className='px-2 py-1 rounded-md border-black '
            >
              # {tag.name}
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
}

export async function getTopTags(limit = 10) {
  "use cache";
  cacheTag(getTagGlobalTag());

  return await db
    .select({
      id: TagTable.id,
      name: TagTable.name,
      count: sql<number>`COUNT(${PostTagTable.postId})`,
    })
    .from(PostTagTable)
    .innerJoin(TagTable, eq(TagTable.id, PostTagTable.tagId))
    .groupBy(TagTable.id)
    .orderBy(desc(sql`COUNT(${PostTagTable.postId})`))
    .limit(limit);
}
