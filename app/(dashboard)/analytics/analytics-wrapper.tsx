import { getAnalyticData } from "@/lib/db";
import Analytics from "./analytics";
import { Client, Invoice } from "@prisma/client";

export default async function AnalyticsWrapper() {
  const { invoices, clients } = await getAnalyticData();

  return (
    <Analytics
      invoices={invoices as (Omit<Invoice, "file"> & { client: Client })[]}
      clients={clients}
    />
  );
}
