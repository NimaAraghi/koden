import { pgTable, varchar } from "drizzle-orm/pg-core";
import { id } from "../schemaHelpers";
import { relations } from "drizzle-orm";
import { PostCategoryTable } from "./postCategory";

export const CategoryTable = pgTable("categories", {
  id,
  name: varchar().notNull().unique(),
});

export const CategoryRelationships = relations(CategoryTable, ({ many }) => ({
  posts: many(PostCategoryTable),
}));
