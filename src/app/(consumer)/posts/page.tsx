import { db } from "@/drizzle/db";
import { PostTable } from "@/drizzle/schema";
import React from "react";

export default async function Posts() {
  const posts = await getAllPosts();

  return (
    <div>
      <h1 className='text-2xl font-bold mb-4'>Posts</h1>
      <ul className='space-y-4'>
        {posts.map((post) => (
          <li key={post.id} className='p-4 border rounded'>
            <h2 className='text-xl font-semibold'>{post.title}</h2>
            <p>{post.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

async function getAllPosts() {
  const posts = await db.select().from(PostTable);

  return posts || [];
}
