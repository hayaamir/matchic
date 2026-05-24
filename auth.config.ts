import type { NextAuthConfig } from "next-auth";

// Edge-safe config — no Prisma imports here (middleware runs on Edge runtime)
export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/he/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isLoginPage = nextUrl.pathname.includes("/login");
      const isAuthApi = nextUrl.pathname.startsWith("/api/auth");
      if (isLoginPage || isAuthApi) return true;
      return isLoggedIn;
    },
  },
  providers: [],
};
