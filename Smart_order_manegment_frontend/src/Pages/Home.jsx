import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Drawers1 from "../Component/Drawers1";

export default function Home() {
  return (
    <Drawers1>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
          bgcolor: "#f4f6fb",
          
        }}
      >
        <Typography variant="h4">
          Home Page
        </Typography>

        <Typography variant="h6">
          Username: {localStorage.getItem("username")}
        </Typography>

        <Typography variant="h6">
          Email: {localStorage.getItem("email")}
        </Typography>
      </Box>
    </Drawers1>
  );
}