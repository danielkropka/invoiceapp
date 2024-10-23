import { getClients } from "@/lib/db";
import ClientsTable from "./clientsTable";
import Pagination from "@/components/pagination";
import { CardContent } from "@/components/ui/card";

export default async function ClientsCardContent({
  searchParams,
}: {
  searchParams: { q: string; offset: string };
}) {
  const search = searchParams.q ?? "";
  const offset = searchParams.offset ?? 0;
  const { clients, newOffset, totalClients } = await getClients(
    search,
    Number(offset),
    false
  );

  return (
    <>
      <CardContent>
        {clients.length === 0 ? (
          <div className="text-center">Brak klientów.</div>
        ) : (
          <ClientsTable clients={clients} />
        )}
      </CardContent>
      <Pagination offset={newOffset} total={totalClients} />
    </>
  );
}
