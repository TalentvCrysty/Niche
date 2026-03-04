"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { registerReferral } from "@/app/actions/referral";
import { Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HubRegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [role, setRole] = useState("creator");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    setError("");
    const res = await registerReferral(name.trim(), email.trim(), password, role);
    if (!res.success) {
      setError(res.error || "Registration failed");
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
          <h1 className="text-3xl font-semibold tracking-tight mb-2">Register</h1>
          <p className="text-sm text-neutral-400">
            Create your account and start earning commissions.
          </p>
        </div>

        <form onSubmit={submit} className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-black border border-neutral-800 rounded-2xl px-4 py-3 text-sm placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40"
              placeholder="Your name"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-black border border-neutral-800 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40"
            >
              <option value="creator">Content Creator</option>
              <option value="sales">Sales Partner</option>
            </select>
          </div>
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
            Create account
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-neutral-500">
          Already have an account?{" "}
          <Link href="/hub/login" className="text-blue-400 hover:text-blue-300">
            Sign in
          </Link>
        </div>
      </div>
    </main>
  );
}

