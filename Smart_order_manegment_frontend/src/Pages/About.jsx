import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React from "react";
import Welcome from "../Component/Welcome";
import Drawer1 from "../Component/Drawers1";
export default function About() {
  return (
    <>
      <Drawer1 >
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
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h4">About Page</Typography>
        </Box>
      </Box>
      </Drawer1>
    </>
  );
}
