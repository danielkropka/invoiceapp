import React, { Suspense } from "react";
import { buttonVariants } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Analytics from "@/app/(dashboard)/(analytic)/analytics";
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
  searchParams: { q: string; offset: string };
}) {
  return (
    <>
      <div className="flex items-center ml-auto">
        <Link className={cn("gap-1", buttonVariants())} href="/create">
          <PlusCircle className="w-4 h-4" />
          <span className="sr-only md:not-sr-only sm:whitespace-nowrap">
            Stwórz fakturę
          </span>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Twoje faktury</CardTitle>
          <CardDescription>
            Zarządzaj swoimi wystawionymi fakturami - edytuj, usuwaj i twórz
            nowe faktury.
          </CardDescription>
        </CardHeader>
        <Suspense
          fallback={
            <CardContent>
              <Loader />
            </CardContent>
          }
        >
          <InvoicesCardContent searchParams={searchParams} />
        </Suspense>
      </Card>
      <Analytics />
    </>
  );
}
