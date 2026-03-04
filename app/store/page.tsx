import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getConfig } from "@/app/actions/config";
import { getProducts } from "@/app/actions/products";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function StorePage() {
  const navbarConfig = await getConfig("navbar");
  const footerConfig = await getConfig("footer");
  const products = await getProducts("active");

  const featured = products.filter((p: any) => p.is_featured);
  const others = products.filter((p: any) => !p.is_featured);

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-blue-600/30 font-sans">
      <Navbar theme="dark" config={navbarConfig} />

      <section className="pt-32 pb-10 md:pt-48 md:pb-16 px-6 md:px-12 max-w-[1400px] mx-auto">
        <div className="max-w-4xl">
          <span className="block text-blue-500 font-medium tracking-wide uppercase text-sm mb-6">
            Store
          </span>
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight leading-tight mb-8">
            Digital and service products <span className="text-neutral-500">built to grow revenue.</span>
          </h1>
          <p className="text-xl text-neutral-400 font-light max-w-2xl leading-relaxed">
            Choose a performance-based package, digital asset, or full-service offer that matches your goals.
          </p>
        </div>
      </section>

      <section className="px-6 md:px-12 max-w-[1400px] mx-auto pb-28 space-y-12">
        {featured.length > 0 && (
          <div className="space-y-5">
            <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-neutral-500">
              Featured offers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featured.map((p: any) => (
                <Link
                  href={`/store/${p.slug}`}
                  key={p.id}
                  className="group bg-neutral-900 border border-neutral-800 rounded-3xl p-6 flex flex-col gap-4 hover:border-blue-500/40 hover:bg-neutral-900/90 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-widest text-blue-400">
                        {p.type}
                      </div>
                      <h3 className="mt-2 text-2xl font-semibold tracking-tight group-hover:text-blue-200 transition-colors">
                        {p.name}
                      </h3>
                    </div>
                    {p.badge ? (
                      <div className="px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/40 text-[11px] font-semibold uppercase tracking-widest text-blue-200">
                        {p.badge}
                      </div>
                    ) : null}
                  </div>
                  <p className="text-sm text-neutral-300 leading-relaxed">
                    {p.short_description}
                  </p>
                  <div className="flex items-baseline justify-between mt-auto pt-2">
                    <div>
                      <div className="text-2xl font-semibold">
                        {p.price_currency}
                        {p.price_amount != null ? p.price_amount.toFixed(0) : "-"}
                      </div>
                      {p.price_period ? (
                        <div className="text-xs text-neutral-500">per {p.price_period}</div>
                      ) : null}
                    </div>
                    {p.best_for ? (
                      <div className="text-xs text-neutral-500 text-right max-w-[200px]">
                        {p.best_for}
                      </div>
                    ) : null}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {others.length > 0 && (
          <div className="space-y-5">
            <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-neutral-500">
              All products
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {others.map((p: any) => (
                <Link
                  href={`/store/${p.slug}`}
                  key={p.id}
                  className="group bg-neutral-900 border border-neutral-800 rounded-3xl p-5 flex flex-col gap-3 hover:border-neutral-700 hover:bg-neutral-900/90 transition-colors"
                >
                  <div className="text-[11px] font-semibold uppercase tracking-widest text-neutral-500">
                    {p.type}
                  </div>
                  <div className="text-lg font-semibold group-hover:text-blue-200 transition-colors">
                    {p.name}
                  </div>
                  <p className="text-sm text-neutral-400 line-clamp-3">
                    {p.short_description}
                  </p>
                  <div className="mt-auto pt-2 flex items-center justify-between">
                    <div className="text-base font-semibold">
                      {p.price_currency}
                      {p.price_amount != null ? p.price_amount.toFixed(0) : "-"}
                    </div>
                    <span className="text-xs text-blue-400">View details</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      <Footer config={footerConfig} />
    </main>
  );
}

