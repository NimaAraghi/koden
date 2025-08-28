"use client";

import { formatter, stringToNumber } from "@/lib/utils";
import Link from "next/link";
import { UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { colors } from "@/lib/colors";
import { Button } from "@/components/ui/button";

interface Post {
  id: string;
  title: string;
  image: string;
  slug: string;
  createdAt: Date;
  authorUsername: string;
  authorName: string;
  authorAvatar: string | null;
  tags: string[];
}

export default function PostCard({ post }: { post: Post }) {
  const colorIndex = stringToNumber(post.slug);
  const colorClass = colors[colorIndex % colors.length];
  return (
    <div className='flex flex-col border-b-2 border-gray-200 px-none py-4 md:p-4'>
      <Link
        href={`/user/${post.authorUsername}`}
        className='flex items-center gap-2 w-fit'
      >
        <Avatar className='size-8'>
          <AvatarImage src={post.authorAvatar || ""} />
          <AvatarFallback>
            <UserIcon className='size-4' />
          </AvatarFallback>
        </Avatar>
        <div>
          <p className='text-sm font-semibold'>{post.authorName}</p>
          <p className='text-xs text-gray-500'>
            {formatter.format(new Date(post.createdAt))}
          </p>
        </div>
      </Link>
      <div className='flex justify-between items-start p-2'>
        <div className='flex-1'>
          <Link href={`/p/${post.slug}`}>
            <h3 className='font-bold text-2xl hover:text-blue-500'>
              {post.title}
            </h3>
          </Link>
          {post.tags.length > 1 && (
            <div className='flex flex-wrap gap-2 mt-2'>
              {post.tags.map((tag, index) => (
                <Button key={index} asChild variant='ghost'>
                  <Link href={`/tag/${tag}`} key={index}>
                    # {tag}
                  </Link>
                </Button>
              ))}
            </div>
          )}
        </div>
        <Link
          href={`/p/${post.slug}`}
          className='shadow-[7px_7px_0px_0px_black] rounded-md inline-block'
        >
          {post.image && (
            <div
              className={`rounded-md border-2 border-black overflow-hidden`}
              style={{ boxShadow: `2px 2px 0 0 ${colorClass}` }}
            >
              <img
                src={post.image}
                alt={post.title}
                className='aspect-video w-24 sm:w-32 md:w-40 object-cover'
              />
            </div>
          )}
        </Link>
      </div>
    </div>
  );
}
