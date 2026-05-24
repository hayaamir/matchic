"use client";

import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useState, useEffect, useActionState, startTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerAction } from "@/lib/actions/auth.actions";

const Login = () => {
  const t = useTranslations();
  const { locale } = useParams<{ locale: string }>();
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loginPending, setLoginPending] = useState(false);

  const [registerState, registerDispatch, isRegistering] = useActionState(registerAction, null);

  useEffect(() => {
    if (!registerState) return;
    if (registerState.success) {
      signIn("credentials", { email, password, redirect: false }).then((res) => {
        if (res?.error) {
          setError("ההרשמה הצליחה — אנא התחבר");
          setMode("login");
        } else {
          router.replace(`/${locale}/questionnaire`);
        }
      });
    } else if (registerState.error) {
      setError(
        typeof registerState.error === "string"
          ? registerState.error
          : "שגיאה בהרשמה"
      );
    }
  }, [registerState]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginPending(true);
    setError(null);

    const res = await signIn("credentials", { email, password, redirect: false });

    setLoginPending(false);
    if (res?.error) {
      setError("אימייל או סיסמה שגויים");
    } else {
      router.replace(`/${locale}/questionnaire`);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    if (firstName) formData.append("firstName", firstName);
    if (lastName) formData.append("lastName", lastName);
    startTransition(() => registerDispatch(formData));
  };

  return (
    <main
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
      style={{ backgroundImage: "url('/loginBackground.png')" }}
    >
      <div className="bg-white/60 backdrop-blur-sm p-10 rounded-xl shadow-xl max-w-lg w-full">
        <p className="text-4xl leading-12 tracking-[1.18px] font-semibold text-center text-dark-green mb-12">
          {t("WELCOME")}
        </p>

        {mode === "login" ? (
          <form
            onSubmit={handleLogin}
            className="flex flex-col gap-4 w-96 max-w-full mx-auto"
          >
            <Input
              type="email"
              placeholder="אימייל"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="סיסמה"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <Button
              type="submit"
              className="w-full h-10 rounded-full bg-light-green hover:bg-light-green/90 cursor-pointer"
              disabled={loginPending}
            >
              {t("LOGIN")}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full h-10 rounded-full cursor-pointer"
              onClick={() => { setMode("register"); setError(null); }}
            >
              {t("REGISTER")}
            </Button>
          </form>
        ) : (
          <form
            onSubmit={handleRegister}
            className="flex flex-col gap-4 w-96 max-w-full mx-auto"
          >
            <Input
              placeholder="שם פרטי"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <Input
              placeholder="שם משפחה"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <Input
              type="email"
              placeholder="אימייל"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="סיסמה (לפחות 6 תווים)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <Button
              type="submit"
              className="w-full h-10 rounded-full bg-light-green hover:bg-light-green/90 cursor-pointer"
              disabled={isRegistering}
            >
              {t("REGISTER")}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full h-10 rounded-full cursor-pointer"
              onClick={() => { setMode("login"); setError(null); }}
            >
              {t("LOGIN")}
            </Button>
          </form>
        )}
      </div>
    </main>
  );
};

export default Login;
