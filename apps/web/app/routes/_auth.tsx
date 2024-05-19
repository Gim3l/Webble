import { Outlet } from "@remix-run/react";
import { Container } from "@mantine/core";
import classes from "~/styles/AuthLayout.module.css";

const AuthLayout = () => {
  return (
    <Container size={"xs"} className={classes.wrapper}>
      <Outlet />
    </Container>
  );
};

export default AuthLayout;
