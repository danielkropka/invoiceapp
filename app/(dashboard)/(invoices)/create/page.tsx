import React from "react";
import { getClients, getPreferredInvoiceId } from "@/lib/db";
import InvoiceCreatorForm from "./invoice-creator-form";

async function Page() {
  const { id }: { id: number | null } = await getPreferredInvoiceId();
  const { clients } = await getClients(null, null, true);

  return <InvoiceCreatorForm autoInvoiceId={id} clients={clients} />;
}

export default Page;
