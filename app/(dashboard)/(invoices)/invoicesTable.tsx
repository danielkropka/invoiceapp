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
import { InvoiceType } from "@/types/db";
import { FileText, Mail, Calendar, DollarSign, Hash } from "lucide-react";

function InvoicesTable({
  invoices,
  offset = 0,
}: {
  invoices: InvoiceType[];
  offset?: number;
}) {
  return (
    <div className="rounded-lg border border-border/50 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50 border-0">
            <TableHead className="font-semibold text-foreground py-4">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-muted-foreground" />
                Numer
              </div>
            </TableHead>
            <TableHead className="font-semibold text-foreground py-4 hidden md:table-cell">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                E-mail
              </div>
            </TableHead>
            <TableHead className="font-semibold text-foreground py-4">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                Status
              </div>
            </TableHead>
            <TableHead className="font-semibold text-foreground py-4 hidden md:table-cell">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                Wartość brutto
              </div>
            </TableHead>
            <TableHead className="font-semibold text-foreground py-4 hidden md:table-cell">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                Data wystawienia
              </div>
            </TableHead>
            <TableHead className="font-semibold text-foreground py-4 text-right">
              <span className="sr-only">Akcje</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice, index) => (
            <Invoice
              key={invoice.id}
              invoice={invoice}
              index={offset + index}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default InvoicesTable;
