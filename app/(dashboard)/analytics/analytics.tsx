"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Analytic from "@/app/(dashboard)/analytics/analytic";
import { getAnalytics } from "@/lib/utils";
import RevenueChart from "@/components/analytics/RevenueChart";
import InvoiceStatusChart from "@/components/analytics/InvoiceStatusChart";
import TimeFilter, { TimePeriod } from "@/components/analytics/TimeFilter";
import {
  TrendingUp,
  BarChart3,
  DollarSign,
  Users,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

interface AnalyticsProps {
  invoices: any[];
  clients: any[];
}

function Analytics({ invoices, clients }: AnalyticsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("month");

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
        <div className="space-y-8">
          {/* Filtr czasowy */}
          <TimeFilter
            selectedPeriod={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
          />

          {/* Główne statystyki */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              Przegląd{" "}
              {selectedPeriod === "month"
                ? "miesięczny"
                : selectedPeriod === "quarter"
                ? "kwartalny"
                : "roczny"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  label: "Nowe faktury",
                  value: "invoices",
                  icon: FileText,
                  color: "blue",
                },
                {
                  label: "Nowi klienci",
                  value: "clients",
                  icon: Users,
                  color: "green",
                },
                {
                  label: "Całkowite przychody",
                  value: "totalRevenue",
                  icon: DollarSign,
                  color: "purple",
                },
                {
                  label: "Średnia wartość faktur",
                  value: "invoicesValue",
                  icon: TrendingUp,
                  color: "blue",
                },
              ].map((analytic) => (
                <Analytic
                  className="border-0 shadow-md hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 rounded-xl p-4"
                  title={analytic.label}
                  key={analytic.value}
                  data={getAnalytics(
                    invoices,
                    clients,
                    analytic.value,
                    selectedPeriod
                  )}
                  icon={analytic.icon}
                  color={analytic.color}
                  period={selectedPeriod}
                />
              ))}
            </div>
          </div>

          {/* Statusy faktur */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              Statusy faktur
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  label: "Opłacone faktury",
                  value: "paidInvoices",
                  icon: CheckCircle,
                  color: "green",
                },
                {
                  label: "Faktury oczekujące",
                  value: "pendingInvoices",
                  icon: Clock,
                  color: "blue",
                },
                {
                  label: "Nieopłacone faktury",
                  value: "unpaidInvoices",
                  icon: XCircle,
                  color: "red",
                },
              ].map((analytic) => (
                <Analytic
                  className="border-0 shadow-md hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 rounded-xl p-4"
                  title={analytic.label}
                  key={analytic.value}
                  data={getAnalytics(
                    invoices,
                    clients,
                    analytic.value,
                    selectedPeriod
                  )}
                  icon={analytic.icon}
                  color={analytic.color}
                  period={selectedPeriod}
                />
              ))}
            </div>
          </div>

          {/* Wykresy */}
          <div className="space-y-6">
            <RevenueChart invoices={invoices} period={selectedPeriod} />
            <InvoiceStatusChart invoices={invoices} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default Analytics;
