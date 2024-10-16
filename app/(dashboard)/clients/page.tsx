import React from "react";
import { PlusCircle } from "lucide-react";
import ClientsTable from "@/app/(dashboard)/clients/clients-table";
import { getClients } from "@/lib/db";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: { q: string; offset: string };
}) {
  const search = searchParams.q ?? "";
  const offset = searchParams.offset ?? 0;
  const { clients, newOffset, totalClients } = await getClients(
    search,
    Number(offset),
    false
  );
  return (
    <>
      <div className="flex items-center ml-auto">
        <Link href="/clients/create" className={cn("gap-1", buttonVariants())}>
          <PlusCircle className="w-4 h-4" />
          <span className="sr-only md:not-sr-only sm:whitespace-nowrap">
            Stwórz klienta
          </span>
        </Link>
      </div>
      <ClientsTable
        clients={clients}
        offset={newOffset}
        totalClients={totalClients}
      />
    </>
  );
}
