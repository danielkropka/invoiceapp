import React, { Suspense } from "react";
import { buttonVariants } from "@/components/ui/button";
import { PlusCircle, FileText } from "lucide-react";

import Link from "next/link";
import { cn } from "@/lib/utils";
import InvoicesCardContent from "./(invoices)/invoicesCardContent";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Loader from "@/components/loader";

export default function Home({
  searchParams,
}: {
  searchParams: { q?: string; offset?: string };
}) {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <FileText className="w-7 h-7 text-slate-700 dark:text-slate-300" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                  Panel główny
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Zarządzaj fakturami i monitoruj swoją działalność
                </p>
              </div>
            </div>
          </div>
          <Link
            className={cn(
              "inline-flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors duration-200 shadow-sm",
              buttonVariants({ size: "lg", variant: "default" })
            )}
            href="/create"
          >
            <PlusCircle className="w-5 h-5" />
            Stwórz fakturę
          </Link>
        </div>
      </div>

      {/* Invoices Section */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 shadow-sm">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <FileText className="w-6 h-6 text-slate-700 dark:text-slate-300" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Twoje faktury
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400 mt-1">
                Zarządzaj swoimi wystawionymi fakturami - edytuj, usuwaj i twórz
                nowe faktury.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <Suspense
          fallback={
            <CardContent className="py-12">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full">
                  <Loader />
                </div>
                <div className="text-center">
                  <p className="text-slate-600 dark:text-slate-400 font-medium">
                    Ładowanie faktur...
                  </p>
                </div>
              </div>
            </CardContent>
          }
        >
          <InvoicesCardContent searchParams={searchParams} />
        </Suspense>
      </Card>
    </div>
  );
}
