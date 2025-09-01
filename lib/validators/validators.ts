import { z } from "zod";
import validator from "validator";

// Wzorzec dla silnego hasła: min 8 znaków, 1 wielka litera, 1 mała litera, 1 cyfra
const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;

export const loginFormSchema = z.object({
  email: z
    .string({ required_error: "E-mail jest wymagany." })
    .email("Nieprawidłowy format e-mail")
    .max(255, "E-mail jest za długi")
    .toLowerCase()
    .trim(),
  password: z
    .string({ required_error: "Hasło jest wymagane." })
    .min(1, "Hasło jest wymagane")
    .max(128, "Hasło jest za długie"),
});

export const registerFormSchema = z
  .object({
    name: z
      .string({ required_error: "Imię i nazwisko jest wymagane." })
      .min(2, "Imię i nazwisko musi mieć co najmniej 2 znaki")
      .max(100, "Imię i nazwisko jest za długie")
      .regex(
        /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s\-'\.]+$/,
        "Imię i nazwisko zawiera niedozwolone znaki"
      )
      .trim(),
    email: z
      .string({ required_error: "E-mail jest wymagany." })
      .email("Nieprawidłowy format e-mail")
      .max(255, "E-mail jest za długi")
      .toLowerCase()
      .trim(),
    password: z
      .string({ required_error: "Hasło jest wymagane." })
      .min(8, "Hasło musi mieć co najmniej 8 znaków")
      .max(128, "Hasło jest za długie")
      .regex(
        strongPasswordRegex,
        "Hasło musi zawierać co najmniej 8 znaków, w tym 1 wielką literę, 1 małą literę i 1 cyfrę"
      ),
    repeatPassword: z
      .string({ required_error: "Powtórzenie hasła jest wymagane." })
      .min(8, "Powtórzenie hasła musi mieć co najmniej 8 znaków")
      .max(128, "Powtórzenie hasła jest za długie"),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Hasła się różnią.",
    path: ["repeatPassword"],
  });

export const clientFormSchema = z.object({
  name: z
    .string({ required_error: "Nazwa klienta jest wymagana." })
    .min(2, "Nazwa musi mieć co najmniej 2 znaki")
    .max(100, "Nazwa jest za długa")
    .trim(),
  email: z
    .string({ required_error: "E-mail jest wymagany." })
    .email("Nieprawidłowy format e-mail")
    .max(255, "E-mail jest za długi")
    .toLowerCase()
    .trim(),
  phoneNumber: z
    .string()
    .optional()
    .refine(
      (val) => !val || validator.isMobilePhone(val, "any"),
      "Nieprawidłowy format numeru telefonu"
    ),
  address: z.object({
    street: z
      .string({ required_error: "Adres jest wymagany." })
      .min(3, "Adres musi mieć co najmniej 3 znaki")
      .max(200, "Adres jest za długi")
      .trim(),
    postalCode: z
      .string({ required_error: "Kod pocztowy jest wymagany." })
      .min(3, "Kod pocztowy musi mieć co najmniej 3 znaki")
      .max(20, "Kod pocztowy jest za długi")
      .trim(),
    city: z
      .string({ required_error: "Miejscowość jest wymagana." })
      .min(2, "Miejscowość musi mieć co najmniej 2 znaki")
      .max(100, "Miejscowość jest za długa")
      .trim(),
    country: z
      .string({ required_error: "Kraj jest wymagany." })
      .min(2, "Kraj musi mieć co najmniej 2 znaki")
      .max(100, "Nazwa kraju jest za długa")
      .trim(),
  }),
  taxIdNumber: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[A-Z0-9]{5,20}$/i.test(val),
      "Numer identyfikacji podatkowej może zawierać litery i cyfry (5-20 znaków)"
    ),
});

export const addressFormSchema = z.object({
  street: z.string(),
  postalCode: z.string().regex(/^\d{2}-\d{3}$/, {
    message: "Kod pocztowy musi być w formacie 00-000",
  }),
  city: z.string(),
  nip: z.string().max(10).min(10).optional(),
});

export const userInfoFormSchema = z.object({
  name: z
    .string()
    .min(2, "Imię i nazwisko musi mieć co najmniej 2 znaki")
    .max(100, "Imię i nazwisko jest za długie")
    .regex(
      /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s\-'\.]+$/,
      "Imię i nazwisko zawiera niedozwolone znaki"
    )
    .trim(),
  email: z
    .string()
    .email("Nieprawidłowy format e-mail")
    .max(255, "E-mail jest za długi")
    .toLowerCase()
    .trim(),
  phoneNumber: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[\+]?[1-9][\d]{0,15}$/.test(val),
      "Nieprawidłowy format numeru telefonu"
    ),
  image: z.string().optional(),
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
