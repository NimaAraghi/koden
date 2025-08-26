"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { profileSchema } from "../schemas/profile";
import z from "zod";
import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import ImageUpload from "@/services/uploadthing/components/ImageUpload";
import { checkUsername, updateUser } from "../actions/users";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

type UserProfile = {
  name: string;
  id: string;
  username: string;
  email: string;
  image: string | null;
  bio: string | null;
};

export default function ProfileForm({ user }: { user: UserProfile }) {
  const { update } = useSession();

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
      username: user.username || "",
      bio: user.bio || "",
    },
  });

  const [imageUrl, setImageUrl] = useState<string>(user.image || "");
  async function onSubmit(data: z.infer<typeof profileSchema>) {
    try {
      const { error, message } = await updateUser({
        id: user.id || "",
        ...data,
        image: imageUrl,
      });

      console.log({
        id: user.id || "",
        ...data,
        image: imageUrl,
      });

      if (error) {
        toast.error(message);
      } else {
        await update({ ...data, image: imageUrl });
        toast.success(message);
      }
    } catch (error) {}
  }

  const username = form.watch("username");

  useEffect(() => {
    const debounce = setTimeout(async () => {
      const { error, message } = await checkUsername(username, user.id || "");

      form.clearErrors("username");
      if (error) form.setError("username", { type: "custom", message });
    }, 500);
  }, [username]);

  return (
    <div className='bg-white rounded-md p-4'>
      <Link
        className='text-blue-700 text-2xl font-bold pb-4'
        href={`/@${user.username || "/"}`}
      >
        @{user.username}
      </Link>
      <Form {...form}>
        <form
          className='flex flex-col justify-center gap-4 p-4'
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder='enter your name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder='example@gamil.com' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='username'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder='enter a username' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='bio'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Tell us a little bit about yourself'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='flex gap-4 my-5'>
            {imageUrl && (
              <div>
                <img
                  src={imageUrl}
                  className='size-12 rounded-full object-cover border border-black'
                />
              </div>
            )}
            <ImageUpload setImageUrl={setImageUrl} imageUrl={imageUrl} />
          </div>

          <Button
            className='w-fit'
            type='submit'
            disabled={form.formState.isSubmitting}
          >
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
