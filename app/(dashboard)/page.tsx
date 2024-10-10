import React from "react";
import { buttonVariants } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import InvoicesTable from "@/app/(dashboard)/invoices-table";
import { getInvoices } from "@/lib/db";
import Analytics from "@/app/(dashboard)/analytics";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function InvoicesPage({
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
      <div className="flex items-center ml-auto">
        <Link className={cn("gap-1", buttonVariants())} href="/create">
          <PlusCircle className="w-4 h-4" />
          <span className="sr-only md:not-sr-only sm:whitespace-nowrap">
            Stwórz fakturę
          </span>
        </Link>
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
