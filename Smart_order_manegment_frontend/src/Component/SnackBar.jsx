
import React from "react";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

export default function SnackBar({
  open,
  handleClose,
  message,
  severity = "success",
}) {
  return (
    <Snackbar
      open={open}
      onClose={handleClose}
      autoHideDuration={2000}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
