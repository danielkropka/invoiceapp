import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import React from "react";
import { cn } from "@/lib/utils";
import Provider from "@/components/Provider";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fakturly",
  description:
    "Fakturly.pl - nowoczesna aplikacja do wystawiania faktur online. Twórz faktury łatwo i błyskawicznie.",
  keywords: [
    "faktura",
    "fakturly",
    "generator faktur",
    "aplikacja do faktur",
    "fakturowanie online",
    "system fakturowania",
    "faktury elektroniczne",
    "program do wystawiania faktur",
    "zarządzanie fakturami",
    "automatyzacja fakturowania",
    "faktury VAT",
    "generowanie faktur",
    "oprogramowanie do fakturowania",
    "bezpłatne fakturowanie online",
    "najlepsza aplikacja do fakturowania",
    "szybkie wystawianie faktur",
    "aplikacja do faktur dla małych firm",
    "integracja z księgowością",
    "funkcje aplikacji do fakturowania",
    "śledzenie płatności",
    "szablony faktur",
    "raportowanie finansowe",
    "aplikacja do zarządzania finansami",
    "fakturowanie w [nazwa miasta/regionu]",
    "program do faktur w Polsce",
    "faktury dla polskich firm",
    "aplikacja do fakturowania w Warszawie",
    "usługi fakturowania w [nazwa miasta]",
    "jak wystawić fakturę online",
    "zalety elektronicznego fakturowania",
    "jak automatyzować proces fakturowania",
    "najlepsze praktyki w fakturowaniu",
    "porównanie programów do fakturowania",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body
        className={cn(inter.className, "flex flex-col min-h-screen w-full")}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <Provider>{children}</Provider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
