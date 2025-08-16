"use client";
import SignOut from "@/app/(auth)/login/_components/SignOut";
import { ThemeToggle } from "@/components/ui/themeToggle";
import { authClient } from "@/lib/auth-client";
import Dropdown from "./DropdownMenu";

export default function Navbar() {
  const navigations = [
    { name: "Home", href: "/" },
    { name: "Courses", href: "/courses" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const { data: session, isPending } = authClient.useSession();
  return (
    <nav className="p-4 sticky top-0 z-50 bg-background/95 backdrop-blur-[backdrop-filter]:bg-background/60 border-b-1">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <a href="/" className="text-muted-foreground text-lg font-bold">
            LMS
          </a>
          <div>
            <ul className="flex space-x-4">
              {navigations.map((nav) => (
                <li key={nav.name}>
                  <a
                    href={nav.href}
                    className="text-muted-foreground hover:text-gray-300"
                  >
                    {nav.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {session ? (
              <div className="flex items-center space-x-4">
                <Dropdown />
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <a
                  href="/login"
                  className="text-muted-foreground hover:text-gray-300"
                >
                  Login
                </a>
                <a
                  href="/register"
                  className="text-muted-foreground hover:text-gray-300"
                >
                  Get Started
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
