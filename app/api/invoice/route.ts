import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { invoiceFormSchema } from "@/lib/validators/validators";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) return new Response("Unauthorized", { status: 401 });

    const body = await req.json();
    const { invoiceId, issuedAt, soldAt, products, clientId } =
      invoiceFormSchema.parse(body);

    const invoiceExist = await db.invoice.findFirst({
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
        products,
        clientId,
        creatorId: session.user.id,
      },
    });

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

export async function DELETE(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) return new Response("Unauthorized", { status: 401 });

    const body = await req.json();
    const { id }: { id: string } = body;

    /* Check if invoice exists */
    const invoiceExists = await db.invoice.findFirst({
      where: {
        id,
        creatorId: session.user.id,
      },
    });

    if (!invoiceExists)
      return new Response("Invoice was not found.", { status: 404 });

    await db.invoice.delete({
      where: {
        id,
        creatorId: session.user.id,
      },
    });

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
