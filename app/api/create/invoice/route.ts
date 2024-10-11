import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { invoiceFormSchema } from "@/lib/validators/validators";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) return new Response("Unauthorized", { status: 401 });

    const body = await req.json();
    console.log(body);

    const { invoiceId, issuedAt, soldAt, paymentMethod, status, products } =
      invoiceFormSchema.parse(body);

    /* const invoiceExist = await db.invoice.findFirst({
      where: {
        invoiceId,
      },
    });

    if (invoiceExist)
      return new Response("Invoice with same invoiceId already exists", {
        status: 400,
      });

    await db.invoice.create({
      data: {
        invoiceId,
        issuedAt,
        soldAt,
        paymentMethod,
        status,
        products,
        clientId: " sasas",
        creatorId: session.user.id,
      },
    });
 */
    return new Response("Invoice created", { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response("There was an error while creating invoice", {
      status: 500,
    });
  }
}
