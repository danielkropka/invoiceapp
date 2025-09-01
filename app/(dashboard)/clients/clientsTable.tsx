"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Client as ClientType } from "@prisma/client";
import Client from "@/app/(dashboard)/clients/client";
import { Mail, User, MapPin, Calendar } from "lucide-react";

function ClientsTable({
  clients,
  offset = 0,
}: {
  clients: ClientType[];
  offset?: number;
}) {
  return (
    <div className="rounded-lg border border-border/50 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50 border-0">
            <TableHead className="font-semibold text-foreground py-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                Nazwa
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
                <MapPin className="w-4 h-4 text-muted-foreground" />
                Miasto
              </div>
            </TableHead>
            <TableHead className="font-semibold text-foreground py-4 hidden md:table-cell">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                Data utworzenia
              </div>
            </TableHead>
            <TableHead className="font-semibold text-foreground py-4 text-right">
              <span className="sr-only">Akcje</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client, index) => (
            <Client key={client.id} client={client} index={offset + index} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default ClientsTable;
