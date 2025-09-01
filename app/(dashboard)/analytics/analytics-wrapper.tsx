import { getAnalyticData } from "@/lib/db";
import Analytics from "./analytics";

export default async function AnalyticsWrapper() {
  const { invoices, clients } = await getAnalyticData();

  return <Analytics invoices={invoices} clients={clients} />;
}
