"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipContentProps,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { TooltipPayloadEntry } from "recharts/types/state/tooltipSlice";

interface RevenueChartProps {
  invoices: Array<{
    issuedAt: Date;
    products: Array<{
      price: number;
      quantity: number;
      vat: string | null;
    }>;
  }>;
  period?: "month" | "quarter" | "year";
}

interface ChartData {
  month: string;
  revenue: number;
  invoices: number;
}

export default function RevenueChart({
  invoices,
  period = "month",
}: RevenueChartProps) {
  // Grupuj faktury według wybranego okresu
  const chartData = React.useMemo(() => {
    const dataMap = new Map<string, { revenue: number; invoices: number }>();

    invoices.forEach((invoice) => {
      const date = new Date(invoice.issuedAt);
      let periodKey: string;

      switch (period) {
        case "quarter":
          const quarter = Math.floor(date.getMonth() / 3) + 1;
          periodKey = `${date.getFullYear()}-Q${quarter}`;
          break;
        case "year":
          periodKey = `${date.getFullYear()}`;
          break;
        default: // month
          periodKey = `${date.getFullYear()}-${String(
            date.getMonth() + 1
          ).padStart(2, "0")}`;
      }

      const total = invoice.products.reduce((sum, product) => {
        return (
          sum +
          product.price *
            product.quantity *
            (1 + Number(product.vat || 0) / 100)
        );
      }, 0);

      if (dataMap.has(periodKey)) {
        const existing = dataMap.get(periodKey)!;
        existing.revenue += total;
        existing.invoices += 1;
      } else {
        dataMap.set(periodKey, { revenue: total, invoices: 1 });
      }
    });

    // Konwertuj na tablicę i posortuj
    const result: ChartData[] = Array.from(dataMap.entries())
      .map(([key, data]) => {
        let periodName: string;

        switch (period) {
          case "quarter":
            const [quarterYear, quarter] = key.split("-Q");
            periodName = `Q${quarter} ${quarterYear}`;
            break;
          case "year":
            periodName = key;
            break;
          default: // month
            const [monthYear, month] = key.split("-");
            const date = new Date(parseInt(monthYear), parseInt(month) - 1);
            periodName = date.toLocaleDateString("pl-PL", {
              month: "short",
              year: "numeric",
            });
        }

        return {
          month: periodName,
          revenue: Math.round(data.revenue * 100) / 100,
          invoices: data.invoices,
        };
      })
      .sort((a, b) => {
        // Sortowanie według klucza okresu
        const aKey =
          Array.from(dataMap.keys()).find((key) => {
            const data = dataMap.get(key)!;
            return data.revenue === a.revenue && data.invoices === a.invoices;
          }) || "";
        const bKey =
          Array.from(dataMap.keys()).find((key) => {
            const data = dataMap.get(key)!;
            return data.revenue === b.revenue && data.invoices === b.invoices;
          }) || "";
        return aKey.localeCompare(bKey);
      });

    return result;
  }, [invoices, period]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (chartData.length === 0) {
    return (
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold">
                Trendy przychodów
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Brak danych do wyświetlenia
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            <p>Nie ma wystarczająco danych do wyświetlenia wykresu</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold">
              Trendy przychodów
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Przychody i liczba faktur w czasie
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="month"
                className="text-xs"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                yAxisId="revenue"
                orientation="left"
                className="text-xs"
                tick={{ fontSize: 12 }}
                tickFormatter={formatCurrency}
              />
              <YAxis
                yAxisId="invoices"
                orientation="right"
                className="text-xs"
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                content={(props: TooltipContentProps<number, string>) => {
                  const { active, payload, label } = props;
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 shadow-lg">
                        <p className="font-medium text-foreground mb-2">
                          {String(label)}
                        </p>
                        {payload.map(
                          (entry: TooltipPayloadEntry, index: number) => (
                            <p
                              key={index}
                              className="text-sm"
                              style={{ color: entry.color }}
                            >
                              {entry.name}:{" "}
                              {entry.name === "Przychody"
                                ? formatCurrency(entry.value as number)
                                : entry.value}
                            </p>
                          )
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                yAxisId="revenue"
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                name="Przychody"
              />
              <Line
                yAxisId="invoices"
                type="monotone"
                dataKey="invoices"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                name="Faktury"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
