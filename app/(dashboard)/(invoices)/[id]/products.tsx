"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { sumAllProducts } from "@/lib/utils";
import { Product } from "@prisma/client";

export default function Products({ products }: { products: Product[] }) {
  return (
    <div className="col-span-full border-t pt-4 flex flex-col gap-10">
      <h2 className="text-2xl font-semibold">Produkty/Usługi</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nazwa produktu/usługi</TableHead>
            <TableHead>Opis</TableHead>
            <TableHead>Cena netto</TableHead>
            <TableHead>Ilość</TableHead>
            <TableHead>VAT</TableHead>
            <TableHead>Cena brutto</TableHead>
            <TableHead>Kwota VAT</TableHead>
            <TableHead>Wartość brutto</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product, i) => (
            <TableRow key={i}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.description ?? "Brak opisu"}</TableCell>
              <TableCell>{product.price.toFixed(2)} zł</TableCell>
              <TableCell>{product.quantity}</TableCell>
              <TableCell>{product.vat}%</TableCell>
              <TableCell>
                {(
                  product.price +
                  (product.price * Number(product.vat)) / 100
                ).toFixed(2)}{" "}
                zł
              </TableCell>
              <TableCell>
                {(product.price * (Number(product.vat) / 100)).toFixed(2)} zł
              </TableCell>
              <TableCell>
                {(
                  product.price *
                  (Number(product.vat) / 100 + 1) *
                  product.quantity
                ).toFixed(2)}{" "}
                zł
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={7}>Łączna wartość brutto</TableCell>
            <TableCell>{sumAllProducts(products).toFixed(2)} zł</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
