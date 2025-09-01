"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { useTransition } from "react";
import { toast } from "sonner";

export default function ConfirmInvoice({ token }: { token: string }) {
  const [isPending, startTrasition] = useTransition();

  const handleConfirm = () => {
    startTrasition(async () => {
      try {
        await axios.post("/api/invoice/confirm", {
          token,
        });

        toast.success(
          "Faktura została oznaczona jako opłacona! Dziękujemy za płatność."
        );
      } catch {
        toast.error(
          "Wystąpił błąd w trakcie wysyłania potwierdzenia do wystawcy faktury. Spróbuj ponownie później."
        );
      }
    });
  };

  return (
    <Button onClick={handleConfirm} isLoading={isPending}>
      Potwierdź opłacenie faktury
    </Button>
  );
}
