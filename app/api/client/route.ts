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
        address: address,
        phoneNumber,
        taxIdNumber,
        creatorId: session.user.id,
      },
    });

    // Wyczyść cache po utworzeniu klienta
    invalidateUserCache(session.user.id);

    return new Response("Client created", { status: 200 });
  } catch (error) {
    console.error("Client creation error:", error);

    if (error instanceof z.ZodError) {
      console.error("Zod validation error:", error.errors);
      return new Response(
        JSON.stringify({
          error: "Validation error",
          details: error.errors,
        }),
        {
          status: 422,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        error: "There was an error while creating client",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
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
