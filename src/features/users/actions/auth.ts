"use server";

import z from "zod";
import { loginSchema } from "../schemas/login";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { signupSchema } from "../schemas/signup";
import { createUser } from "./users";

export async function login(unsafeData: z.infer<typeof loginSchema>) {
  const { success, data } = loginSchema.safeParse(unsafeData);

  if (!success)
    return { error: true, message: "There was a problem with your form" };

  const { email, password } = data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return { error: false, message: "Logged in successfully" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: true, message: "Invalid Credentials" };
        default:
          return { error: true, message: "Something went wrong" };
      }
    }

    throw error;
  }
}

export async function signup(unsafeData: z.infer<typeof signupSchema>) {
  const { error, message } = await createUser(unsafeData);

  if (error) return { error, message };

  const { email, password } = unsafeData;
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return { error: false, message: "Logged in successfully" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: true, message: "Invalid Credentials" };
        default:
          return { error: true, message: "Something went wrong" };
      }
    }

    throw error;
  }
}
