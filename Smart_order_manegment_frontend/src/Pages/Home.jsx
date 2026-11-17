import React from "react";
import Welcome from "../Component/Welcome";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function Home() {
  return (
    <>
      <Welcome />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: "#f4f6fb",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h4">Home Page</Typography>

          <Typography variant="h6">
            Username: {localStorage.getItem("username")}
          </Typography>

          <Typography variant="h6">
            Email: {localStorage.getItem("email")}
          </Typography>
        </Box>
      </Box>
    </>
  );
}
