import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { addressFormSchema } from "@/lib/validators/validators";

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) return new Response("Unauthorized.", { status: 401 });

    const body = await req.json();
    const { postalCode, city, nip, street } = addressFormSchema.parse(body);

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
        },
        taxIdNumber: nip,
      },
    });

    return new Response("User has been updated", { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("There was an error while updating user", {
      status: 500,
    });
  }
}
