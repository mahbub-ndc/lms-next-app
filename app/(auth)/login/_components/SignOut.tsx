"use client";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

import React from "react";

const SignOut = () => {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const signOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          console.log("Sign out successful");
          router.push("/login");
        },
        onError: (error) => {
          console.error("Sign out failed", error);
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
            <h1 className="text-2xl font-bold mb-4">You are signed in</h1>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"
              onClick={signOut}
              disabled={isPending}
            >
              {isPending ? "Signing out..." : "Sign Out"}
            </button>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-bold mb-4">You are not signed in</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignOut;
