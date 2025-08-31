import { ActionButton } from "@/components/ActionButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import React from "react";
import { deletePost } from "../actions/posts";

interface Post {
  id: string;
  title: string;
  slug: string;
  status: "published" | "draft";
}

export default function PostTable({
  posts,
  username,
}: {
  posts: Post[];
  username: string;
}) {
  return (
    <Table className='bg-white rounded-lg'>
      <TableHeader>
        <TableRow>
          <TableHead className='font-bold text-xl'>Title</TableHead>
          <TableHead className='font-bold text-xl'>Status</TableHead>
          <TableHead className='font-bold text-xl'>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post) => (
          <TableRow key={post.id}>
            <TableCell className='line-clamp-2'>
              <Link
                href={`/${username}/${post.slug}`}
                className='font-extrabold text-3xl text-blue-500'
              >
                {post.title}
              </Link>
            </TableCell>
            <TableCell>
              <Badge
                className={
                  post.status === "published"
                    ? "bg-green-500 text-white"
                    : "bg-yellow-500"
                }
                variant='destructive'
              >
                {post.status}
              </Badge>
            </TableCell>
            <TableCell>
              <div className='flex gap-2'>
                <Button asChild variant='outline'>
                  <Link href={`/${username}/${post.slug}/edit`}>Edit</Link>
                </Button>
                <ActionButton
                  className='cursor-pointer'
                  variant='destructive'
                  action={deletePost.bind(null, post.slug)}
                  requireAreYouSure={true}
                >
                  Delete
                </ActionButton>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
