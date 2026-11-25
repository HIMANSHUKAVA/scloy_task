
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import PercentIcon from "@mui/icons-material/Percent";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ImageNotSupportedOutlinedIcon from "@mui/icons-material/ImageNotSupportedOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircle";
import AdminDrawer from "./AdminDrawer";

import Swal from "sweetalert2";

export default function Singleview() {

  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch Single Product
  useEffect(() => {

    const fetchProduct = async () => {

      try {

        setLoading(true);
        setError(false);

        const res = await axios.get(
          `http://localhost:5600/view/product/admin/single-product/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );

        setProduct(res.data.data || {});

      } catch (er) {

        console.log(er);
        setError(true);

      } finally {

        setLoading(false);

      }

    };

    fetchProduct();

  }, [id]);

  // Product Image
  const imagePath = product.productImage;

  const imageUrl = imagePath
    ? imagePath.startsWith("http")
      ? imagePath
      : `http://localhost:5600/${imagePath.replace(/^\/+/, "")}`
    : "";

  // Stock Status
  const stock = Number(product.stock || 0);

  const stockStatus =
    stock <= 0
      ? "Out of Stock"
      : stock <= 5
        ? "Low Stock"
        : "In Stock";

  const stockColor =
    stock <= 0
      ? "error"
      : stock <= 5
        ? "warning"
        : "success";

  // Copy SKU
  const handleCopy = () => {

    if (product.sku) {

      navigator.clipboard.writeText(product.sku);

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "SKU Copied",
        showConfirmButton: false,
        timer: 1500
      });

    }

  };

  // Detail Item
  const DetailItem = ({ label, value }) => (

    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "space-between",
        gap: 1,
        py: 1.8,
        borderBottom: "1px solid #edf0f5"
      }}
    >

      <Typography
        variant="body2"
        color="#64748b"
        fontWeight={500}
      >
        {label}
      </Typography>

      <Typography
        variant="body2"
        color="#172554"
        fontWeight={600}
        sx={{
          textAlign: { xs: "left", sm: "right" },
          wordBreak: "break-word",
          whiteSpace: "pre-wrap"
        }}
      >
        {value !== undefined &&
         value !== null &&
         value !== ""
          ? value
          : "—"}
      </Typography>

    </Box>

  );

  // Overview Card
  const OverviewCard = ({ title, value, subtitle, icon, color, bg }) => (

    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        border: "1px solid #e8edf5",
        borderRadius: 3,
        height: "100%",
        transition: "0.25s",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0 8px 25px rgba(15,23,42,0.06)"
        }
      }}
    >

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >

        <Box>

          <Typography
            variant="body2"
            color="text.secondary"
            fontWeight={500}
          >
            {title}
          </Typography>

          <Typography
            variant="h5"
            fontWeight={800}
            color="#172554"
            mt={1}
          >
            {value}
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
          >
            {subtitle}
          </Typography>

        </Box>

        <Avatar
          sx={{
            bgcolor: bg,
            color: color,
            width: 48,
            height: 48,
            borderRadius: 2.5
          }}
        >
          {icon}
        </Avatar>

      </Stack>

    </Paper>

  );

  return (

    <AdminDrawer>

      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#f4f6fb",
          px: { xs: 2, sm: 3, md: 4 },
          py: 4
        }}
      >

        {/* Loading */}

        {loading ? (

          <Box
            sx={{
              minHeight: "75vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <CircularProgress />
          </Box>

        ) : error ? (

          <Paper
            elevation={0}
            sx={{
              p: 5,
              textAlign: "center",
              borderRadius: 3
            }}
          >

            <Typography variant="h5" fontWeight={700}>
              Product Not Found
            </Typography>

            <Typography color="text.secondary" mt={1}>
              Unable to fetch product details.
            </Typography>

            <Button
              variant="contained"
              sx={{ mt: 3 }}
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>

          </Paper>

        ) : (

          <>

            {/* Page Header */}

            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              spacing={2}
              mb={4}
            >

              <Stack direction="row" spacing={2} alignItems="center">

                <Avatar
                  sx={{
                    width: 54,
                    height: 54,
                    bgcolor: "#e0e7ff",
                    color: "#4f46e5",
                    borderRadius: 3
                  }}
                >
                  <ShoppingBagIcon fontSize="large" />
                </Avatar>

                <Box>

                  <Typography
                    variant="h4"
                    fontWeight={800}
                    color="#172554"
                  >
                    Product Overview
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    mt={0.5}
                  >
                    Complete product information and inventory details
                  </Typography>

                </Box>

              </Stack>

              <Stack direction="row" spacing={1}>

                <Button
                  variant="outlined"
                  startIcon={<ArrowBackIcon />}
                  onClick={() => navigate(-1)}
                  sx={{
                    borderRadius: 2,
                    px: 2,
                    borderColor: "#dbe3f0",
                    color: "#475569",
                    textTransform: "none",
                    fontWeight: 600
                  }}
                >
                  Back
                </Button>

                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={() => navigate(`/admin/edit-product/${id}`)}
                  sx={{
                    borderRadius: 2,
                    px: 2.5,
                    bgcolor: "#4f46e5",
                    textTransform: "none",
                    fontWeight: 700,
                    boxShadow: "none",
                    "&:hover": {
                      bgcolor: "#4338ca",
                      boxShadow: "none"
                    }
                  }}
                >
                  Edit Product
                </Button>

              </Stack>

            </Stack>

            {/* Product Overview Cards */}

            <Grid container spacing={2.5} mb={3}>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>

                <OverviewCard
                  title="Product Price"
                  value={`₹${Number(product.price || 0).toLocaleString("en-IN")}`}
                  subtitle="Current selling price"
                  icon={<CurrencyRupeeIcon />}
                  color="#4f46e5"
                  bg="#eef2ff"
                />

              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>

                <OverviewCard
                  title="Available Stock"
                  value={stock}
                  subtitle={stockStatus}
                  icon={<Inventory2OutlinedIcon />}
                  color="#0891b2"
                  bg="#ecfeff"
                />

              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>

                <OverviewCard
                  title="Product Tax"
                  value={`${product.tax ?? 0}%`}
                  subtitle="Applicable tax rate"
                  icon={<PercentIcon />}
                  color="#d97706"
                  bg="#fffbeb"
                />

              </Grid>

            </Grid>

            {/* Main Layout */}

            <Grid container spacing={3} sx={{mt:8}}>

              {/* Left Column */}

              <Grid size={{ xs: 12, md: 8 }}>

                {/* Product Information */}

                <Paper
                  elevation={0}
                  sx={{
                    border: "1px solid #e8edf5",
                    borderRadius: 3,
                    overflow: "hidden",
                    mb: 3
                  }}
                >

                  <Box sx={{ p: 3 }}>

                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1.5}
                      mb={1}
                    >

                      <Avatar
                        sx={{
                          bgcolor: "#eef2ff",
                          color: "#4f46e5",
                          width: 40,
                          height: 40
                        }}
                      >
                        <CategoryOutlinedIcon />
                      </Avatar>

                      <Box>

                        <Typography
                          variant="h6"
                          fontWeight={800}
                          color="#172554"
                        >
                          General Information
                        </Typography>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          Basic product identification details
                        </Typography>

                      </Box>

                    </Stack>

                    <Divider sx={{ my: 2.5 }} />

                    {/* SKU Box */}

                    <Box
                      sx={{
                        p: 2,
                        bgcolor: "#f8faff",
                        border: "1px solid #e0e7ff",
                        borderRadius: 2,
                        mb: 3
                      }}
                    >

                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >

                        <Box>

                          <Typography
                            variant="caption"
                            color="text.secondary"
                            fontWeight={700}
                          >
                            PRODUCT SKU
                          </Typography>

                          <Typography
                            variant="h6"
                            fontWeight={800}
                            color="#3730a3"
                            letterSpacing={1.5}
                            mt={0.5}
                          >
                            {product.sku || "N/A"}
                          </Typography>

                        </Box>

                        <Tooltip title="Copy SKU">

                          <IconButton
                            onClick={handleCopy}
                            sx={{
                              bgcolor: "#e0e7ff",
                              color: "#4f46e5",
                              borderRadius: 2
                            }}
                          >
                            <ContentCopyIcon fontSize="small" />
                          </IconButton>

                        </Tooltip>

                      </Stack>

                    </Box>

                    {/* Product Details */}

                    <Grid container spacing={3}>

                      <Grid size={{ xs: 12, sm: 6 }}>

                        <Typography
                          fontWeight={700}
                          color="#334155"
                          mb={1}
                        >
                          Product Details
                        </Typography>

                        <DetailItem
                          label="Product Name"
                          value={product.productName}
                        />

                        <DetailItem
                          label="Category"
                          value={product.category}
                        />

                        <DetailItem
                          label="Sub Category"
                          value={product.subCategory}
                        />

                        <DetailItem
                          label="Brand"
                          value={product.brand}
                        />

                        <DetailItem
                          label="Unit"
                          value={product.unit}
                        />

                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>

                        <Typography
                          fontWeight={700}
                          color="#334155"
                          mb={1}
                        >
                          Inventory & Pricing
                        </Typography>

                        <DetailItem
                          label="Minimum Quantity"
                          value={product.minQty}
                        />

                        <DetailItem
                          label="Available Stock"
                          value={product.stock}
                        />

                        <DetailItem
                          label="Price"
                          value={
                            product.price != null
                              ? `₹${Number(product.price).toLocaleString("en-IN")}`
                              : "—"
                          }
                        />

                        <DetailItem
                          label="Tax"
                          value={
                            product.tax != null
                              ? `${product.tax}%`
                              : "—"
                          }
                        />

                        <DetailItem
                          label="Discount Type"
                          value={product.discountType}
                        />

                      </Grid>

                    </Grid>

                  </Box>

                </Paper>

                {/* Description */}

                <Paper
                  elevation={0}
                  sx={{
                    border: "1px solid #e8edf5",
                    borderRadius: 3,
                    p: 3
                  }}
                >

                  <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                    mb={2}
                  >

                    <Avatar
                      sx={{
                        bgcolor: "#f0fdf4",
                        color: "#16a34a"
                      }}
                    >
                      <DescriptionOutlinedIcon />
                    </Avatar>

                    <Box>

                      <Typography
                        variant="h6"
                        fontWeight={800}
                        color="#172554"
                      >
                        Product Description
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        Additional product information
                      </Typography>

                    </Box>

                  </Stack>

                  <Divider sx={{ mb: 2 }} />

                  <Typography
                    variant="body2"
                    color="#475569"
                    lineHeight={1.9}
                    sx={{ whiteSpace: "pre-wrap" }}
                  >
                    {product.description || "No description available."}
                  </Typography>

                </Paper>

              </Grid>

              {/* Right Column */}

              <Grid size={{ xs: 12, md: 4 }}>

                {/* Product Image */}

                <Paper
                  elevation={0}
                  sx={{
                    border: "1px solid #e8edf5",
                    borderRadius: 3,
                    overflow: "hidden",
                    mb: 3
                  }}
                >

                  <Box sx={{ p: 3 }}>

                    <Typography
                      variant="h6"
                      fontWeight={800}
                      color="#172554"
                    >
                      Product Image
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Product visual preview
                    </Typography>

                    <Box
                      sx={{
                        mt: 2.5,
                        height: 280,
                        bgcolor: "#f8fafc",
                        border: "1px solid #edf0f5",
                        borderRadius: 3,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        overflow: "hidden"
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
                            p: 2
                          }}
                        />

                      ) : (

                        <Stack
                          alignItems="center"
                          spacing={1}
                          color="#94a3b8"
                        >

                          <ImageNotSupportedOutlinedIcon
                            sx={{ fontSize: 55 }}
                          />

                          <Typography variant="body2">
                            No Product Image
                          </Typography>

                        </Stack>

                      )}

                    </Box>

                    <Typography
                      fontWeight={700}
                      color="#172554"
                      mt={2}
                    >
                      {product.productName || "Product"}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        display: "block",
                        mt: 0.5,
                        wordBreak: "break-all"
                      }}
                    >
                      {imagePath
                        ? String(imagePath).split("/").pop()
                        : "No image uploaded"}
                    </Typography>

                  </Box>

                </Paper>

                {/* Stock Information */}

                <Paper
                  elevation={0}
                  sx={{
                    border: "1px solid #e8edf5",
                    borderRadius: 3,
                    p: 3
                  }}
                >

                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1.5}
                    mb={2}
                  >

                    <Avatar
                      sx={{
                        bgcolor: "#eef2ff",
                        color: "#4f46e5"
                      }}
                    >
                      <StorefrontOutlinedIcon />
                    </Avatar>

                    <Typography
                      variant="h6"
                      fontWeight={800}
                      color="#172554"
                    >
                      Stock Overview
                    </Typography>

                  </Stack>

                  <Divider sx={{ mb: 2.5 }} />

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Current Availability
                  </Typography>

                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    mt={1}
                  >

                    <Typography
                      variant="h4"
                      fontWeight={800}
                      color="#172554"
                    >
                      {stock}
                    </Typography>

                    <Chip
                      label={stockStatus}
                      color={stockColor}
                      size="small"
                      sx={{ fontWeight: 700 }}
                    />

                  </Stack>

                  <Divider sx={{ my: 2.5 }} />

                  <DetailItem
                    label="Minimum Quantity"
                    value={product.minQty ?? "—"}
                  />

                  <DetailItem
                    label="Current Stock"
                    value={stock}
                  />

                  <DetailItem
                    label="Product Status"
                    value={product.status || "—"}
                  />

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mt: 2,
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: "#f0fdf4"
                    }}
                  >

                    <CheckCircleOutlineIcon
                      sx={{ color: "#16a34a", fontSize: 19 }}
                    />

                    <Typography
                      variant="caption"
                      color="#166534"
                      fontWeight={600}
                    >
                      Inventory information updated
                    </Typography>

                  </Box>

                </Paper>

              </Grid>

            </Grid>

          </>

        )}

      </Box>

    </AdminDrawer>

  );

}
