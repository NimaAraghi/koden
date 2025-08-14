"use client";

import { formatter, stringToNumber } from "@/lib/utils";
import Link from "next/link";
import { UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { colors } from "@/lib/colors";

interface Post {
  title: string;
  slug: string;
  image: string;
  authorName: string;
  authorAvatar: string | null;
  createdAt: Date;
}

export default function PostCard({ post }: { post: Post }) {
  const colorIndex = stringToNumber(post.slug);
  const colorClass = colors[colorIndex % colors.length];

  return (
    <div className='flex flex-col border-b-2 border-gray-200 p-4'>
      <Link href={`/${post.authorName}`} className='flex items-center gap-2'>
        <Avatar className='size-8'>
          <AvatarImage src={post.authorAvatar || ""} />
          <AvatarFallback>
            <UserIcon className='size-4' />
          </AvatarFallback>
        </Avatar>
        <p>{post.authorName}</p>
      </Link>
      <Link href={`/p/${post.slug}`} className='flex justify-between p-2'>
        <div>
          <h3 className='font-bold text-2xl'>{post.title}</h3>
        </div>
        <div className='shadow-[7px_7px_0px_0px_black] rounded-md inline-block'>
          <div
            className={`rounded-md border-2 border-black shadow-[2px_2px_0px_0px_${colorClass}] overflow-hidden`}
            style={{ boxShadow: `2px 2px 0 0 ${colorClass}` }}
          >
            <img
              className='aspect-video object-cover w-40 min-w-40 block'
              src={post.image}
              alt={post.title}
            />
          </div>
        </div>
      </Link>
    </div>
  );
}

// return (
//   <div className='flex flex-col gap-2 p-4'>
//     <Link
//       href={`/posts/${post.slug}`}
//       className='shadow-[7px_7px_0px_0px_black] rounded-md inline-block'
//     >
//       <div
//         className={`rounded-md border-2 border-black shadow-[2px_2px_0px_0px_${colorClass}] overflow-hidden`}
//         style={{ boxShadow: `2px 2px 0 0 ${colorClass}` }}
//       >
//         <img
//           className='aspect-video block'
//           src={post.image}
//           alt={post.title}
//         />
//       </div>
//     </Link>

//     <h3 className='font-bold text-2xl'>{post.title}</h3>
//     <span className='font-light text-sm'>
//       {formatter.format(post.createdAt)}
//     </span>

//     <Link href={`/${post.authorName}`} className='flex gap-2 items'>
//       <Avatar className='size-8'>
//         <AvatarImage src={post.authorAvatar || ""} />
//         <AvatarFallback>
//           <UserIcon className='size-4' />
//         </AvatarFallback>
//       </Avatar>
//       <p>{post.authorName}</p>
//     </Link>
//   </div>
// );
