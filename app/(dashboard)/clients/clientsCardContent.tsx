import { getClients } from "@/lib/db";
import ClientsTable from "./clientsTable";
import Pagination from "@/components/pagination";
import { CardContent } from "@/components/ui/card";
import { Users, PlusCircle } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function ClientsCardContent({
  searchParams,
}: {
  searchParams: { q?: string; offset?: string };
}) {
  const search = searchParams.q ?? "";
  const offsetParam = searchParams.offset;
  const offset =
    offsetParam && !isNaN(Number(offsetParam)) ? Number(offsetParam) : 0;
  const { clients, totalClients } = await getClients(search, offset, false);

  return (
    <>
      <CardContent className="p-0">
        {clients.length === 0 ? (
          <div className="text-center py-16 px-6">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
              <Users className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {searchParams.q ? "Nie znaleziono klientów" : "Brak klientów"}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              {searchParams.q
                ? `Nie znaleziono klientów pasujących do wyszukiwania "${searchParams.q}"`
                : "Nie masz jeszcze żadnych klientów. Stwórz pierwszego klienta, aby rozpocząć zarządzanie swoją działalnością."}
            </p>
            <Link
              href="/clients/create"
              className={cn(
                "inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white",
                buttonVariants({ size: "lg" })
              )}
            >
              <PlusCircle className="w-5 h-5" />
              Stwórz pierwszego klienta
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden">
            <ClientsTable clients={clients} offset={offset} />
          </div>
        )}
      </CardContent>
      {clients.length > 0 && (
        <Pagination offset={offset} total={totalClients} />
      )}
    </>
  );
}
