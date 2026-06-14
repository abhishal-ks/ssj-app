"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (password !== passwordConfirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Unable to register. Please try again.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-4xl border border-neutral-800 bg-neutral-900/95 p-10 shadow-[0_40px_120px_rgba(0,0,0,0.45)]">
        <div className="mb-8 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Create account</p>
          <h1 className="mt-4 text-3xl font-semibold">Register for SSJ</h1>
          <p className="mt-2 text-sm text-neutral-400">Set a username and password to get started.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <label className="block">
            <span className="text-sm text-neutral-300">Username</span>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              required
              className="mt-2 w-full rounded-2xl border border-neutral-800 bg-neutral-950/80 px-4 py-3 text-sm text-white outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/10"
              placeholder="your username"
            />
          </label>

          <label className="block">
            <span className="text-sm text-neutral-300">Password</span>
            <div className="relative mt-2">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
                required
                className="w-full rounded-2xl border border-neutral-800 bg-neutral-950/80 px-4 py-3 pr-12 text-sm text-white outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center justify-center w-10 text-neutral-400 hover:text-neutral-200"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          <label className="block">
            <span className="text-sm text-neutral-300">Confirm Password</span>
            <div className="relative mt-2">
              <input
                type={showPasswordConfirm ? "text" : "password"}
                value={passwordConfirm}
                onChange={(event) => setPasswordConfirm(event.target.value)}
                autoComplete="new-password"
                required
                className="w-full rounded-2xl border border-neutral-800 bg-neutral-950/80 px-4 py-3 pr-12 text-sm text-white outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                className="absolute inset-y-0 right-0 flex items-center justify-center w-10 text-neutral-400 hover:text-neutral-200"
              >
                {showPasswordConfirm ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          {error ? <p className="text-sm text-red-300">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-sky-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.01] disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-400">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-semibold text-sky-300 hover:text-sky-100">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
