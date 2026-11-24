import React, { useEffect, useState } from "react";
import axios from "axios";
import Drawers1 from "../Component/Drawers1";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import Swal from "sweetalert2";

export default function Wishlist() {
  const [wishlist, setwishlist] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5600/wish/user/viewlist", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setwishlist(res.data.deta || []);
      })
      .catch((er) => {
        console.log(er);
      });
  }, []);

  const HandlDeletewishlist = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to remove this product from your wishlist?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Remove it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:5600/wish/user/delete-wish/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((res) => {
            Swal.fire({
              title: "Removed!",
              text:
                res.data.message ||
                "Product removed from wishlist successfully.",
              icon: "success",
              timer: 2000,
              showConfirmButton: false,
            });

            setwishlist((prev) => prev.filter((item) => item._id !== id));
          })
          .catch((er) => {
            Swal.fire({
              title: "Error!",
              text:
                er.response?.data?.message ||
                "Something went wrong. Please try again.",  
              icon: "error",
              confirmButtonColor: "#d33",
            });
          });
      }
    });
  };
  return (
    <Drawers1>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#f5f7fb",
          pt: 11,
          px: { xs: 2, sm: 3, md: 4 },
          pb: 5,
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "flex-start", sm: "center" }}
            justifyContent="space-between"
            spacing={2}
          >
            <Box>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2.5,
                    bgcolor: "#ffe5e9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FavoriteIcon sx={{ color: "#e53950", fontSize: 27 }} />
                </Box>

                <Box>
                  <Typography variant="h4" fontWeight={800} color="#172033">
                    My Wishlist
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Your favourite products, all in one place
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <Chip
              icon={<FavoriteIcon />}
              label={`${wishlist.length} Saved Products`}
              sx={{
                bgcolor: "#fff",
                color: "#e53950",
                fontWeight: 700,
                border: "1px solid #f2d6dc",
                px: 1,
                py: 2.3,
                "& .MuiChip-icon": { color: "#e53950" },
              }}
            />
          </Stack>
        </Box>

        <Divider sx={{ mb: 3, borderColor: "#e6eaf0" }} />

        {/* Product Grid */}
        {wishlist.length > 0 ? (
          <Grid container spacing={3}>
            {wishlist.map((item) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={item._id}>
                <Card
                  sx={{
                    height: "100%",
                    borderRadius: 3,
                    bgcolor: "#fff",
                    overflow: "hidden",
                    border: "1px solid #edf0f5",
                    boxShadow: "0 3px 15px rgba(20,35,60,0.04)",
                    display: "flex",
                    flexDirection: "column",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-7px)",
                      boxShadow: "0 12px 28px rgba(20,35,60,0.12)",
                    },
                  }}
                >
                  {/* Image Section */}
                  <Box
                    sx={{
                      position: "relative",
                      bgcolor: "#f8f9fc",
                      p: 2,
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={`http://localhost:5600${item.productImage}`}
                      alt={item.productName}
                      sx={{
                        height: 200,
                        objectFit: "contain",
                        mixBlendMode: "multiply",
                      }}
                    />

                    <IconButton
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 14,
                        right: 14,
                        bgcolor: "#fff",
                        color: "#e53950",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        "&:hover": {
                          bgcolor: "#ffe5e9",
                        },
                      }}
                    >
                      <FavoriteIcon fontSize="small" />
                    </IconButton>

                    <Chip
                      label={item.stock > 0 ? "Available" : "Sold Out"}
                      size="small"
                      color={item.stock > 0 ? "success" : "error"}
                      sx={{
                        position: "absolute",
                        bottom: 12,
                        left: 12,
                        fontWeight: 700,
                        bgcolor: item.stock > 0 ? "#e5f7ed" : "#ffebee",
                        color: item.stock > 0 ? "#16834a" : "#d32f2f",
                      }}
                    />
                  </Box>

                  {/* Product Details */}
                  <CardContent sx={{ px: 2.2, pt: 2.2, flexGrow: 1 }}>
                    <Typography
                      variant="h6"
                      fontWeight={750}
                      color="#202b40"
                      noWrap
                      sx={{ fontSize: "17px" }}
                    >
                      {item.productName}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mt: 0.5 }}
                    >
                      Product SKU: {item.sku}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mt: 1.5,
                        lineHeight: 1.6,
                        minHeight: 44,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {item.description || "No description available"}
                    </Typography>

                    <Divider sx={{ my: 1.8 }} />

                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Price
                        </Typography>

                        <Typography
                          variant="h5"
                          fontWeight={800}
                          color="#253b80"
                        >
                          ₹{item.price?.toLocaleString("en-IN")}
                        </Typography>
                      </Box>

                      <Chip
                        size="small"
                        label={
                          item.stock > 0 ? `${item.stock} Left` : "Unavailable"
                        }
                        variant="outlined"
                        color={item.stock > 0 ? "success" : "error"}
                      />
                    </Stack>
                  </CardContent>

                  {/* Actions */}
                  <CardActions sx={{ px: 2.2, pb: 2.2, pt: 0 }}>
                    <Stack direction="row" spacing={1} width="100%">
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<ShoppingCartOutlinedIcon />}
                        disabled={item.stock <= 0}
                        sx={{
                          bgcolor: "#253b80",
                          borderRadius: 2,
                          textTransform: "none",
                          fontWeight: 700,
                          py: 1,
                          boxShadow: "none",
                          "&:hover": {
                            bgcolor: "#192c65",
                            boxShadow: "none",
                          },
                        }}
                      >
                        Add to Cart
                      </Button>

                      <IconButton
                        color="error"
                        sx={{
                          border: "1px solid #ffcdd2",
                          borderRadius: 2,
                          "&:hover": {
                            bgcolor: "#ffebee",
                          },
                        }}
                        onClick={() => {
                          HandlDeletewishlist(item._id);
                        }}
                      >
                        <DeleteOutlineOutlinedIcon />
                      </IconButton>
                    </Stack>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          /* Empty Wishlist */
          <Box
            sx={{
              minHeight: 400,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              bgcolor: "#fff",
              borderRadius: 4,
              border: "1px solid #edf0f5",
              px: 2,
            }}
          >
            <Box
              sx={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                bgcolor: "#ffecef",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <FavoriteIcon sx={{ fontSize: 50, color: "#e53950" }} />
            </Box>

            <Typography variant="h5" fontWeight={800} color="#202b40">
              Your Wishlist is Empty
            </Typography>

            <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 350 }}>
              You haven't saved any products yet. Explore products and add your
              favourites here.
            </Typography>
          </Box>
        )}
      </Box>
    </Drawers1>
  );
}
