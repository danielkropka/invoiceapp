"use client";

import React, { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Download, Send } from "lucide-react";
import InvoiceTemplate from "@/components/templates/invoiceTemplate";
import { useInvoiceContext } from "@/contexts/invoiceContext";
import { ExtendedInvoice } from "@/types/db";
import { toast } from "sonner";

export default function Invoice({ invoice }: { invoice: ExtendedInvoice }) {
  const [isGenerating, startTransitionGenerate] = useTransition();
  const [isSending, startTransitionSending] = useTransition();
  const { generatePDF, downloadPDF, invoicePDF, sentEmail } =
    useInvoiceContext();

  const handleGenerate = () => {
    startTransitionGenerate(async () => {
      try {
        await generatePDF(invoice);
      } catch (err) {
        console.log(err);
      }
    });
  };

  const handleDownload = () => {
    downloadPDF(invoice.invoiceId);
  };

  const handleSentEmail = async () => {
    startTransitionSending(async () => {
      try {
        if (invoicePDF.size == 0) {
          await generatePDF(invoice);
        }
        const pdfArrayBuffer = await invoicePDF.arrayBuffer();
        const pdfBuffer = Buffer.from(pdfArrayBuffer);

        sentEmail(
          invoice.client.email,
          invoice.client.name,
          {
            id: invoice.invoiceId,
            issuedDate: invoice.issuedAt,
          },
          pdfBuffer
        );

        toast.success("Pomyślnie wysłano e-mail'a do klienta.");
      } catch (err) {
        console.log(err);
        toast.error(
          "Wystąpił błąd podczas wysyłania e-mail'a. Spróbuj ponownie później."
        );
      }
    });
  };

  return (
    <InvoiceTemplate invoice={invoice}>
      <div className="flex flex-col md:flex-row gap-2">
        {invoicePDF.size == 0 ? (
          <Button
            className="flex flex-1 items-center gap-1"
            onClick={handleGenerate}
            isLoading={isGenerating}
          >
            <Download className="w-5 h-5" />
            {isGenerating
              ? "Trwa generowanie faktury..."
              : "Wygeneruj fakturę w PDF"}
          </Button>
        ) : (
          <Button
            className="flex flex-1 items-center gap-1"
            onClick={handleDownload}
            isLoading={isGenerating}
          >
            <Download className="w-5 h-5" />
            {isGenerating ? "Trwa pobieranie faktury..." : "Pobierz fakturę"}
          </Button>
        )}
        <Button
          className="flex flex-1 items-center gap-1"
          variant={"outline"}
          onClick={handleSentEmail}
          isLoading={isSending}
        >
          <Send className="w-5 h-5" />
          {isSending ? "Trwa wysyłanie e-mail'a" : "Wyślij na e-mail klienta"}
        </Button>
      </div>
    </InvoiceTemplate>
  );
}
