import { getCurrentUser } from "@/actions/user";
import Vapi from "@/components/Vapi";
import React from "react";

const page = async () => {
  const currentUser = await getCurrentUser();

  return (
    <>
      <Vapi userId={currentUser?.id!} username={currentUser?.name!} />
    </>
  );
};

export default page;
