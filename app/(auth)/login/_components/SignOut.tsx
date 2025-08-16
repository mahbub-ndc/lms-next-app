"use client";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

import React from "react";
import { toast } from "sonner";

const SignOut = () => {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const signOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Signed out successfully");
          router.push("/login");
        },
      },
    });

    // Optionally redirect or show a message after signing out
  };
  return (
    <div className="flex items-center justify-center py-1.5">
      <div className="text-center">
        {session ? (
          <div>
            <button
              className="cursor-pointer"
              onClick={signOut}
              disabled={isPending}
            >
              {isPending ? "Logging out..." : "Log Out"}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SignOut;
