import React, { startTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Client as ClientType } from "@prisma/client";
import moment from "moment";
import "moment/locale/pl";
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
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";

function Client({ client }: { client: ClientType }) {
  let timeout: NodeJS.Timeout | undefined = undefined;
  const router = useRouter();

  return (
    <TableRow>
      <TableCell className="hidden md:table-cell">{client.email}</TableCell>
      <TableCell>{client.name}</TableCell>
      <TableCell className="hidden md:table-cell">
        {client.address.city}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {moment(client.createdAt).format("L")}
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
                klienta z naszych serwerów.
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
                              await axios.delete("/api/client", {
                                data: { id: client.id },
                              });
                              resolve("Success");
                              toast.dismiss(t);
                              toast.success("Pomyślnie usunięto klienta.");
                            } catch (err) {
                              timeout = undefined;

                              toast.dismiss(t);
                              if (err instanceof AxiosError) {
                                if (err.response?.status === 404) {
                                  return toast.info(
                                    "Klient którego chcesz usunąć, nie istnieje."
                                  );
                                }
                              }

                              return toast.error("Coś poszło nie tak.", {
                                description:
                                  "Wystąpił błąd podczas usuwania klienta. Spróbuj ponownie później.",
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
                        success: "Pomyślnie usunięto klienta z Twojego konta.",
                        loading: "Trwa usuwanie klienta.",
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

export default Client;
