"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { PostTable } from "@/drizzle/schema";
import { ForwardRefEditor } from "@/features/posts/components/ForwardRefEditor";
import { postFormSchema } from "@/features/posts/schemas/postForm";
import ImageUpload from "@/services/uploadthing/components/ImageUpload";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { createPost } from "../actions/posts";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function PostForm({
  post,
}: {
  post?: Omit<
    typeof PostTable.$inferSelect,
    "slug" | "createdAt" | "updatedAt" | "status"
  >;
}) {
  const { data: session } = useSession();

  const router = useRouter();

  const form = useForm<z.infer<typeof postFormSchema>>({
    defaultValues: post
      ? { title: post.title, content: post.content }
      : { title: "", content: "" },
    resolver: zodResolver(postFormSchema),
  });

  const [imageUrl, setImageUrl] = useState("");

  function onSubmit(status: "draft" | "published") {
    return async (data: z.infer<typeof postFormSchema>) => {
      console.log({
        ...data,
        status,
        image: imageUrl,
        authorId: session?.user.id || "",
      });

      const { error, message } = await createPost({
        ...data,
        status,
        image: imageUrl,
        authorId: session?.user.id || "",
      });

      if (error) {
        toast.error(message);
      } else {
        router.push("/dashboard/posts");
      }
    };
  }

  return (
    <>
      <div className='flex sticky justify-between items-center max-w-6xl mx-auto p-2'>
        <Link className='min-w-[100px]' href='/'>
          <Image src='/logo.png' width={100} height={100} alt='koden logo' />
        </Link>

        <div className='flex gap-2'>
          <Button
            className='cursor-pointer'
            onClick={form.handleSubmit(onSubmit("published"))}
          >
            Publish
          </Button>
          <Button
            className='cursor-pointer'
            onClick={form.handleSubmit(onSubmit("draft"))}
            variant='ghost'
          >
            Save Draft
          </Button>
        </div>
      </div>
      <div className='max-w-4xl mx-auto px-2'>
        <div className='my-5'>
          <ImageUpload setImageUrl={setImageUrl} imageUrl={imageUrl} />
        </div>
        <Form {...form}>
          <form className='flex flex-col gap-4'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <input
                      className='border-none outline-none font-extrabold text-3xl'
                      placeholder='Post Title...'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='content'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ForwardRefEditor
                      markdown='# Share your thoughts'
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
    </>
  );
}
