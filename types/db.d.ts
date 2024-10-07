import { Client, Invoice } from "@prisma/client";

export type ExtendedInvoice = Invoice & {
  client: Client;
};
