
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Drawers1 from '../Component/Drawers1'

export default function SingleViewByUser() {
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    axios.get(
      `http://localhost:5600/view/product/user/single-view/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    )
    .then((res) => {
      console.log("Product Data:", res.data.data);
      setProduct(res.data.data);
    })
    .catch((er) => {
      console.log(er);
    })
    .finally(() => {
      setLoading(false);
    });
  }, [id]);

  // Product Image URL
  const imagePath = product.productImage;

  const imageUrl = imagePath
    ? imagePath instanceof File
      ? URL.createObjectURL(imagePath)
      : imagePath.startsWith("http")
        ? imagePath
        : `http://localhost:5600/${imagePath.replace(/^\/+/, "")}`
    : "";

  // Product Details
  const productDetails = [
    ["Product", product.productName],
    ["Unit", product.stock],
    ["SKU", product.sku],
    ["Price", product.price],
    ["Description", product.description]
  ];

  if (loading) {
    return (
      <Box sx={{
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Drawers1>


    
    <Box sx={{
      minHeight: "100vh",
      bgcolor: "#f5f6f8",
      p: { xs: 2, md: 3 }
    }}>

    
      {/* Heading */}

      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        mb={3}
        sx={{mt:6}}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{
            bgcolor: "#e0eaff",
            color: "#2563eb",
            width: 50,
            height: 50
          }}>
            <ShoppingBagIcon />
          </Avatar>

          <Box>
            <Typography variant="h4" fontWeight="bold">
              Product Details
            </Typography>

            <Typography color="text.secondary">
              View complete product information
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
        </Stack>
      </Stack>

      {/* Main Content */}

      <Grid container spacing={3} sx={{mt:2}}>

        {/* Left Side - Product Details */}

        <Grid size={{ xs: 12, md: 8 }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, md: 3 },
              border: "1px solid #e2e8f0",
              borderRadius: 3,
              height: "100%"
            }}
          >

            {/* SKU Header */}

            <Box sx={{
              border: "1px solid #cbd5e1",
              p: 2,
              // width: { xs: "10%", sm: 300 },
              mb: 3,
              borderRadius: 1
            }}>
              <Typography
                variant="body2"
                color="text.secondary"
                mb={1}
              >
                PRODUCT SKU
              </Typography>

              <Typography
                variant="h5"
                fontWeight="bold"
                letterSpacing={2}
              >
                {product.sku || "N/A"}
              </Typography>
            </Box>

            {/* Details Table */}

            <Table
              sx={{
                border: "1px solid #cbd5e1",
                "& td": {
                  border: "1px solid #cbd5e1",
                  py: 1.5,
                  px: 1.8,
                  fontSize: 15
                }
              }}
            >
              <TableBody>
                {productDetails.map(([label, value]) => (
                  <TableRow key={label}>

                    <TableCell
                      sx={{
                        width: "30%",
                        color: "#16375b",
                        fontWeight: 600,
                        bgcolor: "#fafafa"
                      }}
                    >
                      {label}
                    </TableCell>

                    <TableCell sx={{
                      color: "#222",
                      fontWeight: 500,
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word"
                    }}>
                      {value !== undefined &&
                       value !== null &&
                       value !== ""
                        ? label === "Price"
                          ? `₹${value}`
                          : label === "Tax"
                            ? `${value}%`
                            : value
                        : "None"}
                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>

          </Paper>
        </Grid>

        {/* Right Side - Product Image */}

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: "1px solid #e2e8f0",
              borderRadius: 3,
              textAlign: "center",
              height: "fit-content"
            }}
          >

            <Typography
              variant="h6"
              fontWeight="bold"
              mb={2}
            >
              Product Image
            </Typography>

            <Box sx={{
              height: 280,
              bgcolor: "#f8fafc",
              borderRadius: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
              border: "1px solid #edf0f5"
            }}>
              {imageUrl ? (
                <Box
                  component="img"
                  src={imageUrl}
                  alt={product.productName}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    p: 2
                  }}
                />
              ) : (
                <Typography color="text.secondary">
                  No Product Image
                </Typography>
              )}
            </Box>

            <Typography
              variant="subtitle1"
              fontWeight="600"
              mt={2}
            >
              {product.productName || "Product Image"}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              mt={1}
            >
              {imagePath
                ? String(imagePath).split("/").pop()
                : "No image uploaded"}
            </Typography>

          </Paper>
        </Grid>

      </Grid>
    </Box>
    </Drawers1>
  );
}
