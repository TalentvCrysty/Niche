"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { loginAction } from "../actions/auth";
import Cookies from "js-cookie";

export default function AdminLogin() {
  const [key, setKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Clear any stale cookies on login page load
  useEffect(() => {
    Cookies.remove("admin_token");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim()) {
      setError("Please enter your authentication key");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await loginAction(key);

      if (result.success) {
        router.push("/admin/dashboard");
      } else {
        setError(result.error || "Invalid authentication key");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#FAFAFA] text-zinc-900 p-4">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Subtle background decoration */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-50 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-pink-50 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100 p-8 md:p-10">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center mb-6 shadow-lg rotate-3 transition-transform hover:rotate-6">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
              Admin Access
            </h1>
            <p className="text-sm text-zinc-500 mt-2 text-center">
              Enter your secure authentication key to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="auth-key"
                className="text-xs font-medium text-zinc-500 uppercase tracking-wider ml-1"
              >
                Authentication Key
              </label>
              <div className="relative group">
                <input
                  id="auth-key"
                  type="password"
                  value={key}
                  onChange={(e) => {
                    setKey(e.target.value);
                    if (error) setError("");
                  }}
                  className={`w-full bg-zinc-50 border ${
                    error ? "border-red-300 focus:ring-red-100" : "border-zinc-200 focus:border-zinc-400 focus:ring-zinc-100"
                  } text-zinc-900 text-lg placeholder:text-zinc-300 rounded-xl px-4 py-3.5 outline-none transition-all focus:ring-4 focus:bg-white`}
                  placeholder="••••••••"
                  autoComplete="off"
                  autoFocus
                />
              </div>
              {error && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="text-red-500 text-sm ml-1"
                >
                  {error}
                </motion.p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white rounded-xl py-3.5 font-medium text-[15px] shadow-lg shadow-zinc-900/10 hover:shadow-xl hover:shadow-zinc-900/20 hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all duration-200 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-2 group mt-2"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Continue to Dashboard
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-zinc-50 text-center">
            <p className="text-xs text-zinc-400">
              Authorized personnel only. Secure connection.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
