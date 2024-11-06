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
  if (invoice.file) {
    invoice.fileBase64 = invoice.file.toString("base64");
    invoice.file = null;
  }

  return <Invoice invoice={invoice} />;
}
