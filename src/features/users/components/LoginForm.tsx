"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { loginSchema } from "../schemas/login";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

import Link from "next/link";
import { login } from "@/features/users/actions/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { SocialButtons } from "./SocialButtons";

export default function LoginForm() {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();

  async function onSubmit(data: z.infer<typeof loginSchema>) {
    const { error, message } = await login(data);

    if (error) {
      toast.error(message);
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <Form {...form}>
      <div className='flex flex-col items-center justify-center gap-4 w-xs p-5 bg-white rounded-lg shadow-md'>
        <h2 className='uppercase text-2xl font-bold'>Login</h2>
        <p className='text-sm'>Login with your Github or Google account</p>
        <SocialButtons />
        <p className='text-sm'>or continue with</p>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col gap-4 w-full'
        >
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    className='shadow-border'
                    placeholder='example@gmail.com'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    placeholder='●●●●●●●●●●'
                    className='shadow-border'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            disabled={form.formState.isLoading}
            type='submit'
            className='bg-pink hover:bg-pink/90 cursor-pointer'
          >
            {form.formState.isLoading ? "Submitting..." : "Login"}
          </Button>
        </form>
        <div>
          <p>
            Don't have an Account{" "}
            <Link href='signup' className='text-pink underline'>
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </Form>
  );
}
