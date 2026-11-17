import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import React from 'react'
import Welcome from '../Component/Welcome'

export default function Pagenotfound() {
  return (
    <>
    <Welcome/>
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
          <Typography variant="h4">This Url Doesn't Exiests </Typography>

        </Box>
      </Box>
    </>
  )
}
