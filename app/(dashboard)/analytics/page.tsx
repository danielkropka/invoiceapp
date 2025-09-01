import React, { Suspense } from "react";
import AnalyticsWrapper from "./analytics-wrapper";
import Loader from "@/components/loader";

export default function AnalyticsPage() {
  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center space-y-4 py-12">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-full">
              <Loader />
            </div>
            <div className="text-center">
              <p className="text-slate-600 dark:text-slate-400 font-medium">
                Ładowanie analityki...
              </p>
            </div>
          </div>
        }
      >
        <AnalyticsWrapper />
      </Suspense>
    </div>
  );
}
