import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { z } from "zod";
import { clientFormSchema } from "@/lib/validators/validators";
import { invalidateUserCache } from "@/lib/cache";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) return new Response("Unauthorized", { status: 401 });

    const body = await req.json();
    const { name, phoneNumber, taxIdNumber, address, email } =
      clientFormSchema.parse(body);

    const clientExist = await db.client.findFirst({
      where: {
        email,
        creatorId: session.user.id,
      },
    });

    if (clientExist)
      return new Response("Client already exists", { status: 400 });

    await db.client.create({
      data: {
        name,
        email,
        address,
        phoneNumber,
        taxIdNumber,
        creatorId: session.user.id,
      },
    });

    // Wyczyść cache po utworzeniu klienta
    invalidateUserCache(session.user.id);

    return new Response("Client created", { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response("There was an error while creating client", {
      status: 500,
    });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) return new Response("Unauthorized", { status: 401 });

    const body = await req.json();
    const { id }: { id: string } = body;

    await db.client.delete({
      where: {
        id,
        creatorId: session.user.id,
      },
    });

    // Wyczyść cache po usunięciu klienta
    invalidateUserCache(session.user.id);

    return new Response("Client deleted", { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response("There was an error while deleting client", {
      status: 500,
    });
  }
}
