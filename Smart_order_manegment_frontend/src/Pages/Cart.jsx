import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Drawers1 from "../Component/Drawers1";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function Cart() {
  const [deta, setdeta] = useState([]);
  const [loading, setloading] = useState(true);

  // Fetch Cart
  const FetchCart = () => {
    axios
      .get("http://localhost:5600/cart/user/cartlist", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        // Nested array ko normal array mein convert karo
        const products = res.data.data?.flat() || [];

        // Duplicate products remove
        const uniqueProducts = [
          ...new Map(products.map((item) => [item._id, item])).values(),
        ];

        setdeta(uniqueProducts);
      })
      .catch((er) => {
        console.log(er);
        setdeta([]);
      })
      .finally(() => {
        setloading(false);
      });
  };

  useEffect(() => {
    FetchCart();
  }, []);

  // Quantity Update
  const HandleQuantity = (id, type) => {
    setdeta((prev) =>
      prev.map((item) => {
        if (item._id === id) {
          const currentQuantity = item.quantity || 1;

          const newQuantity =
            type === "add" ? currentQuantity + 1 : currentQuantity - 1;

          if (newQuantity < 1) return item;

          if (newQuantity > item.stock) {
            Swal.fire({
              title: "Stock Limit!",
              text: "Available stock limit reached.",
              icon: "warning",
            });
            return item;
          }

          return {
            ...item,
            quantity: newQuantity,
          };
        }

        return item;
      }),
    );
  };

  // Delete Cart Product
  const HandleDeleteCart = (id) => {
    console.log(id);
    Swal.fire({
      title: "Remove Product?",
      text: "Do you want to remove this product from your cart?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Remove",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        // Delete API abhi connect nahi hai

        axios
          .delete(`http://localhost:5600/cart/user/removecart/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((res) => {
            Swal.fire({
              title: "Success!",
              text:
                res.data.message || "Product removed from cart successfully",
              icon: "success",
              confirmButtonText: "OK",
            });

            // Cart list refresh karne ke liye
            FetchCart();
          })
          .catch((er) => {
            Swal.fire({
              title: "Error!",
              text: er.response?.data?.message || "Something went wrong",
              icon: "error",
              confirmButtonText: "OK",
            });
          });
      }
    });
  };

  // Calculations
  const subtotal = deta.reduce(
    (total, item) => total + item.price * (item.quantity || 1),
    0,
  );

  const totalItems = deta.reduce(
    (total, item) => total + (item.quantity || 1),
    0,
  );

  return (
    <Drawers1>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#f4f6fb",
          pt: 11,
          px: { xs: 2, sm: 3, md: 4 },
          pb: 5,
          boxSizing: "border-box",
        }}
      >
        {/* Header */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
          sx={{ mb: 4 }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 48,
                height: 48,
                bgcolor: "#e8edff",
                borderRadius: 2.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ShoppingCartOutlinedIcon
                sx={{ color: "#253b80", fontSize: 28 }}
              />
            </Box>

            <Box>
              <Typography variant="h4" fontWeight={800} color="#172554">
                My Cart
              </Typography>

              <Typography color="text.secondary" variant="body2">
                Review your selected products
              </Typography>
            </Box>
          </Stack>

          <Chip
            icon={<ShoppingBagOutlinedIcon />}
            label={`${deta.length} Products`}
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 700, px: 1, py: 2.3 }}
          />
        </Stack>

        <Divider sx={{ mb: 3 }} />

        {/* Loading */}
        {loading ? (
          <Box sx={{ textAlign: "center", py: 10 }}>
            <Typography color="text.secondary">Loading your cart...</Typography>
          </Box>
        ) : deta.length === 0 ? (
          /* Empty Cart */
          <Paper
            elevation={0}
            sx={{
              textAlign: "center",
              py: 10,
              borderRadius: 4,
              bgcolor: "#fff",
            }}
          >
            <ShoppingCartOutlinedIcon
              sx={{ fontSize: 75, color: "#94a3b8", mb: 2 }}
            />

            <Typography variant="h5" fontWeight={800}>
              Your Cart is Empty
            </Typography>

            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Looks like you haven't added any products yet.
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {/* Product Cards */}
            <Grid item xs={12} md={9}>
              <Grid container spacing={3}>
                {deta.map((item, index) => (
                  <Grid item xs={12} sm={6} md={4} key={`${item._id}-${index}`}>
                    <Card
                      elevation={0}
                      sx={{
                        height: "100%",
                        borderRadius: 3,
                        border: "1px solid #e8edf4",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        transition: "0.3s",
                        "&:hover": {
                          transform: "translateY(-6px)",
                          boxShadow: "0 10px 25px rgba(0,0,0,0.10)",
                        },
                      }}
                    >
                      {/* Image */}
                      <Box
                        sx={{
                          position: "relative",
                          bgcolor: "#f8f9fc",
                          p: 2,
                        }}
                      >
                        <CardMedia
                          component="img"
                          image={
                            item.productImage?.startsWith("http")
                              ? item.productImage
                              : `http://localhost:5600/${item.productImage?.replace(/^\/+/, "")}`
                          }
                          alt={item.productName}
                          sx={{
                            height: 200,
                            objectFit: "contain",
                          }}
                        />

                        <Chip
                          label={item.stock > 0 ? "In Stock" : "Out of Stock"}
                          color={item.stock > 0 ? "success" : "error"}
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 12,
                            right: 12,
                            fontWeight: 700,
                          }}
                        />
                      </Box>

                      {/* Details */}
                      <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                        <Typography
                          variant="h6"
                          fontWeight={750}
                          color="#1e293b"
                          noWrap
                        >
                          {item.productName}
                        </Typography>

                        <Typography variant="caption" color="text.secondary">
                          SKU: {item.sku}
                        </Typography>

                        <Typography
                          variant="h5"
                          fontWeight={800}
                          color="primary.main"
                          sx={{ mt: 2 }}
                        >
                          ₹{item.price?.toLocaleString("en-IN")}
                        </Typography>

                        <Divider sx={{ my: 2 }} />

                        {/* Quantity */}
                        <Typography fontWeight={600} variant="body2">
                          Quantity
                        </Typography>

                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={1.5}
                          sx={{ mt: 1 }}
                        >
                          <IconButton
                            size="small"
                            disabled={(item.quantity || 1) <= 1}
                            onClick={() => HandleQuantity(item._id, "remove")}
                            sx={{ border: "1px solid #ddd" }}
                          >
                            <RemoveIcon fontSize="small" />
                          </IconButton>

                          <Typography fontWeight={700}>
                            {item.quantity || 1}
                          </Typography>

                          <IconButton
                            size="small"
                            disabled={(item.quantity || 1) >= item.stock}
                            onClick={() => HandleQuantity(item._id, "add")}
                            sx={{ border: "1px solid #ddd" }}
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </Stack>

                        <Divider sx={{ my: 2 }} />

                        {/* Total */}
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography color="text.secondary" fontWeight={600}>
                            Total Price
                          </Typography>

                          <Typography variant="h6" fontWeight={800}>
                            ₹
                            {(item.price * (item.quantity || 1)).toLocaleString(
                              "en-IN",
                            )}
                          </Typography>
                        </Stack>
                      </CardContent>

                      {/* Remove */}
                      <Box sx={{ px: 2.5, pb: 2.5 }}>
                        <Button
                          fullWidth
                          variant="outlined"
                          color="error"
                          startIcon={<DeleteOutlineOutlinedIcon />}
                          onClick={() => HandleDeleteCart(item._id)}
                          sx={{
                            borderRadius: 2,
                            textTransform: "none",
                            fontWeight: 700,
                          }}
                        >
                          Remove
                        </Button>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/* Order Summary */}
            <Grid item xs={12} md={3}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: "1px solid #e8edf4",
                  position: { md: "sticky" },
                  top: 100,
                }}
              >
                <Typography variant="h6" fontWeight={800}>
                  Order Summary
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  sx={{ mb: 2 }}
                >
                  <Typography color="text.secondary">Total Items</Typography>

                  <Typography fontWeight={600}>{totalItems}</Typography>
                </Stack>

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  sx={{ mb: 2 }}
                >
                  <Typography color="text.secondary">Subtotal</Typography>

                  <Typography fontWeight={600}>
                    ₹{subtotal.toLocaleString("en-IN")}
                  </Typography>
                </Stack>

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  sx={{ mb: 2 }}
                >
                  <Typography color="text.secondary">Shipping</Typography>

                  <Typography color="success.main" fontWeight={700}>
                    Free
                  </Typography>
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="h6" fontWeight={800}>
                    Grand Total
                  </Typography>

                  <Typography
                    variant="h5"
                    color="primary.main"
                    fontWeight={800}
                  >
                    ₹{subtotal.toLocaleString("en-IN")}
                  </Typography>
                </Stack>

                <Button
                  fullWidth
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    mt: 3,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 700,
                    bgcolor: "#253b80",
                    "&:hover": {
                      bgcolor: "#192c65",
                    },
                  }}
                >
                  Proceed to Checkout
                </Button>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  textAlign="center"
                  sx={{ mt: 2 }}
                >
                  Secure checkout experience
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Box>
    </Drawers1>
  );
}
