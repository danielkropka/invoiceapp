import { getAuthSession } from "@/lib/auth";
import { notFound } from "next/navigation";
import Notification from "./notification";

export default async function NotificationPage() {
  const session = await getAuthSession();
  if (!session?.user) return notFound();
  const { notifications } = session.user;

  return (
    <div className="flex">
      {notifications.length > 0 ? (
        <div className="flex flex-col gap-2 w-full">
          {notifications
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .map((notification, i) => (
              <Notification notification={notification} key={i} />
            ))}
        </div>
      ) : (
        <span>Brak powiadomień.</span>
      )}
    </div>
  );
}
