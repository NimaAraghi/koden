import { pgTable, varchar, text, integer, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { UserTable } from "./user";

export const AccountTable = pgTable(
  "account",
  {
    userId: uuid().notNull(),
    type: varchar().notNull(),
    provider: varchar().notNull(),
    providerAccountId: varchar().notNull(),
    refresh_token: text(),
    access_token: text(),
    expires_at: integer("expires_at"),
    token_type: varchar(),
    scope: varchar(),
    id_token: text(),
    session_state: varchar(),
  },
  (account) => ({
    compoundPk: {
      columns: [account.provider, account.providerAccountId],
      primaryKey: true,
    },
  })
);

// Optional: define relation to user
export const AccountRelations = relations(AccountTable, ({ one }) => ({
  user: one(UserTable, {
    fields: [AccountTable.userId],
    references: [UserTable.id],
  }),
}));
