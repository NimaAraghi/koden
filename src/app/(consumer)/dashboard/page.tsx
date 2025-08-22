import { auth } from "@/auth";
import ProfileForm from "@/features/users/components/ProfileForm";
import React from "react";

export default function Profile() {
  return (
    <div>
      <ProfileForm />
    </div>
  );
}

export async function SuspendedPage() {
  const session = await auth();
  if (!session?.user) return null;

  return (
    <>
      <h1>{session.user.username}</h1>
    </>
  );
}
