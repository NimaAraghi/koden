import { db } from "@/drizzle/db";
import { PostTable } from "@/drizzle/schema";
import PostForm from "@/features/posts/components/PostForm";
import { getPostIdTag } from "@/features/posts/db/cache";
import { eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";

export default async function page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await getUserPost(slug);

  if (post === null) return notFound();

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <PostForm post={post} />
      </Suspense>
    </>
  );
}

async function getUserPost(slug: string) {
  "use cache";
  cacheTag(getPostIdTag(slug));

  return db.query.PostTable.findFirst({
    where: eq(PostTable.slug, slug),
  });
}
