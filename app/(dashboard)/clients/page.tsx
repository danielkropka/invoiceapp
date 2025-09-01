import React, { Suspense } from "react";
import { PlusCircle, Users } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Loader from "@/components/loader";
import ClientsCardContent from "./clientsCardContent";

export default async function Clients({
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
                <Users className="w-7 h-7 text-slate-700 dark:text-slate-300" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                  Klienci
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Zarządzaj swoimi klientami i ich danymi
                </p>
              </div>
            </div>
          </div>
          <Link
            className={cn(
              "inline-flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors duration-200 shadow-sm",
              buttonVariants({ size: "lg", variant: "default" })
            )}
            href="/clients/create"
          >
            <PlusCircle className="w-5 h-5" />
            Stwórz klienta
          </Link>
        </div>
      </div>

      {/* Clients Section */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 shadow-sm">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <Users className="w-6 h-6 text-slate-700 dark:text-slate-300" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Twoi klienci
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400 mt-1">
                Zarządzaj swoimi klientami - edytuj, usuwaj i twórz nowych
                klientów.
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
                    Ładowanie klientów...
                  </p>
                </div>
              </div>
            </CardContent>
          }
        >
          <ClientsCardContent searchParams={searchParams} />
        </Suspense>
      </Card>
    </div>
  );
}
