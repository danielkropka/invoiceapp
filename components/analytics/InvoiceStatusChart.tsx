"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, PieChart as PieChartIcon } from "lucide-react";

interface InvoiceStatusChartProps {
  invoices: Array<{
    status: string | null;
    issuedAt: Date;
    products: Array<{
      price: number;
      quantity: number;
      vat: string | null;
    }>;
  }>;
}

interface StatusData {
  status: string;
  count: number;
  revenue: number;
  color: string;
}

const STATUS_COLORS = {
  PAID: "#10b981",
  PENDING: "#f59e0b",
  UNPAID: "#ef4444",
  null: "#6b7280",
};

const STATUS_LABELS = {
  PAID: "Opłacone",
  PENDING: "Oczekujące",
  UNPAID: "Nieopłacone",
  null: "Brak statusu",
};

export default function InvoiceStatusChart({
  invoices,
}: InvoiceStatusChartProps) {
  const statusData = React.useMemo(() => {
    const dataMap = new Map<string, { count: number; revenue: number }>();

    invoices.forEach((invoice) => {
      const status = invoice.status || "null";
      const total = invoice.products.reduce((sum, product) => {
        return (
          sum +
          product.price *
            product.quantity *
            (1 + Number(product.vat || 0) / 100)
        );
      }, 0);

      if (dataMap.has(status)) {
        const existing = dataMap.get(status)!;
        existing.count += 1;
        existing.revenue += total;
      } else {
        dataMap.set(status, { count: 1, revenue: total });
      }
    });

    const chartData: StatusData[] = Array.from(dataMap.entries())
      .map(([status, data]) => ({
        status: STATUS_LABELS[status as keyof typeof STATUS_LABELS],
        count: data.count,
        revenue: Math.round(data.revenue * 100) / 100,
        color: STATUS_COLORS[status as keyof typeof STATUS_COLORS],
      }))
      .sort((a, b) => b.count - a.count);

    return chartData;
  }, [invoices]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pl-PL", {
      style: "currency",
      currency: "PLN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (statusData.length === 0) {
    return (
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
              <BarChart3 className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold">
                Statusy faktur
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Wykres słupkowy */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
              <BarChart3 className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">
                Liczba faktur według statusu
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Porównanie ilości faktur
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="status"
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                />
                <YAxis className="text-xs" tick={{ fontSize: 12 }} />
                <Tooltip
                  content={(props: any) => {
                    const { active, payload, label } = props;
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 shadow-lg">
                          <p className="font-medium text-foreground mb-2">
                            {String(label)}
                          </p>
                          <p
                            className="text-sm"
                            style={{ color: payload[0]?.color }}
                          >
                            Liczba: {payload[0]?.value}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Wykres kołowy */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
              <PieChartIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">
                Rozkład statusów
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Procentowy udział statusów
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({
                    name,
                    percent,
                  }: {
                    name: string;
                    percent?: number;
                  }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={(props: any) => {
                    const { active, payload } = props;
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 shadow-lg">
                          <p className="font-medium text-foreground mb-2">
                            {data.status}
                          </p>
                          <p className="text-sm">Liczba: {data.count}</p>
                          <p className="text-sm">
                            Wartość: {formatCurrency(data.revenue)}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
