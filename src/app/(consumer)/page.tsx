import Container from "@/components/Container";
import { db } from "@/drizzle/db";
import { PostTable, PostTagTable, TagTable, UserTable } from "@/drizzle/schema";
import PostCard from "@/features/posts/components/PostCard";
import { getPostGlobalTag } from "@/features/posts/db/cache";
import TagsContainer from "@/features/tags/coponents/TagsContainer";
import { getTagGlobalTag } from "@/features/tags/db/cache";
import { desc, eq, sql } from "drizzle-orm";
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
      <Container className='flex flex-col items-start lg:flex-row gap-4'>
        <div className='lg:order-1 w-full lg:w-80'>
          <TagsContainer />
        </div>
        <div className='w-full md:w-4/5'>
          <h1 className='mb-4'>Newest Posts</h1>
          <div className='flex flex-col'>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}

async function getPosts() {
  "use cache";
  cacheTag(getPostGlobalTag());
  cacheTag(getTagGlobalTag());

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
    .innerJoin(UserTable, eq(UserTable.id, PostTable.authorId))
    .leftJoin(PostTagTable, eq(PostTagTable.postId, PostTable.id))
    .leftJoin(TagTable, eq(TagTable.id, PostTagTable.tagId))
    .groupBy(PostTable.id, UserTable.id)
    .orderBy(desc(PostTable.createdAt));
}
