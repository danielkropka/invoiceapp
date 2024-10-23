import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { ExtendedInvoice } from "@/types/db";
import moment from "moment";
import "moment/locale/pl";
import { Badge } from "@/components/ui/badge";
import { sumAllProducts } from "@/lib/utils";

function Invoice({ invoice }: { invoice: ExtendedInvoice }) {
  return (
    <TableRow>
      <TableCell className="font-medium">{invoice.invoiceId}</TableCell>
      <TableCell className="hidden md:table-cell">
        {invoice.client.email}
      </TableCell>
      <TableCell>
        <Badge variant="outline" className="capitalize">
          {invoice.status === "PAID"
            ? "zapłacono"
            : invoice.status === "PENDING"
            ? "oczekuje"
            : "niezapłacono"}
        </Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {sumAllProducts(invoice.products).toFixed(2)} PLN
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {moment(invoice.issuedAt).format("L")}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Otwórz menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Akcje</DropdownMenuLabel>
            <DropdownMenuItem>Edytuj</DropdownMenuItem>
            <DropdownMenuItem>Szczegóły</DropdownMenuItem>
            <DropdownMenuItem>Usuń</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

export default Invoice;
