import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAnalyticData } from "@/lib/db";
import Analytic from "@/app/(dashboard)/(analytic)/analytic";
import { getAnalytics } from "@/lib/utils";
import { TrendingUp, BarChart3 } from "lucide-react";

async function Analytics() {
  const { invoices, clients } = await getAnalyticData();

  return (
    <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
            <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold">
              Analiza i statystyki
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Monitoruj wydajność i trendy w swojej działalności
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              label: "Nowe faktury",
              value: "invoices",
              icon: TrendingUp,
              color: "blue",
            },
            {
              label: "Nowi klienci",
              value: "clients",
              icon: TrendingUp,
              color: "green",
            },
            {
              label: "Średnia wartość faktur",
              value: "invoicesValue",
              icon: TrendingUp,
              color: "purple",
            },
          ].map((analytic) => (
            <Analytic
              className="border-0 shadow-md hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 rounded-xl p-6"
              title={analytic.label}
              key={analytic.value}
              data={getAnalytics(invoices, clients, analytic.value)}
              icon={analytic.icon}
              color={analytic.color}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default Analytics;
