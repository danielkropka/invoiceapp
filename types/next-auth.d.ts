import { Address } from "@prisma/client";
import type { User } from "next-auth";

type userId = string;

declare module "next-auth/jwt" {
  interface JWT {
    id: userId;
    address: Address?;
    taxIdNumber: string?;
  }
}

declare module "next-auth" {
  interface Session {
    user: User & {
      id: userId;
      address: Address?;
      taxIdNumber: string?;
    };
  }
}
