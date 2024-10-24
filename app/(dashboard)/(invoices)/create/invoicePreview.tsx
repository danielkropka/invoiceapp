import { ChevronRight } from "lucide-react";
import { invoiceType } from "./invoice-creator-form";
import { Client } from "@prisma/client";
import React, { useEffect } from "react";
import clsx from "clsx";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import moment from "moment";

export default function InvoicePreview({
  formData,
  client,
}: {
  formData: invoiceType;
  client: Client | undefined;
}) {
  const { invoiceId, issuedAt, soldAt, products } = formData;
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [hidden, setHidden] = React.useState(isDesktop);
  const isPreviewAvailable =
    invoiceId &&
    issuedAt &&
    soldAt &&
    products.length > 0 &&
    client &&
    client.id;

  useEffect(() => {
    setHidden(isDesktop);
  }, [isDesktop]);

  return (
    <div
      className={clsx(
        "bg-muted/40 rounded-xl max-w-4xl p-8 lg:p-14 relative transition-width duration-700",
        {
          "w-1/4": hidden,
          "w-full": !hidden,
        }
      )}
    >
      <div
        className="absolute -left-5 top-[50px] border bg-background rounded-full w-12 h-12 items-center justify-center hover:cursor-pointer hidden lg:flex"
        onClick={() => setHidden(!hidden)}
      >
        <ChevronRight
          className={cn(
            "h-6 w-6 transition-all",
            hidden ? "rotate-180" : "rotate-0"
          )}
        />
      </div>
      <div className="border-b pb-4">
        <h1 className="text-2xl font-semibold">Podgląd</h1>
      </div>
      {isPreviewAvailable ? (
        <div className="bg-background shadow-md rounded border w-full mt-4 p-4 flex flex-col">
          <div className="border-b pb-2">
            <span className="font-semibold text-xl">Faktura {invoiceId}</span>
          </div>
          <div
            className={clsx("grid mt-2 gap-4", {
              "grid-cols-1": hidden || !isDesktop,
              "grid-cols-2": !hidden && isDesktop,
            })}
          >
            <div className="flex flex-col">
              <span className="text-muted-foreground">Data wystawienia</span>
              <span>{moment(issuedAt).format("LL")}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground">Data sprzedaży</span>
              <span>{moment(soldAt).format("LL")}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground">Wystawiona dla</span>
              <span className="truncate w-3/4">{client?.name}</span>
              <span className="truncate w-3/4">{client?.email}</span>
            </div>
          </div>
        </div>
      ) : (
        <span className="h-full justify-center items-center flex text-muted-foreground">
          Podgląd niedostępny. Uzupełnij formularz.
        </span>
      )}
    </div>
  );
}
