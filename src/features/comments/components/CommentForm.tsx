"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import z from "zod";
import { commentFormSchema } from "../schemas/commentForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import { createComment } from "../actions/comments";
import { toast } from "sonner";

export default function CommentForm({
  user,
  postSlug,
}: {
  user?: {
    id?: string;
    name?: string | null;
    image?: string | null;
  } | null;
  postSlug: string;
}) {
  const form = useForm<z.infer<typeof commentFormSchema>>({
    defaultValues: {
      content: "",
    },
    resolver: zodResolver(commentFormSchema),
  });

  async function onSubmit(data: z.infer<typeof commentFormSchema>) {
    const { error, message } = await createComment({
      ...data,
      postSlug,
    });

    if (!error) {
      toast.success(message);
      form.reset();
    } else {
      toast.error(message);
    }
  }

  return (
    <div className='flex w-full gap-2'>
      <Avatar className='h-8 w-8 my-2'>
        <AvatarImage src={user?.image || ""} alt={user?.name || ""} />
        <AvatarFallback>
          <UserIcon className='h-6 w-6 text-gray-500' />
        </AvatarFallback>
      </Avatar>
      {user ? (
        <Form {...form}>
          <form
            className='space-y-2 my-2 w-full'
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name='content'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea placeholder='Share your Opinion...' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className='cursor-pointer' type='submit'>
              Submit
            </Button>
          </form>
        </Form>
      ) : (
        <>
          <Dialog>
            <DialogTrigger asChild>
              <div className='space-y-2 my-2 w-full' onClick={() => null}>
                <Textarea readOnly placeholder='Share your Opinion...' />
              </div>
            </DialogTrigger>
            <DialogContent className='sm:max-w-md'>
              <DialogHeader>
                <DialogTitle className='text-xl font-bold'>
                  Join the discussion
                </DialogTitle>
              </DialogHeader>
              <p className='text-gray-600 dark:text-gray-400 mb-4'>
                You need an account to comment.
              </p>
              <div className='flex gap-3'>
                <Button asChild className='flex-1'>
                  <Link href='/login'>Log in</Link>
                </Button>
                <Button asChild variant='secondary' className='flex-1'>
                  <Link href='/signup'>Sign up</Link>
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
