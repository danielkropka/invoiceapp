import React, { ReactNode } from "react";
import { ExtendedInvoice } from "@/types/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import moment from "moment";
import "moment/locale/pl";
import clsx from "clsx";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, sumAllProducts } from "@/lib/utils";

function InvoiceTemplate({
  invoice,
  children,
}: {
  invoice: ExtendedInvoice;
  children: ReactNode;
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

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 pb-8 min-h-full">
      <article className="w-full">
        <Card className="shadow-none w-full">
          <CardHeader className="pb-4 sm:pb-6 px-2 sm:px-4 lg:px-6">
            <CardTitle
              className={clsx("border-b border-border pb-3 sm:pb-4", {
                "flex flex-col gap-3 sm:gap-4 lg:gap-0 lg:flex-row justify-between lg:items-end":
                  children,
              })}
            >
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light text-foreground tracking-tight">
                  Faktura
                </h1>
                <div className="flex items-center gap-3">
                  <div className="w-px h-5 sm:h-6 bg-border"></div>
                  <span className="text-sm sm:text-base lg:text-lg font-medium text-muted-foreground">
                    #{invoice.invoiceId}
                  </span>
                </div>
              </div>
              {children}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2 sm:px-4 lg:px-6">
            {/* Daty */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-4 sm:mb-6 lg:mb-8">
              <div>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Data wystawienia
                </span>
                <p className="text-sm sm:text-base lg:text-lg text-foreground mt-2 font-medium">
                  {moment(invoice.issuedAt).format("LL")}
                </p>
              </div>
              <div>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Data sprzedaży
                </span>
                <p className="text-sm sm:text-base lg:text-lg text-foreground mt-2 font-medium">
                  {moment(invoice.soldAt).format("LL")}
                </p>
              </div>
            </div>

            {/* Informacje o stronach */}
            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 mb-4 sm:mb-6 lg:mb-8">
              {/* Wystawca */}
              <div className="flex-1 min-w-0">
                <h3 className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3 sm:mb-4">
                  Wystawca
                </h3>
                <div className="space-y-1">
                  <p className="text-base sm:text-lg lg:text-xl font-semibold text-foreground">
                    {creatorName}
                  </p>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    {creatorEmail}
                  </p>
                  {creatorPhoneNumber && (
                    <p className="text-sm sm:text-base text-muted-foreground">
                      {creatorPhoneNumber}
                    </p>
                  )}
                  {creatorAddress?.street && (
                    <p className="text-sm sm:text-base text-foreground">
                      {creatorAddress.street}
                    </p>
                  )}
                  {creatorAddress && (
                    <p className="text-sm sm:text-base text-foreground">
                      {creatorAddress.city}, {creatorAddress.postalCode}
                    </p>
                  )}
                  {creatorTax && (
                    <p className="text-sm sm:text-base text-foreground">
                      NIP{" "}
                      {creatorTax.replace(
                        /(\d{3})(\d{3})(\d{2})(\d{2})/,
                        "$1-$2-$3-$4"
                      )}
                    </p>
                  )}
                </div>
              </div>

              {/* Odbiorca */}
              <div className="flex-1 min-w-0">
                <h3 className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3 sm:mb-4">
                  Odbiorca
                </h3>
                <div className="space-y-1">
                  <p className="text-base sm:text-lg lg:text-xl font-semibold text-foreground">
                    {clientName}
                  </p>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    {clientEmail}
                  </p>
                  {clientPhoneNumber && (
                    <p className="text-sm sm:text-base text-muted-foreground">
                      {clientPhoneNumber}
                    </p>
                  )}
                  {clientAddress?.street && (
                    <p className="text-sm sm:text-base text-foreground">
                      {clientAddress.street}
                    </p>
                  )}
                  {clientAddress && (
                    <p className="text-sm sm:text-base text-foreground">
                      {clientAddress.city}, {clientAddress.postalCode}
                    </p>
                  )}
                  {clientTax && (
                    <p className="text-sm sm:text-base text-foreground">
                      NIP{" "}
                      {clientTax.replace(
                        /(\d{3})(\d{3})(\d{2})(\d{2})/,
                        "$1-$2-$3-$4"
                      )}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabela produktów - poza Card */}
        <div className="mt-4 border border-border rounded-lg">
          <div className="bg-muted px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-b border-border">
            <h2 className="text-sm sm:text-base lg:text-lg font-medium text-foreground">
              Produkty / Usługi
            </h2>
          </div>
          <div className="w-full overflow-x-auto">
            <Table className="w-full min-w-[600px]">
              <TableHeader>
                <TableRow className="border-b border-border">
                  <TableHead className="font-medium text-foreground text-left py-2 px-2 min-w-[100px]">
                    Nazwa
                  </TableHead>
                  <TableHead className="font-medium text-foreground text-left py-2 px-2 min-w-[120px]">
                    Opis
                  </TableHead>
                  <TableHead className="font-medium text-foreground text-right py-2 px-2 min-w-[80px]">
                    Cena netto
                  </TableHead>
                  <TableHead className="font-medium text-foreground text-center py-2 px-2 min-w-[50px]">
                    Ilość
                  </TableHead>
                  <TableHead
                    className={cn(
                      "font-medium text-foreground text-center py-2 px-2 min-w-[50px]",
                      invoice.exemptTax && "hidden"
                    )}
                  >
                    VAT
                  </TableHead>
                  <TableHead className="font-medium text-foreground text-right py-2 px-2 min-w-[90px]">
                    Wartość netto
                  </TableHead>
                  <TableHead
                    className={cn(
                      "font-medium text-foreground text-right py-2 px-2 min-w-[80px]",
                      invoice.exemptTax && "hidden"
                    )}
                  >
                    Kwota VAT
                  </TableHead>
                  <TableHead className="font-medium text-foreground text-right py-2 px-2 min-w-[90px]">
                    Wartość brutto
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoice.products.map((product, index) => (
                  <TableRow
                    key={index}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="py-2 px-2">
                      <span className="font-medium text-foreground text-xs sm:text-sm break-words block">
                        {product.name}
                      </span>
                    </TableCell>
                    <TableCell className="py-2 px-2">
                      <span className="text-muted-foreground text-xs sm:text-sm break-words block">
                        {product.description ?? "-"}
                      </span>
                    </TableCell>
                    <TableCell className="py-2 px-2 text-right">
                      <span className="font-mono text-foreground text-xs sm:text-sm">
                        {product.price.toFixed(2)} zł
                      </span>
                    </TableCell>
                    <TableCell className="py-2 px-2 text-center">
                      <span className="text-foreground text-xs sm:text-sm">
                        {product.quantity}
                      </span>
                    </TableCell>
                    <TableCell
                      className={cn(
                        "py-2 px-2 text-center text-muted-foreground text-xs sm:text-sm",
                        invoice.exemptTax && "hidden"
                      )}
                    >
                      <span>{product.vat}%</span>
                    </TableCell>
                    <TableCell className="py-2 px-2 text-right">
                      <span className="font-mono font-medium text-foreground text-xs sm:text-sm">
                        {(product.price * product.quantity).toFixed(2)} zł
                      </span>
                    </TableCell>
                    <TableCell
                      className={cn(
                        "py-2 px-2 text-right text-muted-foreground text-xs sm:text-sm",
                        invoice.exemptTax && "hidden"
                      )}
                    >
                      <span className="font-mono">
                        {(
                          product.price *
                          (Number(product.vat) / 100) *
                          product.quantity
                        ).toFixed(2)}{" "}
                        zł
                      </span>
                    </TableCell>
                    <TableCell className="py-2 px-2 text-right">
                      <span className="font-mono font-semibold text-foreground text-xs sm:text-sm">
                        {invoice.exemptTax
                          ? (product.price * product.quantity).toFixed(2)
                          : (
                              product.price *
                              (Number(product.vat) / 100 + 1) *
                              product.quantity
                            ).toFixed(2)}{" "}
                        zł
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow className="bg-muted">
                  <TableCell
                    colSpan={invoice.exemptTax ? 5 : 7}
                    className="py-3 px-3 text-right border-0"
                  >
                    <span className="text-sm sm:text-base font-medium text-foreground">
                      Łączna wartość brutto
                    </span>
                  </TableCell>
                  <TableCell className="py-3 px-3 text-right border-0">
                    <span className="text-base sm:text-lg font-semibold text-foreground">
                      {sumAllProducts(
                        invoice.products,
                        invoice.exemptTax!
                      ).toFixed(2)}{" "}
                      zł
                    </span>
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </div>
      </article>
    </div>
  );
}

export default InvoiceTemplate;
