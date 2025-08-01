import { pgEnum, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelpers";
import { UserTable } from "./user";
import { relations } from "drizzle-orm";
import { PostTable } from "./post";

export const commentStatuses = ["approved", "rejected"] as const;
export type commentStatus = (typeof commentStatuses)[number];
export const commentStatusEnum = pgEnum("comment_status", commentStatuses);

export const CommentTable = pgTable("comments", {
  id,
  postId: uuid()
    .references(() => PostTable.id, { onDelete: "cascade" })
    .notNull(),
  authorId: uuid()
    .references(() => UserTable.id, { onDelete: "restrict" })
    .notNull(),
  content: text().notNull(),
  status: commentStatusEnum().default("approved").notNull(),
  createdAt,
  updatedAt,
});

export const CommentRelationships = relations(CommentTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [CommentTable.authorId],
    references: [UserTable.id],
  }),
  post: one(PostTable, {
    fields: [CommentTable.postId],
    references: [PostTable.id],
  }),
}));
