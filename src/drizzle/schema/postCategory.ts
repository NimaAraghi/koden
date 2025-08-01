import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { PostTable } from "./post";
import { CategoryTable } from "./category";
import { createdAt, updatedAt } from "../schemaHelpers";
import { relations } from "drizzle-orm";

export const PostCategoryTable = pgTable(
  "post_categories",
  {
    postId: uuid()
      .notNull()
      .references(() => PostTable.id, { onDelete: "cascade" }),
    categoryId: uuid()
      .notNull()
      .references(() => CategoryTable.id, { onDelete: "cascade" }),
    createdAt,
    updatedAt,
  },
  (t) => [primaryKey({ columns: [t.postId, t.categoryId] })]
);

export const PostCategoryRelationships = relations(
  PostCategoryTable,
  ({ one }) => ({
    post: one(PostTable, {
      fields: [PostCategoryTable.postId],
      references: [PostTable.id],
    }),
    category: one(CategoryTable, {
      fields: [PostCategoryTable.categoryId],
      references: [CategoryTable.id],
    }),
  })
);
