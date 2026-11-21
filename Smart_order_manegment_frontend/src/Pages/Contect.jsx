import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import React from 'react';
import Drawers1 from '../Component/Drawers1';

export default function Contect() {
  return (
    <Drawers1>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
          bgcolor: "#f4f6fb",
          width: "100%",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h4">
            Contact Page
          </Typography>
        </Box>
      </Box>
    </Drawers1>
  );
}