import { db } from "@/lib/prisma";
import { invalidateUserCache } from "@/lib/cache";

export async function POST(req: Request) {
  try {
    const body: { token: string } = await req.json();

    const invoiceToConfirm = await db.invoice.findFirst({
      select: { id: true, status: true },
      where: {
        token: body.token,
      },
    });

    if (!invoiceToConfirm)
      return new Response("Invoice was not found.", { status: 404 });

    // Sprawdź czy faktura nie jest już opłacona
    if (invoiceToConfirm.status === "PAID")
      return new Response("Invoice is already paid.", { status: 409 });

    // Zmień status na PAID
    const updatedInvoice = await db.invoice.update({
      where: {
        id: invoiceToConfirm.id,
      },
      data: {
        status: "PAID",
      },
      select: {
        creatorId: true,
      },
    });

    // Wyczyść cache po zmianie statusu faktury
    invalidateUserCache(updatedInvoice.creatorId);

    return new Response("Invoice confirmed and marked as paid", {
      status: 200,
    });
  } catch (err) {
    console.error("Error confirming invoice:", err);
    return new Response(
      "There was an error while confirming your invoice payment.",
      { status: 500 }
    );
  }
}
