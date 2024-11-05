import { db } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body: { token: string } = await req.json();

    const invoiceToConfirm = await db.invoice.findFirst({
      select: { creatorId: true, invoiceId: true },
      where: {
        token: body.token,
      },
    });

    if (!invoiceToConfirm)
      return new Response("Invoice was not found.", { status: 404 });

    const invoiceCreator = await db.user.findFirst({
      select: { notifications: true, id: true },
      where: {
        id: invoiceToConfirm.creatorId,
      },
    });

    if (!invoiceCreator)
      return new Response("Creator of invoice was not found.", {
        status: 404,
      });

    if (
      invoiceCreator.notifications.find(
        (notification) => notification.invoiceId === invoiceToConfirm.invoiceId
      )
    )
      return new Response("Notification was already sent.", { status: 409 });

    await db.user.update({
      where: {
        id: invoiceCreator.id,
      },
      data: {
        notifications: [
          ...invoiceCreator.notifications,
          {
            invoiceId: invoiceToConfirm.invoiceId,
            type: "CONFIRM_INVOICE",
            read: false,
            createdAt: new Date(),
          },
        ],
      },
    });

    return new Response("Notify sent", { status: 200 });
  } catch (err) {
    if (err)
      return new Response(
        "There was an error while confirming your invoice payment.",
        { status: 500 }
      );
  }
}
