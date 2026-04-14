"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";
import { setToken } from "@/lib/auth";

export default function SignInPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setError("Please enter your username and password.");
      return;
    }
    setLoading(true);
    setError("");

    const result = await login(identifier.trim(), password);
    setLoading(false);

    if (result.success && result.data) {
      setToken(result.data.token);
      router.push("/home");
    } else {
      setError(result.error ?? "Sign in failed. Please try again.");
    }
  }

  return (
    <div className="w-full max-w-sm">
      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-12 h-12 rounded-2xl bg-brand-purple flex items-center justify-center mb-4">
          <span className="text-white font-bold text-xl">S</span>
        </div>
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-text-muted text-sm mt-1">Sign in to your Sock account</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text-secondary">
            Username
          </label>
          <input
            type="text"
            autoComplete="username"
            placeholder="your_username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full bg-bg-elevated border border-border-default rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-purple transition-colors text-sm"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text-secondary">
            Password
          </label>
          <input
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-bg-elevated border border-border-default rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-purple transition-colors text-sm"
          />
        </div>

        {error && (
          <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-purple hover:bg-brand-purple-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors mt-1"
        >
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>

      <p className="text-center text-sm text-text-muted mt-6">
        No account?{" "}
        <Link href="/signup" className="text-brand-purple-light hover:underline">
          Create one
        </Link>
      </p>

      <p className="text-center mt-6">
        <Link href="/" className="text-xs text-text-muted hover:text-text-secondary transition-colors">
          ← Back to home
        </Link>
      </p>
    </div>
  );
}
