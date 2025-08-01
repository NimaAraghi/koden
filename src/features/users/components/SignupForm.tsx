"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { signupSchema } from "../schemas/signup";
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

import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { VerificationForm } from "./VerificaitonForm";
import { SocialButtons } from "./SocialButtons";
import { signup } from "../actions/auth";

export default function SignupForm() {
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");

  const router = useRouter();

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: z.infer<typeof signupSchema>) {
    const { error, message } = await signup(data);

    if (error) {
      toast.error(message);
      return;
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <Form {...form}>
      <div className='flex flex-col items-center justify-center gap-4 w-xs p-5 bg-white rounded-lg shadow-md'>
        <h2 className='uppercase text-2xl font-bold'>Sign Up</h2>
        <p className='text-sm'>Sign up with your Github or Google account</p>
        <SocialButtons />
        <p className='text-sm'>or continue with</p>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col gap-4 w-full'
        >
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    className='shadow-border'
                    placeholder='John Doe'
                    {...field}
                  />
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
                    className='shadow-border'
                    placeholder='●●●●●●●●●●'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='confirmPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    className='shadow-border'
                    placeholder='●●●●●●●●●●'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            disabled={form.formState.isSubmitting}
            type='submit'
            className='bg-pink hover:bg-pink/90 cursor-pointer'
          >
            {form.formState.isLoading ? "Submitting..." : "Sign up"}
          </Button>
        </form>
        <div>
          <p>
            Already have an account?{" "}
            <Link href='/login' className='text-pink underline'>
              Login
            </Link>
          </p>
        </div>
      </div>
    </Form>
  );
}
