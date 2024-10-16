import React from "react";
import InvoiceCreatorForm from "@/app/(dashboard)/create/invoice-creator-form";
import { getClients, getPreferredInvoiceId } from "@/lib/db";

async function Page() {
  const { id }: { id: number | null } = await getPreferredInvoiceId();
  const { clients } = await getClients(null, null, true);

  return <InvoiceCreatorForm autoInvoiceId={id} clients={clients} />;
}

export default Page;
