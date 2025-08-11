import Container from "@/components/Container";
import { Avatar } from "@/components/ui/avatar";
import { db } from "@/drizzle/db";
import { PostTable } from "@/drizzle/schema";
import { getPostIdTag } from "@/features/posts/db/cache";
import { formatter } from "@/lib/utils";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { eq } from "drizzle-orm";
import { UserIcon } from "lucide-react";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import ReactMarkdown from "react-markdown";

// Child component that fetches and renders the post
async function PostContent({
  paramsPromise,
}: {
  paramsPromise: Promise<{ slug: string }>;
}) {
  const { slug } = await paramsPromise;
  const post = await getPost(slug);

  if (!post) notFound();

  return (
    <>
      <section className='hero'>
        <p className='tag tag-tri'>{formatter.format(post.createdAt)}</p>
        <h1 className='heading'>{post.title}</h1>
      </section>
      <Container className='max-w-4xl mx-auto'>
        <img
          src={post.image}
          className='aspect-video rounded-lg border-2 border-black'
        />
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
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PostContent paramsPromise={params} />
    </Suspense>
  );
}

async function getPost(slug: string) {
  "use cache";
  cacheTag(getPostIdTag(slug));

  return db.query.PostTable.findFirst({
    columns: {
      title: true,
      image: true,
      content: true,
      createdAt: true,
    },
    where: eq(PostTable.slug, slug),
    with: {
      user: {
        columns: {
          name: true,
          image: true,
        },
      },
    },
  });
}
