"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useParams, usePathname } from "next/navigation";

const navItems = [
  { id: "candidates", label: "משודכים", href: "candidates" },
  { id: "dashboard", label: "סטטיסטיקות", href: "dashboard" },
  { id: "questionnaire", label: "שאלון", href: "questionnaire" },
  { id: "profile", label: "פרופיל", href: "profile" },
];

export const Header = () => {
  const { locale } = useParams<{ locale: string }>();
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const isLoggedIn = status === "authenticated";

  if (pathname?.includes("/login")) return null;

  const activeId = navItems.find((item) =>
    pathname?.includes(`/${item.href}`)
  )?.id;

  const userName = session?.user?.name?.split(" ")[0] ?? session?.user?.email?.split("@")[0] ?? "שלום";
  const userInitial = userName?.[0] ?? "ש";

  return (
    <header
      style={{
        borderBottom: "1px solid var(--mc-line-soft)",
        background: "#FFFFFF",
        padding: "0 48px",
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 32,
        position: "sticky",
        top: 0,
        zIndex: 50,
        boxShadow: "0 1px 0 var(--mc-line-soft)",
      }}
    >
      {/* Logo */}
      <Link href={`/${locale}/candidates`} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/Matchic.png" alt="Matchic" style={{ height: 28, width: "auto", display: "block" }} />
      </Link>

      {/* Nav — centered, pill active state */}
      {isLoggedIn && (
        <nav style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <ul style={{ display: "flex", gap: 4, listStyle: "none", margin: 0, padding: 0 }}>
            {navItems.map((item) => {
              const active = activeId === item.id;
              return (
                <li key={item.id}>
                  <Link
                    href={`/${locale}/${item.href}`}
                    style={{
                      display: "block",
                      padding: "9px 18px",
                      fontSize: 14,
                      fontWeight: active ? 600 : 500,
                      color: active ? "var(--mc-accent-deep)" : "var(--mc-ink-soft)",
                      borderRadius: 999,
                      background: active ? "var(--mc-accent-soft)" : "transparent",
                      transition: "all .15s",
                      textDecoration: "none",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}

      {/* Right cluster */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
        {isLoggedIn ? (
          <>
            {/* New candidate button */}
            <Link
              href={`/${locale}/candidates/new`}
              style={{
                background: "var(--mc-ink)",
                color: "#FFF",
                borderRadius: 999,
                padding: "9px 18px",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 7,
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              משודך חדש
            </Link>

            {/* Notification bell */}
            <button
              style={{
                background: "transparent",
                border: "none",
                width: 40,
                height: 40,
                borderRadius: "50%",
                cursor: "pointer",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--mc-ink)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
              </svg>
              <span
                style={{
                  position: "absolute",
                  top: 10,
                  insetInlineEnd: 10,
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "var(--mc-accent)",
                  border: "2px solid #FFF",
                }}
              />
            </button>

            {/* Profile chip */}
            <button
              onClick={() => signOut({ callbackUrl: `/${locale}/login` })}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "4px 12px 4px 4px",
                border: "1px solid var(--mc-line)",
                borderRadius: 999,
                cursor: "pointer",
                background: "#FFF",
              }}
            >
              <span
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "var(--mc-accent-tint)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--mc-accent-deep)",
                  fontSize: 13,
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                {userInitial}
              </span>
              <span style={{ fontSize: 13, fontWeight: 500, color: "var(--mc-ink)" }}>{userName}</span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--mc-ink-soft)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
          </>
        ) : (
          <>
            <Link
              href={`/${locale}/login`}
              style={{
                padding: "9px 18px",
                fontSize: 14,
                fontWeight: 500,
                color: "var(--mc-ink-soft)",
                borderRadius: 999,
                textDecoration: "none",
              }}
            >
              כניסה
            </Link>
            <Link
              href={`/${locale}/login`}
              style={{
                background: "var(--mc-ink)",
                color: "#FFF",
                borderRadius: 999,
                padding: "9px 18px",
                fontSize: 14,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              הרשמה
            </Link>
          </>
        )}
      </div>
    </header>
  );
};
