import { verifySession } from "../../actions/auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import LeadsAdminClient from "./ui/LeadsAdminClient";

export const dynamic = "force-dynamic";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3005";

export default async function AdminLeadsPage() {
  const session = await verifySession();
  if (!session) redirect("/admin");

  const token = (await cookies()).get("admin_token")?.value;
  if (!token) redirect("/admin");

  const res = await fetch(`${BACKEND_URL}/api/leads`, {
    cache: "no-store",
    headers: { Authorization: `Bearer ${token}` },
  });

  const leads = res.ok ? await res.json() : [];

  return (
    <div className="min-h-screen bg-[#FAFAFA] p-6 text-zinc-900">
      <div className="max-w-6xl mx-auto">
        <LeadsAdminClient initialLeads={leads} backendUrl={BACKEND_URL} />
      </div>
    </div>
  );
}

