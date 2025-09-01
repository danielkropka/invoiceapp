import { db } from "@/lib/prisma";
import Invoice from "./invoice";
import { getAuthSession } from "@/lib/auth";
import { notFound } from "next/navigation";

export default async function InvoicePage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const { id } = params;
  const session = await getAuthSession();
  if (!session?.user) return notFound();

  const invoice = await db.invoice.findFirst({
    where: {
      id,
    },
    include: {
      creator: true,
      client: true,
    },
  });

  if (!invoice) return notFound();

  // Konwertuj file na base64 jeśli istnieje
  const invoiceWithBase64 = {
    ...invoice,
    fileBase64: invoice.file ? invoice.file.toString("base64") : null,
  };

  // Usuń pole file z obiektu
  const { file, ...invoiceWithoutFile } = invoiceWithBase64;

  return <Invoice invoice={invoiceWithoutFile} />;
}
