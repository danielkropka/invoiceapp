import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Client } from "@prisma/client";
import { UseFormReturn } from "react-hook-form";
import { invoiceType } from "./invoice-creator-form";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

export default function ClientSelection({
  clients,
  form,
}: {
  clients: Client[];
  form: UseFormReturn<invoiceType, "client", undefined>;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <FormField
      control={form.control}
      name="clientId"
      render={({ field }) => (
        <FormItem className="flex flex-col col-span-full">
          <FormLabel>Nazwa klienta</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-between h-12",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  <span className="flex gap-3 items-center">
                    <UserRound className="w-5 h-5" />
                    {field.value
                      ? clients.find((client) => client.id === field.value)
                          ?.name
                      : "Wybierz klienta z listy"}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] max-w-[--radix-popover-trigger-width] p-0">
              <Command>
                <CommandInput placeholder="Wyszukaj klienta..." />
                <CommandList>
                  <CommandEmpty>Brak klientów.</CommandEmpty>
                  <CommandGroup>
                    {clients.map((client) => (
                      <CommandItem
                        value={client.email}
                        key={client.id}
                        onSelect={() => {
                          form.setValue("clientId", client.id);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            client.id === field.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        <span className="flex flex-col">
                          {client.name}
                          <span className="text-sm text-muted-foreground truncate w-full">
                            {client.email}
                          </span>
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
