"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Invoice from "@/app/(dashboard)/(invoices)/invoice";
import { ExtendedInvoice } from "@/types/db";

function InvoicesTable({ invoices }: { invoices: ExtendedInvoice[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Numer</TableHead>
          <TableHead className="hidden md:table-cell">E-mail</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="hidden md:table-cell">Wartość brutto</TableHead>
          <TableHead className="hidden md:table-cell">
            Data wystawienia
          </TableHead>
          <TableHead>
            <span className="sr-only">Akcje</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <Invoice key={invoice.id} invoice={invoice} />
        ))}
      </TableBody>
    </Table>
  );
}

export default InvoicesTable;
