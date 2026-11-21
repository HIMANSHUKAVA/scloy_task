
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
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";

export default function ViewProduct() {
  const [deta, setdeta] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const navigate = useNavigate();
  return (
    <Drawers1>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#f4f6fb",
          p: { xs: 2, sm: 3, md: 4 },
          width:"100%",
          boxSizing: "border-box",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            flexWrap: "wrap",
            gap: 2,
            mb: 4,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              fontWeight={800}
              color="#172554"
              sx={{ fontSize: { xs: 26, md: 32 } }}
            >
              Our Products
            </Typography>

            <Typography color="text.secondary" mt={1}>
              Discover our latest collection of products.
            </Typography>
          </Box>

          <Chip
            icon={<Inventory2OutlinedIcon />}
            label={`${deta.length} Products`}
            color="primary"
            variant="outlined"
            sx={{
              fontWeight: 700,
              px: 1,
              py: 2,
              borderRadius: 2,
            }}
          />
        </Box>

        {/* Loading */}
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "50vh",
            }}
          >
            <CircularProgress />
          </Box>
        ) : deta.length === 0 ? (
          /* Empty State */
          <Box
            sx={{
              textAlign: "center",
              py: 10,
              bgcolor: "white",
              borderRadius: 4,
            }}
          >
            <ShoppingBagIcon
              sx={{ fontSize: 65, color: "#94a3b8", mb: 2 }}
            />

            <Typography variant="h5" fontWeight="bold">
              No Products Found
            </Typography>

            <Typography color="text.secondary" mt={1}>
              Products will appear here when available.
            </Typography>
          </Box>
        ) : (
          /* Product Cards */
          <Grid container spacing={3}>
            {deta.map((item) => (
              <Grid key={item._id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <Card
                  sx={{
                    height: "100%",
                    borderRadius: 3,
                    overflow: "hidden",
                    bgcolor: "white",
                    boxShadow: "0 3px 15px rgba(0,0,0,0.05)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-7px)",
                      boxShadow: "0 12px 28px rgba(0,0,0,0.12)",
                    },
                  }}
                >
                  {/* Image */}
                  <Box
                    sx={{
                      position: "relative",
                      bgcolor: "#f8fafc",
                      p: 2,
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={`http://localhost:5600${item.productImage}`}
                      alt={item.productName}
                      sx={{
                        height: 210,
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
                  <CardContent sx={{ p: 2.5 }}>
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      color="#1e293b"
                      noWrap
                    >
                      {item.productName}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mt: 1,
                        minHeight: 40,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {item.description || "No description available"}
                    </Typography>

                    <Typography
                      variant="h5"
                      fontWeight={800}
                      color="primary.main"
                      sx={{ mt: 2 }}
                    >
                      ₹{item.price}
                    </Typography>

                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{
                        mt: 2,
                        pt: 2,
                        borderTop: "1px solid #e2e8f0",
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        SKU: {item.sku}
                      </Typography>

                      <Typography
                        variant="caption"
                        fontWeight={700}
                        color={item.stock > 0 ? "success.main" : "error.main"}
                      >
                        Stock: {item.stock}
                      </Typography>
                    </Stack>

                    <Button
                      fullWidth
                      variant="outlined"
                      endIcon={<ArrowForwardIcon />}
                      disabled={item.stock <= 0}
                      sx={{
                        mt: 2,
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 700,
                      }}
                      onClick={()=>{
                        navigate(`/view-single/${item._id}`)
                      }}
                    >
                      View Details
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
