"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { InvoiceContextProvider } from "@/contexts/invoiceContext";

function Provider({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <InvoiceContextProvider>{children}</InvoiceContextProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
}

export default Provider;
