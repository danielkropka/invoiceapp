"use client";

import React from "react";
import { CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Client as ClientType } from "@prisma/client";
import Client from "@/app/(dashboard)/clients/client";

function ClientsTable({ clients }: { clients: ClientType[] }) {
  return (
    <CardContent>
      {clients.length === 0 ? (
        <div className="text-center">Brak klientów.</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden md:table-cell">E-mail</TableHead>
              <TableHead>Nazwa</TableHead>
              <TableHead className="hidden md:table-cell">
                Data utworzenia
              </TableHead>
              <TableHead>
                <span className="sr-only">Akcje</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <Client key={client.id} client={client} />
            ))}
          </TableBody>
        </Table>
      )}
    </CardContent>
  );
}

export default ClientsTable;
