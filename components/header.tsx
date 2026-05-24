"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { useParams } from "next/navigation";

const menuItems = [
  { name: "המחברת", href: "candidates" },
  { name: "פרופיל", href: "#" },
  { name: "שאלון", href: "questionnaire" },
];

export const Header = () => {
  const { locale } = useParams<{ locale: string }>();
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";

  return (
    <header className="w-full border-b bg-background">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href={`/${locale}`} aria-label="home" className="flex items-center gap-3">
          <img src="/Matchic.png" alt="Logo" className="h-12 w-auto" />
        </Link>

        <nav aria-label="primary">
          <ul className="hidden gap-6 text-sm font-medium text-foreground md:flex">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href === "#" ? "#" : `/${locale}/${item.href}`}
                  className="transition-colors hover:text-primary"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          {!isLoggedIn ? (
            <>
              <Button asChild variant="outline" size="sm">
                <Link href={`/${locale}/login`}>כניסה</Link>
              </Button>
              <Button asChild size="sm">
                <Link href={`/${locale}/login`}>הרשמה</Link>
              </Button>
            </>
          ) : (
            <>
              <span className="text-sm text-muted-foreground hidden md:block">
                {session?.user?.name ?? session?.user?.email}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => signOut({ callbackUrl: `/${locale}/login` })}
              >
                יציאה
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
