"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export default function VerifyEmailPage() {
  const [emailPending, startTransition] = useTransition();
  const router = useRouter();
  const [otp, setOtp] = useState("");

  const searchParams = useSearchParams();
  const email = searchParams.get("email") as string;

  function verifyOtp() {
    startTransition(async () => {
      if (!otp || otp.length < 6) {
        toast.error("Please enter a valid OTP");
        return;
      }

      await authClient.signIn.emailOtp({
        email: email,
        otp: otp,
        fetchOptions: {
          onSuccess: () => {
            toast.success("Email verified successfully");
            router.push("/");
          },
          onError: (error) => {
            toast.error(`Email verification failed!`);
          },
        },
      });
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verify Your Email</CardTitle>
        <CardDescription>
          Please check your email for the verification link.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <h3 className="py-3">
          Enter the OTP sent to your email to verify your account.
        </h3>
        <InputOTP maxLength={6} value={otp} onChange={(value) => setOtp(value)}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        <button
          className="mt-4 px-4 py-2 bg-gray-600 text-white rounded cursor-pointer"
          onClick={verifyOtp}
          disabled={emailPending}
        >
          {emailPending ? "Verifying..." : "Verify Email"}
        </button>
      </CardContent>
    </Card>
  );
}
