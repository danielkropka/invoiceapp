import React from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { clsx } from "clsx";
import { cn } from "@/lib/utils";

function Analytic({
  className,
  title,
  data,
}: {
  className?: React.ReactNode;
  title: string;
  data: {
    value: string;
    percent: number;
    isHigher: boolean;
  };
}) {
  return (
    <div className={cn("p-4 flex flex-col min-h-32", className)}>
      <h1 className="font-semibold text-lg">{title}</h1>
      <div className="flex flex-col justify-end h-full gap-2">
        <span className="font-semibold text-xl flex items-center gap-3">
          {data.value}
          <div className="flex items-center gap-1">
            <span
              className={clsx(
                "rounded-full w-5 h-5 flex items-center justify-center",
                {
                  "bg-green-200": data.isHigher,
                  "bg-red-200": !data.isHigher,
                }
              )}
            >
              {data.isHigher ? (
                <ArrowUp strokeWidth={3} className="w-4 h-4 text-green-600" />
              ) : (
                <ArrowDown strokeWidth={3} className="w-4 h-4 text-red-600" />
              )}
            </span>
            <span
              className={clsx("text-base", {
                "text-red-600": !data.isHigher,
                "text-green-600": data.isHigher,
              })}
            >
              {Math.abs(data.percent).toFixed(0)}%
            </span>
          </div>
        </span>
        <span className="text-sm text-muted-foreground">
          W porównaniu do poprzedniego miesiąca.
        </span>
      </div>
    </div>
  );
}

export default Analytic;
