import React, { ReactNode } from "react";
import { Client, Invoice, User } from "@prisma/client";
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
  invoice: Invoice & {
    client: Client;
    creator: User;
  };
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
    <article>
      <Card className="h-full">
        <CardHeader>
          <CardTitle
            className={clsx("border-b pb-4", {
              "flex flex-col gap-4 lg:gap-0 lg:flex-row justify-between lg:items-center":
                children,
            })}
          >
            <span>
              Faktura
              <span className="ml-1 italic">
                <span className="text-gray-600">#</span>
                {invoice.invoiceId}
              </span>
            </span>
            {children}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="flex flex-col">
              <span className="text-gray-600">Data wystawienia</span>
              <span>{moment(invoice.issuedAt).format("LL")}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-600">Data sprzedaży</span>
              <span>{moment(invoice.soldAt).format("LL")}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-600">Wystawiona przez</span>
              <span>{creatorName}</span>
              <span>{creatorEmail}</span>
              {creatorPhoneNumber ? (
                <span>tel. {creatorPhoneNumber}</span>
              ) : null}
              <span>{creatorAddress?.street}</span>
              <span>
                {creatorAddress
                  ? `${creatorAddress.city}, ${creatorAddress.postalCode}`
                  : null}
              </span>
              {creatorTax ? (
                <span>
                  NIP{" "}
                  {creatorTax.replace(
                    /(\d{3})(\d{3})(\d{2})(\d{2})/,
                    "$1-$2-$3-$4"
                  )}
                </span>
              ) : null}
            </div>
            <div className="flex flex-col">
              <span className="text-gray-600">Wystawiona dla</span>
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
                  NIP{" "}
                  {clientTax.replace(
                    /(\d{3})(\d{3})(\d{2})(\d{2})/,
                    "$1-$2-$3-$4"
                  )}
                </span>
              ) : null}
            </div>
            <div className="col-span-full border-t pt-4 flex flex-col gap-10">
              <h2 className="text-2xl font-semibold">Produkty/Usługi</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nazwa produktu/usługi</TableHead>
                    <TableHead>Opis</TableHead>
                    <TableHead>Cena netto</TableHead>
                    <TableHead>Ilość</TableHead>
                    <TableHead className={cn(invoice.exemptTax && "hidden")}>
                      VAT
                    </TableHead>
                    <TableHead>Wartość netto</TableHead>
                    <TableHead className={cn(invoice.exemptTax && "hidden")}>
                      Kwota VAT
                    </TableHead>
                    <TableHead>Wartość brutto</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoice.products.map((product, index) => (
                    <React.Fragment key={index}>
                      <TableRow>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.description ?? "-"}</TableCell>
                        <TableCell>{product.price.toFixed(2)} zł</TableCell>
                        <TableCell>{product.quantity}</TableCell>
                        <TableCell
                          className={cn(invoice.exemptTax && "hidden")}
                        >
                          {product.vat}%
                        </TableCell>
                        <TableCell>
                          {(product.price * product.quantity).toFixed(2)} zł
                        </TableCell>
                        <TableCell
                          className={cn(invoice.exemptTax && "hidden")}
                        >
                          {(
                            product.price *
                            (Number(product.vat) / 100) *
                            product.quantity
                          ).toFixed(2)}
                          &nbsp;zł
                        </TableCell>
                        <TableCell>
                          {invoice.exemptTax
                            ? (product.price * product.quantity).toFixed(2)
                            : (
                                product.price *
                                (Number(product.vat) / 100 + 1) *
                                product.quantity
                              ).toFixed(2)}
                          &nbsp;zł
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={invoice.exemptTax ? 5 : 7}>
                      Łączna wartość brutto
                    </TableCell>
                    <TableCell>
                      {sumAllProducts(
                        invoice.products,
                        invoice.exemptTax!
                      ).toFixed(2)}{" "}
                      zł
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </article>
  );
}

export default InvoiceTemplate;
