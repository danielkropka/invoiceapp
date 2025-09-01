import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/prisma";
import {
  addressFormSchema,
  userInfoFormSchema,
} from "@/lib/validators/validators";

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) return new Response("Unauthorized.", { status: 401 });

    const body = await req.json();

    // Sprawdź czy to dane adresowe czy dane użytkownika
    if (body.street && body.postalCode && body.city) {
      // Aktualizacja danych adresowych
      const { postalCode, city, nip, street, country } =
        addressFormSchema.parse(body);

      const user = await db.user.findFirst({
        where: {
          id: session.user.id,
        },
      });

      if (!user) return new Response("User not found", { status: 404 });

      await db.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          ...(({ id: _, ...rest }) => rest)(user),
          address: {
            postalCode,
            city,
            street,
            country,
          },
          taxIdNumber: nip,
        },
      });

      return new Response("Address has been updated", { status: 200 });
    } else {
      // Aktualizacja danych użytkownika
      const { name, email, phoneNumber, image } =
        userInfoFormSchema.parse(body);

      const user = await db.user.findFirst({
        where: {
          id: session.user.id,
        },
      });

      if (!user) return new Response("User not found", { status: 404 });

      // Sprawdź czy email nie jest już używany przez innego użytkownika
      if (email && email !== user.email) {
        const existingUser = await db.user.findFirst({
          where: {
            email: email,
            id: { not: session.user.id },
          },
        });

        if (existingUser) {
          return new Response("Email is already in use", { status: 400 });
        }
      }

      await db.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          name: name || user.name,
          email: email || user.email,
          phoneNumber: phoneNumber || user.phoneNumber,
          image: image !== undefined ? image : user.image,
        },
      });

      return new Response("User has been updated", { status: 200 });
    }
  } catch (error) {
    console.log(error);
    return new Response("There was an error while updating user", {
      status: 500,
    });
  }
}
