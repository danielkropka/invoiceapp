import { db } from "@/lib/prisma";
import { registerFormSchema } from "@/lib/validators/validators";
import { hash } from "bcrypt";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body: z.infer<typeof registerFormSchema> = await req.json();

    const user = await db.user.findFirst({
      where: {
        email: body.email,
      },
    });

    if (user)
      return new Response("Account with this email already exists.", {
        status: 302,
      });

    await db.user.create({
      data: {
        email: body.email,
        password: await hash(body.password, 10),
      },
    });

    return new Response("Account created.", { status: 200 });
  } catch (error) {
    if (error)
      return new Response("There was an error while creating account.", {
        status: 500,
      });
  }
}
