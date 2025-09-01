import InvoicesTable from "./invoicesTable";
import { CardContent } from "@/components/ui/card";
import Pagination from "../../../components/pagination";
import { getInvoices } from "@/lib/db";
import { FileText, PlusCircle } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function InvoicesCardContent({
  searchParams,
}: {
  searchParams: { q?: string; offset?: string };
}) {
  const search = searchParams.q ?? "";
  const offsetParam = searchParams.offset;
  const offset =
    offsetParam && !isNaN(Number(offsetParam)) ? Number(offsetParam) : 0;

  const { invoices, totalInvoices } = await getInvoices(search, offset);

  return (
    <>
      <CardContent className="p-0">
        {invoices.length === 0 ? (
          <div className="text-center py-16 px-6">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
              <FileText className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Brak faktur</h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              Nie masz jeszcze żadnych faktur. Stwórz pierwszą fakturę, aby
              rozpocząć zarządzanie swoją działalnością.
            </p>
            <Link
              href="/create"
              className={cn(
                "inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white",
                buttonVariants({ size: "lg" })
              )}
            >
              <PlusCircle className="w-5 h-5" />
              Stwórz pierwszą fakturę
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden">
            <InvoicesTable invoices={invoices} offset={offset} />
          </div>
        )}
      </CardContent>
      {invoices.length > 0 && (
        <Pagination offset={offset} total={totalInvoices} />
      )}
    </>
  );
}
