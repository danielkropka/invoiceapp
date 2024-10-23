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
import { Client as ClientType } from "@prisma/client";
import moment from "moment";
import "moment/locale/pl";

function Client({ client }: { client: ClientType }) {
  return (
    <TableRow>
      <TableCell className="hidden md:table-cell">{client.email}</TableCell>
      <TableCell>{client.name}</TableCell>
      <TableCell className="hidden md:table-cell">
        {moment(client.createdAt).format("L")}
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

export default Client;
