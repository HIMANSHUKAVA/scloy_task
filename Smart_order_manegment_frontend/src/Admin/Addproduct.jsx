import React, { useState } from "react";
import AdminDashboard from "./AdminDashboard ";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import SettingsIcon from "@mui/icons-material/Settings";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import AdminDrawer from "./AdminDrawer";
export default function Addproduct() {
  const [product, setProduct] = useState({
    productName: "",
    sku: "",
    price: "",
    stock: "",
    description: "",
    productImage: null,
  });

  const productFields = [
    {
      name: "productName",
      label: "Product Name",
      type: "text",
      size: 6,
    },
    {
      name: "sku",
      label: "SKU",
      type: "text",
      size: 6,
    },
    {
      name: "description",
      label: "small description",
      type: "text",
      size: 6,
    },
    {
      name: "price",
      label: "Price",
      type: "number",
      size: 6,
    },
    {
      name: "stock",
      label: "Stock",
      type: "number",
      size: 6,
    },
  ];

  const handlreset = () => {
    setProduct({
      productName: "",
      price: "",
      productImage: "",
      description: "",
      stock: "",
      sku: "",
    });
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

    // if (!product.description.trim()) {
    //   errors.description = "Description is required";
    // } else if (product.description.trim().length < 10) {
    //   errors.description = "Minimum 10 characters required";
    // }

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

  const [errors, seterrors] = useState({});
  const navigate = useNavigate();

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

  // Loading
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
        confirmButtonColor: "#2563eb",
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
        {/* heading stack */}
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
            <Typography variant="h4">Add Product</Typography>
            <Typography variant="body2">
              Add new Product to Your Store
            </Typography>
          </Box>
        </Stack>

        {/* grid */}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid size={{ xs: 12, md: 7 }}>
              <Box
                sx={{
                  bgcolor: "white",
                  p: 3,
                  borderRadius: 3,
                  boxShadow: 1,
                }}
              >
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <SettingsIcon color="primary" />
                  <Typography variant="h5">Product Details</Typography>
                </Stack>

                {/*  Product Form  */}

                <Grid container spacing={2} sx={{ mt: 2 }}>
                  {productFields.map((field) => (
                    <Grid key={field.name} size={{ xs: 12, sm: field.size }}>
                      <TextField
                        fullWidth
                        label={field.label}
                        type={field.type}
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
                      />
                    </Grid>
                  ))}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Button
                      component="label"
                      variant="outlined"
                      fullWidth
                      sx={{ height: 56 }}
                    >
                      Upload Product Image
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
                    {errors.productImage && (
                      <Typography color="error" variant="caption">
                        {errors.productImage}
                      </Typography>
                    )}
                  </Grid>

                  <Stack
                    direction="row"
                    spacing={2}
                    justifyContent="flex-end"
                    sx={{ mt: 3 }}
                  >
                    <Button
                      variant="outlined"
                      color="inherit"
                      onClick={handlreset}
                      sx={{
                        borderRadius: 2,
                        px: 3,
                        borderColor: "grey.400",
                        color: "text.primary",
                      }}
                    >
                      Reset
                    </Button>

                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      sx={{
                        borderRadius: 2,
                        px: 3,
                        bgcolor: "#2563eb",
                        "&:hover": {
                          bgcolor: "#1d4ed8",
                        },
                      }}
                      type="submit"
                    >
                      Add Product
                    </Button>
                  </Stack>
                </Grid>
              </Box>
            </Grid>
            {/* second preview */}
            <Grid  size={{ xs: 12, md: 5 }}>
              <Box
                sx={{
                  bgcolor: "white",
                  p: 3,
                  borderRadius: 2,
                  boxShadow: 1,
                }}
              >
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <VisibilityIcon color="primary" fontSize="large" />
                  <Typography variant="h5">Live Preview</Typography>
                </Stack>

                <Box
                  sx={{
                    borderRadius: 2,
                    border: "1px solid grey",
                    mt: 2,
                    boxShadow: 2,
                    p: 2,
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: "#f1f5f9",
                      borderRadius: 2,
                      height: 230,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
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
                          padding: "10px",
                        }}
                      />
                    ) : (
                      <Typography color="text.secondary">
                        Product Image Preview
                      </Typography>
                    )}
                  </Box>

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="h5" fontWeight="bold">
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
                      alignItems="center"
                      sx={{
                        mt: 2,
                        py: 2,
                        borderTop: "1px solid #e2e8f0",
                        borderBottom: "1px solid #e2e8f0",
                      }}
                    >
                      <Typography>Stock: {product.stock || "0"}</Typography>
                    </Stack>

                    <Typography sx={{ mt: 2 }} color="text.secondary">
                      {product.description ||
                        "Product description will appear here"}
                    </Typography>
                  </Box>
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
