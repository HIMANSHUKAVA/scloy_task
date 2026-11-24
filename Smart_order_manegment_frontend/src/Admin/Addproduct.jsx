
import React, { useState } from "react";
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import SettingsIcon from "@mui/icons-material/Settings";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";

import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import AdminDrawer from "./AdminDrawer";

const primary = "#6366f1";
const dark = "#111827";
const muted = "#64748b";

export default function Addproduct() {
  const [product, setProduct] = useState({
    productName: "",
    sku: "",
    price: "",
    stock: "",
    description: "",
    productImage: null,
  });

  const [errors, seterrors] = useState({});
  const navigate = useNavigate();

  const productFields = [
    {
      name: "productName",
      label: "Product Name",
      type: "text",
      size: 6,
      placeholder: "Enter product name",
    },
    {
      name: "sku",
      label: "SKU",
      type: "text",
      size: 6,
      placeholder: "e.g. PRD-001",
    },
    {
      name: "description",
      label: "Short Description",
      type: "text",
      size: 12,
      placeholder: "Write a short product description",
    },
    {
      name: "price",
      label: "Price (₹)",
      type: "number",
      size: 6,
      placeholder: "Enter price",
    },
    {
      name: "stock",
      label: "Stock Quantity",
      type: "number",
      size: 6,
      placeholder: "Enter available stock",
    },
  ];

  const handlreset = () => {
    setProduct({
      productName: "",
      price: "",
      productImage: null,
      description: "",
      stock: "",
      sku: "",
    });
    seterrors({});
  };

  const validateProduct = () => {
    const errors = {};

    if (!product.productName.trim()) {
      errors.productName = "Product name is required";
    } else if (product.productName.trim().length < 3) {
      errors.productName = "Minimum 3 characters required";
    }

    if (!product.sku.trim()) {
      errors.sku = "SKU is required";
    }

    if (!product.price || Number(product.price) <= 0) {
      errors.price = "Enter a valid price";
    }

    if (
      product.stock === "" ||
      !Number.isInteger(Number(product.stock)) ||
      Number(product.stock) < 0
    ) {
      errors.stock = "Enter valid stock quantity";
    }

    if (!product.productImage) {
      errors.productImage = "Product image is required";
    } else {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

      if (!allowedTypes.includes(product.productImage.type)) {
        errors.productImage = "Only JPG, PNG and WEBP allowed";
      }

      if (product.productImage.size > 5 * 1024 * 1024) {
        errors.productImage = "Image size must be below 5 MB";
      }
    }

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateProduct();
    seterrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const formData = new FormData();

    formData.append("productName", product.productName);
    formData.append("sku", product.sku);
    formData.append("description", product.description);
    formData.append("price", product.price);
    formData.append("stock", product.stock);
    formData.append("productImage", product.productImage);

    Swal.fire({
      title: "Adding Product...",
      text: "Please wait while your product is being added.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    axios
      .post("http://localhost:5600/view/addproduct", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        Swal.fire({
          title: "Success!",
          text: res.data.message,
          icon: "success",
          confirmButtonColor: "#6366f1",
        });

        navigate("/admin/view-product");
      })
      .catch((er) => {
        Swal.fire({
          title: "Error!",
          text: er.response?.data?.message || "Something went wrong",
          icon: "error",
          confirmButtonColor: "#d33",
        });

        console.log(er);
      });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      setProduct((prev) => ({
        ...prev,
        productImage: file,
      }));

      seterrors((prev) => ({
        ...prev,
        productImage: "",
      }));
    }
  };

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2.5,
      backgroundColor: "#f8fafc",
      "& fieldset": {
        borderColor: "#e2e8f0",
      },
      "&:hover fieldset": {
        borderColor: "#a5b4fc",
      },
      "&.Mui-focused fieldset": {
        borderColor: primary,
        borderWidth: 1.5,
      },
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: primary,
    },
  };

  return (
    <AdminDrawer>
      <Box
        sx={{
          minHeight: "100vh",
          background: "#f4f6fb",
          px: { xs: 2, sm: 3, md: 4 },
          pt: { xs: 3, md: 4 },
          pb: 5,
        }}
      >
        {/* Page Heading */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
          sx={{ mb: 4 }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              variant="rounded"
              sx={{
                width: 58,
                height: 58,
                borderRadius: 3,
                background: "linear-gradient(135deg, #6366f1, #4338ca)",
                boxShadow: "0 8px 20px rgba(99,102,241,0.25)",
              }}
            >
              <ShoppingBagIcon sx={{ fontSize: 29 }} />
            </Avatar>

            <Box>
              <Typography
                variant="h5"
                fontWeight={800}
                color={dark}
                letterSpacing="-0.5px"
              >
                Add New Product
              </Typography>

              <Typography variant="body2" color={muted} sx={{ mt: 0.5 }}>
                Create and manage products in your store inventory
              </Typography>
            </Box>
          </Stack>

          <Chip
            icon={<Inventory2OutlinedIcon />}
            label="Product Management"
            sx={{
              backgroundColor: "#eef2ff",
              color: "#4f46e5",
              fontWeight: 700,
              borderRadius: 2,
              height: 36,
              "& .MuiChip-icon": { color: "#6366f1" },
            }}
          />
        </Stack>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3} alignItems="flex-start">

            {/* Product Form */}
            <Grid size={{ xs: 12, lg: 7.5 }}>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 4,
                  border: "1px solid #e8ebf3",
                  overflow: "hidden",
                  boxShadow: "0 8px 30px rgba(15,23,42,0.04)",
                }}
              >
                <Box sx={{ p: { xs: 2.5, sm: 3.5 } }}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar
                      sx={{
                        width: 42,
                        height: 42,
                        borderRadius: 2.5,
                        backgroundColor: "#eef2ff",
                        color: primary,
                      }}
                    >
                      <SettingsIcon />
                    </Avatar>

                    <Box>
                      <Typography fontWeight={800} color={dark}>
                        Product Information
                      </Typography>
                      <Typography variant="caption" color={muted}>
                        Enter the basic details of your product
                      </Typography>
                    </Box>
                  </Stack>

                  <Divider sx={{ my: 3, borderColor: "#edf0f5" }} />

                  <Grid container spacing={2.5}>
                    {productFields.map((field) => (
                      <Grid
                        key={field.name}
                        size={{ xs: 12, sm: field.size }}
                      >
                        <TextField
                          fullWidth
                          label={field.label}
                          type={field.type}
                          placeholder={field.placeholder}
                          name={field.name}
                          value={product[field.name]}
                          error={Boolean(errors[field.name])}
                          helperText={errors[field.name] || ""}
                          onChange={(e) => {
                            setProduct({
                              ...product,
                              [field.name]: e.target.value,
                            });

                            seterrors({
                              ...errors,
                              [field.name]: "",
                            });
                          }}
                          sx={inputSx}
                          InputLabelProps={{
                            shrink: field.type === "number" ? true : undefined,
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>

                  {/* Image Upload */}
                  <Box sx={{ mt: 3 }}>
                    <Typography
                      variant="subtitle2"
                      fontWeight={700}
                      color={dark}
                      sx={{ mb: 1.2 }}
                    >
                      Product Image
                    </Typography>

                    <Button
                      component="label"
                      fullWidth
                      variant="outlined"
                      startIcon={<CloudUploadOutlinedIcon />}
                      sx={{
                        height: 58,
                        borderRadius: 2.5,
                        borderStyle: "dashed",
                        borderWidth: 1.5,
                        borderColor: errors.productImage ? "#ef4444" : "#c7d2fe",
                        backgroundColor: "#f8faff",
                        color: primary,
                        fontWeight: 700,
                        textTransform: "none",
                        "&:hover": {
                          borderWidth: 1.5,
                          borderColor: primary,
                          backgroundColor: "#eef2ff",
                        },
                      }}
                    >
                      {product.productImage
                        ? product.productImage.name
                        : "Choose product image (JPG, PNG, WEBP)"}

                      <input
                        hidden
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleImageChange}
                      />
                    </Button>

                    {errors.productImage && (
                      <Typography
                        color="error"
                        variant="caption"
                        sx={{ mt: 0.5, display: "block" }}
                      >
                        {errors.productImage}
                      </Typography>
                    )}

                    <Typography
                      variant="caption"
                      color={muted}
                      sx={{ mt: 1, display: "block" }}
                    >
                      Maximum image size: 5 MB
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 3, borderColor: "#edf0f5" }} />

                  {/* Buttons */}
                  <Stack
                    direction={{ xs: "column-reverse", sm: "row" }}
                    spacing={1.5}
                    justifyContent="flex-end"
                  >
                    <Button
                      variant="outlined"
                      startIcon={<RestartAltIcon />}
                      onClick={handlreset}
                      sx={{
                        borderRadius: 2.5,
                        px: 3,
                        py: 1.2,
                        borderColor: "#cbd5e1",
                        color: "#475569",
                        fontWeight: 700,
                        textTransform: "none",
                      }}
                    >
                      Reset Form
                    </Button>

                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      type="submit"
                      sx={{
                        borderRadius: 2.5,
                        px: 3.5,
                        py: 1.2,
                        background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                        fontWeight: 700,
                        textTransform: "none",
                        boxShadow: "0 6px 16px rgba(99,102,241,0.25)",
                        "&:hover": {
                          background: "linear-gradient(135deg, #4f46e5, #4338ca)",
                          boxShadow: "0 8px 20px rgba(99,102,241,0.35)",
                        },
                      }}
                    >
                      Add Product
                    </Button>
                  </Stack>
                </Box>
              </Paper>
            </Grid>

            {/* Live Preview */}
            <Grid size={{ xs: 12, lg: 4.5 }}>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 4,
                  border: "1px solid #e8ebf3",
                  overflow: "hidden",
                  boxShadow: "0 8px 30px rgba(15,23,42,0.04)",
                  position: "sticky",
                  top: 24,
                }}
              >
                <Box
                  sx={{
                    px: 3,
                    py: 2.5,
                    background: "linear-gradient(135deg, #111827, #1e293b)",
                    color: "white",
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar
                      sx={{
                        bgcolor: "rgba(255,255,255,0.12)",
                        color: "white",
                        borderRadius: 2,
                      }}
                    >
                      <VisibilityIcon />
                    </Avatar>

                    <Box>
                      <Typography fontWeight={800}>
                        Live Preview
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "#cbd5e1" }}
                      >
                        Preview your product card
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                <Box sx={{ p: 2.5 }}>
                  <Box
                    sx={{
                      height: 250,
                      borderRadius: 3,
                      backgroundColor: "#f1f5f9",
                      border: "1px solid #e2e8f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                    }}
                  >
                    {product.productImage ? (
                      <img
                        src={URL.createObjectURL(product.productImage)}
                        alt="Product Preview"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          padding: "15px",
                        }}
                      />
                    ) : (
                      <Stack alignItems="center" spacing={1}>
                        <ImageOutlinedIcon
                          sx={{ fontSize: 55, color: "#94a3b8" }}
                        />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          Product image will appear here
                        </Typography>
                      </Stack>
                    )}
                  </Box>

                  <Box sx={{ mt: 2.5 }}>
                    <Typography
                      variant="h6"
                      fontWeight={800}
                      color={dark}
                    >
                      {product.productName || "Product Name"}
                    </Typography>

                    <Typography
                      variant="body2"
                      color={muted}
                      sx={{ mt: 0.7 }}
                    >
                      SKU: {product.sku || "SKU"}
                    </Typography>

                    <Typography
                      variant="h4"
                      fontWeight={800}
                      color={primary}
                      sx={{ mt: 2 }}
                    >
                      ₹{product.price || "0"}
                    </Typography>

                    <Divider sx={{ my: 2, borderColor: "#edf0f5" }} />

                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography
                        variant="body2"
                        color={muted}
                        fontWeight={600}
                      >
                        Available Stock
                      </Typography>

                      <Chip
                        size="small"
                        icon={<Inventory2OutlinedIcon />}
                        label={`${product.stock || "0"} Units`}
                        sx={{
                          backgroundColor: "#eef2ff",
                          color: "#4f46e5",
                          fontWeight: 700,
                          "& .MuiChip-icon": { color: "#6366f1" },
                        }}
                      />
                    </Stack>

                    <Typography
                      variant="subtitle2"
                      fontWeight={700}
                      sx={{ mt: 2, color: dark }}
                    >
                      Description
                    </Typography>

                    <Typography
                      variant="body2"
                      color={muted}
                      sx={{
                        mt: 0.7,
                        lineHeight: 1.7,
                        overflowWrap: "anywhere",
                      }}
                    >
                      {product.description ||
                        "Product description will appear here once you enter it."}
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  mt: 2,
                  p: 2.5,
                  borderRadius: 3,
                  border: "1px solid #e8ebf3",
                  backgroundColor: "#eef2ff",
                }}
              >
                <Typography
                  variant="subtitle2"
                  fontWeight={800}
                  color="#4338ca"
                >
                  Product Setup Tip
                </Typography>

                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    mt: 0.7,
                    color: "#475569",
                    lineHeight: 1.7,
                  }}
                >
                  Use a clear product image and a unique SKU to make inventory
                  management easier.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </AdminDrawer>
  );
}
