import { auth } from "@/auth";
import { db } from "@/drizzle/db";
import { PostTable } from "@/drizzle/schema";
import PostForm from "@/features/posts/components/PostForm";
import { getPostIdTag } from "@/features/posts/db/cache";
import { eq, and } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { notFound, redirect } from "next/navigation";
import React, { Suspense } from "react";

export default function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuspendedPage paramsPromise={params} />
    </Suspense>
  );
}

async function SuspendedPage({
  paramsPromise,
}: {
  paramsPromise: Promise<{ slug: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { slug } = await paramsPromise;
  const post = await getUserPost(session?.user.id || "", slug);
  if (!post) return notFound();

  return <PostForm post={post} />;
}

async function getUserPost(userId: string, slug: string) {
  "use cache";
  cacheTag(getPostIdTag(slug));

  return db.query.PostTable.findFirst({
    where: and(eq(PostTable.slug, slug), eq(PostTable.authorId, userId)),
    with: {
      tags: {
        columns: {},
        with: {
          tag: {
            columns: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });
}
