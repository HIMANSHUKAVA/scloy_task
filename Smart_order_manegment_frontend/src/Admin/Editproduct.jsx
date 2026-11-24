
import React, { useEffect, useState } from "react";

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
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";

import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import AdminDrawer from "./AdminDrawer";

const primary = "#6366f1";
const dark = "#111827";
const muted = "#64748b";

export default function Editproduct() {
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch Product
  useEffect(() => {
    axios
      .get(
        `http://localhost:5600/view/product/admin/single-product/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        setProduct(res.data.data);
        console.log("Product Data:", res.data);
      })
      .catch((er) => {
        console.log(er);

        Swal.fire({
          title: "Error!",
          text:
            er.response?.data?.message ||
            "Unable to fetch product details",
          icon: "error",
          confirmButtonColor: "#6366f1",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

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
      placeholder: "Enter SKU",
    },
    {
      name: "description",
      label: "Short Description",
      type: "text",
      size: 12,
      placeholder: "Enter product description",
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
      placeholder: "Enter stock quantity",
    },
  ];

  // Update Product
  const handlsubmit = async (e) => {
    e.preventDefault();

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to update this product?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: primary,
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Update!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        Swal.fire({
          title: "Updating Product...",
          text: "Please wait",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        const formData = new FormData();

        formData.append("productName", product.productName);
        formData.append("sku", product.sku);
        formData.append("description", product.description);
        formData.append("price", product.price);
        formData.append("stock", product.stock);

        if (product.productImage instanceof File) {
          formData.append("productImage", product.productImage);
        }

        const res = await axios.put(
          `http://localhost:5600/view/updateproductbyid/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        Swal.fire({
          title: "Updated!",
          text: res.data.message || "Product updated successfully",
          icon: "success",
          confirmButtonColor: primary,
        });

        navigate("/admin/view-product");
      } catch (er) {
        Swal.fire({
          title: "Update Failed!",
          text:
            er.response?.data?.message ||
            "Something went wrong",
          icon: "error",
          confirmButtonColor: "#d33",
        });

        console.log(er);
      }
    }
  };

  // Image Preview
  const imagePreview =
    product.productImage instanceof File
      ? URL.createObjectURL(product.productImage)
      : product.productImage
        ? `http://localhost:5600${product.productImage}`
        : null;

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

  if (loading) {
    return (
      <AdminDrawer>
        <Box
          sx={{
            minHeight: "100vh",
            background: "#f4f6fb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography color="text.secondary" fontWeight={600}>
            Loading product details...
          </Typography>
        </Box>
      </AdminDrawer>
    );
  }

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
                Edit Product
              </Typography>

              <Typography variant="body2" color={muted} sx={{ mt: 0.5 }}>
                Update and manage your existing product details
              </Typography>
            </Box>
          </Stack>

          <Chip
            icon={<EditIcon />}
            label="Product Editing"
            sx={{
              backgroundColor: "#eef2ff",
              color: "#4f46e5",
              fontWeight: 700,
              borderRadius: 2,
              height: 36,
              "& .MuiChip-icon": {
                color: primary,
              },
            }}
          />
        </Stack>

        <Box component="form" onSubmit={handlsubmit}>
          <Grid container spacing={3} alignItems="flex-start">

            {/* Edit Form */}
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
                        Modify the product information below
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
                          placeholder={field.placeholder}
                          type={field.type}
                          name={field.name}
                          value={product[field.name] ?? ""}
                          onChange={(e) =>
                            setProduct({
                              ...product,
                              [field.name]: e.target.value,
                            })
                          }
                          sx={inputSx}
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
                      Change Product Image
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
                        borderColor: "#c7d2fe",
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
                      {product.productImage instanceof File
                        ? product.productImage.name
                        : "Choose a new product image"}

                      <input
                        hidden
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(e) => {
                          const file = e.target.files?.[0];

                          if (file) {
                            setProduct({
                              ...product,
                              productImage: file,
                            });
                          }
                        }}
                      />
                    </Button>

                    <Typography
                      variant="caption"
                      color={muted}
                      sx={{ mt: 1, display: "block" }}
                    >
                      Leave unchanged to keep the existing product image.
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 3, borderColor: "#edf0f5" }} />

                  {/* Update Button */}
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1.5}
                    justifyContent="flex-end"
                  >
                    <Button
                      variant="outlined"
                      onClick={() => navigate("/admin/view-product")}
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
                      Cancel
                    </Button>

                    <Button
                      variant="contained"
                      startIcon={<EditIcon />}
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
                      Update Product
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
                        Changes appear instantly
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
                    {imagePreview ? (
                      <img
                        src={imagePreview}
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

                        <Typography variant="body2" color="text.secondary">
                          Product image not available
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
                        label={`${product.stock ?? "0"} Units`}
                        sx={{
                          backgroundColor: "#eef2ff",
                          color: "#4f46e5",
                          fontWeight: 700,
                          "& .MuiChip-icon": {
                            color: primary,
                          },
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
                        "Product description will appear here."}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </AdminDrawer>
  );
}
