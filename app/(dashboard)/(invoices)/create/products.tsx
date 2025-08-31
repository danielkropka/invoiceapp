import { useFieldArray, UseFormReturn } from "react-hook-form";
import { invoiceType } from "./invoice-creator-form";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2, Package } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { SelectValue } from "@radix-ui/react-select";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function Products({
  form,
  children,
}: {
  form: UseFormReturn<invoiceType, "products", undefined>;
  children: ReactNode;
}) {
  const {
    fields: products,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "products",
  });

  return (
    <div className="col-span-full space-y-6">
      {/* Header Section */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <Package className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Produkty i usługi
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Dodaj produkty lub usługi do faktury
          </p>
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <Table className="products-table">
          <TableCaption className="py-4 text-gray-600 dark:text-gray-400">
            Lista produktów i usług w fakturze
          </TableCaption>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-gray-200 dark:border-gray-700">
              <TableHead className="font-medium text-gray-700 dark:text-gray-300 rounded-l-lg pl-6">
                Produkt/usługa
              </TableHead>
              <TableHead className="font-medium text-gray-700 dark:text-gray-300">
                Opis
              </TableHead>
              <TableHead className="font-medium text-gray-700 dark:text-gray-300">
                Cena netto
              </TableHead>
              <TableHead className="font-medium text-gray-700 dark:text-gray-300">
                Ilość
              </TableHead>
              <TableHead
                className={cn(
                  "font-medium text-gray-700 dark:text-gray-300",
                  form.watch("exemptTax") && "hidden"
                )}
              >
                VAT
              </TableHead>
              <TableHead className="w-16 rounded-r-lg"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product, index) => (
              <TableRow
                key={product.id}
                className="group hover:bg-gray-50/80 dark:hover:bg-gray-800/80 transition-all duration-200 border-b border-gray-100 dark:border-gray-800 last:border-b-0"
              >
                <TableCell className="pl-6">
                  <FormField
                    name={`products.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            className="w-[150px] md:w-full border-0 bg-transparent focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 dark:text-gray-100"
                            type="text"
                            placeholder="Nazwa produktu/usługi"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TableCell>
                <TableCell>
                  <FormField
                    name={`products.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            className="w-[150px] md:w-full border-0 bg-transparent focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 dark:text-gray-100"
                            type="text"
                            placeholder="Opis produktu/usługi"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TableCell>
                <TableCell>
                  <FormField
                    name={`products.${index}.price`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            className="w-[150px] md:w-full border-0 bg-transparent focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 dark:text-gray-100"
                            type="number"
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TableCell>
                <TableCell>
                  <FormField
                    name={`products.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            className="w-[150px] md:w-full border-0 bg-transparent focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 dark:text-gray-100"
                            type="number"
                            placeholder="1"
                            min="0"
                            step="1"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TableCell>
                <TableCell
                  className={cn(
                    "transition-all duration-200",
                    form.watch("exemptTax") && "hidden"
                  )}
                >
                  <FormField
                    name={`products.${index}.vat`}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-[150px] md:w-full border-0 bg-transparent focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-100">
                              <SelectValue placeholder="Wybierz VAT" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                            <SelectItem
                              value="23"
                              className="hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-100"
                            >
                              23%
                            </SelectItem>
                            <SelectItem
                              value="8"
                              className="hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-100"
                            >
                              8%
                            </SelectItem>
                            <SelectItem
                              value="5"
                              className="hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-100"
                            >
                              5%
                            </SelectItem>
                            <SelectItem
                              value="0"
                              className="hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-100"
                            >
                              0%
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TableCell>
                <TableCell className="pr-6">
                  <Button
                    type="button"
                    className="opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 dark:hover:text-red-400 hover:scale-105"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      remove(index);
                    }}
                    disabled={products.length === 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Actions Section */}
      <div className="flex flex-col gap-4 mt-6 p-4 bg-gray-50/80 dark:bg-gray-800/80 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center sm:justify-between">
          <Button
            type="button"
            variant="outline"
            className="group hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-700 dark:hover:text-blue-300 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-200 border-dashed border-2 border-gray-300 dark:border-gray-600"
            onClick={(e) => {
              e.preventDefault();
              append({
                name: "",
                price: 0,
                quantity: 0,
                vat: "23",
              });
            }}
          >
            <Plus className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
            Dodaj produkt/usługę
          </Button>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {products.length}{" "}
            {products.length === 1
              ? "produkt"
              : products.length < 5
              ? "produkty"
              : "produktów"}
          </div>
        </div>
        {children && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
