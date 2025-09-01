import { Client, Invoice, User } from "@prisma/client";

export type ExtendedInvoice = Omit<Invoice, "file"> & {
  client: Client;
  creator: User;
};

export type InvoiceType = Omit<Invoice, "file"> & {
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
  attachment: string;
};
