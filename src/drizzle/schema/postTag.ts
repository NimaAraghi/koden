import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { PostTable } from "./post";
import { TagTable } from "./tag";
import { createdAt, updatedAt } from "../schemaHelpers";
import { relations } from "drizzle-orm";

export const PostTagTable = pgTable(
  "post_tags",
  {
    postId: uuid()
      .notNull()
      .references(() => PostTable.id, { onDelete: "cascade" }),
    tagId: uuid()
      .notNull()
      .references(() => TagTable.id, { onDelete: "cascade" }),
    createdAt,
    updatedAt,
  },
  (t) => [primaryKey({ columns: [t.postId, t.tagId] })]
);

export const PostTagRelationships = relations(PostTagTable, ({ one }) => ({
  post: one(PostTable, {
    fields: [PostTagTable.postId],
    references: [PostTable.id],
  }),
  tag: one(TagTable, {
    fields: [PostTagTable.tagId],
    references: [TagTable.id],
  }),
}));
