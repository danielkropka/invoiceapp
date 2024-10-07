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
