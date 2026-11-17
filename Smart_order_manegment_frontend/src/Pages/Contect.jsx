import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import React from 'react'
import Welcome from '../Component/Welcome'

export default function Contect() {
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
          <Typography variant="h4">Contect Page</Typography>

        </Box>
      </Box>
    </>
  )
}
