import Container from "@/components/Container";
import { db } from "@/drizzle/db";
import { PostTable, PostTagTable, TagTable, UserTable } from "@/drizzle/schema";
import PostCard from "@/features/posts/components/PostCard";
import { getPostGlobalTag } from "@/features/posts/db/cache";
import { getTagGlobalTag } from "@/features/tags/db/cache";
import { getUserGlobalTag } from "@/features/users/db/cache";
import { and, desc, eq, sql } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import React, { Suspense } from "react";

export default function Tag({
  params,
}: {
  params: Promise<{ tagName: string }>;
}) {
  return (
    <Container>
      <Suspense>
        <SuspendedPage params={params} />
      </Suspense>
    </Container>
  );
}

async function SuspendedPage({
  params,
}: {
  params: Promise<{ tagName: string }>;
}) {
  const { tagName } = await params;
  const posts = await getPostsByTag(tagName);

  console.log(posts);

  return (
    <div>
      <h1>{tagName}</h1>
      <Container>
        <div className='flex flex-col'>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </Container>
    </div>
  );
}

async function getPostsByTag(tagName: string) {
  "use cache";
  cacheTag(getPostGlobalTag());
  cacheTag(getTagGlobalTag());
  cacheTag(getUserGlobalTag());

  const taggedPosts = db
    .select({ postId: PostTagTable.postId })
    .from(PostTagTable)
    .innerJoin(TagTable, eq(TagTable.id, PostTagTable.tagId))
    .where(eq(TagTable.name, tagName));

  return db
    .select({
      id: PostTable.id,
      title: PostTable.title,
      image: PostTable.image,
      slug: PostTable.slug,
      createdAt: PostTable.createdAt,
      authorName: UserTable.name,
      authorUsername: UserTable.username,
      authorAvatar: UserTable.image,
      tags: sql<
        string[]
      >`coalesce(array_agg(distinct ${TagTable.name}), '{}')`.as("tags"),
    })
    .from(PostTable)
    .where(
      and(
        eq(PostTable.status, "published"),
        sql`${PostTable.id} in (${taggedPosts})`
      )
    )
    .innerJoin(UserTable, eq(UserTable.id, PostTable.authorId))
    .innerJoin(PostTagTable, eq(PostTagTable.postId, PostTable.id))
    .innerJoin(TagTable, eq(TagTable.id, PostTagTable.tagId))
    .groupBy(PostTable.id, UserTable.id)
    .orderBy(desc(PostTable.createdAt));
}
