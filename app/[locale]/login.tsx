"use client";

import { Unauthenticated } from "convex/react";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function Login() {
  const t = useTranslations();

  return (
    <>
      <main
        className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={{ backgroundImage: "url('/loginBackground.png')" }}
      >
        <div className="bg-white/60 backdrop-blur-sm p-10 rounded-xl shadow-xl max-w-lg w-full">
          <p className="text-4xl leading-12 tracking-[1.18px] font-semibold text-center text-dark-green mb-12">
            {t("WELCOME")}
          </p>
          <Unauthenticated>
            <div className="flex flex-col gap-4 w-96 max-w-full mx-auto items-center">
              <div className="flex flex-col gap-4 w-96 mx-auto items-center">
                <SignInButton mode="modal">
                  <Button className="w-64 h-10 rounded-full bg-light-green hover:bg-light-green/90 cursor-pointer">
                    {t("LOGIN")}
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button
                    className="w-64 h-10 rounded-full cursor-pointer"
                    variant="outline"
                  >
                    {t("REGISTER")}
                  </Button>
                </SignUpButton>
              </div>
            </div>
          </Unauthenticated>
        </div>
      </main>
    </>
  );
}
