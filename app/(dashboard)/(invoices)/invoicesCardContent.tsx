import InvoicesTable from "./invoicesTable";
import { CardContent } from "@/components/ui/card";
import Pagination from "../../../components/pagination";
import { getInvoices } from "@/lib/db";

export default async function InvoicesCardContent({
  searchParams,
}: {
  searchParams: { q: string; offset: string };
}) {
  const search = searchParams.q ?? "";
  const offset = searchParams.offset ?? 0;

  const { invoices, newOffset, totalInvoices } = await getInvoices(
    search,
    Number(offset)
  );

  return (
    <>
      <CardContent>
        {invoices.length === 0 ? (
          <div className="text-center">Brak faktur.</div>
        ) : (
          <InvoicesTable invoices={invoices} />
        )}
      </CardContent>
      <Pagination offset={newOffset} total={totalInvoices} />
    </>
  );
}
