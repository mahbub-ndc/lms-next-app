import { ThemeToggle } from "@/components/ui/themeToggle";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import SignOut from "./(auth)/login/_components/SignOut";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return (
    <div>
      <ThemeToggle />
      <div className="flex flex-col items-center  ">
        <h1 className="text-[40px]">Hello world</h1>
        <div>
          {session ? (
            <div>
              <h3 className="text-2xl">
                Welcome back, {session.user.name || "User"}!
              </h3>
              <SignOut />
            </div>
          ) : (
            <p>
              Please
              <Link href="/login" className="text-blue-500 hover:underline">
                login
              </Link>
              to continue
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
