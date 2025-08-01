import { auth } from "@/auth";
import SignupForm from "@/features/users/components/SignupForm";
import { redirect } from "next/navigation";
import React from "react";

export default async function Signup() {
  const session = await auth();

  if (session) redirect("/dashboard");

  return (
    <>
      <SignupForm />
    </>
  );
}
