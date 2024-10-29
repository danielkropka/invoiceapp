import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/prisma";
import chromium from "@sparticuz/chromium";
import { Client, Invoice, User } from "@prisma/client";
import { getInvoiceTemplate } from "@/lib/utils";
import InvoiceTemplate from "@/components/templates/invoiceTemplate";

export async function POST(req: Request) {
  let browser;

  try {
    const session = await getAuthSession();
    if (!session?.user) return new Response("Unauthorized", { status: 401 });

    const body: Invoice & {
      client: Client;
      creator: User;
    } = await req.json();

    const client = await db.client.findFirst({
      where: {
        id: body.clientId,
      },
    });

    if (!client) return new Response("Client was not found", { status: 404 });

    const user = await db.user.findFirst({
      where: {
        id: session.user.id,
      },
    });

    if (!user) return new Response("User was not found", { status: 404 });

    const ReactDOMServer = (await import("react-dom/server")).default;
    const InvoiceTemplate = await getInvoiceTemplate();
    const template = ReactDOMServer.renderToStaticMarkup(
      InvoiceTemplate({ invoice: body })
    );

    if (process.env.NODE_ENV === "production") {
      const puppeteer = await import("puppeteer-core");
      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: true,
      });
    } else if (process.env.NODE_ENV === "development") {
      const puppeteer = await import("puppeteer");
      browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        headless: "shell",
      });
    }

    if (!browser) throw new Error("Failed to launch browser");

    const page = await browser.newPage();
    console.log("Page opened");

    await page.setContent(template, {
      waitUntil: "networkidle0",
    });
    console.log("Page content set");

    await page.addStyleTag({
      url: process.env.TAILWIND_CDN,
    });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    for (const page of await browser.pages()) {
      await page.close();
    }

    await browser.close();
    console.log("Browser closed");

    const pdfBlob = new Blob([pdf], { type: "application/pdf" });

    return new Response(pdfBlob, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename=invoice.pdf`,
      },
      status: 200,
    });
  } catch (err) {
    console.log(err);

    return new Response("There was an error while generating PDF", {
      status: 500,
    });
  } finally {
    if (browser) {
      await Promise.race([browser.close(), browser.close(), browser.close()]);
    }
  }
}
