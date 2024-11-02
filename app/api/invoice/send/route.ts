import EmailTemplate from "@/components/templates/emailTemplate";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body: {
      email: string;
      clientName: string;
      invoiceDetails: {
        id: string;
        issuedDate: Date;
      };
      attachment: Buffer;
    } = await req.json();
    await resend.emails.send({
      from: "Fakturly <invoices@fakturly.pl>",
      to: [body.email],
      subject: "Twoja faktura",
      react: EmailTemplate({
        sentToName: body.clientName,
        invoiceDetails: body.invoiceDetails,
      }),
      attachments: [
        {
          filename: "invoice.pdf",
          contentType: "pdf",
          content: body.attachment,
        },
      ],
    });

    return new Response("Email sent.", { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response("Failed to send email", { status: 500 });
  }
}
