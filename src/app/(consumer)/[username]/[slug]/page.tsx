import Container from "@/components/Container";
import { Avatar } from "@/components/ui/avatar";
import { db } from "@/drizzle/db";
import { PostTable, UserTable } from "@/drizzle/schema";
import { getPostIdTag } from "@/features/posts/db/cache";
import { getUserGlobalTag } from "@/features/users/db/cache";
import { formatter } from "@/lib/utils";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { and, eq } from "drizzle-orm";
import { UserIcon } from "lucide-react";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { notFound } from "next/navigation";
import { Suspense, use } from "react";
import ReactMarkdown from "react-markdown";

// Child component that fetches and renders the post
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

          <h1 className='font-extrabold text-5xl'>{post?.title}</h1>

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
      content: PostTable.content,
      image: PostTable.image,
      createdAt: PostTable.createdAt,
      user: {
        name: UserTable.name,
        image: UserTable.image,
      },
    })
    .from(PostTable)
    .innerJoin(UserTable, eq(PostTable.authorId, UserTable.id))
    .where(and(eq(PostTable.slug, slug), eq(UserTable.username, username)));
}
