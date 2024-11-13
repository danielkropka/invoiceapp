import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { getInvoiceTemplate } from "@/lib/utils";
import { invoiceFormSchema } from "@/lib/validators/validators";
import { Invoice } from "@prisma/client";
import chromium from "@sparticuz/chromium";
import { z } from "zod";

export async function POST(req: Request) {
  let browser;

  try {
    const session = await getAuthSession();
    if (!session?.user) return new Response("Unauthorized", { status: 401 });

    const body = await req.json();

    const { invoiceId, issuedAt, soldAt, products, clientId, exemptTax } =
      invoiceFormSchema.parse(body);

    const invoiceExist = await db.invoice.findFirst({
      where: {
        invoiceId,
        creatorId: session.user.id,
      },
    });

    if (invoiceExist)
      return new Response("Invoice with same invoiceId already exists", {
        status: 400,
      });

    const invoice = await db.invoice.create({
      data: {
        exemptTax,
        invoiceId,
        issuedAt,
        soldAt,
        products,
        clientId,
        creatorId: session.user.id,
      },
      include: {
        creator: true,
        client: true,
      },
    });

    const ReactDOMServer = (await import("react-dom/server")).default;
    const InvoiceTemplate = await getInvoiceTemplate();
    const template = ReactDOMServer.renderToStaticMarkup(
      InvoiceTemplate({ invoice })
    );

    if (process.env.NODE_ENV === "production") {
      const puppeteer = await import("puppeteer-core");
      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(
          process.env.CHROMIUM_EXECUTABLE_PATH
        ),
        headless: true,
        ignoreHTTPSErrors: true,
      });
    } else if (process.env.NODE_ENV === "development") {
      const puppeteer = await import("puppeteer");
      browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        headless: "new",
      });
    }

    if (!browser) throw new Error("Failed to launch browser");

    const page = await browser.newPage();

    await page.setContent(template, {
      waitUntil: "networkidle0",
    });

    await page.addStyleTag({
      url: process.env.TAILWIND_CDN,
    });

    const pdf = await page.pdf({
      format: "a4",
      printBackground: true,
    });

    for (const page of await browser.pages()) {
      await page.close();
    }

    await browser.close();

    await db.invoice.update({
      where: {
        id: invoice.id,
      },
      data: {
        file: pdf,
        fileName: invoice.invoiceId,
      },
    });

    return new Response("Invoice created", { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }
    console.log(error);

    return new Response("There was an error while creating invoice", {
      status: 500,
    });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) return new Response("Unauthorized", { status: 401 });

    const body: Invoice = await req.json();
    const { id } = body;

    const invoice = await db.invoice.findFirst({
      where: {
        id,
      },
    });

    if (!invoice) return new Response("Invoice was not found", { status: 404 });

    await db.invoice.update({
      where: {
        id,
      },
      data: {
        ...(({ id: _, ...rest }) => rest)(invoice),
        ...(({ id: _, ...rest }) => rest)(body),
      },
    });

    return new Response("Invoice has been updated", { status: 200 });
  } catch (error) {
    if (error) {
      console.log(error);
      return new Response("There was an error while updating invoice.", {
        status: 500,
      });
    }
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

    return new Response("Invoice deleted", { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response("There was an error while deleting invoice", {
      status: 500,
    });
  }
}
