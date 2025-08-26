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
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  createPost,
  unpublishPost,
  updatePost,
} from "@/features/posts/actions/posts";
import { ActionButton } from "@/components/ActionButton";
import { TagsInput } from "../../tags/coponents/TagsInput";

export default function PostForm({
  post,
}: {
  post?: typeof PostTable.$inferSelect & {
    tags: { tag: { id: string; name: string } }[];
  };
}) {
  const router = useRouter();

  const form = useForm<z.infer<typeof postFormSchema>>({
    defaultValues: post
      ? {
          title: post.title,
          content: post.content,
          tags: post.tags.map((t) => t.tag.name) || [],
        }
      : { title: "", content: "", tags: [] },
    resolver: zodResolver(postFormSchema),
  });

  const [imageUrl, setImageUrl] = useState(post?.image || "");

  function onSubmit(status: "draft" | "published") {
    return async (data: z.infer<typeof postFormSchema>) => {
      console.log({
        ...data,
        status,
        image: imageUrl,
      });

      const action = post ? updatePost.bind(null, post.slug || "") : createPost;

      const { error, message } = await action({
        ...data,
        status,
        image: imageUrl,
      });

      if (error) {
        toast.error(message);
      } else {
        router.push("/dashboard/posts");
      }
    };
  }

  return (
    <div className='min-h-screen bg-gray-100'>
      <div className='max-w-4xl mx-auto'>
        <div className='w-full h-[calc(100vh-72px)] mx-auto overflow-y-auto overflow-x-hidden bg-white rounded-lg shadow-md'>
          <Form {...form}>
            <form className='flex flex-col gap-4 '>
              <div className='p-5 md:px-12 lg:px-16 md:py-8'>
                <div className='flex gap-4 my-5'>
                  {imageUrl && (
                    <div>
                      <img src={imageUrl} width={100} />
                    </div>
                  )}
                  <ImageUpload setImageUrl={setImageUrl} imageUrl={imageUrl} />
                </div>
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
                  name='tags'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <TagsInput
                          value={field.value || []}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='content'
                render={({ field }) => (
                  <FormItem className='block editor'>
                    <FormControl>
                      <ForwardRefEditor
                        markdown={post ? post.content : "# Share your Thoughts"}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <div className='flex w-full gap-2 py-4 mx-auto'>
          {form.formState.isSubmitting ? (
            <Button disabled>Saving...</Button>
          ) : post && post.status === "published" ? (
            <>
              <Button onClick={form.handleSubmit(onSubmit("published"))}>
                Update Post
              </Button>
              <ActionButton
                variant='destructive'
                action={unpublishPost.bind(null, post.slug)}
                requireAreYouSure={true}
              >
                Unpublish post
              </ActionButton>
            </>
          ) : (
            <>
              <Button onClick={form.handleSubmit(onSubmit("published"))}>
                Publish Post
              </Button>
              <Button
                variant='outline'
                onClick={form.handleSubmit(onSubmit("draft"))}
              >
                Save as Draft
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
