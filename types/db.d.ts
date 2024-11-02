import { Client, Invoice, User } from "@prisma/client";

export type ExtendedInvoice = Invoice & {
  client: Client;
  creator: User;
};

export type InvoiceType = Invoice & {
  client: Client;
};

export type SendEmailToClientType = {
  email: string;
  clientName: string;
  invoiceDetails: {
    id: string;
    issuedDate: Date;
  };
  token: string;
  attachment: Buffer;
};
