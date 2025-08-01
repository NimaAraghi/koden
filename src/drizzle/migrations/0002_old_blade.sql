CREATE TABLE "account" (
	"userId" varchar NOT NULL,
	"type" varchar NOT NULL,
	"provider" varchar NOT NULL,
	"providerAccountId" varchar NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" timestamp,
	"token_type" varchar,
	"scope" varchar,
	"id_token" text,
	"session_state" varchar
);
