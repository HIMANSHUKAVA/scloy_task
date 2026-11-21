import React, { useEffect, useState } from "react";
import AdminDashboard from "./AdminDashboard ";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SettingsIcon from "@mui/icons-material/Settings";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import AdminDrawer from "./AdminDrawer";

export default function Editproduct() {
  const [product, setProduct] = useState([]);
  const navigate = useNavigate();

  const { id } = useParams();
  useEffect(() => {
    axios
      .get(`http://localhost:5600/view/product/admin/single-product/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setProduct(res.data.data);
        console.log("Product Data:", res.data);
        console.log("Product Image:", res.data.productImage);
      })
      .catch((er) => {
        console.log(er);
      });
  }, []);

  const productFields = [
    {
      name: "productName",
      label: "Product Name",
      type: "text",
    },
    {
      name: "sku",
      label: "SKU",
      type: "text",
    },
    {
      name: "description",
      label: "Small Description",
      type: "text",
    },
    {
      name: "price",
      label: "Price",
      type: "number",
    },
    {
      name: "stock",
      label: "Stock",
      type: "number",
    },
  ];

  const handlsubmit = async (e) => {
    e.preventDefault();

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to update this product?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
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
          },
        );

        Swal.fire({
          title: "Updated!",
          text: res.data.message || "Product updated successfully",
          icon: "success",
          confirmButtonColor: "#2563eb",
        });

        navigate("/admin/view-product")
      } catch (er) {
        Swal.fire({
          title: "Update Failed!",
          text: er.response?.data?.message || "Something went wrong",
          icon: "error",
          confirmButtonColor: "#d33",
        });

        console.log(er);
      }
    }
  };
  return (
    <>
      <AdminDrawer>

      <Box
        sx={{
          background: "#f5f7fb",
          minHeight: "100vh",
          pt: 10,
          px: { xs: 2, sm: 3, md: 5 },
          pb: 4,
        }}
      >
        {/* Heading */}

        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            sx={{
              width: 55,
              height: 55,
              bgcolor: "#e0eaff",
              color: "#2563eb",
            }}
          >
            <ShoppingBagIcon />
          </Avatar>

          <Box>
            <Typography variant="h4" fontWeight="bold">
              Edit Product
            </Typography>
            <Typography variant="body2">Update your product details</Typography>
          </Box>
        </Stack>

        {/* Main Grid */}
        <Box component="form" onSubmit={handlsubmit}>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {/* Edit Form */}

            <Grid size={{ xs: 12, md: 7 }}>
              <Box
                sx={{
                  bgcolor: "white",
                  p: 3,
                  borderRadius: 3,
                  boxShadow: 1,
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <SettingsIcon color="primary" />
                  <Typography variant="h5">Product Details</Typography>
                </Stack>

                <Grid container spacing={2} sx={{ mt: 2 }}>
                  {productFields.map((field) => (
                    <Grid key={field.name} size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label={field.label}
                        type={field.type}
                        name={field.name}
                        value={product[field.name] ?? ""}
                        onChange={(e) =>
                          setProduct({
                            ...product,
                            [field.name]: e.target.value,
                          })
                        }
                      />
                    </Grid>
                  ))}

                  {/* Image Upload */}

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Button
                      component="label"
                      variant="outlined"
                      fullWidth
                      startIcon={<CloudUploadIcon />}
                      sx={{ height: 56 }}
                    >
                      Change Product Image
                      <input
                        hidden
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setProduct({
                            ...product,
                            productImage: e.target.files[0],
                          })
                        }
                      />
                    </Button>
                  </Grid>

                  {/* Buttons */}

                  <Grid size={12}>
                    <Stack
                      direction="row"
                      spacing={2}
                      justifyContent="flex-end"
                      sx={{ mt: 3 }}
                    >

                      <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        sx={{
                          borderRadius: 2,
                          px: 3,
                          bgcolor: "#2563eb",
                        }}
                        type="submit"
                      >
                        Update Product
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            {/* Live Preview */}

            <Grid size={{ xs: 12, md: 5 }}>
              <Box
                sx={{
                  bgcolor: "white",
                  p: 3,
                  borderRadius: 3,
                  boxShadow: 1,
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <VisibilityIcon color="primary" />
                  <Typography variant="h5">Live Preview</Typography>
                </Stack>

                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    border: "1px solid #e2e8f0",
                    borderRadius: 3,
                    boxShadow: 1,
                  }}
                >
                  <Box
                    sx={{
                      height: 230,
                      bgcolor: "#f1f5f9",
                      borderRadius: 2,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {product.productImage && (
                      <img
                        src={
                          product.productImage instanceof File
                            ? URL.createObjectURL(product.productImage)
                            : `http://localhost:5600${product.productImage}`
                        }
                        alt="Product Preview"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          padding: "10px",
                        }}
                      />
                    )}
                  </Box>

                  <Typography variant="h5" sx={{ mt: 2 }}>
                    {product.productName || "Product Name"}
                  </Typography>

                  <Typography color="text.secondary" sx={{ mt: 1 }}>
                    SKU: {product.sku || "SKU"}
                  </Typography>

                  <Typography
                    variant="h4"
                    color="primary"
                    fontWeight="bold"
                    sx={{ mt: 2 }}
                  >
                    ₹{product.price || "0"}
                  </Typography>

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    sx={{
                      mt: 2,
                      py: 2,
                      borderTop: "1px solid #e2e8f0",
                      borderBottom: "1px solid #e2e8f0",
                    }}
                  >
                    <Typography>Stock: {product.stock || "0"}</Typography>

                    <Typography color="success.main">● Active</Typography>
                  </Stack>

                  <Typography sx={{ mt: 2 }} color="text.secondary">
                    {product.description ||
                      "Product description will appear here"}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
      </AdminDrawer>
    </>
  );
}
