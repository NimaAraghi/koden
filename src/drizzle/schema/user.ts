import { pgEnum, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelpers";
import { relations } from "drizzle-orm";
import { PostTable } from "./post";
import { CommentTable } from "./comment";
import { AccountTable } from "./account";

export const userRoles = ["user", "admin"] as const;
export type UserRole = (typeof userRoles)[number];
export const userRoleEnum = pgEnum("user_role", userRoles);

export const UserTable = pgTable("users", {
  id,
  name: varchar().default("guest").notNull(),
  username: varchar()
    .$defaultFn(() => `user_${crypto.randomUUID().slice(0, 8)}`)
    .unique()
    .notNull(),
  email: varchar().notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  password: varchar(),
  role: userRoleEnum().default("user").notNull(),
  image: varchar(),
  createdAt,
  updatedAt,
});

export const UserRelationships = relations(UserTable, ({ many }) => ({
  posts: many(PostTable),
  comments: many(CommentTable),
  accounts: many(AccountTable),
}));
