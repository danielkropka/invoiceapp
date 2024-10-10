import React from "react";
import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import UserMenu from "@/app/(dashboard)/user-menu";

const User = async () => {
  const session = await getAuthSession();
  if (!session?.user) {
    redirect("/sign-in");
  }
  const user = session.user;

  return <UserMenu user={user} />;
};

export default User;
