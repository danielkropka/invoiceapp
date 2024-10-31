import { Client, Invoice, User } from "@prisma/client";

export type ExtendedInvoice = Invoice & {
  client: Client;
  creator: User;
};
