"use client";

import React, { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Download, Send } from "lucide-react";
import InvoiceTemplate from "@/components/templates/invoiceTemplate";
import { useInvoiceContext } from "@/contexts/invoiceContext";
import { ExtendedInvoice } from "@/types/db";
import { useRouter } from "next/navigation";

export default function Invoice({ invoice }: { invoice: ExtendedInvoice }) {
  const [isSending, startTransition] = useTransition();
  const { downloadPDF, sentEmail } = useInvoiceContext();
  const router = useRouter();

  const handleDownload = () => {
    downloadPDF(invoice.fileBase64!, invoice.fileName!);
  };

  const handleSentEmail = async () => {
    startTransition(async () => {
      sentEmail({
        token: invoice.token,
        email: invoice.client.email,
        invoiceDetails: {
          id: invoice.invoiceId,
          issuedDate: invoice.issuedAt,
        },
        clientName: invoice.client.name,
        attachment: invoice.fileBase64!,
      });
      router.refresh();
    });
  };

  return (
    <InvoiceTemplate invoice={invoice}>
      <div className="flex flex-col md:flex-row gap-2">
        <Button
          className="flex flex-1 items-center gap-1"
          onClick={handleDownload}
        >
          <Download className="w-5 h-5" />
          Pobierz fakturę
        </Button>
        <Button
          className="flex flex-1 items-center gap-1"
          variant={"outline"}
          onClick={handleSentEmail}
          isLoading={isSending}
          disabled={invoice.status === "PENDING" || isSending}
        >
          <Send className="w-5 h-5" />
          {isSending
            ? "Trwa wysyłanie e-mail'a"
            : invoice.status === "PENDING"
            ? "E-mail został już wysłany"
            : "Wyślij na e-mail klienta"}
        </Button>
      </div>
    </InvoiceTemplate>
  );
}
