import React, { useEffect, useState } from "react";
import Welcome from "../Component/Welcome";
import axios from "axios";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
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

  return (
    <>
      <Welcome />

      <Box
        sx={{
          background: "#f5f7fb",
          minHeight: "100vh",
          p: { xs: 2, md: 4 },
          mt: 7,
        }}
      >
        <Typography variant="h4" fontWeight="bold" mb={1}>
          Our Products
        </Typography>

        <Typography color="text.secondary" mb={3}>
          Explore our latest products
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" mt={5}>
            <CircularProgress />
          </Box>
        ) : deta.length === 0 ? (
          <Typography textAlign="center" mt={5}>
            No Products Found
          </Typography>
        ) : (
          <Grid container spacing={3} sx={{ mt: 3 }}>
            {deta.map((item) => {

              return (
                <Grid key={item._id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      boxShadow: 2,
                      height: "100%",
                      transition: "0.3s",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: 5,
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="220"
                      image={
                        item.productImage instanceof File
                          ? URL.createObjectURL(item.productImage)
                          : `http://localhost:5600${item.productImage}`
                      }
                      alt={item.productName}
                      sx={{
                        objectFit: "contain",
                        bgcolor: "#fff",
                        p: 2,
                      }}
                    />
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" noWrap>
                        {item.productName}
                      </Typography>

                      <Typography
                        color="text.secondary"
                        variant="body2"
                        sx={{
                          mt: 1,
                          minHeight: 40,
                        }}
                      >
                        {item.description}
                      </Typography>

                      <Typography
                        variant="h5"
                        color="primary"
                        fontWeight="bold"
                        sx={{ mt: 2 }}
                      >
                        ₹{item.price}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mt: 2,
                        }}
                      >
                        <Typography variant="body2">SKU: {item.sku}</Typography>

                        <Typography variant="body2">
                          Stock: {item.stock}
                        </Typography>
                      </Box>

                     
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>
    </>
  );
}
