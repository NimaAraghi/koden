import { auth } from "@/auth";
import SignupForm from "@/features/users/components/SignupForm";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";

export default function Signup() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignupWithSession />
    </Suspense>
  );
}

async function SignupWithSession() {
  const session = await auth();

  if (session) redirect("/dashboard");

  return <SignupForm />;
}
