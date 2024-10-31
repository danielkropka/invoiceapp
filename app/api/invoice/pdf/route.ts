import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { getInvoiceTemplate } from "@/lib/utils";
import chromium from "@sparticuz/chromium";
import { createClient } from "redis";
import { ExtendedInvoice } from "@/types/db";

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.connect();

export async function POST(req: Request) {
  let browser;

  try {
    const session = await getAuthSession();
    if (!session?.user) return new Response("Unauthorized", { status: 401 });

    const body: ExtendedInvoice = await req.json();

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

    const cachedPDF = await redisClient.get(body.id);
    if (cachedPDF) {
      return new Response(
        new Blob([Buffer.from(cachedPDF, "binary")], {
          type: "application/pdf",
        }),
        {
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `inline; filename=${body.invoiceId}.pdf`,
          },
        }
      );
    }

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

    const pdfBlob = new Blob([pdf], { type: "application/pdf" });

    await redisClient.setEx(body.id, 3600, pdf.toString("binary"));

    return new Response(pdfBlob, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename=${body.invoiceId}.pdf`,
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
