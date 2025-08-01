"use server";

import z from "zod";
import { signupSchema } from "../schemas/signup";
import bcrypt from "bcryptjs";
import { getUserByEmail, insertUser } from "../db/users";

export async function createUser(unsafeData: z.infer<typeof signupSchema>) {
  const { success, data } = signupSchema.safeParse(unsafeData);

  if (!success) return { error: true, message: "Invalid data provided" };

  const { name, email, password } = data;

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: true, message: "User already exists" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await insertUser({
    name,
    email,
    password: hashedPassword,
  });

  return { error: false, message: "User created successfully" };
}
