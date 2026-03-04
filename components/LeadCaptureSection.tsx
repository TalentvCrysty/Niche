"use client";

import React, { useMemo, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3005";

const BUDGETS = [
  "Under $1,000",
  "$1,000 - $5,000",
  "$5,000 - $15,000",
  "$15,000 - $50,000",
  "$50,000+",
];

export function LeadCaptureSection() {
  const [isSubmitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [referralCode, setReferralCode] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    budget_range: "",
    problem: "",
    preferred_contact_time: "",
  });

  const canSubmit = useMemo(() => {
    return form.name.trim() && form.email.trim() && form.problem.trim() && !isSubmitting;
  }, [form, isSubmitting]);

  const update = (key: keyof typeof form, value: string) => {
    setForm((p) => ({ ...p, [key]: value }));
    if (error) setError("");
  };

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const code = window.localStorage.getItem("referral_code");
        if (code) setReferralCode(code);
      }
    } catch {
    }
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(`${BACKEND_URL}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "homepage_form", referral_code: referralCode || undefined }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error || "Submission failed");
        setSubmitting(false);
        return;
      }

      setDone(true);
    } catch {
      setError("Failed to connect to server");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="lead-form" className="w-full py-24 md:py-32 bg-black relative overflow-hidden border-t border-neutral-900">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-0 w-[700px] h-[700px] bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-6">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-widest"
            >
              Lead Capture
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-white"
            >
              Let us solve your business challenges.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="text-lg md:text-xl text-neutral-400 leading-relaxed font-light max-w-xl"
            >
              Tell us what you need and we’ll contact you within 24 hours with a tailored plan.
            </motion.p>

            <div className="bg-neutral-900/40 border border-white/10 rounded-3xl p-6 space-y-3 text-neutral-300">
              <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">What happens next</div>
              <div className="text-sm leading-relaxed">
                You’ll get an automated confirmation email. Our team reviews your request and reaches out within 24 hours.
              </div>
            </div>
          </div>

          <div className="bg-neutral-900/40 border border-white/10 rounded-3xl p-8">
            <AnimatePresence mode="wait">
              {done ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-center py-10"
                >
                  <div className="mx-auto w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-7 h-7 text-blue-400" />
                  </div>
                  <div className="text-2xl font-semibold text-white mb-2">Request submitted</div>
                  <div className="text-neutral-400 font-light max-w-md mx-auto">
                    Thanks. We’ll contact you within 24 hours.
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={submit}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Name</label>
                      <input
                        value={form.name}
                        onChange={(e) => update("name", e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30"
                        placeholder="Your name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Email</label>
                      <input
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                        type="email"
                        className="w-full bg-black/20 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30"
                        placeholder="you@company.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Phone</label>
                      <input
                        value={form.phone}
                        onChange={(e) => update("phone", e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30"
                        placeholder="+1 555 000 0000"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Company / Project</label>
                      <input
                        value={form.company}
                        onChange={(e) => update("company", e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30"
                        placeholder="Company or project name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Budget range</label>
                      <select
                        value={form.budget_range}
                        onChange={(e) => update("budget_range", e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30"
                      >
                        <option value="">Select budget</option>
                        {BUDGETS.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                        Preferred contact time
                      </label>
                      <input
                        value={form.preferred_contact_time}
                        onChange={(e) => update("preferred_contact_time", e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30"
                        placeholder="e.g. Mon-Fri 10:00-14:00"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Problem / Goal</label>
                    <textarea
                      value={form.problem}
                      onChange={(e) => update("problem", e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 min-h-[140px] resize-y"
                      placeholder="Describe your goal, constraints, and what success looks like..."
                      required
                    />
                  </div>

                  {error ? (
                    <div className="text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3">
                      {error}
                    </div>
                  ) : null}

                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-blue-500 text-white text-xs font-bold uppercase tracking-wider hover:bg-blue-400 transition-colors disabled:opacity-60"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                    Submit request
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

