import { UseFormReturn } from "react-hook-form";
import { invoiceType } from "./invoice-creator-form";

export default function Products({
  form,
}: {
  form: UseFormReturn<invoiceType, "products", undefined>;
}) {
  /* const {
    fields: products,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "products",
  }); */
  return <span>{form.watch("client.email")}</span>;
}
