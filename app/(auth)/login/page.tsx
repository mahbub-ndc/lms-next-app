"use client";
import { authClient } from "@/lib/auth-client";

import { redirect } from "next/navigation";
import LoginForm from "./_components/loginForm";

export default function Login() {
  const session = authClient.useSession();

  return <LoginForm />;
}
