"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { ArrowLeft, Loader2, RefreshCw, CheckCircle2, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

type Lead = {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  budget_range: string;
  problem: string;
  preferred_contact_time: string;
  source: string;
  status: string;
  created_at: string;
  updated_at: string;
};

const STATUSES = ["new", "reviewed", "contacted", "won", "lost"];

export default function LeadsAdminClient({ initialLeads, backendUrl }: { initialLeads: Lead[]; backendUrl: string }) {
  const [leads, setLeads] = useState<Lead[]>(Array.isArray(initialLeads) ? initialLeads : []);
  const [isLoading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [q, setQ] = useState("");
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return leads.filter((l) => {
      const matchesStatus = statusFilter === "all" ? true : l.status === statusFilter;
      const matchesQuery =
        !query ||
        (l.name || "").toLowerCase().includes(query) ||
        (l.email || "").toLowerCase().includes(query) ||
        (l.company || "").toLowerCase().includes(query) ||
        (l.problem || "").toLowerCase().includes(query);
      return matchesStatus && matchesQuery;
    });
  }, [leads, statusFilter, q]);

  const token = () => Cookies.get("admin_token") || "";

  const load = async () => {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch(`${backendUrl}/api/leads`, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      const data = await res.json().catch(() => []);
      if (!res.ok) {
        setMsg({ type: "err", text: data?.error || "Failed to load leads" });
        setLoading(false);
        return;
      }
      setLeads(Array.isArray(data) ? data : []);
    } catch {
      setMsg({ type: "err", text: "Failed to connect to server" });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    setMsg(null);
    try {
      const res = await fetch(`${backendUrl}/api/leads/${id}/status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token()}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg({ type: "err", text: data?.error || "Failed to update status" });
        return;
      }
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
      setMsg({ type: "ok", text: "Updated" });
    } catch {
      setMsg({ type: "err", text: "Failed to connect to server" });
    }
  };

  const processEvents = async () => {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch(`${backendUrl}/api/leads/process-events`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token()}` },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg({ type: "err", text: data?.error || "Failed to process events" });
      } else {
        setMsg({ type: "ok", text: "Automation processed" });
      }
    } catch {
      setMsg({ type: "err", text: "Failed to connect to server" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/dashboard" className="p-2 hover:bg-zinc-100 rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
            <p className="text-zinc-500 text-sm">Lead capture submissions</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={processEvents}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-white border border-zinc-200 hover:bg-zinc-50 transition-colors"
          >
            {isLoading ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle2 size={16} />}
            Process automation
          </button>
          <button
            onClick={load}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-black text-white hover:bg-zinc-800 transition-colors"
          >
            {isLoading ? <Loader2 className="animate-spin" size={16} /> : <RefreshCw size={16} />}
            Refresh
          </button>
        </div>
      </div>

      <div className="bg-white border border-zinc-100 rounded-2xl p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, email, company, problem..."
            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm"
          >
            <option value="all">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <div className="text-sm text-zinc-500 flex items-center justify-between px-1">
            <div>Total</div>
            <div className="font-semibold text-zinc-900">{filtered.length}</div>
          </div>
        </div>
      </div>

      {msg ? (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-4 px-4 py-3 rounded-xl border text-sm flex items-center gap-2 ${
            msg.type === "ok" ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          <AlertTriangle size={16} className={msg.type === "ok" ? "hidden" : ""} />
          <CheckCircle2 size={16} className={msg.type === "ok" ? "" : "hidden"} />
          {msg.text}
        </motion.div>
      ) : null}

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-zinc-100 p-12 text-center text-zinc-500">
          No leads found.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((l) => (
            <div key={l.id} className="bg-white rounded-2xl border border-zinc-100 p-5">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <div className="text-lg font-semibold text-zinc-900 truncate">{l.name}</div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-zinc-100 text-zinc-600">
                      {l.status}
                    </span>
                    {l.source ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-100">
                        {l.source}
                      </span>
                    ) : null}
                  </div>
                  <div className="text-sm text-zinc-500 mt-1">
                    <span className="font-medium">{l.email}</span>
                    {l.phone ? <span className="ml-3">{l.phone}</span> : null}
                    {l.company ? <span className="ml-3">{l.company}</span> : null}
                  </div>
                  <div className="text-sm text-zinc-700 mt-4 whitespace-pre-wrap">{l.problem}</div>
                  <div className="text-xs text-zinc-400 mt-4 flex flex-wrap gap-3">
                    {l.budget_range ? <span>Budget: {l.budget_range}</span> : null}
                    {l.preferred_contact_time ? <span>Preferred: {l.preferred_contact_time}</span> : null}
                    <span>Created: {l.created_at}</span>
                  </div>
                </div>

                <div className="shrink-0 flex flex-col gap-2">
                  <select
                    value={l.status}
                    onChange={(e) => updateStatus(l.id, e.target.value)}
                    className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <a
                    href={`mailto:${encodeURIComponent(l.email)}?subject=${encodeURIComponent("Re: Your request")}`}
                    className="inline-flex items-center justify-center px-4 py-3 rounded-xl bg-black text-white text-sm font-medium hover:bg-zinc-800 transition-colors"
                  >
                    Email lead
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

