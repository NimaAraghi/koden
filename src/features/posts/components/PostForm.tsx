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
import { postSchema } from "@/features/posts/schemas/postForm";
import ImageUpload from "@/services/uploadthing/components/ImageUpload";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";

export default function PostForm({
  post,
}: {
  post?: Omit<
    typeof PostTable.$inferSelect,
    "slug" | "createdAt" | "updatedAt" | "status"
  >;
}) {
  const form = useForm<z.infer<typeof postSchema>>({
    defaultValues: post
      ? { title: post.title, content: post.content }
      : undefined,
    resolver: zodResolver(postSchema),
  });

  function onSubmit(data: z.infer<typeof postSchema>) {
    console.log(data);
  }

  return (
    <div>
      <Form {...form}>
        <ImageUpload />
        <form
          className='flex flex-col items-start gap-5'
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <input
                    className='border-none outline-none font-extrabold text-3xl'
                    type='text'
                    placeholder='Post Title'
                    {...field}
                  />
                </FormControl>
                <FormMessage className='font-bold text-lg' />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='content'
            render={({ field }) => (
              <FormItem className='w-full h-full overflow-y-auto'>
                <FormControl>
                  <ForwardRefEditor
                    markdown='# Write your post Content here'
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button type='submit'>submit</Button>
        </form>
      </Form>
    </div>
  );
}
