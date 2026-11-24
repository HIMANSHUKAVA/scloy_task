
import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Drawers1 from "../Component/Drawers1";

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";

export default function Cart() {
  const [deta, setdeta] = useState([]);
  const [loading, setloading] = useState(true);

  const FetchCart = () => {
    axios
      .get("http://localhost:5600/cart/user/cartlist", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        const products = res.data.data?.flat() || [];

        const uniqueProducts = [
          ...new Map(products.map((item) => [item._id, item])).values(),
        ];

        setdeta(uniqueProducts);
      })
      .catch((er) => {
        console.log(er);
        setdeta([]);
      })
      .finally(() => setloading(false));
  };

  useEffect(() => {
    FetchCart();
  }, []);

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

          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const HandleDeleteCart = (id) => {
    Swal.fire({
      title: "Remove Product?",
      text: "Do you want to remove this product from your cart?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#253b80",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "Yes, Remove",
      cancelButtonText: "Keep It",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:5600/cart/user/removecart/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((res) => {
            Swal.fire({
              title: "Removed!",
              text: res.data.message || "Product removed from cart.",
              icon: "success",
              confirmButtonColor: "#253b80",
            });
            FetchCart();
          })
          .catch((er) => {
            Swal.fire({
              title: "Error!",
              text: er.response?.data?.message || "Something went wrong",
              icon: "error",
            });
          });
      }
    });
  };

  const subtotal = deta.reduce(
    (total, item) => total + Number(item.price || 0) * (item.quantity || 1),
    0
  );

  const totalItems = deta.reduce(
    (total, item) => total + (item.quantity || 1),
    0
  );

  const formatPrice = (price) =>
    Number(price || 0).toLocaleString("en-IN");

  const getImage = (image) => {
    if (!image) return "";
    return image.startsWith("http")
      ? image
      : `http://localhost:5600/${image.replace(/^\/+/, "")}`;
  };

  return (
    <Drawers1>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#f5f7fc",
          pt: { xs: 10, md: 12 },
          px: { xs: 2, sm: 3, md: 4 },
          pb: 6,
        }}
      >
        <Box sx={{ maxWidth: 1500, mx: "auto" }}>

          {/* Header */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={2}
            sx={{ mb: 4 }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                sx={{
                  width: 58,
                  height: 58,
                  borderRadius: 3,
                  background: "linear-gradient(135deg,#253b80,#536dce)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 8px 20px rgba(37,59,128,0.2)",
                }}
              >
                <ShoppingCartOutlinedIcon
                  sx={{ color: "#fff", fontSize: 29 }}
                />
              </Box>

              <Box>
                <Typography
                  variant="h4"
                  fontWeight={850}
                  color="#172554"
                  sx={{ letterSpacing: -1 }}
                >
                  Shopping Cart
                </Typography>
                <Typography color="text.secondary" fontSize={14}>
                  Manage your selected products and checkout
                </Typography>
              </Box>
            </Stack>

            <Chip
              icon={<ShoppingBagOutlinedIcon />}
              label={`${deta.length} Products`}
              sx={{
                px: 1.5,
                py: 2.5,
                fontWeight: 750,
                borderRadius: 2,
                bgcolor: "#e9edff",
                color: "#253b80",
                "& .MuiChip-icon": { color: "#253b80" },
              }}
            />
          </Stack>

          {/* Loading */}
          {loading ? (
            <Paper
              elevation={0}
              sx={{
                p: 8,
                borderRadius: 4,
                textAlign: "center",
              }}
            >
              <CircularProgress sx={{ color: "#253b80" }} />
              <Typography color="text.secondary" sx={{ mt: 2 }}>
                Loading your cart...
              </Typography>
            </Paper>
          ) : deta.length === 0 ? (
            /* Empty Cart */
            <Paper
              elevation={0}
              sx={{
                py: 10,
                px: 2,
                borderRadius: 4,
                textAlign: "center",
                border: "1px solid #e8edf5",
                bgcolor: "#fff",
              }}
            >
              <Box
                sx={{
                  width: 110,
                  height: 110,
                  borderRadius: "50%",
                  bgcolor: "#eef2ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 3,
                }}
              >
                <ShoppingCartOutlinedIcon
                  sx={{ fontSize: 55, color: "#536dce" }}
                />
              </Box>

              <Typography variant="h5" fontWeight={850} color="#172554">
                Your Cart is Empty
              </Typography>

              <Typography color="text.secondary" sx={{ mt: 1 }}>
                You haven't added any products to your cart yet.
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={3} alignItems="flex-start">

              {/* Product List */}
              <Grid size={{ xs: 12, lg: 8.5 }}>
                <Stack spacing={2.5}>
                  {deta.map((item) => (
                    <Card
                      key={item._id}
                      elevation={0}
                      sx={{
                        borderRadius: 3.5,
                        border: "1px solid #e7ebf3",
                        overflow: "hidden",
                        transition: "0.25s",
                        "&:hover": {
                          borderColor: "#c5d0f3",
                          boxShadow: "0 10px 30px rgba(37,59,128,0.07)",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          p: { xs: 2, sm: 2.5 },
                          display: "flex",
                          flexDirection: { xs: "column", sm: "row" },
                          gap: 3,
                        }}
                      >
                        {/* Product Image */}
                        <Box
                          sx={{
                            width: { xs: "100%", sm: 180 },
                            height: { xs: 190, sm: 170 },
                            flexShrink: 0,
                            bgcolor: "#f7f8fc",
                            borderRadius: 3,
                            position: "relative",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            p: 1.5,
                          }}
                        >
                          <CardMedia
                            component="img"
                            image={getImage(item.productImage)}
                            alt={item.productName}
                            sx={{
                              width: "100%",
                              height: "100%",
                              objectFit: "contain",
                            }}
                          />

                          <Chip
                            size="small"
                            label={
                              item.stock > 0 ? "In Stock" : "Out of Stock"
                            }
                            color={item.stock > 0 ? "success" : "error"}
                            sx={{
                              position: "absolute",
                              top: 10,
                              left: 10,
                              fontWeight: 750,
                              fontSize: 10,
                            }}
                          />
                        </Box>

                        {/* Product Details */}
                        <Box
                          sx={{
                            flex: 1,
                            minWidth: 0,
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="flex-start"
                            spacing={1}
                          >
                            <Box sx={{ minWidth: 0 }}>
                              <Typography
                                variant="h6"
                                fontWeight={800}
                                color="#172554"
                                sx={{ wordBreak: "break-word" }}
                              >
                                {item.productName}
                              </Typography>

                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                SKU: {item.sku || "N/A"}
                              </Typography>
                            </Box>

                            <IconButton
                              onClick={() => HandleDeleteCart(item._id)}
                              sx={{
                                bgcolor: "#fff1f2",
                                color: "#e11d48",
                                borderRadius: 2,
                                "&:hover": { bgcolor: "#ffe4e6" },
                              }}
                            >
                              <DeleteOutlineOutlinedIcon />
                            </IconButton>
                          </Stack>

                          <Typography
                            variant="h5"
                            fontWeight={850}
                            color="#253b80"
                            sx={{ mt: 1.5 }}
                          >
                            ₹{formatPrice(item.price)}
                          </Typography>

                          <Divider sx={{ my: 2 }} />

                          <Stack
                            direction={{ xs: "column", sm: "row" }}
                            justifyContent="space-between"
                            alignItems={{ xs: "flex-start", sm: "center" }}
                            spacing={2}
                            sx={{ mt: "auto" }}
                          >
                            {/* Quantity */}
                            <Box>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                fontWeight={700}
                              >
                                QUANTITY
                              </Typography>

                              <Stack
                                direction="row"
                                alignItems="center"
                                spacing={1.5}
                                sx={{ mt: 0.7 }}
                              >
                                <IconButton
                                  size="small"
                                  disabled={(item.quantity || 1) <= 1}
                                  onClick={() =>
                                    HandleQuantity(item._id, "remove")
                                  }
                                  sx={{
                                    border: "1px solid #dce2ee",
                                    borderRadius: 2,
                                    width: 34,
                                    height: 34,
                                    color: "#253b80",
                                  }}
                                >
                                  <RemoveIcon fontSize="small" />
                                </IconButton>

                                <Typography
                                  fontWeight={800}
                                  sx={{ minWidth: 20, textAlign: "center" }}
                                >
                                  {item.quantity || 1}
                                </Typography>

                                <IconButton
                                  size="small"
                                  disabled={
                                    (item.quantity || 1) >= item.stock ||
                                    item.stock <= 0
                                  }
                                  onClick={() =>
                                    HandleQuantity(item._id, "add")
                                  }
                                  sx={{
                                    border: "1px solid #dce2ee",
                                    borderRadius: 2,
                                    width: 34,
                                    height: 34,
                                    color: "#253b80",
                                  }}
                                >
                                  <AddIcon fontSize="small" />
                                </IconButton>
                              </Stack>
                            </Box>

                            {/* Item Total */}
                            <Box sx={{ textAlign: { sm: "right" } }}>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                fontWeight={700}
                              >
                                ITEM TOTAL
                              </Typography>
                              <Typography
                                variant="h6"
                                fontWeight={850}
                                color="#172554"
                              >
                                ₹
                                {formatPrice(
                                  Number(item.price || 0) *
                                    (item.quantity || 1)
                                )}
                              </Typography>
                            </Box>
                          </Stack>
                        </Box>
                      </Box>
                    </Card>
                  ))}
                </Stack>
              </Grid>

              {/* Order Summary */}
              <Grid size={{ xs: 12, lg: 3.5 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3.5,
                    border: "1px solid #e7ebf3",
                    bgcolor: "#fff",
                    position: { lg: "sticky" },
                    top: 100,
                  }}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1.5}
                  >
                    <Box
                      sx={{
                        width: 42,
                        height: 42,
                        borderRadius: 2,
                        bgcolor: "#eef2ff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Inventory2OutlinedIcon sx={{ color: "#253b80" }} />
                    </Box>

                    <Typography
                      variant="h6"
                      fontWeight={850}
                      color="#172554"
                    >
                      Order Summary
                    </Typography>
                  </Stack>

                  <Divider sx={{ my: 2.5 }} />

                  <Stack spacing={2}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                    >
                      <Typography color="text.secondary">
                        Total Products
                      </Typography>
                      <Typography fontWeight={750}>{deta.length}</Typography>
                    </Stack>

                    <Stack
                      direction="row"
                      justifyContent="space-between"
                    >
                      <Typography color="text.secondary">
                        Total Quantity
                      </Typography>
                      <Typography fontWeight={750}>{totalItems}</Typography>
                    </Stack>

                    <Stack
                      direction="row"
                      justifyContent="space-between"
                    >
                      <Typography color="text.secondary">
                        Subtotal
                      </Typography>
                      <Typography fontWeight={750}>
                        ₹{formatPrice(subtotal)}
                      </Typography>
                    </Stack>

                    <Stack
                      direction="row"
                      justifyContent="space-between"
                    >
                      <Typography color="text.secondary">
                        Shipping
                      </Typography>
                      <Typography
                        color="success.main"
                        fontWeight={750}
                      >
                        Free
                      </Typography>
                    </Stack>
                  </Stack>

                  <Divider sx={{ my: 2.5 }} />

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography fontWeight={800} color="#172554">
                      Grand Total
                    </Typography>

                    <Typography
                      variant="h5"
                      fontWeight={900}
                      color="#253b80"
                    >
                      ₹{formatPrice(subtotal)}
                    </Typography>
                  </Stack>

                  <Button
                    fullWidth
                    variant="contained"
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      mt: 3,
                      py: 1.6,
                      borderRadius: 2.5,
                      textTransform: "none",
                      fontWeight: 800,
                      fontSize: 15,
                      background:
                        "linear-gradient(135deg,#253b80,#536dce)",
                      boxShadow: "0 7px 18px rgba(37,59,128,0.2)",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg,#192c65,#4059b4)",
                        boxShadow: "0 9px 22px rgba(37,59,128,0.28)",
                      },
                    }}
                  >
                    Proceed to Checkout
                  </Button>

                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    justifyContent="center"
                    sx={{ mt: 2.5 }}
                  >
                    <SecurityOutlinedIcon
                      sx={{ fontSize: 17, color: "#16a34a" }}
                    />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Secure checkout experience
                    </Typography>
                  </Stack>

                  <Divider sx={{ my: 2.5 }} />

                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <LocalShippingOutlinedIcon
                      sx={{ color: "#536dce", fontSize: 25 }}
                    />
                    <Box>
                      <Typography fontWeight={750} fontSize={13}>
                        Free Shipping
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        No extra delivery charges
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
          )}
        </Box>
      </Box>
    </Drawers1>
  );
}
