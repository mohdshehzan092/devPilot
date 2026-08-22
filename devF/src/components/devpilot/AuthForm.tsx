import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Loader2, Terminal } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import * as authService from "@/services/auth.service";

export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const isLogin = mode === "login";
  const navigate = useNavigate();
  const { login } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    try {
      setLoading(true);

      if (isLogin) {
        const data = await authService.loginUser({ email, password });
        login(data);
        navigate({ to: "/" });
      } else {
        await authService.registerUser({ name, email, password });
        navigate({ to: "/login" });
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          (isLogin ? "Invalid credentials" : "Could not create account"),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-2">
      {/* Brand side */}
      <div className="relative hidden flex-col justify-between overflow-hidden border-r border-border bg-surface p-10 lg:flex">
        <div className="pointer-events-none absolute -top-32 -left-24 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute right-0 bottom-0 h-72 w-72 rounded-full bg-ai/10 blur-3xl" />

        <div className="relative flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Terminal size={16} />
          </span>
          <span className="text-[15px] font-bold tracking-tight">DevPilot</span>
        </div>

        <div className="relative max-w-sm">
          <h2 className="text-[30px] leading-[1.15] font-bold tracking-tight">
            The API workspace with an AI copilot built in.
          </h2>
          <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">
            Organize collections, run requests against any environment, and let
            AI draft bodies, write tests and explain failures.
          </p>

          <div className="mt-8 space-y-2.5">
            {[
              "Collections, history and environments in one rail",
              "AI-generated request bodies and assertions",
              "Instant error explanations on failed calls",
            ].map((item) => (
              <p
                key={item}
                className="flex items-start gap-2 text-[12.5px] text-muted-foreground"
              >
                <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {item}
              </p>
            ))}
          </div>
        </div>

        <p className="relative font-mono text-[11px] text-muted-foreground">
          v1.0 · built for developers
        </p>
      </div>

      {/* Form side */}
      <div className="flex items-center justify-center px-5 py-12">
        <form onSubmit={submit} className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Terminal size={16} />
            </span>
            <span className="text-[15px] font-bold tracking-tight">DevPilot</span>
          </div>

          <h1 className="text-[22px] font-bold tracking-tight">
            {isLogin ? "Sign in to DevPilot" : "Create your account"}
          </h1>
          <p className="mt-1.5 text-[13px] text-muted-foreground">
            {isLogin
              ? "Pick up right where you left off."
              : "Start building and testing APIs in minutes."}
          </p>

          {error && (
            <p className="animate-fade-up mt-5 rounded-md border border-destructive/35 bg-destructive/10 px-3 py-2 text-[12.5px] text-destructive">
              {error}
            </p>
          )}

          <div className="mt-6 space-y-3.5">
            {!isLogin && (
              <div>
                <label className="mb-1.5 block text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                  Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Ada Lovelace"
                  className="field py-2.5"
                />
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@company.com"
                className="field py-2.5"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="field py-2.5"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-primary py-2.5 text-[13.5px] font-bold text-primary-foreground shadow-[0_8px_22px_-10px_var(--primary)] transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {loading && <Loader2 size={15} className="animate-spin" />}
            {isLogin ? "Sign in" : "Create account"}
          </button>

          <p className="mt-5 text-center text-[12.5px] text-muted-foreground">
            {isLogin ? "New to DevPilot? " : "Already have an account? "}
            <Link
              to={isLogin ? "/signup" : "/login"}
              className="font-semibold text-primary hover:underline"
            >
              {isLogin ? "Create an account" : "Sign in"}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
