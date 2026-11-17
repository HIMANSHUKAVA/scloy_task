import Typography from "@mui/material/Typography";
import React from "react";

export default function Welcome() {
  return (
    <>
      <Typography variant="h5">Hello {localStorage.getItem("username")}</Typography>
      <Typography variant="h5">
        email : {localStorage.getItem("email")}
      </Typography>
    </>
  );
}
