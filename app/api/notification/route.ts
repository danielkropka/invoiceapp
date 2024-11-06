import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/prisma";

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) return new Response("Unauthorized", { status: 401 });
    const { notifications, id } = session.user;

    const body: { read: boolean; id: string } = await req.json();
    const index = notifications.findIndex((noti) => noti.invoiceId === body.id);
    notifications[index].read = body.read;

    await db.user.update({
      where: {
        id,
      },
      data: {
        notifications,
      },
    });

    return new Response("Notification property read has changed.", {
      status: 200,
    });
  } catch (err) {
    console.log(err);

    return new Response(
      "There was an error while changing notification read property",
      { status: 500 }
    );
  }
}
