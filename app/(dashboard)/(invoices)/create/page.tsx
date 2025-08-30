import React from "react";
import { getClients, generateUniqueInvoiceId } from "@/lib/db";
import InvoiceCreatorForm from "./invoice-creator-form";

async function Page() {
  const { id }: { id: string | null } = await generateUniqueInvoiceId();
  const { clients } = await getClients(null, null, true);

  return <InvoiceCreatorForm autoInvoiceId={id} clients={clients} />;
}

export default Page;
