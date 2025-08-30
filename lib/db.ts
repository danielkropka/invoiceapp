import "server-only";

import { db } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";
import { Client, Invoice } from "@prisma/client";
import { InvoiceType } from "@/types/db";

/* function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
 */

export async function getInvoices(
  search: string,
  offset: number
): Promise<{
  invoices: InvoiceType[];
  newOffset: number | null;
  totalInvoices: number;
}> {
  const session = await getAuthSession();
  if (!session?.user)
    return { invoices: [], newOffset: null, totalInvoices: 0 };
  const user = session.user;
  if (search) {
    return {
      invoices: await db.invoice.findMany({
        where: {
          creatorId: user.id,
          client: {
            email: {
              contains: search,
            },
          },
        },
        include: {
          client: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      newOffset: null,
      totalInvoices: 0,
    };
  }

  if (offset === null) {
    return { invoices: [], newOffset: null, totalInvoices: 0 };
  }

  const totalInvoices = await db.invoice.count({
    where: {
      creatorId: user.id,
    },
  });
  const moreInvoices = await db.invoice.findMany({
    where: {
      creatorId: user.id,
    },
    include: {
      client: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: offset,
    take: 5,
  });

  // Sprawdź czy są więcej stron
  const hasMorePages = offset + moreInvoices.length < totalInvoices;
  const newOffset = hasMorePages ? offset + moreInvoices.length : null;

  return {
    invoices: moreInvoices,
    newOffset,
    totalInvoices: totalInvoices,
  };
}

export async function generateUniqueInvoiceId(): Promise<{
  id: string | null;
}> {
  const session = await getAuthSession();
  if (!session?.user) return { id: null };

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");

  const invoicesThisMonth = await db.invoice.count({
    where: {
      creatorId: session.user.id,
      createdAt: {
        gte: new Date(year, currentDate.getMonth(), 1),
        lt: new Date(year, currentDate.getMonth() + 1, 1),
      },
    },
  });

  const sequentialNumber = String(invoicesThisMonth + 1).padStart(3, "0");
  const uniqueId = `${year}-${month}-${sequentialNumber}`;

  return { id: uniqueId };
}

export async function getClients(
  search: string | null,
  offset: number | null,
  getAll: boolean = false
): Promise<{
  clients: Client[];
  newOffset: number | null;
  totalClients: number;
}> {
  const session = await getAuthSession();
  if (!session?.user) return { clients: [], newOffset: null, totalClients: 0 };
  const user = session.user;

  if (getAll) {
    const clients = await db.client.findMany({
      where: {
        creatorId: user.id,
      },
    });

    return {
      clients,
      newOffset: null,
      totalClients: clients.length,
    };
  }

  if (search) {
    const clients = await db.client.findMany({
      where: {
        creatorId: user.id,
        email: {
          contains: search,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      clients,
      newOffset: null,
      totalClients: clients.length,
    };
  }

  if (offset !== null) {
    const totalClients = await db.client.count({
      where: {
        creatorId: user.id,
      },
    });

    const moreClients = await db.client.findMany({
      where: {
        creatorId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: offset,
      take: 5,
    });

    // Sprawdź czy są więcej stron
    const hasMorePages = offset + moreClients.length < totalClients;
    const newOffset = hasMorePages ? offset + moreClients.length : null;

    return {
      clients: moreClients,
      newOffset,
      totalClients: totalClients,
    };
  }

  return { clients: [], newOffset: null, totalClients: 0 };
}

export async function getAnalyticData(): Promise<{
  invoices: Invoice[];
  clients: Client[];
}> {
  const session = await getAuthSession();
  if (!session?.user) return { invoices: [], clients: [] };

  return {
    invoices: await db.invoice.findMany({
      where: {
        creatorId: session.user.id,
      },
    }),
    clients: await db.client.findMany({
      where: {
        creatorId: session.user.id,
      },
    }),
  };
}
