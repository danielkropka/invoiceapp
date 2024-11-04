import { db } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body: { token: string } = await req.json();

    const invoiceToConfirm = db.invoice.findFirst({
      where: {
        token: body.token,
      },
    });

    if (!invoiceToConfirm)
      return new Response("Invoice was not found.", { status: 404 });

    return new Response("Notify sent", { status: 200 });
  } catch (err) {
    if (err)
      return new Response(
        "There was an error while confirming your invoice payment.",
        { status: 500 }
      );
  }
}
