import { AuthPage } from "../../components/pages/auth";

export const Login = () => {
  return (
    <AuthPage
      type="login"
      title={<img src={require("./zeal-horizontal-removebg.png")} width={290} alt="zeal-logo" />}
      formProps={{
        initialValues: { email: "admin@admin.com", password: "admin123" },
      }}
      rememberMe={false}
      forgotPasswordLink={false}
    />
  );
};



