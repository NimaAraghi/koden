import { db } from "@/drizzle/db";
import PostTable from "@/features/posts/components/PostTable";
import { getPostGlobalTag } from "@/features/posts/db/cache";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { PostTable as DbPostTable } from "@/drizzle/schema";
import { desc, eq } from "drizzle-orm";
import { auth } from "@/auth";
import { Suspense } from "react";
import { redirect } from "next/navigation";

export default function Posts() {
  return (
    <Suspense>
      <SuspendedPage />
    </Suspense>
  );
}

async function SuspendedPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const posts = await getUserPosts(session.user.id || "");

  return (
    <div>
      <h2 className='my-0'>Posts</h2>
      <PostTable posts={posts} username={session.user.username} />
    </div>
  );
}

async function getUserPosts(userId: string) {
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
    .where(eq(DbPostTable.authorId, userId))
    .orderBy(desc(DbPostTable.createdAt));
}
