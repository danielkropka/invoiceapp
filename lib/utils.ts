import { Client, Invoice, Product } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getInvoiceTemplate = async () => {
  const componentName = `invoiceTemplate`;
  try {
    const _module = await import(`@/components/templates/${componentName}`);
    return _module.default;
  } catch (err) {
    console.error(`Error importing template ${componentName}: ${err}`);

    return null;
  }
};

export const sumAllProducts = (
  products: Product[],
  exemptTax: boolean = false
) => {
  let sum = 0;
  products.forEach((product) => {
    sum += exemptTax
      ? product.price * product.quantity
      : product.price * product.quantity * (1 + Number(product.vat) / 100);
  });

  return sum;
};

// Funkcja pomocnicza do filtrowania danych według okresu
function filterByPeriod<
  T extends { [K in DateKey]: Date },
  DateKey extends keyof T
>(
  items: T[],
  dateKey: DateKey,
  period: "month" | "quarter" | "year",
  offset: number = 0
): T[] {
  const currentDate = new Date();
  const targetDate = new Date(currentDate);

  switch (period) {
    case "month":
      targetDate.setMonth(currentDate.getMonth() + offset);
      break;
    case "quarter":
      targetDate.setMonth(currentDate.getMonth() + offset * 3);
      break;
    case "year":
      targetDate.setFullYear(currentDate.getFullYear() + offset);
      break;
  }

  return items.filter((item) => {
    const itemDate = item[dateKey];
    const itemYear = itemDate.getFullYear();
    const itemMonth = itemDate.getMonth();
    const targetYear = targetDate.getFullYear();
    const targetMonth = targetDate.getMonth();

    switch (period) {
      case "month":
        return itemYear === targetYear && itemMonth === targetMonth;
      case "quarter":
        const itemQuarter = Math.floor(itemMonth / 3);
        const targetQuarter = Math.floor(targetMonth / 3);
        return itemYear === targetYear && itemQuarter === targetQuarter;
      case "year":
        return itemYear === targetYear;
      default:
        return false;
    }
  });
}

