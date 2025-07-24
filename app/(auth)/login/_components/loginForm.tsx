"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { use, useTransition } from "react";
import { toast } from "sonner";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Separator } from "@radix-ui/react-dropdown-menu";

const LoginForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [emailPending, startEmailTransition] = useTransition();
  const [email, setEmail] = useState("");

  async function signInqithGithub() {
    startTransition(async () => {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Sign in with GitHub successful");
          },
          onError: (error) => {
            toast.error("Sign in with GitHub failed");
          },
        },
      });
      console.log("Sign in with GitHub clicked");
    });
  }
  function signInWithEmail() {
    startEmailTransition(async () => {
      await authClient.emailOtp.sendVerificationOtp({
        email: email,
        type: "sign-in",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Email OPT Sent");
            router.push(`/verify-request?email=${email}`);
          },
          onError: (error) => {
            toast.error("Sign in with email failed");
          },
        },
      });
      console.log("Sign in with email clicked");
    });
  }
  return (
    <div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
          <CardAction>
            <Button variant="link">Sign Up</Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            type="submit"
            className="w-full"
            onClick={signInWithEmail}
            disabled={emailPending}
          >
            {emailPending ? "Sending OTP..." : "Send OTP to Email"}
          </Button>
          <Separator className="my-1" />
          <h3>Or Singin using Github</h3>
          <Separator className="my-1" />
          <Button
            variant="outline"
            className="w-full"
            onClick={signInqithGithub}
            disabled={isPending}
          >
            {isPending ? "Logging in..." : "Login with GitHub"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginForm;
