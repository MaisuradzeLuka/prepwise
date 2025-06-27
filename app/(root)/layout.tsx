import { isAuthenticated } from "@/actions/user";
import { redirect } from "next/navigation";

import React, { ReactNode } from "react";

const rootLayout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();

  if (!isUserAuthenticated) redirect("/sign-in");

  return <div className="pattern">{children}</div>;
};

export default rootLayout;