export const getAnalytics = (
  invoices: (Omit<Invoice, "file"> & { client: Client })[],
  clients: Client[],
  analyticType: string,
  period: "month" | "quarter" | "year" = "month"
): {
  value: string;
  percent: number;
  isHigher: boolean;
  additionalInfo?: string;
} => {
  const invoicesOfLastPeriod = filterByPeriod(invoices, "issuedAt", period, -1);
  const invoicesOfThisPeriod = filterByPeriod(invoices, "issuedAt", period, 0);
  const bothZero =
    invoicesOfThisPeriod.length === 0 && invoicesOfLastPeriod.length === 0;

  const calculatePercent = (current: number, previous: number) =>
    previous === 0
      ? current > 0
        ? 100
        : 0
      : ((current - previous) / previous) * 100;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  switch (analyticType) {
    case "invoicesValue":
      const sumInvoices = (
        invoices: (Omit<Invoice, "file"> & { client: Client })[]
      ) =>
        invoices.reduce(
          (total, invoice) => total + sumAllProducts(invoice.products),
          0
        );
      const lastPeriodSum = sumInvoices(invoicesOfLastPeriod);
      const thisPeriodSum = sumInvoices(invoicesOfThisPeriod);
      const averageValue =
        invoicesOfThisPeriod.length > 0
          ? thisPeriodSum / invoicesOfThisPeriod.length
          : 0;

      return {
        value: formatCurrency(averageValue),
        percent: bothZero ? 0 : calculatePercent(thisPeriodSum, lastPeriodSum),
        isHigher: thisPeriodSum >= lastPeriodSum,
        additionalInfo: `Łącznie: ${formatCurrency(thisPeriodSum)}`,
      };

    case "totalRevenue":
      const sumInvoicesTotal = (
        invoices: (Omit<Invoice, "file"> & { client: Client })[]
      ) =>
        invoices.reduce(
          (total, invoice) => total + sumAllProducts(invoice.products),
          0
        );
      const lastPeriodRevenue = sumInvoicesTotal(invoicesOfLastPeriod);
      const thisPeriodRevenue = sumInvoicesTotal(invoicesOfThisPeriod);

      return {
        value: formatCurrency(thisPeriodRevenue),
        percent: bothZero
          ? 0
          : calculatePercent(thisPeriodRevenue, lastPeriodRevenue),
        isHigher: thisPeriodRevenue >= lastPeriodRevenue,
        additionalInfo: `${invoicesOfThisPeriod.length} faktur`,
      };

    case "clients":
      const clientsOfLastPeriod = filterByPeriod(
        clients,
        "createdAt",
        period,
        -1
      );
      const clientsOfThisPeriod = filterByPeriod(
        clients,
        "createdAt",
        period,
        0
      );

      return {
        value: clientsOfThisPeriod.length.toString(),
        percent: bothZero
          ? 0
          : calculatePercent(
              clientsOfThisPeriod.length,
              clientsOfLastPeriod.length
            ),
        isHigher: clientsOfThisPeriod.length >= clientsOfLastPeriod.length,
        additionalInfo: `Łącznie: ${clients.length} klientów`,
      };

    case "invoices":
      return {
        value: invoicesOfThisPeriod.length.toString(),
        percent: bothZero
          ? 0
          : calculatePercent(
              invoicesOfThisPeriod.length,
              invoicesOfLastPeriod.length
            ),
        isHigher: invoicesOfThisPeriod.length >= invoicesOfLastPeriod.length,
        additionalInfo: `Łącznie: ${invoices.length} faktur`,
      };

    case "paidInvoices":
      const paidInvoicesThisPeriod = invoicesOfThisPeriod.filter(
        (invoice) => invoice.status === "PAID"
      );
      const paidInvoicesLastPeriod = invoicesOfLastPeriod.filter(
        (invoice) => invoice.status === "PAID"
      );

      return {
        value: paidInvoicesThisPeriod.length.toString(),
        percent: bothZero
          ? 0
          : calculatePercent(
              paidInvoicesThisPeriod.length,
              paidInvoicesLastPeriod.length
            ),
        isHigher:
          paidInvoicesThisPeriod.length >= paidInvoicesLastPeriod.length,
        additionalInfo: `${(
          (paidInvoicesThisPeriod.length / invoicesOfThisPeriod.length) * 100 ||
          0
        ).toFixed(1)}% opłaconych`,
      };

    case "pendingInvoices":
      const pendingInvoicesThisPeriod = invoicesOfThisPeriod.filter(
        (invoice) => invoice.status === "PENDING"
      );
      const pendingInvoicesLastPeriod = invoicesOfLastPeriod.filter(
        (invoice) => invoice.status === "PENDING"
      );

      return {
        value: pendingInvoicesThisPeriod.length.toString(),
        percent: bothZero
          ? 0
          : calculatePercent(
              pendingInvoicesThisPeriod.length,
              pendingInvoicesLastPeriod.length
            ),
        isHigher:
          pendingInvoicesThisPeriod.length >= pendingInvoicesLastPeriod.length,
        additionalInfo: `Wartość: ${formatCurrency(
          pendingInvoicesThisPeriod.reduce(
            (sum, invoice) => sum + sumAllProducts(invoice.products),
            0
          )
        )}`,
      };

    case "unpaidInvoices":
      const unpaidInvoicesThisPeriod = invoicesOfThisPeriod.filter(
        (invoice) => invoice.status === "UNPAID"
      );
      const unpaidInvoicesLastPeriod = invoicesOfLastPeriod.filter(
        (invoice) => invoice.status === "UNPAID"
      );

      return {
        value: unpaidInvoicesThisPeriod.length.toString(),
        percent: bothZero
          ? 0
          : calculatePercent(
              unpaidInvoicesThisPeriod.length,
              unpaidInvoicesLastPeriod.length
            ),
        isHigher:
          unpaidInvoicesThisPeriod.length >= unpaidInvoicesLastPeriod.length,
        additionalInfo: `Wartość: ${formatCurrency(
          unpaidInvoicesThisPeriod.reduce(
            (sum, invoice) => sum + sumAllProducts(invoice.products),
            0
          )
        )}`,
      };

    default:
      return { value: "", percent: 0, isHigher: false };
  }
};
