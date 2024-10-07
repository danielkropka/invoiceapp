import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Invoice, Product } from "@prisma/client";
import { getAnalyticData } from "@/lib/db";
import Analytic from "@/app/(dashboard)/settings/analytic";

async function Analytics() {
  const { invoices, clients } = await getAnalyticData();
  const sumAllProducts = (products: Product[]) => {
    let sum = 0;
    products.forEach((product) => {
      sum += product.price * product.quantity * (1 + product.vat / 100);
    });

    return sum;
  };

  const getAnalytics = (
    analyticType: string,
  ): { value: string; percent: number; isHigher: boolean | undefined } => {
    const currentDate = new Date();
    const invoicesOfLastMonth: Invoice[] = invoices.filter(
      (invoice) => invoice.issuedAt.getMonth() === currentDate.getMonth() - 1,
    );
    const invoicesOfThisMonth: Invoice[] = invoices.filter(
      (invoice) => invoice.issuedAt.getMonth() === currentDate.getMonth(),
    );
    switch (analyticType) {
      case "invoicesValue":
        let sumInvoicesOfLastMonth = 0;
        invoicesOfLastMonth.forEach(
          (invoice) =>
            (sumInvoicesOfLastMonth += sumAllProducts(invoice.products)),
        );
        let sumInvoicesOfThisMonth = 0;
        invoicesOfThisMonth.forEach(
          (invoice) =>
            (sumInvoicesOfThisMonth += sumAllProducts(invoice.products)),
        );

        return {
          isHigher: sumInvoicesOfThisMonth > sumInvoicesOfLastMonth,
          percent:
            sumInvoicesOfLastMonth === 0
              ? 100
              : ((sumInvoicesOfThisMonth - sumInvoicesOfLastMonth) /
                  sumInvoicesOfLastMonth) *
                100,
          value: `${(sumInvoicesOfThisMonth / invoicesOfThisMonth.length).toFixed(2)} PLN`,
        };
      case "clients":
        const clientsOfLastMonth = clients.filter(
          (client) =>
            client.createdAt.getMonth() === currentDate.getMonth() - 1,
        );
        const clientsOfThisMonth = clients.filter(
          (client) => client.createdAt.getMonth() === currentDate.getMonth(),
        );
        return {
          value: clientsOfThisMonth.length.toString(),
          percent:
            clientsOfLastMonth.length === 0
              ? 100
              : ((clientsOfThisMonth.length - clientsOfLastMonth.length) /
                  clientsOfLastMonth.length) *
                100,
          isHigher: clientsOfThisMonth > clientsOfLastMonth,
        };
      case "invoices":
        return {
          value: invoicesOfThisMonth.length.toString(),
          percent:
            invoicesOfLastMonth.length === 0
              ? 100
              : ((invoicesOfThisMonth.length - invoicesOfLastMonth.length) /
                  invoicesOfLastMonth.length) *
                100,
          isHigher: invoicesOfThisMonth > invoicesOfLastMonth,
        };
      default:
        return { value: "", percent: 0, isHigher: undefined };
    }
  };

  const analytics = [
    {
      label: "Nowe faktury",
      value: "invoices",
    },
    {
      label: "Nowi klienci",
      value: "clients",
    },
    {
      label: "Średnia wartość faktur",
      value: "invoicesValue",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Podsumowanie</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid border rounded-lg grid-cols-1 md:grid-cols-3">
          {analytics.map((analytic) => (
            <Analytic
              className={
                "border-b last:border-b-0 md:border-b-0 md:border-r last:md:border-r-0"
              }
              title={analytic.label}
              key={analytic.value}
              data={getAnalytics(analytic.value)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default Analytics;
