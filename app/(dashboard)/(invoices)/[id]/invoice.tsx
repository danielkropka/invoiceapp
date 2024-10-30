"use client";

import React, { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Client, Invoice as InvoiceType, User } from "@prisma/client";
import { Download, Send } from "lucide-react";
import InvoiceTemplate from "@/components/templates/invoiceTemplate";

export default function Invoice({
  invoice,
}: {
  invoice: InvoiceType & {
    creator: User;
    client: Client;
  };
}) {
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
        a.download = `${invoice.invoiceId}.pdf`;
        document.body.appendChild(a);

        a.click();

        window.URL.revokeObjectURL(url);
      }
    });
  };

  return (
    <InvoiceTemplate invoice={invoice}>
      <div className="flex flex-col md:flex-row gap-2">
        <Button
          className="flex flex-1 items-center gap-1"
          onClick={downloadPDF}
          isLoading={isPending}
        >
          <Download className="w-5 h-5" />
          Pobierz w PDF
        </Button>
        <Button className="flex flex-1 items-center gap-1" variant={"outline"}>
          <Send className="w-5 h-5" />
          Wyślij na e-mail klienta
        </Button>
      </div>
    </InvoiceTemplate>
  );
}
