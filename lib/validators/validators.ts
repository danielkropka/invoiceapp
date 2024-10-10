import { z } from "zod";
import validator from "validator";
import { Method, Status } from "@prisma/client";

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
  status: z.nativeEnum(Status),
  paymentMethod: z.nativeEnum(Method),
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
