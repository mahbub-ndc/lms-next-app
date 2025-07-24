"use client";
import { authClient } from "@/lib/auth-client";

import LoginForm from "./_components/loginForm";
import { redirect } from "next/navigation";

export default function Login() {
  const session = authClient.useSession();

  return <LoginForm />;
}
