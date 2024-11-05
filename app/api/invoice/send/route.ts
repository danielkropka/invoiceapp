import EmailTemplate from "@/components/templates/emailTemplate";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { SendEmailToClientType } from "@/types/db";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) return new Response("Unauthorized", { status: 401 });

    const body: SendEmailToClientType = await req.json();

    /* Check if invoice exists */
    const invoiceExists = await db.invoice.findFirst({
      select: {
        status: true,
        token: true,
        id: true,
      },
      where: {
        invoiceId: body.invoiceDetails.id,
        creatorId: session.user.id,
      },
    });

    if (!invoiceExists)
      return new Response("Invoice was not found.", { status: 404 });

    if (invoiceExists.status === "PENDING" || invoiceExists.status === "PAID")
      return new Response("Notification to client was already sent.", {
        status: 409,
      });

    await resend.emails.send({
      from: "Fakturly <invoices@fakturly.pl>",
      to: [body.email],
      subject: "Twoja faktura",
      react: EmailTemplate({
        sentToName: body.clientName,
        invoiceDetails: body.invoiceDetails,
        token: invoiceExists.token,
      }),
      attachments: [
        {
          filename: "invoice.pdf",
          contentType: "pdf",
          content: body.attachment,
        },
      ],
    });

    await db.invoice.update({
      where: {
        id: invoiceExists.id,
      },
      data: {
        status: "PENDING",
      },
    });

    return new Response("Email sent.", { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response("Failed to send email", { status: 500 });
  }
}
