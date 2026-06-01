"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect, useActionState, startTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import { registerAction } from "@/lib/actions/auth.actions";

const Login = () => {
  const { locale } = useParams<{ locale: string }>();
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loginPending, setLoginPending] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);

  const [registerState, registerDispatch, isRegistering] = useActionState(registerAction, null);

  useEffect(() => {
    if (!registerState) return;
    if (registerState.success) {
      signIn("credentials", { email, password, redirect: false }).then((res) => {
        if (res?.error) {
          setError("ההרשמה הצליחה — אנא התחבר");
          setMode("login");
        } else {
          router.replace(`/${locale}/candidates`);
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
      router.replace(`/${locale}/candidates`);
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

  const switchMode = (m: "login" | "register") => {
    setMode(m);
    setError(null);
  };

  const isRegister = mode === "register";
  const isPending = loginPending || isRegistering;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#FFFFFF",
        direction: "rtl",
        fontFamily: "var(--font-heebo, 'Heebo', sans-serif)",
        color: "var(--mc-ink)",
        display: "grid",
        gridTemplateColumns: "1.2fr 0.8fr",
        overflow: "hidden",
      }}
    >
      {/* Brand panel */}
      <BrandPanel />

      {/* Form panel */}
      <div
        style={{
          background: "#FFFFFF",
          padding: "56px 56px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          overflowY: "auto",
        }}
      >
        {/* Tab toggle */}
        <div
          style={{
            display: "inline-flex",
            alignSelf: "flex-start",
            background: "var(--mc-bg-alt)",
            borderRadius: 999,
            padding: 4,
            marginBottom: 32,
          }}
        >
          {[
            { id: "login", label: "כניסה" },
            { id: "register", label: "פתיחת חשבון" },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => switchMode(t.id as "login" | "register")}
              style={{
                padding: "8px 22px",
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                background: mode === t.id ? "#FFF" : "transparent",
                color: mode === t.id ? "var(--mc-ink)" : "var(--mc-ink-soft)",
                boxShadow: mode === t.id ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
                transition: "all .18s",
                border: "none",
                fontFamily: "inherit",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <h2
          style={{
            fontSize: 32,
            fontWeight: 800,
            letterSpacing: "-0.035em",
            lineHeight: 1.1,
            margin: 0,
            color: "var(--mc-ink)",
          }}
        >
          {isRegister ? "ברוכה הבאה למשפחה" : "ברוכה השבה"}
        </h2>
        <div style={{ marginTop: 8, color: "var(--mc-ink-soft)", fontSize: 15, lineHeight: 1.5 }}>
          {isRegister
            ? "כמה פרטים, ואת מתחילה לנהל את המשודכים שלך."
            : "הזיני את הפרטים שלך כדי להמשיך לפלטפורמה."}
        </div>

        <form
          onSubmit={isRegister ? handleRegister : handleLogin}
          style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 14 }}
        >
          {isRegister && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <LoginField
                label="שם פרטי"
                placeholder="רחל"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <LoginField
                label="שם משפחה"
                placeholder="אברמוב"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          )}

          <LoginField
            label="אימייל"
            placeholder="rachel@matchic.co.il"
            icon="mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <LoginField
            label="סיסמה"
            placeholder="••••••••"
            icon="lock"
            type={showPw ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            trailing={
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                style={{
                  cursor: "pointer",
                  fontSize: 12,
                  color: "var(--mc-accent-deep)",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  background: "none",
                  border: "none",
                  fontFamily: "inherit",
                }}
              >
                {showPw ? "הסתרה" : "הצגה"}
              </button>
            }
          />

          {!isRegister && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: -2 }}>
              <label
                onClick={() => setRemember((r) => !r)}
                style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--mc-ink-soft)", cursor: "pointer" }}
              >
                <span
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 5,
                    border: remember ? "1.5px solid var(--mc-accent)" : "1.5px solid var(--mc-line)",
                    background: remember ? "var(--mc-accent)" : "#FFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all .15s",
                  }}
                >
                  {remember && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  )}
                </span>
                זכרי אותי
              </label>
              <a style={{ fontSize: 13, color: "var(--mc-accent-deep)", textDecoration: "none", fontWeight: 600, cursor: "pointer" }}>
                שכחתי סיסמה
              </a>
            </div>
          )}

          {error && (
            <div
              style={{
                fontSize: 13,
                color: "#C8595E",
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "10px 14px",
                background: "#FEF2F2",
                borderRadius: 10,
                border: "1px solid #FED7D7",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C8595E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            style={{
              marginTop: 6,
              background: "var(--mc-ink)",
              color: "#FFF",
              border: "none",
              borderRadius: 12,
              padding: "15px 24px",
              fontSize: 15,
              fontWeight: 600,
              fontFamily: "inherit",
              cursor: isPending ? "wait" : "pointer",
              opacity: isPending ? 0.85 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              transition: "opacity .15s",
            }}
          >
            {isPending ? (
              <>
                <span
                  className="mc-spin"
                  style={{
                    width: 16,
                    height: 16,
                    border: "2px solid rgba(255,255,255,0.35)",
                    borderTopColor: "#FFF",
                    borderRadius: "50%",
                    display: "inline-block",
                  }}
                />
                רגע…
              </>
            ) : isRegister ? (
              "פתחי חשבון חינם"
            ) : (
              "המשיכי לפלטפורמה"
            )}
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              margin: "4px 0",
              color: "var(--mc-ink-muted)",
              fontSize: 12,
            }}
          >
            <div style={{ height: 1, background: "var(--mc-line)", flex: 1 }} />
            <span>או</span>
            <div style={{ height: 1, background: "var(--mc-line)", flex: 1 }} />
          </div>

          <button
            type="button"
            style={{
              background: "#FFF",
              color: "var(--mc-ink)",
              border: "1.5px solid var(--mc-line)",
              borderRadius: 12,
              padding: "13px 24px",
              fontSize: 14,
              fontWeight: 600,
              fontFamily: "inherit",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            המשיכי עם Google
          </button>

          {!isRegister && (
            <div style={{ marginTop: 8, fontSize: 13, color: "var(--mc-ink-soft)", textAlign: "center" }}>
              אין לך עדיין חשבון?{" "}
              <button
                type="button"
                onClick={() => switchMode("register")}
                style={{
                  color: "var(--mc-accent-deep)",
                  fontWeight: 600,
                  cursor: "pointer",
                  background: "none",
                  border: "none",
                  fontFamily: "inherit",
                  fontSize: 13,
                }}
              >
                פתחי חשבון חינם
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

const BrandPanel = () => (
  <div
    style={{
      background: "linear-gradient(165deg, #FAF1F0 0%, #F4DDDC 55%, #EBC8C5 100%)",
      color: "var(--mc-ink)",
      padding: "44px 56px",
      position: "relative",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      minHeight: "100vh",
    }}
  >
    {/* Soft decorative circles */}
    <div
      style={{
        position: "absolute",
        top: -140,
        insetInlineEnd: -100,
        width: 380,
        height: 380,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%)",
        pointerEvents: "none",
      }}
    />
    <div
      style={{
        position: "absolute",
        bottom: -80,
        insetInlineStart: -80,
        width: 260,
        height: 260,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(200,138,142,0.25) 0%, transparent 70%)",
        pointerEvents: "none",
      }}
    />

    {/* Logo */}
    <div style={{ position: "relative", zIndex: 2 }}>
      <img src="/Matchic.png" alt="Matchic" style={{ height: 36, width: "auto", display: "block" }} />
    </div>

    {/* Headline */}
    <div style={{ position: "relative", zIndex: 2, marginTop: 44, marginBottom: 22 }}>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          padding: "8px 18px",
          background: "rgba(255,255,255,0.78)",
          border: "1px solid rgba(200,138,142,0.45)",
          borderRadius: 999,
          fontSize: 14,
          fontWeight: 700,
          color: "var(--mc-accent-deep)",
          letterSpacing: "-0.005em",
          marginBottom: 26,
        }}
      >
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--mc-accent)" }} />
        המקום של השדכניות בישראל
      </div>
      <h1
        style={{
          fontSize: 56,
          fontWeight: 800,
          letterSpacing: "-0.04em",
          lineHeight: 1.05,
          margin: 0,
          color: "var(--mc-ink)",
        }}
      >
        כל המשודכים שלך
        <br />
        <span style={{ color: "var(--mc-accent-deep)" }}>במקום אחד נגיש ומסודר.</span>
      </h1>
      <p
        style={{
          marginTop: 22,
          fontSize: 17,
          lineHeight: 1.75,
          color: "rgba(42,27,31,0.78)",
          maxWidth: 520,
        }}
      >
        אותה דרך טובה ומוכרת — רק מסודרת יותר.
        <br />
        שום פרט לא נופל, שום בירור לא נשכח, שום הזדמנות לא נעלמת.
        <br />
        <b style={{ color: "var(--mc-ink)", fontWeight: 700 }}>
          ״עוֹד יִשָּׁמַע… קוֹל שָׂשׂוֹן וְקוֹל שִׂמְחָה, קוֹל חָתָן וְקוֹל כַּלָּה.״
        </b>
      </p>
    </div>

    {/* Floating product collage */}
    <div style={{ position: "relative", flex: 1, minHeight: 260 }}>
      <ProductCollage />
    </div>

    {/* Bottom value strip */}
    <div
      style={{
        position: "relative",
        zIndex: 2,
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: 16,
        paddingTop: 22,
        borderTop: "1px solid rgba(162,98,105,0.18)",
        marginTop: "auto",
      }}
    >
      {[
        { icon: "check", title: "אותה השיטה — רק נוחה יותר", text: "לא משנה את הדרך, רק את הסדר" },
        { icon: "bell",  title: "את תמיד בעניינים",            text: "תזכורות, בירורים פתוחים, וכל מה שלא יכול לחכות" },
        { icon: "heart", title: "לעזור לך לעזור לאחרים",        text: "זו המטרה היחידה שלנו" },
      ].map((v, i) => (
        <div key={i} style={{ display: "flex", gap: 10 }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: "rgba(255,255,255,0.75)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <ValueIcon name={v.icon} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--mc-ink)" }}>{v.title}</div>
            <div style={{ fontSize: 11, color: "rgba(42,27,31,0.6)", marginTop: 2, lineHeight: 1.4 }}>{v.text}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ProductCollage = () => (
  <div style={{ position: "absolute", inset: 0 }}>
    {/* Candidate card — back, tilted */}
    <div
      style={{
        position: "absolute",
        top: 0,
        insetInlineStart: 0,
        width: 200,
        transform: "rotate(-3.5deg)",
        filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.2))",
      }}
    >
      <div style={{ background: "#FFF", borderRadius: 14, padding: 12, width: 200 }}>
        <div
          style={{
            width: "100%",
            aspectRatio: "3/4",
            borderRadius: 10,
            background: "linear-gradient(160deg, #F8DDE0, #E8B8BE)",
            position: "relative",
            overflow: "hidden",
            marginBottom: 10,
          }}
        >
          <svg width="50%" height="auto" viewBox="0 0 100 130" style={{ position: "absolute", bottom: "-2%", left: "25%", opacity: 0.25 }}>
            <circle cx="50" cy="36" r="20" fill="white" />
            <path d="M10 130 Q10 70 50 70 Q90 70 90 130 Z" fill="white" />
          </svg>
          <div
            style={{
              position: "absolute",
              bottom: 8,
              insetInlineEnd: 8,
              background: "#FFF",
              padding: "3px 8px",
              borderRadius: 999,
              fontSize: 10,
              fontWeight: 500,
              color: "var(--mc-ink)",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--mc-accent)" }} />
            ממתינה
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--mc-ink)" }}>שירה לוי</div>
          <div style={{ fontSize: 12, color: "var(--mc-ink)", fontWeight: 500 }}>26</div>
        </div>
        <div style={{ fontSize: 11, color: "var(--mc-ink-soft)", marginTop: 2 }}>ירושלים · דתי לאומי</div>
      </div>
    </div>

    {/* Stat tile */}
    <div
      style={{
        position: "absolute",
        top: 60,
        insetInlineEnd: 40,
        transform: "rotate(2.5deg)",
        filter: "drop-shadow(0 16px 32px rgba(0,0,0,0.18))",
      }}
    >
      <div style={{ background: "#FFF", borderRadius: 14, padding: 18, width: 170 }}>
        <div style={{ fontSize: 11, color: "var(--mc-ink-soft)", fontWeight: 500, marginBottom: 6 }}>
          שידוכים נסגרו השנה
        </div>
        <div
          style={{
            fontSize: 44,
            fontWeight: 800,
            color: "var(--mc-ink)",
            letterSpacing: "-0.04em",
            lineHeight: 1,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          12
        </div>
        <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#7C9577", fontWeight: 600 }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
          +3 מהשנה שעברה
        </div>
        <div style={{ marginTop: 14, display: "flex", alignItems: "flex-end", gap: 4, height: 28 }}>
          {[40, 55, 35, 70, 50, 85, 100].map((h, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: `${h}%`,
                background: i === 6 ? "var(--mc-accent)" : "var(--mc-accent-tint)",
                borderRadius: 2,
              }}
            />
          ))}
        </div>
      </div>
    </div>

    {/* Notification toast */}
    <div
      style={{
        position: "absolute",
        bottom: 10,
        insetInlineStart: 100,
        transform: "rotate(-1.5deg)",
        filter: "drop-shadow(0 14px 28px rgba(0,0,0,0.16))",
      }}
    >
      <div
        style={{
          background: "#FFF",
          borderRadius: 14,
          padding: "12px 16px",
          width: 260,
          display: "flex",
          gap: 12,
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #F8DDE0, #E8B8BE)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--mc-accent-deep)",
            fontSize: 14,
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          מ
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--mc-ink)" }}>מרים פינטו שלחה הצעה</div>
          <div style={{ fontSize: 11, color: "var(--mc-ink-soft)", marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            יהונתן כהן · 28 · ירושלים
          </div>
        </div>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--mc-accent)", flexShrink: 0 }} />
      </div>
    </div>
  </div>
);

type LoginFieldProps = {
  label: string;
  placeholder?: string;
  icon?: "mail" | "lock";
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  trailing?: React.ReactNode;
  error?: string;
};

const LoginField = ({ label, placeholder, icon, type = "text", value, onChange, trailing, error }: LoginFieldProps) => {
  const [focus, setFocus] = useState(false);
  const borderColor = error ? "#C8595E" : focus ? "var(--mc-accent)" : "var(--mc-line)";
  return (
    <label style={{ display: "block" }}>
      <div style={{ fontSize: 13, color: "var(--mc-ink)", marginBottom: 7, fontWeight: 600 }}>{label}</div>
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          background: "#FFF",
          border: `1.5px solid ${borderColor}`,
          boxShadow: focus && !error ? "0 0 0 3px rgba(200,138,142,0.14)" : "none",
          borderRadius: 12,
          padding: "0 14px",
          height: 50,
          transition: "border-color .15s, box-shadow .15s",
          gap: 10,
        }}
      >
        {icon && (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={error ? "#C8595E" : "var(--mc-ink-muted)"} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            {icon === "mail" && (
              <>
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m2 7 10 6 10-6" />
              </>
            )}
            {icon === "lock" && (
              <>
                <rect x="4" y="11" width="16" height="10" rx="2" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" />
              </>
            )}
          </svg>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={{
            flex: 1,
            border: "none",
            background: "transparent",
            outline: "none",
            fontFamily: "inherit",
            fontSize: 15,
            color: "var(--mc-ink)",
            height: "100%",
          }}
        />
        {trailing}
      </div>
      {error && (
        <div style={{ marginTop: 6, fontSize: 12, color: "#C8595E", display: "flex", alignItems: "center", gap: 5 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#C8595E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          {error}
        </div>
      )}
    </label>
  );
};

type ValueIconProps = { name: string };

const ValueIcon = ({ name }: ValueIconProps) => {
  const paths: Record<string, React.ReactNode> = {
    check: <path d="M20 6 9 17l-5-5" />,
    bell: (
      <>
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      </>
    ),
    heart: (
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    ),
  };
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--mc-accent-deep)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
};

export default Login;
