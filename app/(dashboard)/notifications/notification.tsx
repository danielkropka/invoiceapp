"use client";

import { Button } from "@/components/ui/button";
import { Notification as NotifyType } from "@prisma/client";
import axios from "axios";
import moment from "moment";
import "moment/locale/pl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function Notification({
  notification,
}: {
  notification: NotifyType;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <div className="border p-4 rounded">
      <div className="w-full flex">
        <div className="flex flex-col gap-2 w-full">
          <span className="flex items-center gap-2">
            {notification.type === "CONFIRM_INVOICE" && (
              <span className="relative flex h-3 w-3">
                <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
              </span>
            )}
            <span className="flex justify-between items-center w-full">
              <span className="text-sm text-muted-foreground">
                Faktura nr {notification.invoiceId}
              </span>
              <span className="text-sm text-muted-foreground">
                {moment(notification.createdAt).fromNow()}
              </span>
            </span>
          </span>
          <div className="flex justify-between">
            <span>
              Klient/ka potwierdził/a opłacenie faktury, aby zmienić status
              faktury na opłaconą&nbsp;
              <span className="underline underline-offset-2 hover:cursor-pointer text-sky-500">
                kliknij tutaj
              </span>
              .
            </span>
            <Button
              size={"sm"}
              onClick={() => {
                startTransition(async () => {
                  try {
                    await axios.patch("/api/notification", {
                      read: !notification.read,
                      id: notification.invoiceId,
                    });

                    router.refresh();
                  } catch (err) {
                    console.log(err);
                  }
                });
              }}
              isLoading={isPending}
            >
              {notification.read
                ? "Oznacz jako nieprzeczytane"
                : "Oznacz jako przeczytane"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
