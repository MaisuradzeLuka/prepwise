import AuthForm from "@/components/forms/AuthForm";
import React from "react";

const page = () => {
  return (
    <div className="cardWrapperBorder">
      <div className="cardWrapper text-white">
        <AuthForm type="sign-up" />
      </div>
    </div>
  );
};

export default page;
