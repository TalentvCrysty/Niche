import { notFound } from "next/navigation";
import PortfolioEditor from "../../../components/PortfolioEditor";
import { getProjectById } from "@/app/actions/portfolio";

export default async function PortfolioEditorPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const isNew = id === "new";

    let initialData;

    if (!isNew) {
        const projectId = parseInt(id);
        if (isNaN(projectId)) {
            notFound();
        }

        initialData = await getProjectById(projectId);

        if (!initialData) {
            notFound();
        }
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-zinc-900 p-6">
            <PortfolioEditor initialData={initialData} isNew={isNew} />
        </div>
    );
}
