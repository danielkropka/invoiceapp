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

export const sumAllProducts = (products: Product[]) => {
  let sum = 0;
  products.forEach((product) => {
    sum += product.price * product.quantity * (1 + Number(product.vat) / 100);
  });

  return sum;
};

function filterByMonth<
  T extends { [K in DateKey]: Date },
  DateKey extends keyof T
>(items: T[], dateKey: DateKey, monthOffset: number): T[] {
  const currentDate = new Date();
  const targetMonth = currentDate.getMonth() + monthOffset;
  let targetYear = currentDate.getFullYear();

  if (targetMonth < 0) {
    targetYear -= 1;
  }

  const adjustedMonth = (targetMonth + 12) % 12;

  return items.filter((item) => {
    const itemDate = item[dateKey];
    return (
      itemDate.getMonth() === adjustedMonth &&
      itemDate.getFullYear() === targetYear
    );
  });
}

export const getAnalytics = (
  invoices: Invoice[],
  clients: Client[],
  analyticType: string
): { value: string; percent: number; isHigher: boolean } => {
  const invoicesOfLastMonth = filterByMonth(invoices, "issuedAt", -1);
  const invoicesOfThisMonth = filterByMonth(invoices, "issuedAt", 0);
  const bothZero =
    invoicesOfThisMonth.length === 0 && invoicesOfLastMonth.length === 0;

  const calculatePercent = (current: number, previous: number) =>
    previous === 0
      ? current > 0
        ? 100
        : 0
      : ((current - previous) / previous) * 100;

  switch (analyticType) {
    case "invoicesValue":
      const sumInvoices = (invoices: Invoice[]) =>
        invoices.reduce(
          (total, invoice) => total + sumAllProducts(invoice.products),
          0
        );
      const lastMonthSum = sumInvoices(invoicesOfLastMonth);
      const thisMonthSum = sumInvoices(invoicesOfThisMonth);

      return {
        value: `${(thisMonthSum / invoicesOfThisMonth.length || 0).toFixed(
          2
        )} PLN`,
        percent: bothZero ? 0 : calculatePercent(thisMonthSum, lastMonthSum),
        isHigher: thisMonthSum >= lastMonthSum,
      };

    case "clients":
      const clientsOfLastMonth = filterByMonth(clients, "createdAt", -1);
      const clientsOfThisMonth = filterByMonth(clients, "createdAt", 0);

      return {
        value: clientsOfThisMonth.length.toString(),
        percent: bothZero
          ? 0
          : calculatePercent(
              clientsOfThisMonth.length,
              clientsOfLastMonth.length
            ),
        isHigher: clientsOfThisMonth.length >= clientsOfLastMonth.length,
      };

    case "invoices":
      return {
        value: invoicesOfThisMonth.length.toString(),
        percent: bothZero
          ? 0
          : calculatePercent(
              invoicesOfThisMonth.length,
              invoicesOfLastMonth.length
            ),
        isHigher: invoicesOfThisMonth.length >= invoicesOfLastMonth.length,
      };

    default:
      return { value: "", percent: 0, isHigher: false };
  }
};
