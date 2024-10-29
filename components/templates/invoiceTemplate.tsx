import React from "react";
import { Client, Invoice, User } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import moment from "moment";
import "moment/locale/pl";
/* import Products from "@/app/(dashboard)/(invoices)/[id]/products"; */

function InvoiceTemplate({
  invoice,
}: {
  invoice: Invoice & {
    client: Client;
    creator: User;
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

  return (
    <article>
      <Card>
        <CardHeader>
          <CardTitle className="border-b pb-4 ">
            <span>
              Faktura
              <span className="ml-1 italic">
                <span className="text-gray-600">#</span>
                {invoice.invoiceId}
              </span>
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-16">
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
                  <span className="font-semibold">NIP:</span> {creatorTax}
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
                  <span className="font-semibold">NIP:</span> {clientTax}
                </span>
              ) : null}
            </div>
            {/* <Products products={invoice.products} /> */}
          </div>
        </CardContent>
      </Card>
    </article>
  );
}

export default InvoiceTemplate;
