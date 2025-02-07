import React from "react";
import { AuthPage } from "../../components/pages/auth";

export const Login = () => {
  return (
    <AuthPage
      type="login"
      title={<img src={"./square.png"} width={290} alt="zeal-logo" />}
      formProps={{
        initialValues: { email: "", password: "" },
      }}
      rememberMe={false}
      forgotPasswordLink={false}
    />
  );
};
