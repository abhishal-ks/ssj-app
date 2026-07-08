"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { LockKeyhole, Sparkles } from "lucide-react";
import { Button, Input } from "@/components/ui";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Unable to login. Please try again.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background/90 px-4 py-12">
      <div className="w-full max-w-3xl rounded-4xl border border-border/70 bg-surface/90 shadow-[0_28px_90px_rgba(15,23,42,0.12)] backdrop-blur-xl">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Welcome Message Section */}
          <div className="rounded-4xl bg-linear-to-br from-accent/15 via-surface to-surface-strong p-10 sm:p-12">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-accent/20 text-accent shadow-inner">
              <LockKeyhole size={24} />
            </div>
            <p className="mt-6 text-xs uppercase tracking-[0.35em] text-muted">Welcome back</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground">Sign in and continue your quiet space.</h1>
            <p className="mt-4 text-sm leading-7 text-muted">
              Access your private journal instantly and keep your thoughts organized with calm, clean design.
            </p>
            <div className="mt-8 rounded-3xl border border-border/70 bg-background/80 p-4 text-sm text-muted shadow-sm">
              <div className="flex items-center gap-2 text-accent">
                <Sparkles size={16} />
                <span className="font-medium">Safe, minimal journaling</span>
              </div>
              <p className="mt-2">Your entries stay private and available only when you sign in.</p>
            </div>
          </div>

          {/* Login Form Section */}
          <div className="p-8 sm:p-10">
            <div className="mb-8 text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-muted">Login</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">Welcome back to SSJ</h2>
              <p className="mt-3 text-sm leading-6 text-muted">
                Enter your username and password to pick up where you left off.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <label className="block">
                <span className="text-sm font-medium text-foreground">Username</span>
                <Input
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  autoComplete="username"
                  required
                  placeholder="Your username"
                  className="mt-2"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-foreground">Password</span>
                <div className="relative mt-2">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    required
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center justify-center w-12 text-muted transition hover:text-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </label>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button type="submit" variant="primary" size="lg" disabled={loading} className="w-full hover:scale-105 transition-transform">
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <div className="mt-8 rounded-3xl border border-border/70 bg-surface/80 p-5 text-center text-sm text-muted">
              <p>
                Don&apos;t have an account?{' '}
                <Link href="/auth/register" className="font-semibold text-accent hover:text-accent-strong transition">
                  Create one now.
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
