"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Client, Invoice as InvoiceType, User } from "@prisma/client";
import { Download } from "lucide-react";
import moment from "moment";
import "moment/locale/pl";
import Products from "./products";

export default function Invoice({
  invoice,
}: {
  invoice: InvoiceType & {
    creator: User;
    client: Client;
  };
}) {
  const {
    name: creatorName,
    email: creatorEmail,
    address: creatorAddress,
  } = invoice.creator;
  const {
    name: clientName,
    email: clientEmail,
    address: clientAddress,
  } = invoice.client;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="border-b pb-4 flex flex-col gap-4 lg:gap-0 lg:flex-row justify-between lg:items-center">
          <span>
            Faktura
            <span className="ml-1 italic">
              <span className="text-muted-foreground">#</span>
              {invoice.invoiceId}
            </span>
          </span>
          <Button className="flex items-center gap-1">
            <Download className="w-5 h-5" />
            Pobierz w PDF
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="flex flex-col">
            <span className="text-muted-foreground">Data wystawienia</span>
            <span>{moment(invoice.issuedAt).format("LL")}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">Data sprzedaży</span>
            <span>{moment(invoice.soldAt).format("LL")}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">Wystawiona przez</span>
            <span>{creatorName}</span>
            <span>{creatorEmail}</span>
            <span>{creatorAddress?.street}</span>
            <span>
              {creatorAddress
                ? `${creatorAddress.city}, ${creatorAddress.postalCode}`
                : null}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">Wystawiona dla</span>
            <span>{clientName}</span>
            <span>{clientEmail}</span>
            <span>{clientAddress?.street}</span>
            <span>
              {clientAddress
                ? `${clientAddress.city}, ${clientAddress.postalCode}`
                : null}
            </span>
          </div>
          <Products products={invoice.products} />
        </div>
      </CardContent>
    </Card>
  );
}
