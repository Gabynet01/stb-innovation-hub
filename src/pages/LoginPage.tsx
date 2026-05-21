import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Input, Button } from "@/components/ui";
import stanbicLogo from "@/assets/images/stanbic_logo.svg";
import packageJson from "../../package.json";

type AuthMode = "internal" | "ad";

const HERO_IMAGE = `${process.env.PUBLIC_URL || ""}/bg-img.jpg`;

export const LoginPage: React.FC = () => {
  const { login, loginAd } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ||
    "/dashboard";

  const [mode, setMode] = useState<AuthMode>("internal");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "ad") {
        await loginAd(username.trim(), password);
      } else {
        await login(username.trim(), password);
      }
      navigate(from, { replace: true });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Sign-in failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white md:flex-row">
      {/* Left — form */}
      <div className="flex w-full flex-col px-6 py-10 sm:px-10 md:w-1/2 md:max-w-xl md:px-12 lg:max-w-none lg:w-[46%] lg:px-16 lg:py-14">
        <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="flex w-full justify-center">
              <img
                src={stanbicLogo}
                alt="Stanbic Bank"
                className="h-16 w-auto max-w-[200px] object-contain sm:h-[4.5rem]"
              />
            </div>
            <h1 className="mt-6 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Welcome to Idea Flow
            </h1>
            <p className="mt-2 max-w-sm text-sm text-slate-600">
              Sign in with your organisation credentials.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-2.5">
            <button
              type="button"
              role="tab"
              aria-selected={mode === "internal"}
              onClick={() => {
                setMode("internal");
                setError(null);
              }}
              className={`flex w-full items-center justify-center rounded-lg border px-2.5 py-2 text-center text-[11px] font-semibold leading-tight transition sm:px-3 sm:py-2.5 sm:text-xs ${
                mode === "internal"
                  ? "border-[#0051FF] bg-[#F0F7FF] text-[#0033A1] shadow-sm ring-1 ring-[#0051FF]/20"
                  : "border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              Login with username or password
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "ad"}
              onClick={() => {
                setMode("ad");
                setError(null);
              }}
              className={`flex w-full items-center justify-center rounded-lg border px-2.5 py-2 text-center text-[11px] font-semibold leading-tight transition sm:px-3 sm:py-2.5 sm:text-xs ${
                mode === "ad"
                  ? "border-amber-400/90 bg-amber-50/80 text-amber-950 shadow-sm ring-1 ring-amber-200/60"
                  : "border-amber-200 bg-white text-slate-800 hover:border-amber-300 hover:bg-amber-50/40"
              }`}
            >
              Continue with Active Directory
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                {mode === "ad"
                  ? "Username (UPN or sAMAccountName)"
                  : "Username"}
              </label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
                inputSize="md"
                className="border-slate-200 focus:border-[#0051FF] focus:ring-[#0051FF]/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                inputSize="md"
                className="border-slate-200 focus:border-[#0051FF] focus:ring-[#0051FF]/20"
              />
            </div>
            {error ? (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            ) : null}
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="w-full !min-h-[48px] !bg-[#0051FF] hover:!bg-[#0033A1] focus:ring-[#0051FF]/30"
            >
              Sign in
            </Button>
          </form>

          <Button
            type="button"
            variant="outline"
            fullWidth
            className="mt-3 !min-h-[48px] border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50"
            onClick={() => navigate("/ideas?view=form")}
          >
            Proceed as Guest
          </Button>

          <p className="mt-8 text-center text-xs text-slate-500">
            Public idea submissions do not require sign-in. Staff tools need an
            active session.
          </p>
        </div>

        <p className="mx-auto mt-8 w-full max-w-lg text-center text-xs text-slate-400">
          Version {packageJson.version}
        </p>
      </div>

      {/* Right — hero (tablet+) */}
      <div className="relative hidden min-h-0 flex-1 md:block">
        <img
          src={HERO_IMAGE}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#0033A1]/85 via-[#0033A1]/25 to-transparent"
          aria-hidden
        />
        {/* Light shield outline — echoes Stanbic crest */}
        <svg
          className="pointer-events-none absolute left-1/2 top-1/2 h-[min(70vh,520px)] w-[min(85vw,420px)] -translate-x-1/2 -translate-y-1/2 text-white/25"
          viewBox="0 0 200 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <path
            d="M100 8 L172 48 V120 C172 175 145 210 100 232 C55 210 28 175 28 120 V48 Z"
            stroke="currentColor"
            strokeWidth="2.5"
          />
        </svg>
      </div>
    </div>
  );
};
