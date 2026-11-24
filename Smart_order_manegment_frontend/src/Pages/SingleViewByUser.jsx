
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";

import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";

import Drawers1 from "../Component/Drawers1";
import PriceSummary from "../ReuseComponent/PriceSummary";

export default function SingleViewByUser() {
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [inputQuantity, setInputQuantity] = useState("1");

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);

    axios
      .get(`http://localhost:5600/view/product/user/single-view/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        const data = res.data.data;
        setProduct(data);
        setQuantity(1);
        setInputQuantity("1");
      })
      .catch((er) => {
        console.log(er);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const stock = Math.max(0, Number(product.stock) || 0);

  const imagePath = product.productImage;

  const imageUrl = imagePath
    ? imagePath instanceof File
      ? URL.createObjectURL(imagePath)
      : imagePath.startsWith("http")
        ? imagePath
        : `http://localhost:5600/${imagePath.replace(/^\/+/, "")}`
    : "";

  const handleQuantityChange = (value) => {
    const newQuantity = Number(value);

    if (!Number.isInteger(newQuantity) || newQuantity < 1) return;

    if (newQuantity > stock) return;

    setQuantity(newQuantity);
    setInputQuantity(String(newQuantity));
  };

  const handleInputChange = (value) => {
    setInputQuantity(value);

    if (value === "") return;

    const newQuantity = Number(value);

    if (
      Number.isInteger(newQuantity) &&
      newQuantity >= 1 &&
      newQuantity <= stock
    ) {
      setQuantity(newQuantity);
    }
  };

  const handleAddQuantity = () => {
    const newQuantity = Number(inputQuantity);

    if (
      !Number.isInteger(newQuantity) ||
      newQuantity < 1 ||
      newQuantity > stock
    ) {
      setInputQuantity(String(quantity));
      return;
    }

    setQuantity(newQuantity);
  };

  if (loading) {
    return (
      <Drawers1>
        <Box
          sx={{
            minHeight: "80vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      </Drawers1>
    );
  }

  if (!product || !product._id) {
    return (
      <Drawers1>
        <Box sx={{ p: 4, textAlign: "center", mt: 8 }}>
          <Typography variant="h5" fontWeight={700}>
            Product Not Found
          </Typography>
          <Button sx={{ mt: 2 }} onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </Box>
      </Drawers1>
    );
  }

  return (
    <Drawers1>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#f5f7fc",
          px: { xs: 2, sm: 3, md: 4 },
          py: 3,
          pt: { xs: 8, md: 9 },
        }}
      >
        {/* PAGE HEADER */}

        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
          mb={3}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: 3,
                bgcolor: "#e9edff",
                color: "#4f46e5",
                display: "grid",
                placeItems: "center",
              }}
            >
              <ShoppingBagIcon fontSize="large" />
            </Box>

            <Box>
              <Typography
                variant="h4"
                fontWeight={800}
                color="#172554"
                sx={{ fontSize: { xs: 25, md: 30 } }}
              >
                Product Details
              </Typography>

              <Typography color="text.secondary" fontSize={14}>
                Explore product information and pricing
              </Typography>
            </Box>
          </Stack>

          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 700,
              px: 2.5,
              py: 1,
              borderColor: "#cbd5e1",
              color: "#334155",
            }}
          >
            Back to Products
          </Button>
        </Stack>

        {/* MAIN CONTENT */}

        <Grid container spacing={3} alignItems="flex-start">

          {/* LEFT PRODUCT INFORMATION */}

          <Grid size={{ xs: 12, md: 7.5 }}>
            <Stack spacing={3}>

              {/* PRODUCT OVERVIEW */}

              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2, md: 3 },
                  borderRadius: 4,
                  border: "1px solid #e5eaf2",
                  bgcolor: "#fff",
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={3}
                >
                  <Typography variant="h6" fontWeight={800} color="#172554">
                    Product Overview
                  </Typography>

                  <Chip
                    icon={<VerifiedOutlinedIcon />}
                    label="Verified Product"
                    size="small"
                    sx={{
                      bgcolor: "#ecfdf5",
                      color: "#047857",
                      fontWeight: 700,
                    }}
                  />
                </Stack>

                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    bgcolor: "#f5f7ff",
                    border: "1px solid #e0e7ff",
                  }}
                >
                  <Typography
                    variant="caption"
                    color="#64748b"
                    fontWeight={700}
                    letterSpacing={1.2}
                  >
                    PRODUCT SKU
                  </Typography>

                  <Typography
                    variant="h5"
                    fontWeight={800}
                    color="#3730a3"
                    letterSpacing={2}
                    mt={0.5}
                    sx={{ wordBreak: "break-word" }}
                  >
                    {product.sku || "N/A"}
                  </Typography>
                </Box>

                <Grid container spacing={2} mt={1}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: "#f8fafc",
                        borderRadius: 3,
                        border: "1px solid #edf0f5",
                      }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        <LocalOfferOutlinedIcon color="primary" />
                        <Typography color="text.secondary" fontSize={13}>
                          Product Price
                        </Typography>
                      </Stack>

                      <Typography
                        variant="h5"
                        fontWeight={800}
                        color="#172554"
                        mt={1}
                      >
                        ₹{Number(product.price || 0).toLocaleString("en-IN")}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: "#f8fafc",
                        borderRadius: 3,
                        border: "1px solid #edf0f5",
                      }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Inventory2OutlinedIcon color="primary" />
                        <Typography color="text.secondary" fontSize={13}>
                          Available Stock
                        </Typography>
                      </Stack>

                      <Typography
                        variant="h5"
                        fontWeight={800}
                        color={stock > 0 ? "#059669" : "#dc2626"}
                        mt={1}
                      >
                        {stock} Units
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" fontWeight={800} mb={2}>
                  Product Information
                </Typography>

                <Stack spacing={2}>
                  {[
                    ["Product Name", product.productName],
                    ["SKU", product.sku],
                    ["Available Units", product.stock],
                    ["Unit Price", `₹${product.price || 0}`],
                  ].map(([label, value]) => (
                    <Stack
                      key={label}
                      direction="row"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      spacing={2}
                    >
                      <Typography
                        color="text.secondary"
                        fontSize={14}
                        fontWeight={600}
                      >
                        {label}
                      </Typography>

                      <Typography
                        color="#1e293b"
                        fontSize={14}
                        fontWeight={700}
                        textAlign="right"
                        sx={{ wordBreak: "break-word" }}
                      >
                        {value || "N/A"}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" fontWeight={800} mb={1}>
                  Description
                </Typography>

                <Typography
                  color="text.secondary"
                  lineHeight={1.9}
                  fontSize={14}
                  sx={{ whiteSpace: "pre-wrap" }}
                >
                  {product.description || "No description available."}
                </Typography>
              </Paper>

              {/* QUANTITY SELECTOR */}

              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2, md: 3 },
                  borderRadius: 4,
                  border: "1px solid #e5eaf2",
                }}
              >
                <Typography variant="h6" fontWeight={800} color="#172554">
                  Select Quantity
                </Typography>

                <Typography color="text.secondary" fontSize={13} mt={0.5}>
                  Choose how many units you want to purchase.
                </Typography>

                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  alignItems={{ xs: "stretch", sm: "center" }}
                  mt={3}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    sx={{
                      border: "1px solid #cbd5e1",
                      borderRadius: 2,
                      width: "fit-content",
                      overflow: "hidden",
                    }}
                  >
                    <IconButton
                      disabled={quantity <= 1}
                      onClick={() => handleQuantityChange(quantity - 1)}
                      sx={{ borderRadius: 0 }}
                    >
                      <RemoveIcon />
                    </IconButton>

                    <TextField
                      type="number"
                      value={inputQuantity}
                      onChange={(e) => handleInputChange(e.target.value)}
                      onBlur={handleAddQuantity}
                      size="small"
                      sx={{
                        width: 85,
                        "& fieldset": { border: "none" },
                        "& input": {
                          textAlign: "center",
                          fontWeight: 800,
                        },
                      }}
                      inputProps={{
                        min: 1,
                        max: stock,
                      }}
                    />

                    <IconButton
                      disabled={quantity >= stock}
                      onClick={() => handleQuantityChange(quantity + 1)}
                      sx={{ borderRadius: 0 }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Stack>

                  <Button
                    variant="contained"
                    startIcon={<ShoppingBagIcon />}
                    onClick={handleAddQuantity}
                    disabled={stock <= 0}
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 800,
                      bgcolor: "#4f46e5",
                      boxShadow: "0 6px 15px rgba(79,70,229,0.2)",
                      "&:hover": { bgcolor: "#3730a3" },
                    }}
                  >
                    Update Quantity
                  </Button>
                </Stack>

                <Typography
                  color="text.secondary"
                  fontSize={12}
                  mt={2}
                >
                  Maximum available quantity: {stock} units
                </Typography>

                {stock <= 0 && (
                  <Chip
                    label="Currently Out of Stock"
                    color="error"
                    sx={{ mt: 2 }}
                  />
                )}
              </Paper>
            </Stack>
          </Grid>

          {/* RIGHT SIDE IMAGE + PRICE SUMMARY */}

          <Grid size={{ xs: 12, md: 4.5 }}>
            <Stack spacing={3}>

              {/* IMAGE CARD */}

              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 4,
                  border: "1px solid #e5eaf2",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <Chip
                  label="PRODUCT IMAGE"
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 18,
                    left: 18,
                    zIndex: 1,
                    bgcolor: "#eef2ff",
                    color: "#4338ca",
                    fontWeight: 800,
                    fontSize: 10,
                  }}
                />

                <Box
                  sx={{
                    height: { xs: 260, sm: 340 },
                    mt: 2,
                    bgcolor: "#f8fafc",
                    borderRadius: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    border: "1px solid #edf0f5",
                  }}
                >
                  {imageUrl ? (
                    <Box
                      component="img"
                      src={imageUrl}
                      alt={product.productName}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        p: 2,
                        transition: "transform 0.35s ease",
                        "&:hover": {
                          transform: "scale(1.06)",
                        },
                      }}
                    />
                  ) : (
                    <Stack alignItems="center" spacing={1}>
                      <ShoppingBagIcon
                        sx={{ fontSize: 55, color: "#cbd5e1" }}
                      />
                      <Typography color="text.secondary">
                        No Product Image
                      </Typography>
                    </Stack>
                  )}
                </Box>

                <Typography
                  variant="h6"
                  fontWeight={800}
                  color="#172554"
                  mt={2}
                >
                  {product.productName}
                </Typography>

                <Typography
                  color="text.secondary"
                  fontSize={12}
                  mt={0.5}
                  sx={{ wordBreak: "break-word" }}
                >
                  {imagePath
                    ? String(imagePath).split("/").pop()
                    : "No image uploaded"}
                </Typography>
              </Paper>

              {/* PRICE SUMMARY */}

              <PriceSummary
                price={product.price}
                quantity={quantity}
                tax={5}
                productId={product._id}
              />
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Drawers1>
  );
}
