import { db } from "@/drizzle/db";
import { PostTable } from "@/drizzle/schema";
import PostForm from "@/features/posts/components/PostForm";
import { getPostIdTag } from "@/features/posts/db/cache";
import { eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { notFound } from "next/navigation";
import React from "react";

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
      <PostForm post={post} />
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
