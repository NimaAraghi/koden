import Container from "@/components/Container";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { db } from "@/drizzle/db";
import { PostTable, PostTagTable, TagTable, UserTable } from "@/drizzle/schema";
import { getPostIdTag } from "@/features/posts/db/cache";
import { getUserGlobalTag } from "@/features/users/db/cache";
import { formatter } from "@/lib/utils";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { and, eq, sql } from "drizzle-orm";
import { UserIcon } from "lucide-react";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import ReactMarkdown from "react-markdown";

async function PostContent({
  paramsPromise,
}: {
  paramsPromise: Promise<{ slug: string; username: string }>;
}) {
  const { slug, username } = await paramsPromise;
  const [post] = await getPost(slug, username);

  if (!post) notFound();

  return (
    <>
      <section className='hero'>
        <p className='tag tag-tri'>{formatter.format(post.createdAt)}</p>
        <h1 className='heading'>{post.title}</h1>
      </section>
      <Container className='max-w-4xl mx-auto'>
        {post.image && (
          <img
            src={post.image}
            className='aspect-video object-cover rounded-lg border-2 border-black'
          />
        )}
        <article className='flex flex-col justify-center'>
          <div className='flex items-center max-w-3xl gap-2 mt-4'>
            <Avatar>
              <AvatarImage src={post.user.image || ""} alt={post.user.name} />
              <AvatarFallback>
                <UserIcon className='size-6' />
              </AvatarFallback>
            </Avatar>
            <div>
              <p>{post.user.name}</p>
              <p>{formatter.format(post?.createdAt)}</p>
            </div>
          </div>

          <h1 className='font-extrabold text-5xl my-0'>{post?.title}</h1>
          {post.tags.length > 1 && (
            <div className='flex flex-wrap gap-2 my-2'>
              {post.tags.map((tag, index) => (
                <Button key={index} asChild variant='secondary'>
                  <Link href={`/tag/${tag}`} key={index}>
                    # {tag}
                  </Link>
                </Button>
              ))}
            </div>
          )}

          <ReactMarkdown>{post.content}</ReactMarkdown>
        </article>
      </Container>
    </>
  );
}

export default function PostPage({
  params,
}: {
  params: Promise<{ slug: string; username: string }>;
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PostContent paramsPromise={params} />
    </Suspense>
  );
}

async function getPost(slug: string, username: string) {
  "use cache";
  cacheTag(getPostIdTag(slug));
  cacheTag(getUserGlobalTag());

  return db
    .select({
      title: PostTable.title,
      image: PostTable.image,
      content: PostTable.content,
      createdAt: PostTable.createdAt,
      tags: sql<string[]>`coalesce(array_agg(${TagTable.name}), '{}')`.as(
        "tags"
      ),
      user: {
        name: UserTable.name,
        image: UserTable.image,
      },
    })
    .from(PostTable)
    .innerJoin(UserTable, eq(PostTable.authorId, UserTable.id))
    .leftJoin(PostTagTable, eq(PostTagTable.postId, PostTable.id))
    .leftJoin(TagTable, eq(TagTable.id, PostTagTable.tagId))
    .where(and(eq(PostTable.slug, slug), eq(UserTable.username, username)))
    .groupBy(PostTable.id, UserTable.id)
    .limit(1);
}
