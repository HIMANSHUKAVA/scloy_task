import React, { useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
export default function PriceSummary({
  price = 0,
  quantity = 1,
  tax = 0,
  productId,
}) {
  const subtotal = price * quantity;
  const taxAmount = (subtotal * tax) / 100;
  const grandTotal = subtotal + taxAmount;

  const deta = {
    id: productId,
    quantity: quantity,
  };

  const [buttondisabled, setbuttondisabled] = useState(false);

  const navigate = useNavigate();

  const HandlCreateOrder = async () => {
    setbuttondisabled(true);

    try {
      const res = await axios.post(
        "http://localhost:5600/order/user/ordercreate",
        deta,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      Swal.fire({
        icon: "success",
        title: "Order Placed!",
        text: res.data.message || "Your order has been placed successfully.",
        confirmButtonColor: "#2e7d32",
      });
      navigate("/user/myorder");
    } catch (er) {
      Swal.fire({
        icon: "error",
        title: "Order Failed!",
        text:
          er.response?.data?.message ||
          "Something went wrong. Please try again.",
        confirmButtonColor: "#d32f2f",
      });
    } finally {
      setbuttondisabled(false);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: "1px solid #e2e8f0",
        borderRadius: 3,
        mt: 1,
      }}
    >
      <Typography variant="h6" fontWeight="bold" mb={3}>
        Price Summary
      </Typography>

      <Stack spacing={2}>
        <Box display="flex" justifyContent="space-between">
          <Typography color="text.secondary">Price</Typography>
          <Typography fontWeight={600}>₹{price}</Typography>
        </Box>

        <Box display="flex" justifyContent="space-between">
          <Typography color="text.secondary">Quantity</Typography>
          <Typography fontWeight={600}>{quantity}</Typography>
        </Box>

        <Box display="flex" justifyContent="space-between">
          <Typography color="text.secondary">Subtotal</Typography>
          <Typography fontWeight={600}>₹{subtotal}</Typography>
        </Box>

        <Box display="flex" justifyContent="space-between">
          <Typography color="text.secondary">Tax ({tax}%)</Typography>
          <Typography fontWeight={600}>₹{taxAmount}</Typography>
        </Box>

        <Divider />

        <Box display="flex" justifyContent="space-between">
          <Typography fontWeight="bold">Grand Total</Typography>
          <Typography variant="h6" color="success.main" fontWeight="bold">
            ₹{grandTotal}
          </Typography>
        </Box>

        <Button
          fullWidth
          sx={{
            "&:hover": {
              bgcolor: "#0d47a1",
              transform: "translateY(-3px)",
              boxShadow: 4,
              color: "white",
            },
            transition: "all 3s",
          }}
          variant="outlined"
          disabled={buttondisabled}
          onClick={HandlCreateOrder}
        >
          {buttondisabled ? "Order processing" : "Place Order"}
        </Button>
      </Stack>
    </Paper>
  );
}
