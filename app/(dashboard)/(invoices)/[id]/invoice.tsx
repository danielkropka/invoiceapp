"use client";

import React, { useEffect, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Download, Send } from "lucide-react";
import InvoiceTemplate from "@/components/templates/invoiceTemplate";
import { useInvoiceContext } from "@/contexts/invoiceContext";
import { ExtendedInvoice } from "@/types/db";

export default function Invoice({ invoice }: { invoice: ExtendedInvoice }) {
  const [isPending, startTransition] = useTransition();
  const { generatePDF, downloadPDF, invoicePDF } = useInvoiceContext();

  const handleDownload = async () => {
    startTransition(async () => {
      try {
        await generatePDF(invoice);
      } catch (err) {
        console.log(err);
      }
    });
  };

  useEffect(() => {
    downloadPDF(invoice.invoiceId);
  }, [invoicePDF]);

  return (
    <InvoiceTemplate invoice={invoice}>
      <div className="flex flex-col md:flex-row gap-2">
        <Button
          className="flex flex-1 items-center gap-1"
          onClick={handleDownload}
          isLoading={isPending}
        >
          <Download className="w-5 h-5" />
          {isPending ? "Trwa generowanie faktury..." : "Pobierz w PDF"}
        </Button>
        <Button className="flex flex-1 items-center gap-1" variant={"outline"}>
          <Send className="w-5 h-5" />
          Wyślij na e-mail klienta
        </Button>
      </div>
    </InvoiceTemplate>
  );
}
