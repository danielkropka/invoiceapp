"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Invoice from "@/app/(dashboard)/invoice";
import { ExtendedInvoice } from "@/types/db";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

function InvoicesTable({
  invoices,
  offset,
  totalInvoices,
}: {
  invoices: ExtendedInvoice[];
  offset: number | null;
  totalInvoices: number;
}) {
  const router = useRouter();
  const invoicesPerPage = 5;

  function prevPage() {
    router.back();
  }

  function nextPage() {
    router.push(`/?offset=${offset}`, { scroll: false });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Twoje faktury</CardTitle>
        <CardDescription>
          Zarządzaj swoimi wystawionymi fakturami - edytuj, usuwaj i twórz nowe
          faktury.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {invoices.length === 0 ? (
          <div className="text-center">Brak faktur.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Numer</TableHead>
                <TableHead className="hidden md:table-cell">E-mail</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">
                  Wartość brutto
                </TableHead>
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
        )}
      </CardContent>
      <CardFooter>
        {offset && offset !== 0 ? (
          <div className="flex">
            <Button
              onClick={prevPage}
              variant="ghost"
              size="sm"
              type="submit"
              disabled={offset === invoicesPerPage}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Poprzednia
            </Button>
            <Button
              onClick={nextPage}
              variant="ghost"
              size="sm"
              type="submit"
              disabled={offset >= totalInvoices}
            >
              Następna
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ) : null}
      </CardFooter>
    </Card>
  );
}

export default InvoicesTable;
