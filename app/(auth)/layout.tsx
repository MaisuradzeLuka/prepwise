import { isAuthenticated } from "@/actions/user";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";

const authLayout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();

  if (isUserAuthenticated) redirect("/");
  return <main className="pattern">{children}</main>;
};

export default authLayout;
