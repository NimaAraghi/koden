import Container from "@/components/Container";
import { db } from "@/drizzle/db";
import { PostTable, UserTable } from "@/drizzle/schema";
import PostCard from "@/features/posts/components/PostCard";
import { getPostGlobalTag } from "@/features/posts/db/cache";
import { desc, eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

export default async function Home() {
  const posts = await getPosts();

  return (
    <div>
      <section className='hero'>
        <p className='tag tag-tri'>Share, Comment, And Develop</p>
        <h1 className='heading'>share your knowledge, help other developers</h1>
        <p className='sub-heading'>
          An online platform offering developers a place to share their
          knowledge and stories
        </p>
      </section>
      <Container className='flex flex-col md:flex-row gap-4'>
        <div className='flex-1'>
          <h1 className='mb-4'>Newest Posts</h1>
          <div className='flex flex-col'>
            {posts.map((post, index) => (
              <PostCard key={index} post={post} />
            ))}
          </div>
        </div>
        <div className='w-24 h-24 bg-gray-200 rounded-2xl shadow'></div>
      </Container>
    </div>
  );
}

async function getPosts() {
  "use cache";
  cacheTag(getPostGlobalTag());

  return db
    .select({
      id: PostTable.id,
      title: PostTable.title,
      image: PostTable.image,
      slug: PostTable.slug,
      createdAt: PostTable.createdAt,
      authorName: UserTable.name,
      authorAvatar: UserTable.image,
    })
    .from(PostTable)
    .where(eq(PostTable.status, "published"))
    .innerJoin(UserTable, eq(UserTable.id, PostTable.authorId))
    .orderBy(desc(PostTable.createdAt));
}
