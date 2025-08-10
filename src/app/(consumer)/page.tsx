import Container from "@/components/Container";
import PostCard from "@/components/PostCard";

const posts = [
  {
    title: "Getting Started with TypeScript",
    slug: "getting-started-with-typescript",
    content:
      "TypeScript extends JavaScript by adding types. In this post, we explore how to set up a TypeScript project from scratch.",
    image: "/test.png",
    authorName: "Nima Araghi",
    authorAvatar: "https://avatars.githubusercontent.com/u/166223644?v=4",
    categories: ["Programming", "TypeScript", "Frontend"],
    createdAt: new Date(),
  },
  {
    title: "Deploying a Next.js App on Vercel",
    slug: "deploying-nextjs-on-vercel",
    content:
      "Learn how to deploy your Next.js application with ease using Vercel’s platform. Step-by-step guide included.",
    image: "/test.png",
    authorName: "Sara Khalili",
    authorAvatar: "https://avatars.githubusercontent.com/u/166223644?v=4",
    categories: ["DevOps", "Next.js", "Deployment"],
    createdAt: new Date(),
  },
  {
    title: "10 Tips to Improve Your React Code",
    slug: "10-tips-to-improve-react-code",
    content:
      "From using custom hooks to organizing components better, these tips will help you write cleaner and more efficient React code.",
    image: "/test.png",
    authorName: "Ali Moradi",
    authorAvatar: "https://avatars.githubusercontent.com/u/166223644?v=4",
    categories: ["React", "Frontend", "Best Practices"],
    createdAt: new Date(),
  },
];

export default async function Home() {
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
      <Container className='flex flex-col gap-8'>
        <h1>Newest Posts</h1>
        <div className='post-grid'>
          {posts.map((post, index) => (
            <PostCard key={index} post={post} />
          ))}
        </div>
      </Container>
    </div>
  );
}
