"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { UserIcon } from "lucide-react";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { User } from "next-auth";
import Link from "next/link";
import { signOut } from "next-auth/react";

export default function UserAvatar({ user }: { user: User }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='size-10 cursor-pointer'>
        <Avatar>
          <AvatarImage
            className='rounded-full size-10 object-cover'
            src={user.image || ""}
          />
          <AvatarFallback className='size-10 text-center'>
            <UserIcon />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' sideOffset={5}>
        <DropdownMenuItem className='flex flex-col items-start gap-0'>
          <p className='text-xl font-bold'>{user.name}</p>
          <span className='text-sm text-black/55'>{user.email}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href='/dashboard' className='cursor-pointer text-md'>
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href='/new' className='cursor-pointer text-md'>
            Create Post
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <button className='cursor-pointer w-full' onClick={() => signOut()}>
            Sign Out
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
