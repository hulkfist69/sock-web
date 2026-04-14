"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { register } from "@/lib/api";
import { setToken } from "@/lib/auth";

export default function SignUpPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    setError("");

    const result = await register(username.trim(), password);
    setLoading(false);

    if (result.success && result.data) {
      setToken(result.data.token);
      router.push("/home");
    } else {
      setError(result.error ?? "Registration failed. Please try again.");
    }
  }

  return (
    <div className="w-full max-w-sm">
      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-12 h-12 rounded-2xl bg-brand-purple flex items-center justify-center mb-4">
          <span className="text-white font-bold text-xl">S</span>
        </div>
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="text-text-muted text-sm mt-1">
          Join Sock — free during beta
        </p>
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
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-bg-elevated border border-border-default rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-purple transition-colors text-sm"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text-secondary">
            Password
          </label>
          <input
            type="password"
            autoComplete="new-password"
            placeholder="At least 6 characters"
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
          {loading ? "Creating account…" : "Create Account"}
        </button>
      </form>

      <p className="text-center text-sm text-text-muted mt-6">
        Already have an account?{" "}
        <Link href="/signin" className="text-brand-purple-light hover:underline">
          Sign in
        </Link>
      </p>

      <p className="text-center mt-4 text-xs text-text-muted px-4">
        By creating an account you agree to our{" "}
        <Link href="/terms" className="hover:underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="hover:underline">
          Privacy Policy
        </Link>
        .
      </p>

      <p className="text-center mt-4">
        <Link href="/" className="text-xs text-text-muted hover:text-text-secondary transition-colors">
          ← Back to home
        </Link>
      </p>
    </div>
  );
}
