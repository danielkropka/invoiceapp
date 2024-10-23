import React, { Suspense } from "react";
import { PlusCircle } from "lucide-react";
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
  searchParams: { q: string; offset: string };
}) {
  return (
    <>
      <div className="flex items-center ml-auto">
        <Link href="/clients/create" className={cn("gap-1", buttonVariants())}>
          <PlusCircle className="w-4 h-4" />
          <span className="sr-only md:not-sr-only sm:whitespace-nowrap">
            Stwórz klienta
          </span>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Twoi klienci</CardTitle>
          <CardDescription>
            Zarządzaj swoimi klientami - edytuj, usuwaj i twórz nowych klientów.
          </CardDescription>
        </CardHeader>
        <Suspense
          fallback={
            <CardContent>
              <Loader />
            </CardContent>
          }
        >
          <ClientsCardContent searchParams={searchParams} />
        </Suspense>
      </Card>
    </>
  );
}
