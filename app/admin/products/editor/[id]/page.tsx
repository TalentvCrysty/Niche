import { notFound } from "next/navigation";
import ProductEditor from "../../../components/ProductEditor";
import { getProductById } from "@/app/actions/products";

export const dynamic = "force-dynamic";

export default async function ProductEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "new";

  let initialData;

  if (!isNew) {
    const productId = parseInt(id);
    if (isNaN(productId)) {
      notFound();
    }
    initialData = await getProductById(productId);
    if (!initialData) {
      notFound();
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-zinc-900 p-6">
      <ProductEditor initialData={initialData as any} isNew={isNew} />
    </div>
  );
}

