import { db } from "@/drizzle/db";
import PostTable from "@/features/posts/components/PostTable";
import { getPostGlobalTag } from "@/features/posts/db/cache";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { PostTable as DbPostTable } from "@/drizzle/schema";
import { desc } from "drizzle-orm";

export default async function Posts() {
  const posts = await getUserPosts();

  return (
    <div>
      <h2 className='my-0'>Posts</h2>
      <PostTable posts={posts} />
    </div>
  );
}

async function getUserPosts() {
  "use cache";
  cacheTag(getPostGlobalTag());

  return db
    .select({
      id: DbPostTable.id,
      title: DbPostTable.title,
      slug: DbPostTable.slug,
      status: DbPostTable.status,
    })
    .from(DbPostTable)
    .orderBy(desc(DbPostTable.createdAt));
}
