import { Client, Invoice, User } from "@prisma/client";

export type ExtendedInvoice = Invoice & {
  client: Client;
  creator: User;
};

export type InvoiceType = Invoice & {
  client: Client;
};
