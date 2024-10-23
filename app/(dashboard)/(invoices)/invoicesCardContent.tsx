import { getInvoices } from "@/lib/db";
import InvoicesTable from "./invoicesTable";
import React from "react";
import { CardContent } from "@/components/ui/card";
import Pagination from "../../../components/pagination";

export default async function InvoicesCardContent({
  searchParams,
}: {
  searchParams: { q: string; offset: string };
}) {
  const search = searchParams.q ?? "";
  const offset = searchParams.offset ?? 0;
  const { invoices, newOffset, totalInvoices } = await getInvoices(
    search,
    Number(offset)
  );

  return (
    <>
      <CardContent>
        {invoices.length === 0 ? (
          <div className="text-center">Brak faktur.</div>
        ) : (
          <InvoicesTable invoices={invoices} />
        )}
      </CardContent>
      <Pagination offset={newOffset} total={totalInvoices} />
    </>
  );
}
