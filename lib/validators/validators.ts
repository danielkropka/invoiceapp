import { z } from "zod";
import validator from "validator";

export const loginFormSchema = z.object({
  email: z.string({ required_error: "E-mail jest wymagany." }).email(),
  password: z.string({ required_error: "Hasło jest wymagane." }).min(4),
});

export const registerFormSchema = z
  .object({
    name: z.string().min(3),
    email: z.string({ required_error: "E-mail jest wymagany." }).email(),
    password: z.string({ required_error: "Hasło jest wymagane." }).min(4),
    repeatPassword: z.string({ required_error: "Hasło jest wymagane." }).min(4),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Hasła się różnią.",
    path: ["repeatPassword"],
  });

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

export const addressFormSchema = z.object({
  street: z.string(),
  postalCode: z.string().regex(/^\d{2}-\d{3}$/, {
    message: "Kod pocztowy musi być w formacie 00-000",
  }),
  city: z.string(),
  nip: z.string().max(10).min(10).optional(),
});

export const invoiceFormSchema = z
  .object({
    invoiceId: z.string().optional(),
    issuedAt: z.coerce.date(),
    soldAt: z.coerce.date(),
    exemptTax: z.boolean().default(false).optional(),
    clientId: z.string(),
    products: z
      .object({
        name: z.string(),
        description: z.string().optional(),
        price: z.coerce.number(),
        quantity: z.coerce.number(),
        vat: z.string().optional(),
      })
      .array(),
  })
  .refine(
    (data) => {
      if (!data.exemptTax) {
        return data.products.every((product) => product.vat);
      }

      return true;
    },
    { message: "Pole VAT jest wymagane", path: ["products", "vat"] }
  );
