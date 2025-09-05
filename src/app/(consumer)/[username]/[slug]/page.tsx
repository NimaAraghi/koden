import { auth } from "@/auth";
import Container from "@/components/Container";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/drizzle/db";
import {
  CommentTable,
  PostTable,
  PostTagTable,
  TagTable,
  UserTable,
} from "@/drizzle/schema";
import CommentForm from "@/features/comments/components/CommentForm";
import Comment from "@/features/comments/components/Comment";
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

export default function Post({
  params,
}: {
  params: Promise<{ slug: string; username: string }>;
}) {
  return (
    <Container className='max-w-4xl mx-auto'>
      <Suspense fallback={<PostSkeleton />}>
        <PostContent params={params} />
      </Suspense>
      <hr />
      <Suspense>
        <Comments params={params} />
      </Suspense>
    </Container>
  );
}

async function PostContent({
  params,
}: {
  params: Promise<{ slug: string; username: string }>;
}) {
  const { slug, username } = await params;
  const [post] = await getPost(slug, username);

  if (!post) notFound();

  return (
    <article className='flex flex-col space-y-6'>
      {/* Cover Image */}
      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className='aspect-video object-cover rounded-xl shadow-md'
        />
      )}

      {/* Author Info */}
      <div className='flex items-center gap-3'>
        <Avatar className='h-12 w-12'>
          <AvatarImage src={post.user.image || ""} alt={post.user.name} />
          <AvatarFallback>
            <UserIcon className='h-6 w-6 text-gray-500' />
          </AvatarFallback>
        </Avatar>
        <div className='flex flex-col'>
          <p className='font-medium text-gray-900'>{post.user.name}</p>
          <p className='text-sm text-gray-500'>
            {formatter.format(post?.createdAt)}
          </p>
        </div>
      </div>

      {/* Title */}
      <h1 className='font-extrabold text-3xl sm:text-4xl lg:text-5xl leading-tight'>
        {post?.title}
      </h1>

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className='flex flex-wrap gap-2'>
          {post.tags.map((tag, index) => (
            <Link
              key={index}
              href={`/tag/${tag}`}
              className='px-3 py-1 text-sm rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition'
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}

      {/* Content */}
      <div className='prose prose-neutral max-w-none'>
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
    </article>
  );
}

function PostSkeleton() {
  return (
    <div className='animate-pulse space-y-6'>
      {/* Cover image */}
      <Skeleton className='w-full aspect-video rounded-2xl' />

      {/* Author */}
      <div className='flex items-center gap-3'>
        <Skeleton className='h-12 w-12 rounded-full' />
        <div className='flex flex-col gap-2'>
          <Skeleton className='h-4 w-32 rounded-md' />
          <Skeleton className='h-4 w-24 rounded-md' />
        </div>
      </div>

      {/* Title */}
      <Skeleton className='h-8 w-3/4 rounded-md' />

      {/* Tags */}
      <div className='flex flex-wrap gap-2'>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className='h-7 w-16 rounded-full' />
        ))}
      </div>

      {/* Content */}
      <div className='space-y-3'>
        <Skeleton className='h-4 w-full rounded-md' />
        <Skeleton className='h-4 w-11/12 rounded-md' />
        <Skeleton className='h-4 w-10/12 rounded-md' />
        <Skeleton className='h-4 w-9/12 rounded-md' />
        <Skeleton className='h-4 w-5/6 rounded-md' />
        <Skeleton className='h-4 w-3/4 rounded-md' />
      </div>
    </div>
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

async function Comments({
  params,
}: {
  params: Promise<{ slug: string; username: string }>;
}) {
  const session = await auth();
  const { slug, username } = await params;
  const comments = await getPostComments(slug, username);

  return (
    <>
      <CommentForm
        user={
          session?.user
            ? {
                id: session.user.id,
                name: session.user.name,
                image: session.user.image,
              }
            : null
        }
        postSlug={slug}
      />
      <div className='space-y-2'>
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
    </>
  );
}

function CommentsSkeleton() {
  return (
    <div>
      <div></div>
    </div>
  );
}

async function getPostComments(slug: string, username: string) {
  return db
    .select({
      id: CommentTable.id,
      content: CommentTable.content,
      createdAt: CommentTable.createdAt,
      user: {
        name: UserTable.name,
        image: UserTable.image,
      },
    })
    .from(CommentTable)
    .innerJoin(PostTable, eq(CommentTable.postId, PostTable.id))
    .innerJoin(UserTable, eq(CommentTable.authorId, UserTable.id))
    .where(
      and(
        eq(PostTable.slug, slug),
        eq(UserTable.username, username),
        eq(CommentTable.status, "approved")
      )
    );
}
