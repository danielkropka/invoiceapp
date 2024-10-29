"use client";

import React, { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Client, Invoice as InvoiceType, User } from "@prisma/client";
import { Download, Send } from "lucide-react";
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
    phoneNumber: creatorPhoneNumber,
    address: creatorAddress,
    taxIdNumber: creatorTax,
  } = invoice.creator;
  const {
    name: clientName,
    email: clientEmail,
    phoneNumber: clientPhoneNumber,
    address: clientAddress,
    taxIdNumber: clientTax,
  } = invoice.client;

  const [isPending, startTransition] = useTransition();

  const downloadPDF = async () => {
    startTransition(async () => {
      const res = await fetch("/api/invoice/pdf", {
        method: "POST",
        body: JSON.stringify(invoice),
      });

      const invoicePDF = await res.blob();

      if (invoicePDF instanceof Blob && invoicePDF.size > 0) {
        const url = window.URL.createObjectURL(invoicePDF);

        const a = document.createElement("a");
        a.href = url;
        a.download = `invoice.pdf`;
        document.body.appendChild(a);

        a.click();

        window.URL.revokeObjectURL(url);
      }
    });
  };

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
          <div className="flex flex-col md:flex-row gap-2">
            <Button
              className="flex flex-1 items-center gap-1"
              onClick={downloadPDF}
              isLoading={isPending}
            >
              <Download className="w-5 h-5" />
              Pobierz w PDF
            </Button>
            <Button
              className="flex flex-1 items-center gap-1"
              variant={"outline"}
            >
              <Send className="w-5 h-5" />
              Wyślij na e-mail klienta
            </Button>
          </div>
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
            {creatorPhoneNumber ? <span>tel. {creatorPhoneNumber}</span> : null}
            <span>{creatorAddress?.street}</span>
            <span>
              {creatorAddress
                ? `${creatorAddress.city}, ${creatorAddress.postalCode}`
                : null}
            </span>
            {creatorTax ? (
              <span>
                <span className="font-semibold">NIP:</span> {creatorTax}
              </span>
            ) : null}
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">Wystawiona dla</span>
            <span>{clientName}</span>
            <span>{clientEmail}</span>
            {clientPhoneNumber ? <span>tel. {clientPhoneNumber}</span> : null}
            <span>{clientAddress?.street}</span>
            <span>
              {clientAddress
                ? `${clientAddress.city}, ${clientAddress.postalCode}`
                : null}
            </span>
            {clientTax ? (
              <span>
                <span className="font-semibold">NIP:</span> {clientTax}
              </span>
            ) : null}
          </div>
          <Products products={invoice.products} />
        </div>
      </CardContent>
    </Card>
  );
}
