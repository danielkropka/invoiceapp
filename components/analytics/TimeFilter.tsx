"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

export type TimePeriod = "month" | "quarter" | "year";

interface TimeFilterProps {
  selectedPeriod: TimePeriod;
  onPeriodChange: (period: TimePeriod) => void;
}

const periodOptions = [
  {
    value: "month" as TimePeriod,
    label: "Miesięcznie",
    description: "Porównanie z poprzednim miesiącem",
    icon: Calendar,
  },
  {
    value: "quarter" as TimePeriod,
    label: "Kwartalnie",
    description: "Porównanie z poprzednim kwartałem",
    icon: BarChart3,
  },
  {
    value: "year" as TimePeriod,
    label: "Rocznie",
    description: "Porównanie z poprzednim rokiem",
    icon: Calendar,
  },
];

export default function TimeFilter({
  selectedPeriod,
  onPeriodChange,
}: TimeFilterProps) {
  return (
    <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
            <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="font-semibold text-foreground">Okres analizy</h3>
        </div>

        <div className="flex flex-wrap gap-2">
          {periodOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = selectedPeriod === option.value;

            return (
              <Button
                key={option.value}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => onPeriodChange(option.value)}
                className={cn(
                  "flex items-center gap-2 transition-all duration-200",
                  isSelected
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800"
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{option.label}</span>
              </Button>
            );
          })}
        </div>

        <div className="mt-3 text-sm text-muted-foreground">
          {
            periodOptions.find((opt) => opt.value === selectedPeriod)
              ?.description
          }
        </div>
      </CardContent>
    </Card>
  );
}
