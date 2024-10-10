import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAnalyticData } from "@/lib/db";
import Analytic from "@/app/(dashboard)/analytic";
import { getAnalytics } from "@/lib/utils";

async function Analytics() {
  const { invoices, clients } = await getAnalyticData();

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
              data={getAnalytics(invoices, clients, analytic.value)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default Analytics;
