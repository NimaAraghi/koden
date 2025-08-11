import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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

export default function PostTable({ posts }: { posts: any[] }) {
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
            <TableCell>
              <Link
                href={`/p/${post.slug}`}
                className='font-extrabold text-3xl text-blue-500'
              >
                {post.title}
              </Link>
            </TableCell>
            <TableCell>
              <Badge
                className={
                  post.status === "published" ? "bg-green-500 text-white" : ""
                }
                variant={
                  post.status === "published" ? "secondary" : "destructive"
                }
              >
                {post.status}
              </Badge>
            </TableCell>
            <TableCell>
              <div className='flex gap-2'>
                <Button asChild variant='outline'>
                  <Link href={`/${post.slug}/edit`}>Edit</Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant='destructive'>Delete</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your post and remove your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
