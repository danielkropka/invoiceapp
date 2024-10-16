import { z } from "zod";
import validator from "validator";

export const clientFormSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phoneNumber: z.string().min(9).refine(validator.isMobilePhone).optional(),
  address: z.object({
    street: z.string(),
    postalCode: z.string(),
    city: z.string(),
  }),
  taxIdNumber: z.string().optional(),
});

export const invoiceFormSchema = z.object({
  invoiceId: z.string(),
  issuedAt: z.date(),
  soldAt: z.date(),
  products: z
    .object({
      name: z.string(),
      description: z.string().optional(),
      price: z.number(),
      quantity: z.number(),
      vat: z.string(),
    })
    .array(),
});
