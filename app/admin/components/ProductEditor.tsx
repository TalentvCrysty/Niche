"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Product, createProduct, updateProduct } from "@/app/actions/products";
import { Loader2, Save, ArrowLeft, Link as LinkIcon, X, Plus } from "lucide-react";
import Link from "next/link";
import { ImageUploader } from "./ui/ImageUploader";

const TYPES = ["Service", "Digital", "Physical"];

interface ProductEditorProps {
  initialData?: Product;
  isNew?: boolean;
}

export default function ProductEditor({ initialData, isNew = false }: ProductEditorProps) {
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Product>(
    initialData || {
      slug: "",
      name: "",
      type: "Service",
      short_description: "",
      long_description: "",
      price_amount: null,
      price_currency: "$",
      price_period: "",
      badge: "",
      is_featured: false,
      tags: [],
      includes: [],
      best_for: "",
      image: "",
      purchase_url: "",
      status: "active",
      sort_order: 0,
    }
  );

  const change = (field: keyof Product, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const generateSlug = () => {
    const slug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    change("slug", slug);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isNew) {
        const res = await createProduct(formData);
        if (!res.success) {
          alert(res.error);
          setLoading(false);
          return;
        }
      } else {
        if (!formData.id) return;
        const res = await updateProduct(formData.id, formData);
        if (!res.success) {
          alert(res.error);
          setLoading(false);
          return;
        }
      }
      router.push("/admin/products");
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    const t = prompt("Enter tag");
    if (!t) return;
    change("tags", [...(formData.tags || []), t]);
  };

  const removeTag = (index: number) => {
    const n = [...(formData.tags || [])];
    n.splice(index, 1);
    change("tags", n);
  };

  const addInclude = () => {
    change("includes", [...(formData.includes || []), "New item"]);
  };

  const updateInclude = (index: number, value: string) => {
    const n = [...(formData.includes || [])];
    n[index] = value;
    change("includes", n);
  };

  const removeInclude = (index: number) => {
    const n = [...(formData.includes || [])];
    n.splice(index, 1);
    change("includes", n);
  };

  return (
    <form onSubmit={submit} className="max-w-7xl mx-auto pb-20">
      <div className="sticky top-0 z-20 bg-[#FAFAFA]/80 backdrop-blur-md py-6 flex items-center justify-between mb-8 border-b border-zinc-200">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/products"
            className="p-2 hover:bg-zinc-200 rounded-lg transition-colors text-zinc-500 hover:text-black"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">
            {isNew ? "Create Product" : "Edit Product"}
          </h1>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-xl font-medium hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-900/10 disabled:opacity-70"
        >
          {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          Save
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-2">Name</label>
              <input
                value={formData.name}
                onChange={(e) => change("name", e.target.value)}
                onBlur={() => !formData.slug && generateSlug()}
                className="w-full text-3xl font-bold border-0 border-b border-zinc-200 px-0 py-2 focus:ring-0 focus:border-black placeholder:text-zinc-300 bg-transparent"
                placeholder="Product name"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => change("type", e.target.value)}
                  className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm"
                >
                  {TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
                  Badge
                </label>
                <input
                  value={formData.badge || ""}
                  onChange={(e) => change("badge", e.target.value)}
                  className="w-full border border-zinc-200 rounded-xl px-3 py-2.5 text-sm"
                  placeholder="Best value"
                />
              </div>
              <label className="inline-flex items-center gap-2 mt-6 text-sm text-zinc-700">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => change("is_featured", e.target.checked)}
                  className="rounded border-zinc-300"
                />
                Featured
              </label>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
                Short description
              </label>
              <textarea
                value={formData.short_description}
                onChange={(e) => change("short_description", e.target.value)}
                className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm min-h-[80px]"
                placeholder="Short summary shown on cards"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
                Long description
              </label>
              <textarea
                value={formData.long_description}
                onChange={(e) => change("long_description", e.target.value)}
                className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm min-h-[200px]"
                placeholder="Describe what this product includes and how it works"
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-zinc-700">What is included</div>
              <button
                type="button"
                onClick={addInclude}
                className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add
              </button>
            </div>
            <div className="space-y-2">
              {formData.includes?.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    value={item}
                    onChange={(e) => updateInclude(index, e.target.value)}
                    className="flex-1 border border-zinc-200 rounded-xl px-3 py-2 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removeInclude(index)}
                    className="p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {(!formData.includes || formData.includes.length === 0) && (
                <div className="text-xs text-zinc-400">
                  No items yet.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
                Slug
              </label>
              <input
                value={formData.slug}
                onChange={(e) => change("slug", e.target.value)}
                className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-sm"
                placeholder="product-slug"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
                  Price
                </label>
                <input
                  type="number"
                  value={formData.price_amount ?? ""}
                  onChange={(e) =>
                    change("price_amount", e.target.value ? Number(e.target.value) : null)
                  }
                  className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
                  Currency
                </label>
                <input
                  value={formData.price_currency}
                  onChange={(e) => change("price_currency", e.target.value)}
                  className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
                  Period
                </label>
                <input
                  value={formData.price_period}
                  onChange={(e) => change("price_period", e.target.value)}
                  className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-sm"
                  placeholder="month, project, etc."
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
                Best for
              </label>
              <input
                value={formData.best_for || ""}
                onChange={(e) => change("best_for", e.target.value)}
                className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-sm"
                placeholder="Who this is ideal for"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
                Purchase URL
              </label>
              <div className="relative">
                <input
                  value={formData.purchase_url || ""}
                  onChange={(e) => change("purchase_url", e.target.value)}
                  className="w-full border border-zinc-200 rounded-xl pl-9 pr-3 py-2 text-sm"
                  placeholder="External checkout or payment link"
                />
                <LinkIcon className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => change("status", e.target.value)}
                className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-sm"
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
                Sort order
              </label>
              <input
                type="number"
                value={formData.sort_order}
                onChange={(e) => change("sort_order", Number(e.target.value || 0))}
                className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm space-y-4">
            <div className="mb-2 text-sm font-semibold text-zinc-700">Image</div>
            <ImageUploader
              label="Product image"
              value={formData.image || ""}
              onChange={(val: string) => change("image", val)}
              className="h-full"
            />
          </div>

          <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-zinc-700">Tags</div>
              <button
                type="button"
                onClick={addTag}
                className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-zinc-100 text-xs font-medium text-zinc-700"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="text-zinc-400 hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {(!formData.tags || formData.tags.length === 0) && (
                <span className="text-xs text-zinc-400">No tags yet.</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

