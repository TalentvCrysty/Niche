import { notFound } from "next/navigation";
import BlogEditor from "../../../components/BlogEditor";
import { getBlogById } from "../../../../actions/blog";

export default async function BlogEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "new";
  
  let initialData;

  if (!isNew) {
    const blogId = parseInt(id);
    if (isNaN(blogId)) {
      notFound();
    }
    
    initialData = await getBlogById(blogId);
    
    if (!initialData) {
      notFound();
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-zinc-900 p-6">
      <BlogEditor initialData={initialData} isNew={isNew} />
    </div>
  );
}
