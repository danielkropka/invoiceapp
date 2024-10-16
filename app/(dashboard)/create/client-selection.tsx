import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ClientSelection({
  clients,
  form,
}: {
  clients: Client[];
  form: UseFormReturn<invoiceType, "client", undefined>;
}) {
  return (
    <FormField
      control={form.control}
      name="client"
      render={({ field }) => (
        <FormItem className="flex flex-col col-span-full">
          <FormLabel>Nazwa klienta</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-between",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value
                    ? clients.find(
                        (client) => client.email === field.value.email
                      )?.name
                    : "Wybierz klienta"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
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
                          form.setValue("client", client);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            client.email === field.value?.email
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
        </FormItem>
      )}
    />
  );
}
