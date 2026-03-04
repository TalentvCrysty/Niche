"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { loginReferral } from "@/app/actions/referral";
import { Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HubLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    setError("");
    const res = await loginReferral(email.trim(), password);
    if (!res.success) {
      setError(res.error || "Login failed");
      setLoading(false);
      return;
    }
    router.push("/hub/dashboard");
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500 mb-3">Creator & Sales Hub</div>
          <h1 className="text-3xl font-semibold tracking-tight mb-2">Sign in</h1>
          <p className="text-sm text-neutral-400">
            Access your referrals, clicks, and commissions.
          </p>
        </div>

        <form onSubmit={submit} className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="w-full bg-black border border-neutral-800 rounded-2xl px-4 py-3 text-sm placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40"
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="w-full bg-black border border-neutral-800 rounded-2xl px-4 py-3 text-sm placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40"
              placeholder="Password"
            />
          </div>

          {error ? (
            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-500 text-white text-sm font-semibold px-4 py-3 hover:bg-blue-400 transition-colors disabled:opacity-60"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
            Sign in
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-neutral-500">
          No account?{" "}
          <Link href="/hub/register" className="text-blue-400 hover:text-blue-300">
            Register
          </Link>
        </div>
      </div>
    </main>
  );
}

