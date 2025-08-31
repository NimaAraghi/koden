import Container from "@/components/Container";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { db } from "@/drizzle/db";
import { PostTable, PostTagTable, TagTable, UserTable } from "@/drizzle/schema";
import PostCard from "@/features/posts/components/PostCard";
import { getPostGlobalTag } from "@/features/posts/db/cache";
import { getUserIdTag } from "@/features/users/db/cache";
import { getUserByUsername } from "@/features/users/db/users";
import { and, desc, eq, sql } from "drizzle-orm";
import { UserIcon } from "lucide-react";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default function User({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  return (
    <Suspense>
      <SuspendedPage params={params} />
    </Suspense>
  );
}

async function SuspendedPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const user = await getUserByUsername(username);

  if (!user) notFound();

  const posts = await getUserPosts(username);

  return (
    <Container>
      <div className='flex flex-col items-center w-full'>
        <Avatar className='size-40'>
          <AvatarImage src={user.image || ""} />
          <AvatarFallback>
            <UserIcon />
          </AvatarFallback>
        </Avatar>
        <h2>{user.name}</h2>
        <p>{user.bio}</p>
      </div>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </Container>
  );
}

async function getUserPosts(username: string) {
  "use cache";
  cacheTag(getUserIdTag(username));
  cacheTag(getPostGlobalTag());

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
      tags: sql<string[]>`coalesce(array_agg(${TagTable.name}), '{}')`.as(
        "tags"
      ),
    })
    .from(PostTable)
    .where(eq(PostTable.status, "published"))
    .innerJoin(
      UserTable,
      and(
        eq(UserTable.id, PostTable.authorId),
        eq(UserTable.username, username)
      )
    )
    .leftJoin(PostTagTable, eq(PostTagTable.postId, PostTable.id))
    .leftJoin(TagTable, eq(TagTable.id, PostTagTable.tagId))
    .groupBy(PostTable.id, UserTable.id)
    .orderBy(desc(PostTable.createdAt));
}
