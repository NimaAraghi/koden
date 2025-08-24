import Container from "@/components/Container";
import SearchForm from "@/components/SearchForm";
import { db } from "@/drizzle/db";
import { PostTable, PostTagTable, TagTable, UserTable } from "@/drizzle/schema";
import PostCard from "@/features/posts/components/PostCard";
import PostSkeleton from "@/features/posts/components/PostSkeleton";
import { and, desc, eq, ilike, sql } from "drizzle-orm";
import { Suspense } from "react";

export default async function Search({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  return (
    <Container>
      <div className='block md:hidden'>
        <SearchForm />
      </div>
      <Suspense fallback={<PostSkeleton />}>
        <SuspendedPage searchParams={searchParams} />
      </Suspense>
    </Container>
  );
}

async function SuspendedPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const posts = await getSearchedPosts(q);

  return (
    <div>
      <h1 className='text-2xl font-bold'>
        Search results {q ? `for "${q}"` : ""}
      </h1>
      <Container>
        <div className='flex flex-col'>
          {posts.length === 0 ? (
            <div>
              <p>No post Found</p>
            </div>
          ) : (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </div>
      </Container>
    </div>
  );
}

async function getSearchedPosts(q: string) {
  return db
    .select({
      id: PostTable.id,
      title: PostTable.title,
      image: PostTable.image,
      slug: PostTable.slug,
      createdAt: PostTable.createdAt,
      authorName: UserTable.name,
      authorAvatar: UserTable.image,
      tags: sql<string[]>`coalesce(array_agg(${TagTable.name}), '{}')`.as(
        "tags"
      ),
    })
    .from(PostTable)
    .where(
      and(eq(PostTable.status, "published"), ilike(PostTable.title, `%${q}%`))
    )
    .innerJoin(UserTable, eq(UserTable.id, PostTable.authorId))
    .leftJoin(PostTagTable, eq(PostTagTable.postId, PostTable.id))
    .leftJoin(TagTable, eq(TagTable.id, PostTagTable.tagId))
    .groupBy(PostTable.id, UserTable.id)
    .orderBy(desc(PostTable.createdAt));
}
