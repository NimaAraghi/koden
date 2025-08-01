"use client";

import { formatter } from "@/lib/utils";
import Link from "next/link";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { UserIcon } from "lucide-react";
import { Button } from "./ui/button";

interface Post {
  title: string;
  slug: string;
  content: string;
  image: string;
  authorName: string;
  authorAvatar: string;
  categories: string[];
  createdAt: Date;
}

export default function PostCard({ post }: { post: Post }) {
  return (
    <div className='post-card'>
      <span className='date'>{formatter.format(post.createdAt)}</span>
      <div className='flex justify-between items-center'>
        <div className='flex justify-between items-center w-full'>
          <div className='flex flex-col'>
            <Link href={`/author/${post.slug}`} className='font-semibold'>
              {post.authorName}
            </Link>
            <Link
              href={`/posts/${post.slug}`}
              className='text-xl font-bold text-balance'
            >
              {post.title}
            </Link>
          </div>
          <Link href={`/author/${post.slug}`}>
            <Avatar className='rounded-full'>
              <AvatarImage src={post.authorAvatar} width={48} height={48} />
              <AvatarFallback>
                <UserIcon />
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
      <p className='font-normal text-base line-clamp-2 break-all'>
        {post.content}
      </p>
      <Link href={`/posts/${post.slug}`}>
        <img
          className='rounded-2xl border-2 border-black'
          src={post.image}
          alt={post.title}
        />
      </Link>
      <div className='flex justify-between gap-1.5'>
        <Button asChild variant='link'>
          <Link href={`/search?category=${post.categories[0]}`}>
            {post.categories[0]}
          </Link>
        </Button>

        <Button asChild>
          <Link href={`/posts/${post.slug}`}>View more</Link>
        </Button>
      </div>
    </div>
  );
}
