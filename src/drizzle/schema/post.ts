import { pgEnum, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelpers";
import { UserTable } from "./user";
import { relations } from "drizzle-orm";
import { CommentTable } from "./comment";
import { PostCategoryTable } from "./postCategory";

export const postStatuses = ["published", "draft"] as const;
export type postStatus = (typeof postStatuses)[number];
export const postStatusEnum = pgEnum("post_status", postStatuses);

export const PostTable = pgTable("posts", {
  id,
  title: varchar().notNull(),
  slug: varchar().notNull().unique(),
  content: text().notNull(),
  image: varchar().notNull(),
  authorId: uuid()
    .notNull()
    .references(() => UserTable.id, { onDelete: "restrict" }),
  status: postStatusEnum().default("draft").notNull(),
  createdAt,
  updatedAt,
});

export const PostRelationships = relations(PostTable, ({ one, many }) => ({
  user: one(UserTable, {
    fields: [PostTable.authorId],
    references: [UserTable.id],
  }),
  comments: many(CommentTable),
  categories: many(PostCategoryTable),
}));
