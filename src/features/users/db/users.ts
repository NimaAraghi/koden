"use server";

import { db } from "@/drizzle/db";
import { UserTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { revalidateUserCache } from "./cache";

export async function getUserByUsername(username: string) {
  const [user] = await db
    .select()
    .from(UserTable)
    .where(eq(UserTable.username, username));

  return user ? user : null;
}

export async function getUserByEmail(email: string) {
  const [user] = await db
    .select()
    .from(UserTable)
    .where(eq(UserTable.email, email));

  return user ? user : null;
}

export async function getUserById(id: string) {
  const [user] = await db.select().from(UserTable).where(eq(UserTable.id, id));

  return user ? user : null;
}

export async function insertUser(data: typeof UserTable.$inferInsert) {
  const [newUser] = await db
    .insert(UserTable)
    .values(data)
    .returning()
    .onConflictDoUpdate({
      target: [UserTable.id],
      set: data,
    });

  if (newUser == null) throw new Error("Failed to insert user");

  revalidateUserCache(newUser.id);

  return newUser;
}

export async function updateUser(
  { id }: { id: string },
  data: Partial<typeof UserTable.$inferInsert>
) {
  const [updatedUser] = await db
    .update(UserTable)
    .set(data)
    .where(eq(UserTable.id, id))
    .returning();

  if (updatedUser == null) throw new Error("Failed to update user");

  revalidateUserCache(updatedUser.id);

  return updatedUser;
}

export async function deleteUser({ id }: { id: string }) {
  const [deletedUser] = await db
    .delete(UserTable)
    .where(eq(UserTable.id, id))
    .returning();

  if (deletedUser == null) throw new Error("Failed to delete user");

  revalidateUserCache(deletedUser.id);

  return deletedUser;
}
