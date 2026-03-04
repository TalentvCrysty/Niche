import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getConfig } from "@/app/actions/config";
import { getProductBySlug } from "@/app/actions/products";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const navbarConfig = await getConfig("navbar");
  const footerConfig = await getConfig("footer");
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const price =
    product.price_amount != null
      ? `${product.price_currency || ""}${product.price_amount.toFixed(0)}`
      : null;

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-blue-600/30 font-sans">
      <Navbar theme="dark" config={navbarConfig} />

      <section className="pt-28 md:pt-40 pb-20 px-6 md:px-12 max-w-[1200px] mx-auto">
        <Link
          href="/store"
          className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-sm mb-8"
        >
          Store
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="text-xs font-semibold uppercase tracking-widest text-blue-400">
                  {product.type}
                </div>
                {product.badge ? (
                  <div className="px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/40 text-[11px] font-semibold uppercase tracking-widest text-blue-200">
                    {product.badge}
                  </div>
                ) : null}
              </div>
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
                {product.name}
              </h1>
              {product.short_description ? (
                <p className="text-lg text-neutral-400 leading-relaxed">
                  {product.short_description}
                </p>
              ) : null}
            </div>

            {product.long_description ? (
              <div className="prose prose-invert prose-lg max-w-none text-neutral-300">
                <p>{product.long_description}</p>
              </div>
            ) : null}
          </div>

          <div className="space-y-6">
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-4">
              <div className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
                Pricing
              </div>
              {price ? (
                <div className="text-3xl font-semibold">
                  {price}
                  {product.price_period ? (
                    <span className="text-sm text-neutral-400 ml-1">
                      /{product.price_period}
                    </span>
                  ) : null}
                </div>
              ) : (
                <div className="text-base text-neutral-300">Contact for pricing</div>
              )}
              {product.best_for ? (
                <div className="text-xs text-neutral-400">
                  {product.best_for}
                </div>
              ) : null}

              {product.purchase_url ? (
                <a
                  href={product.purchase_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center px-4 py-3 rounded-2xl bg-blue-500 text-white text-sm font-semibold hover:bg-blue-400 transition-colors"
                >
                  Get this package
                </a>
              ) : (
                <Link
                  href="/#lead-form"
                  className="w-full inline-flex items-center justify-center px-4 py-3 rounded-2xl bg-blue-500 text-white text-sm font-semibold hover:bg-blue-400 transition-colors"
                >
                  Talk to sales
                </Link>
              )}
            </div>

            {product.includes && product.includes.length > 0 ? (
              <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-3">
                <div className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
                  What is included
                </div>
                <ul className="space-y-2 text-sm text-neutral-300">
                  {product.includes.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-[6px] w-1.5 h-1.5 rounded-full bg-blue-500/80" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {product.tags && product.tags.length > 0 ? (
              <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 rounded-full bg-neutral-800 border border-neutral-700 text-[11px] font-semibold uppercase tracking-widest text-neutral-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <Footer config={footerConfig} />
    </main>
  );
}

