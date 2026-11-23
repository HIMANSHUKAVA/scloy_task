
import React, { useEffect, useState } from "react";
import Drawers1 from "../Component/Drawers1";
import axios from "axios";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";

import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

export default function Wishlist() {
  const [deta, setdeta] = useState([]);
  const [loading, setloading] = useState(true);

  useEffect(() => {
    const FetchWishlist = async () => {
      try {
        const token = localStorage.getItem("token");

        // First API: Fetch Wishlist Product IDs
        const res = await axios.get(
          "http://localhost:5600/wish/user/viewlist",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const wishlist = res.data.deta;

        // Second API: Fetch Individual Product Details
        const products = await Promise.all(
          wishlist.map(async (item) => {
            const result = await axios.get(
              `http://localhost:5600/wish/user/wishsingle/${item.productId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            return result.data.deta;
          })
        );

        setdeta(products.filter(Boolean));

      } catch (er) {
        console.log(er.response?.data || er.message);
      } finally {
        setloading(false);
      }
    };

    FetchWishlist();
  }, []);

  return (
    <Drawers1>
      <Box
        sx={{
          bgcolor: "#f5f7fb",
          minHeight: "100vh",
          pt: 10,
          px: { xs: 2, sm: 3, md: 5 },
          pb: 4,
        }}
      >
        <Typography variant="h4" fontWeight={700} mb={1}>
          My Wishlist
        </Typography>

        <Typography color="text.secondary" mb={4}>
          Manage your favorite products
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
            <CircularProgress />
          </Box>
        ) : deta.length === 0 ? (
          <Box sx={{ textAlign: "center", mt: 8 }}>
            <FavoriteIcon sx={{ fontSize: 65, color: "#cbd5e1" }} />

            <Typography variant="h6" mt={2}>
              Your Wishlist is Empty
            </Typography>

            <Typography color="text.secondary">
              Add your favorite products to your wishlist.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {deta.map((product, index) => {
              const image = product.productImage;
              const name = product.productName;

              return (
                <Grid
                  key={product._id || index}
                  size={{ xs: 12, sm: 6, md: 4 }}
                >
                  <Card
                    sx={{
                      borderRadius: 3,
                      overflow: "hidden",
                      transition: "0.3s",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: 5,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        bgcolor: "#f8fafc",
                        p: 2,
                      }}
                    >
                      <IconButton
                        sx={{
                          position: "absolute",
                          top: 10,
                          right: 10,
                          bgcolor: "white",
                          zIndex: 1,
                        }}
                      >
                        <FavoriteIcon sx={{ color: "red" }} />
                      </IconButton>

                      {image ? (
                        <CardMedia
                          component="img"
                          image={
                            image.startsWith("http")
                              ? image
                              : `http://localhost:5600/${image}`
                          }
                          alt={name}
                          sx={{
                            height: 190,
                            objectFit: "contain",
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            height: 190,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Typography color="text.secondary">
                            No Image Available
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    <CardContent>
                      <Typography variant="h6" fontWeight={700}>
                        {name}
                      </Typography>

                      <Typography
                        color="primary.main"
                        fontWeight={700}
                        mt={1}
                      >
                        ₹{product.price}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        Available Stock: {product.stock}
                      </Typography>
                    </CardContent>

                    <CardActions sx={{ px: 2, pb: 2 }}>
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<ShoppingCartIcon />}
                      >
                        Add to Cart
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>
    </Drawers1>
  );
}
