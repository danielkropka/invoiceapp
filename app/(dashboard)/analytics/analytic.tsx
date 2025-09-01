import React from "react";
import { ArrowDown, ArrowUp, TrendingUp } from "lucide-react";
import { clsx } from "clsx";
import { cn } from "@/lib/utils";

function Analytic({
  className,
  title,
  data,
  icon: Icon = TrendingUp,
  color = "blue",
  period = "month",
}: {
  className?: React.ReactNode;
  title: string;
  data: {
    value: string;
    percent: number;
    isHigher: boolean;
    additionalInfo?: string;
  };
  icon?: React.ComponentType<{ className?: string }>;
  color?: string;
  period?: "month" | "quarter" | "year";
}) {
  const colorClasses = {
    blue: {
      bg: "bg-blue-100 dark:bg-blue-900/50",
      text: "text-blue-600 dark:text-blue-400",
      iconBg: "bg-blue-50 dark:bg-blue-950/50",
    },
    green: {
      bg: "bg-green-100 dark:bg-green-900/50",
      text: "text-green-600 dark:text-green-400",
      iconBg: "bg-green-50 dark:bg-green-950/50",
    },
    purple: {
      bg: "bg-purple-100 dark:bg-purple-900/50",
      text: "text-purple-600 dark:text-purple-400",
      iconBg: "bg-purple-50 dark:bg-purple-950/50",
    },
    red: {
      bg: "bg-red-100 dark:bg-red-900/50",
      text: "text-red-600 dark:text-red-400",
      iconBg: "bg-red-50 dark:bg-red-950/50",
    },
  };

  const currentColor =
    colorClasses[color as keyof typeof colorClasses] || colorClasses.blue;

  return (
    <div className={cn("flex flex-col min-h-32", className)}>
      <div className="flex items-center gap-3 mb-4">
        <div className={cn("p-2 rounded-lg", currentColor.iconBg)}>
          <Icon className={cn("w-5 h-5", currentColor.text)} />
        </div>
        <h3 className="font-semibold text-lg text-foreground">{title}</h3>
      </div>

      <div className="flex flex-col justify-end h-full gap-3">
        <div className="flex items-center justify-between">
          <span className={cn("font-bold text-2xl", currentColor.text)}>
            {data.value}
          </span>
          <div className="flex items-center gap-2">
            <div
              className={clsx(
                "rounded-full w-8 h-8 flex items-center justify-center transition-all duration-200",
                {
                  "bg-green-100 dark:bg-green-900/50": data.isHigher,
                  "bg-red-100 dark:bg-red-900/50": !data.isHigher,
                }
              )}
            >
              {data.isHigher ? (
                <ArrowUp
                  strokeWidth={2.5}
                  className="w-4 h-4 text-green-600 dark:text-green-400"
                />
              ) : (
                <ArrowDown
                  strokeWidth={2.5}
                  className="w-4 h-4 text-red-600 dark:text-red-400"
                />
              )}
            </div>
            <span
              className={clsx("text-sm font-medium", {
                "text-red-600 dark:text-red-400": !data.isHigher,
                "text-green-600 dark:text-green-400": data.isHigher,
              })}
            >
              {Math.abs(data.percent).toFixed(0)}%
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div
              className={cn("w-2 h-2 rounded-full", {
                "bg-green-500": data.isHigher,
                "bg-red-500": !data.isHigher,
              })}
            />
            <span>
              {data.isHigher ? "Wzrost" : "Spadek"} w porównaniu do poprzedniego{" "}
              {period === "month"
                ? "miesiąca"
                : period === "quarter"
                ? "kwartału"
                : "roku"}
            </span>
          </div>
          {data.additionalInfo && (
            <div className="text-xs text-muted-foreground/80 bg-muted/50 rounded-md px-2 py-1">
              {data.additionalInfo}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Analytic;
