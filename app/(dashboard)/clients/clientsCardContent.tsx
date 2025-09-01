import { getClients } from "@/lib/db";
import ClientsTable from "./clientsTable";
import Pagination from "@/components/pagination";
import { CardContent } from "@/components/ui/card";

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
      <CardContent>
        {clients.length === 0 ? (
          <div className="text-center">Brak klientów.</div>
        ) : (
          <ClientsTable clients={clients} />
        )}
      </CardContent>
      {clients.length > 0 && (
        <Pagination offset={offset} total={totalClients} />
      )}
    </>
  );
}
