"use server";

import z from "zod";
import { signupSchema } from "../schemas/signup";
import bcrypt from "bcryptjs";
import {
  getUserByEmail,
  getUserById,
  getUserByUsername,
  insertUser,
  updateUser as updatedUserDB,
} from "../db/users";
import { fullProfileSchema } from "../schemas/profile";

export async function checkUsername(username: string, userId: string) {
  const user = await getUserByUsername(username);

  if (!user || user.id === userId)
    return { error: false, message: "Username is available" };

  return { error: true, message: "Username is taken" };
}

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

export async function updateUser(
  unsafeData: z.infer<typeof fullProfileSchema>
) {
  const { success, data } = fullProfileSchema.safeParse(unsafeData);
  if (!success) return { error: true, message: "Invalid data provided" };

  const { name, email, username, image, id, bio } = data;

  const existingUser = await getUserById(id);
  if (!existingUser) return { error: true, message: "User Not Found!" };

  const updatedUser = await updatedUserDB(
    { id },
    { name, email, username, image, bio }
  );

  return { error: false, message: "User Updated Successfully" };
}
