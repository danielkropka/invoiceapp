import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import InvoicesTable from "@/app/(dashboard)/invoices-table";
import { getInvoices } from "@/lib/db";
import Analytics from "@/app/(dashboard)/analytics";

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: { q: string; offset: string };
}) {
  const search = searchParams.q ?? "";
  const offset = searchParams.offset ?? 0;
  const { invoices, newOffset, totalInvoices } = await getInvoices(
    search,
    Number(offset),
  );

  return (
    <>
      <div className="flex items-center ml-auto">
        <Button className="gap-1">
          <PlusCircle className="w-4 h-4" />
          <span className="sr-only md:not-sr-only sm:whitespace-nowrap">
            Stwórz fakturę
          </span>
        </Button>
      </div>
      <InvoicesTable
        invoices={invoices}
        offset={newOffset}
        totalInvoices={totalInvoices}
      />
      <Analytics />
    </>
  );
}
