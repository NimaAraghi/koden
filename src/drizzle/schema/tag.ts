import { pgTable, varchar } from "drizzle-orm/pg-core";
import { id } from "../schemaHelpers";
import { relations } from "drizzle-orm";
import { PostTagTable } from "./postTag";

export const TagTable = pgTable("tags", {
  id,
  name: varchar().notNull().unique(),
});

export const TagRelationships = relations(TagTable, ({ many }) => ({
  posts: many(PostTagTable),
}));
