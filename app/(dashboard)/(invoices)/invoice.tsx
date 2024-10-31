import React, { startTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExternalLink, MoreHorizontal, Trash2 } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { InvoiceType } from "@/types/db";
import moment from "moment";
import "moment/locale/pl";
import { Badge } from "@/components/ui/badge";
import { sumAllProducts } from "@/lib/utils";
import Link from "next/link";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function Invoice({ invoice }: { invoice: InvoiceType }) {
  let timeout: NodeJS.Timeout | undefined = undefined;
  const router = useRouter();

  return (
    <TableRow>
      <TableCell className="font-medium">{invoice.invoiceId}</TableCell>
      <TableCell className="hidden md:table-cell">
        {invoice.client.email}
      </TableCell>
      <TableCell>
        <Badge variant="outline" className="capitalize">
          {invoice.status === "PAID"
            ? "zapłacono"
            : invoice.status === "PENDING"
            ? "oczekuje"
            : "niezapłacono"}
        </Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {sumAllProducts(invoice.products).toFixed(2)} PLN
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {moment(invoice.issuedAt).format("L")}
      </TableCell>
      <TableCell>
        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-haspopup="true" size="icon" variant="ghost">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Otwórz menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Akcje</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link
                  className="flex items-center gap-2"
                  href={`/${invoice.id}`}
                >
                  <ExternalLink className="w-4 h-4" />
                  Otwórz
                </Link>
              </DropdownMenuItem>
              <DialogTrigger className="flex items-center gap-2 w-full" asChild>
                <DropdownMenuItem>
                  <Trash2 className="w-4 h-4" />
                  Usuń
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Czy na pewno chcesz kontynuować?</DialogTitle>
              <DialogDescription>
                Tej operacji nie można cofnąć. Spowoduje ona trwałe usunięcie
                Twojej faktury z naszych serwerów.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  type="submit"
                  onClick={async () => {
                    if (timeout) return;
                    const t = toast.promise(
                      () => {
                        return new Promise((resolve) => {
                          timeout = setTimeout(async () => {
                            try {
                              await axios.delete("/api/invoice", {
                                data: { id: invoice.id },
                              });
                              resolve("Success");
                            } catch (err) {
                              timeout = undefined;

                              toast.dismiss(t);
                              if (err instanceof AxiosError) {
                                if (err.response?.status === 404) {
                                  return toast.info(
                                    "Faktura którą chcesz usunąć, nie istnieje."
                                  );
                                }
                              }

                              return toast.error("Coś poszło nie tak.", {
                                description:
                                  "Wystąpił błąd podczas usuwania faktury. Spróbuj ponownie później.",
                              });
                            }
                            startTransition(() => {
                              router.refresh();
                            });
                            timeout = undefined;
                          }, 5000);
                        });
                      },
                      {
                        success: "Pomyślnie usunięto fakturę z Twojego konta.",
                        loading: "Trwa usuwanie faktury.",
                        action: {
                          label: "Cofnij",
                          onClick: () => {
                            clearTimeout(timeout);
                            timeout = undefined;
                          },
                        },
                      }
                    );
                  }}
                >
                  Usuń
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  );
}

export default Invoice;
