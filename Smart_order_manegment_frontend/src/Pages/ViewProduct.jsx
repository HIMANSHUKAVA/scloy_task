
import React, { useEffect, useState } from "react";
import axios from "axios";

import Drawers1 from "../Component/Drawers1";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Divider from "@mui/material/Divider";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";

import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function ViewProduct() {
  const [deta, setdeta] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Fetch Products
  useEffect(() => {
    axios
      .get("http://localhost:5600/view/product/user/getdeta", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((re) => {
        setdeta(re.data.data);
      })
      .catch((er) => {
        console.log(er);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Add To Wishlist
  const HandleAddWishlist = (id) => {
    axios
      .post(
        `http://localhost:5600/wish/user/add-wish/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        Swal.fire({
          title: "Added to Wishlist!",
          text: res.data.message || "Product added successfully.",
          icon: "success",
          timer: 1800,
          showConfirmButton: false,
        }).then(() => {
          navigate("/wishlist");
        });
      })
      .catch((er) => {
        Swal.fire({
          title: "Oops!",
          text:
            er.response?.data?.message ||
            "Unable to add product to wishlist.",
          icon: "error",
          confirmButtonColor: "#4f46e5",
        });
      });
  };

  // Add To Cart
  const HandleAddCart = (id) => {
    axios
      .post(
        `http://localhost:5600/cart/user/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        Swal.fire({
          title: "Added to Cart!",
          text: res.data.message || "Product added to cart successfully.",
          icon: "success",
          timer: 1800,
          showConfirmButton: false,
        });
      })
      .catch((er) => {
        Swal.fire({
          title: "Error!",
          text:
            er.response?.data?.message ||
            "Unable to add product to cart.",
          icon: "error",
          confirmButtonColor: "#4f46e5",
        });
      });
  };

  return (
    <Drawers1>
      <Box
        sx={{
          width: "100%",
          maxWidth: 1500,
          mx: "auto",
          mt:7
        }}
      >
        {/* Page Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            flexWrap: "wrap",
            gap: 2,
            mb: 3.5,
          }}
        >
          <Box>
            <Typography
              variant="h5"
              fontWeight={800}
              color="#172033"
              sx={{ mb: 0.7 }}
            >
              Explore Products
            </Typography>

            <Typography fontSize={14} color="#8490a5">
              Discover our collection and find something you love.
            </Typography>
          </Box>

          <Chip
            icon={<Inventory2OutlinedIcon />}
            label={`${deta.length} Products`}
            sx={{
              height: 38,
              px: 1,
              borderRadius: 2.5,
              fontWeight: 700,
              color: "#4338ca",
              bgcolor: "#eef2ff",
              border: "1px solid #c7d2fe",
              "& .MuiChip-icon": {
                color: "#4f46e5",
              },
            }}
          />
        </Box>

        {/* Product Banner */}
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 4,
            p: { xs: 3, md: 3.5 },
            mb: 4,
            color: "#fff",
            background:
              "linear-gradient(110deg, #1e1b4b 0%, #3730a3 60%, #6366f1 100%)",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              width: 190,
              height: 190,
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.15)",
              right: -30,
              top: -100,
            }}
          />

          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            sx={{ position: "relative", zIndex: 1 }}
          >
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: 2.5,
                display: "grid",
                placeItems: "center",
                bgcolor: "rgba(255,255,255,0.15)",
              }}
            >
              <ShoppingBagOutlinedIcon sx={{ fontSize: 29 }} />
            </Box>

            <Box>
              <Typography fontSize={20} fontWeight={800}>
                Our Product Collection
              </Typography>

              <Typography fontSize={13} color="#e0e7ff">
                Quality products, all in one place.
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* Loading */}
        {loading ? (
          <Box
            sx={{
              minHeight: "45vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <CircularProgress
              size={42}
              thickness={4}
              sx={{ color: "#4f46e5" }}
            />

            <Typography color="#8490a5" fontSize={14}>
              Loading products...
            </Typography>
          </Box>
        ) : deta.length === 0 ? (
          /* Empty State */
          <Box
            sx={{
              textAlign: "center",
              py: 9,
              px: 2,
              bgcolor: "#fff",
              borderRadius: 4,
              border: "1px solid #e9edf5",
            }}
          >
            <Box
              sx={{
                width: 85,
                height: 85,
                mx: "auto",
                mb: 2,
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                bgcolor: "#eef2ff",
                color: "#6366f1",
              }}
            >
              <ShoppingBagOutlinedIcon sx={{ fontSize: 42 }} />
            </Box>

            <Typography variant="h5" fontWeight={800} color="#172033">
              No Products Found
            </Typography>

            <Typography fontSize={14} color="#94a3b8" mt={1}>
              Products will appear here when they become available.
            </Typography>
          </Box>
        ) : (
          /* Product Cards */
          <Grid container spacing={3}>
            {deta.map((item) => (
              <Grid
                key={item._id}
                size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
              >
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 3.5,
                    overflow: "hidden",
                    bgcolor: "#fff",
                    border: "1px solid #e9edf5",
                    transition: "all 0.3s ease",

                    "&:hover": {
                      transform: "translateY(-6px)",
                      borderColor: "#c7d2fe",
                      boxShadow: "0 15px 35px rgba(30,41,59,0.10)",
                    },
                  }}
                >
                  {/* Product Image */}
                  <Box
                    sx={{
                      position: "relative",
                      p: 2,
                      bgcolor: "#f8faff",
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={`http://localhost:5600${item.productImage}`}
                      alt={item.productName}
                      sx={{
                        height: 215,
                        width: "100%",
                        objectFit: "contain",
                        transition: "transform 0.35s ease",
                        "&:hover": {
                          transform: "scale(1.06)",
                        },
                      }}
                    />

                    {/* Stock Status */}
                    <Chip
                      label={
                        item.stock > 0 ? "In Stock" : "Out of Stock"
                      }
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 14,
                        left: 14,
                        fontWeight: 700,
                        fontSize: 11,
                        bgcolor:
                          item.stock > 0 ? "#dcfce7" : "#fee2e2",
                        color:
                          item.stock > 0 ? "#15803d" : "#dc2626",
                        border: "1px solid",
                        borderColor:
                          item.stock > 0 ? "#bbf7d0" : "#fecaca",
                      }}
                    />

                    {/* Wishlist */}
                    <Tooltip title="Add to Wishlist">
                      <IconButton
                        onClick={() => HandleAddWishlist(item._id)}
                        sx={{
                          position: "absolute",
                          top: 10,
                          right: 10,
                          width: 38,
                          height: 38,
                          bgcolor: "#fff",
                          color: "#e11d48",
                          boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
                          "&:hover": {
                            bgcolor: "#fff1f2",
                            transform: "scale(1.08)",
                          },
                        }}
                      >
                        <FavoriteBorderIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  {/* Product Details */}
                  <CardContent
                    sx={{
                      p: 2.5,
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Typography
                      fontSize={16}
                      fontWeight={800}
                      color="#172033"
                      noWrap
                    >
                      {item.productName}
                    </Typography>

                    <Typography
                      fontSize={12}
                      color="#8490a5"
                      sx={{
                        mt: 1,
                        minHeight: 38,
                        lineHeight: 1.6,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {item.description || "No description available"}
                    </Typography>

                    {/* Price */}
                    <Box sx={{ mt: 2 }}>
                      <Typography
                        fontSize={12}
                        color="#94a3b8"
                        fontWeight={600}
                      >
                        PRICE
                      </Typography>

                      <Typography
                        fontSize={25}
                        fontWeight={800}
                        color="#4338ca"
                      >
                        ₹{item.price}
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 2, borderColor: "#edf0f5" }} />

                    {/* SKU and Stock */}
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      gap={1}
                    >
                      <Box sx={{ minWidth: 0 }}>
                        <Typography fontSize={10} color="#94a3b8">
                          PRODUCT SKU
                        </Typography>

                        <Typography
                          fontSize={11}
                          fontWeight={700}
                          color="#475569"
                          noWrap
                        >
                          {item.sku}
                        </Typography>
                      </Box>

                      <Box sx={{ textAlign: "right" }}>
                        <Typography fontSize={10} color="#94a3b8">
                          AVAILABLE
                        </Typography>

                        <Typography
                          fontSize={12}
                          fontWeight={800}
                          color={
                            item.stock > 0 ? "#16a34a" : "#dc2626"
                          }
                        >
                          {item.stock} Units
                        </Typography>
                      </Box>
                    </Stack>

                    {/* View Details */}
                    <Button
                      fullWidth
                      variant="contained"
                      endIcon={<ArrowForwardIcon />}
                      disabled={item.stock <= 0}
                      onClick={() => {
                        navigate(`/view-single/${item._id}`);
                      }}
                      sx={{
                        mt: 2.5,
                        py: 1.2,
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 700,
                        bgcolor: "#4f46e5",
                        boxShadow: "none",
                        "&:hover": {
                          bgcolor: "#4338ca",
                          boxShadow: "0 5px 14px rgba(79,70,229,0.2)",
                        },
                        "&.Mui-disabled": {
                          bgcolor: "#e2e8f0",
                          color: "#94a3b8",
                        },
                      }}
                    >
                      View Details
                    </Button>

                    {/* Add To Cart */}
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<AddShoppingCartIcon />}
                      disabled={item.stock <= 0}
                      onClick={() => HandleAddCart(item._id)}
                      sx={{
                        mt: 1.2,
                        py: 1.1,
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 700,
                        color: "#475569",
                        borderColor: "#dbe1eb",
                        "&:hover": {
                          bgcolor: "#eef2ff",
                          color: "#4338ca",
                          borderColor: "#818cf8",
                        },
                      }}
                    >
                      Add To Cart
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Drawers1>
  );
}
