import { auth } from "@/auth";
import LoginForm from "@/features/users/components/LoginForm";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";

export default function Login() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginWithSessionCheck />
    </Suspense>
  );
}

async function LoginWithSessionCheck() {
  const session = await auth();
  if (session) redirect("/dashboard");
  return <LoginForm />;
}
