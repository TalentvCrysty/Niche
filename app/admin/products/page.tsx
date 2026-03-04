import { verifySession } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import { getProducts } from "@/app/actions/products";
import Link from "next/link";
import { ArrowLeft, Loader2, Edit, Trash2, Plus } from "lucide-react";
import { deleteProduct } from "@/app/actions/products";

export const dynamic = "force-dynamic";

async function removeProduct(id: number) {
  await deleteProduct(id);
}

export default async function ProductsAdminPage() {
  const session = await verifySession();
  if (!session) redirect("/admin");
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-[#FAFAFA] p-6 text-zinc-900">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/dashboard"
              className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Products</h1>
              <p className="text-zinc-500 text-sm">Digital and service products in the store</p>
            </div>
          </div>
          <Link
            href="/admin/products/editor/new"
            className="flex items-center gap-2 bg-black text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-900/10"
          >
            <Plus size={16} />
            Add Product
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-2xl border border-zinc-100 p-12 text-center">
            <p className="text-zinc-500">No products yet.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {products.map((p: any) => (
              <div
                key={p.id}
                className="bg-white p-5 rounded-xl border border-zinc-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0 pr-8">
                  <div className="w-14 h-14 rounded-xl bg-zinc-50 flex items-center justify-center text-xs font-medium text-zinc-500 uppercase">
                    {p.type}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg truncate">{p.name}</h3>
                      {p.badge ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-blue-50 text-blue-700">
                          {p.badge}
                        </span>
                      ) : null}
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          p.status === "active"
                            ? "bg-green-100 text-green-700"
                            : p.status === "draft"
                            ? "bg-zinc-100 text-zinc-600"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {p.status}
                      </span>
                    </div>
                    <div className="text-xs text-zinc-500 mb-1">
                      {p.slug} · Order {p.sort_order}
                    </div>
                    <div className="text-sm text-zinc-700 line-clamp-2">
                      {p.short_description}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <form action={removeProduct.bind(null, p.id)}>
                    <button
                      type="submit"
                      className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </form>
                  <Link
                    href={`/admin/products/editor/${p.id}`}
                    className="p-2 text-zinc-400 hover:text-black hover:bg-zinc-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit size={18} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

