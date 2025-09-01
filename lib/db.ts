import "server-only";

import { db } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";
import { Client, Invoice } from "@prisma/client";
import { InvoiceType } from "@/types/db";
import {
  getCachedInvoices,
  setCachedInvoices,
  getCachedClients,
  setCachedClients,
  getCachedAnalytics,
  setCachedAnalytics,
  invalidateUserCache,
} from "@/lib/cache";

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

  // Sprawdź cache
  const cached = getCachedInvoices(user.id, search, offset);
  if (cached) {
    return cached as {
      invoices: InvoiceType[];
      newOffset: number | null;
      totalInvoices: number;
    };
  }

  let result: {
    invoices: InvoiceType[];
    newOffset: number | null;
    totalInvoices: number;
  };

  if (search) {
    const invoices = await db.invoice.findMany({
      where: {
        creatorId: user.id,
        client: {
          email: {
            contains: search,
            mode: "insensitive",
          },
        },
      },
      select: {
        id: true,
        token: true,
        invoiceId: true,
        status: true,
        paymentMethod: true,
        exemptTax: true,
        issuedAt: true,
        soldAt: true,
        createdAt: true,
        updatedAt: true,
        creatorId: true,
        clientId: true,
        fileBase64: true,
        fileName: true,
        contentType: true,
        products: true,
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
            address: true,
            taxIdNumber: true,
            createdAt: true,
            creatorId: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50, // Limit wyników wyszukiwania
    });

    result = {
      invoices,
      newOffset: null,
      totalInvoices: invoices.length,
    };
  } else if (offset === null) {
    result = { invoices: [], newOffset: null, totalInvoices: 0 };
  } else {
    // Równoległe zapytania dla lepszej wydajności
    const [totalInvoices, moreInvoices] = await Promise.all([
      db.invoice.count({
        where: {
          creatorId: user.id,
        },
      }),
      db.invoice.findMany({
        where: {
          creatorId: user.id,
        },
        select: {
          id: true,
          token: true,
          invoiceId: true,
          status: true,
          paymentMethod: true,
          exemptTax: true,
          issuedAt: true,
          soldAt: true,
          createdAt: true,
          updatedAt: true,
          creatorId: true,
          clientId: true,
          file: true,
          fileBase64: true,
          fileName: true,
          contentType: true,
          products: true,
          client: {
            select: {
              id: true,
              name: true,
              email: true,
              phoneNumber: true,
              address: true,
              taxIdNumber: true,
              createdAt: true,
              creatorId: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: offset,
        take: 10, // Zwiększamy limit na stronę dla lepszej wydajności
      }),
    ]);

    // Sprawdź czy są więcej stron
    const hasMorePages = offset + moreInvoices.length < totalInvoices;
    const newOffset = hasMorePages ? offset + moreInvoices.length : null;

    result = {
      invoices: moreInvoices,
      newOffset,
      totalInvoices,
    };
  }

  // Zapisz w cache
  setCachedInvoices(user.id, search, offset, result);

  return result;
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

  // Sprawdź cache
  const cached = getCachedClients(user.id, search, offset, getAll);
  if (cached) {
    return cached as {
      clients: Client[];
      newOffset: number | null;
      totalClients: number;
    };
  }

  let result: {
    clients: Client[];
    newOffset: number | null;
    totalClients: number;
  };

  if (getAll) {
    const clients = await db.client.findMany({
      where: {
        creatorId: user.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        address: true,
        taxIdNumber: true,
        createdAt: true,
        creatorId: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    result = {
      clients,
      newOffset: null,
      totalClients: clients.length,
    };
  } else if (search) {
    const clients = await db.client.findMany({
      where: {
        creatorId: user.id,
        email: {
          contains: search,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        address: true,
        taxIdNumber: true,
        createdAt: true,
        creatorId: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50, // Limit wyników wyszukiwania
    });

    result = {
      clients,
      newOffset: null,
      totalClients: clients.length,
    };
  } else if (offset !== null) {
    // Równoległe zapytania dla lepszej wydajności
    const [totalClients, moreClients] = await Promise.all([
      db.client.count({
        where: {
          creatorId: user.id,
        },
      }),
      db.client.findMany({
        where: {
          creatorId: user.id,
        },
        select: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true,
          address: true,
          taxIdNumber: true,
          createdAt: true,
          creatorId: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: offset,
        take: 10, // Zwiększamy limit na stronę
      }),
    ]);

    // Sprawdź czy są więcej stron
    const hasMorePages = offset + moreClients.length < totalClients;
    const newOffset = hasMorePages ? offset + moreClients.length : null;

    result = {
      clients: moreClients,
      newOffset,
      totalClients,
    };
  } else {
    result = { clients: [], newOffset: null, totalClients: 0 };
  }

  // Zapisz w cache
  setCachedClients(user.id, search, offset, getAll, result);

  return result;
}

export async function getAnalyticData(): Promise<{
  invoices: Omit<Invoice, "file">[];
  clients: Client[];
}> {
  const session = await getAuthSession();
  if (!session?.user) return { invoices: [], clients: [] };

  // Sprawdź cache
  const cached = getCachedAnalytics(session.user.id);
  if (cached) {
    return cached as {
      invoices: Omit<Invoice, "file">[];
      clients: Client[];
    };
  }

  // Równoległe zapytania dla lepszej wydajności
  const [invoices, clients] = await Promise.all([
    // Pobierz faktury z klientami (bez pola file)
    db.invoice.findMany({
      where: {
        creatorId: session.user.id,
      },
      select: {
        id: true,
        token: true,
        invoiceId: true,
        status: true,
        paymentMethod: true,
        exemptTax: true,
        issuedAt: true,
        soldAt: true,
        createdAt: true,
        updatedAt: true,
        creatorId: true,
        clientId: true,
        fileBase64: true,
        fileName: true,
        contentType: true,
        products: true,
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
            address: true,
            taxIdNumber: true,
            createdAt: true,
            creatorId: true,
          },
        },
      },
      orderBy: {
        issuedAt: "desc",
      },
    }),
    // Pobierz klientów
    db.client.findMany({
      where: {
        creatorId: session.user.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        address: true,
        taxIdNumber: true,
        createdAt: true,
        creatorId: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  const result = { invoices, clients };

  // Zapisz w cache
  setCachedAnalytics(session.user.id, result);

  return result;
}
