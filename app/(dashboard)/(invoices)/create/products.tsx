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
import { Plus, Trash2 } from "lucide-react";
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
    <div className="col-span-full">
      <Table className="products-table">
        <TableCaption>Lista twoich produktów.</TableCaption>
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead className="rounded-l w-[150px]">
              Produkt/usługa
            </TableHead>
            <TableHead className="w-[150px]">Opis</TableHead>
            <TableHead className="w-[150px]">Cena netto</TableHead>
            <TableHead>Ilość</TableHead>
            <TableHead className="w-[150px]">VAT</TableHead>
            <TableHead className="w-3 rounded-r"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product, index) => (
            <TableRow key={product.id}>
              <TableCell>
                <FormField
                  name={`products.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className="w-[150px]"
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
                          className="w-[150px]"
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
                          className="w-[150px]"
                          type="number"
                          placeholder="Cena netto"
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
                          className="w-[150px]"
                          type="number"
                          placeholder="Ilość"
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
                  name={`products.${index}.vat`}
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Wybierz VAT" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="23">23%</SelectItem>
                          <SelectItem value="8">8%</SelectItem>
                          <SelectItem value="5">5%</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TableCell>
              <TableCell>
                <Button
                  type="button"
                  variant={"ghost"}
                  onClick={(e) => {
                    e.preventDefault();
                    remove(index);
                  }}
                  disabled={products.length === 1}
                >
                  <Trash2 className="w-5 h-5 text-muted-foreground hover:text-black transition-colors" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex flex-col mt-2 gap-8 items-start md:flex-row md:justify-between md:items-center">
        <span
          className="w-fit text-blue-500 text-sm flex items-center gap-1 hover:underline hover:cursor-pointer hover:underline-offset-4"
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
          <Plus className="w-4 h-4" />
          Dodaj produkt/usługę
        </span>
        {children}
      </div>
    </div>
  );
}
