import { auth } from "@/auth";
import LoginForm from "@/features/users/components/LoginForm";
import { redirect } from "next/navigation";
import React from "react";

export default async function Login() {
  const session = await auth();

  if (session) redirect("/dashboard");

  return (
    <>
      <LoginForm />
    </>
  );
}
