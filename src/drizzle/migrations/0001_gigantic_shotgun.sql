ALTER TABLE "posts" ALTER COLUMN "authorId" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "comments" ALTER COLUMN "authorId" SET DATA TYPE uuid;