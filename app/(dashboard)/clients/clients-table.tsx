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
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Client as ClientType } from "@prisma/client";
import Client from "@/app/(dashboard)/clients/client";

function ClientsTable({
  clients,
  offset,
  totalClients,
}: {
  clients: ClientType[];
  offset: number | null;
  totalClients: number;
}) {
  const router = useRouter();
  const clientsPerPage = 5;

  function prevPage() {
    router.back();
  }

  function nextPage() {
    router.push(`/clients?offset=${offset}`, { scroll: false });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Twoi klienci</CardTitle>
        <CardDescription>
          Zarządzaj swoimi klientami - edytuj, usuwaj i twórz nowych klientów.
        </CardDescription>
      </CardHeader>
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
      <CardFooter>
        {offset && offset !== 0 ? (
          <form>
            <div className="flex">
              <Button
                formAction={prevPage}
                variant="ghost"
                size="sm"
                type="submit"
                disabled={offset <= clientsPerPage}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Poprzednia
              </Button>
              <Button
                formAction={nextPage}
                variant="ghost"
                size="sm"
                type="submit"
                disabled={offset >= totalClients}
              >
                Następna
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        ) : null}
      </CardFooter>
    </Card>
  );
}

export default ClientsTable;
