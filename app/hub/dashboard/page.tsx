import { redirect } from "next/navigation";
import { getReferralMe, getReferralStats, logoutReferral } from "@/app/actions/referral";
import { getProducts } from "@/app/actions/products";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HubDashboardPage() {
  const me = await getReferralMe();
  if (!me) redirect("/hub/login");
  const stats = await getReferralStats();
  const code = stats?.referral_code || me.referral_code;
  const products = await getProducts("active");

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const globalLink = `${baseUrl}/?ref=${code}`;

  const clicksByPath: Record<string, number> =
    stats?.clicks_by_path?.reduce((acc: Record<string, number>, row: any) => {
      if (row && row.path) {
        acc[row.path] = row.count;
      }
      return acc;
    }, {}) || {};

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500 mb-3">
              Creator & Sales Hub
            </div>
            <h1 className="text-3xl font-semibold tracking-tight mb-1">Dashboard</h1>
            <p className="text-sm text-neutral-400">
              {me.name || me.email} · {me.role}
            </p>
          </div>
          <form action={logoutReferral}>
            <button className="text-xs text-neutral-400 hover:text-white border border-neutral-800 rounded-full px-3 py-1.5">
              Sign out
            </button>
          </form>
        </header>

        <section className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-4">
          <div className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Your referral link</div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="text-sm bg-black border border-neutral-800 rounded-2xl px-4 py-3 break-all">
              {globalLink}
            </div>
            <button
              type="button"
              onClick={async () => {
                if (typeof navigator !== "undefined" && navigator.clipboard) {
                  await navigator.clipboard.writeText(globalLink);
                }
              }}
              className="px-4 py-3 rounded-2xl bg-blue-500 text-white text-xs font-semibold uppercase tracking-widest hover:bg-blue-400 transition-colors"
            >
              Copy link
            </button>
          </div>
          <div className="text-xs text-neutral-500">
            Share this link in your content. We track clicks and leads, and calculate commissions based on closed revenue.
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5">
            <div className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-2">Clicks</div>
            <div className="text-3xl font-semibold">{stats?.clicks ?? 0}</div>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5">
            <div className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-2">Conversions</div>
            <div className="text-3xl font-semibold">{stats?.conversions ?? 0}</div>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5">
            <div className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-2">Earned</div>
            <div className="text-3xl font-semibold">
              {(stats?.earnings ?? 0).toFixed(2)}{" "}
              <span className="text-sm text-neutral-400">USD</span>
            </div>
          </div>
        </section>

        <section className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Recent conversions</div>
              <p className="text-xs text-neutral-500">Values are updated when deals are marked as closed.</p>
            </div>
          </div>

          {stats?.recent_conversions && stats.recent_conversions.length > 0 ? (
            <div className="space-y-3">
              {stats.recent_conversions.map((c: any) => (
                <div key={c.id} className="flex items-center justify-between border border-neutral-800 rounded-2xl px-4 py-3">
                  <div className="text-sm text-neutral-200">
                    Lead {c.lead_id || "-"} · {c.status}
                    <div className="text-xs text-neutral-500">{c.created_at}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-neutral-100">
                      {c.amount != null ? c.amount.toFixed(2) : "-"} {c.currency || ""}
                    </div>
                    <div className="text-xs text-neutral-500">
                      Commission {c.commission_amount != null ? c.commission_amount.toFixed(2) : "-"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-neutral-500">No conversions yet.</div>
          )}
        </section>

        <section className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
                Products and services
              </div>
              <p className="text-xs text-neutral-500">
                Each card has your personal referral link. Share it to earn commissions.
              </p>
            </div>
          </div>
          {products.length === 0 ? (
            <div className="text-sm text-neutral-500">No products are available yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((p: any) => {
                const path = `/store/${p.slug}`;
                const link = `${baseUrl}${path}?ref=${code}`;
                const paths = Object.keys(clicksByPath);
                const clickCount = paths
                  .filter((k) => typeof k === "string" && k.startsWith(path))
                  .reduce((sum, k) => sum + (clicksByPath[k] || 0), 0);
                return (
                  <div
                    key={p.id}
                    className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-5 flex flex-col gap-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="text-[10px] font-semibold uppercase tracking-widest text-blue-400">
                          {p.type}
                        </div>
                        <div className="text-lg font-semibold mt-1">{p.name}</div>
                      </div>
                      {p.badge ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-blue-500/20 text-blue-100 border border-blue-500/40">
                          {p.badge}
                        </span>
                      ) : null}
                    </div>
                    {p.short_description ? (
                      <div className="text-xs text-neutral-400 line-clamp-3">{p.short_description}</div>
                    ) : null}
                    <div className="flex items-center justify-between mt-2">
                      <div className="text-xs text-neutral-500">
                        Clicks: <span className="text-neutral-100 font-semibold">{clickCount}</span>
                      </div>
                      <div className="text-xs text-neutral-500">
                        {p.price_currency}
                        {p.price_amount != null ? p.price_amount.toFixed(0) : "-"}
                      </div>
                    </div>
                    <div className="mt-2 space-y-1">
                      <div className="text-[11px] text-neutral-500">Your link</div>
                      <div className="text-[11px] bg-black border border-neutral-800 rounded-xl px-3 py-2 break-all">
                        {link}
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          if (typeof navigator !== "undefined" && navigator.clipboard) {
                            await navigator.clipboard.writeText(link);
                          }
                        }}
                        className="mt-2 inline-flex items-center justify-center px-3 py-2 rounded-xl bg-blue-500 text-white text-[11px] font-semibold uppercase tracking-widest hover:bg-blue-400 transition-colors w-full"
                      >
                        Copy link
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="text-xs text-neutral-500">
          For questions about payouts or custom deals, contact{" "}
          <Link href="mailto:team@niche.agency" className="text-blue-400 hover:text-blue-300">
            the Niche team
          </Link>
          .
        </section>
      </div>
    </main>
  );
}

