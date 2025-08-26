import { auth } from "@/auth";
import { db } from "@/drizzle/db";
import { UserTable } from "@/drizzle/schema";
import ProfileForm from "@/features/users/components/ProfileForm";
import { getUserIdTag } from "@/features/users/db/cache";
import { eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import React, { Suspense } from "react";

export default function Profile() {
  return (
    <>
      <Suspense>
        <SuspendedPage />
      </Suspense>
    </>
  );
}

async function SuspendedPage() {
  const session = await auth();

  const user = await getUser(session?.user.id || "");

  if (!user) return <h1>User info not found, Login again</h1>;

  return (
    <div>
      <ProfileForm user={user} />
    </div>
  );
}

async function getUser(id: string) {
  "use cache";
  cacheTag(getUserIdTag(id));

  return db.query.UserTable.findFirst({
    columns: {
      id: true,
      name: true,
      email: true,
      username: true,
      image: true,
      bio: true,
    },
    where: eq(UserTable.id, id),
  });
}
