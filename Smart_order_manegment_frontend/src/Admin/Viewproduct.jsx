
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import AdminDrawer from "./AdminDrawer";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import LinearProgress from "@mui/material/LinearProgress";
import Divider from "@mui/material/Divider";

import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import DeleteIcon from "@mui/icons-material/Delete";

// import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import SearchIcon from "@mui/icons-material/Search";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import RemoveShoppingCartOutlinedIcon from "@mui/icons-material/RemoveShoppingCartOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import FilterListIcon from "@mui/icons-material/FilterList";
import RefreshIcon from "@mui/icons-material/Refresh";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import SortIcon from "@mui/icons-material/Sort";

const API = "http://localhost:5600";

export default function Viewproduct() {
  const navigate = useNavigate();

  const [product, setproduct] = useState([]);
  const [loading, setloading] = useState(true);

  const [search, setsearch] = useState("");
  const [categoryFilter, setcategoryFilter] = useState("All");
  const [stockFilter, setstockFilter] = useState("All");

  const [page, setpage] = useState(0);
  const [rowperpage, setrowperpage] = useState(5);

  const [sortField, setsortField] = useState("productName");
  const [sortOrder, setsortOrder] = useState("asc");

  const token = localStorage.getItem("token");

  // ================= FETCH PRODUCTS =================

  const FetchProducts = async () => {
    setloading(true);

    try {
      const res = await axios.get(
        `${API}/view/product/admin/viewdeta`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setproduct(res.data.data || []);
    } catch (er) {
      console.log(er.response?.data || er.message);

      Swal.fire({
        icon: "error",
        title: "Failed to load products",
        text:
          er.response?.data?.message ||
          "Unable to fetch products",
      });
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    FetchProducts();
  }, []);

  // ================= DYNAMIC STATISTICS =================

  const totalProducts = product.length;

  const totalStock = product.reduce(
    (total, item) => total + (Number(item.stock) || 0),
    0
  );

  const lowStock = product.filter(
    (item) =>
      Number(item.stock) > 0 &&
      Number(item.stock) <= 5
  ).length;

  const outOfStock = product.filter(
    (item) => Number(item.stock) <= 0
  ).length;

  const inventoryValue = product.reduce(
    (total, item) =>
      total +
      (Number(item.price) || 0) *
        (Number(item.stock) || 0),
    0
  );

  // ================= CATEGORY LIST =================

  const categories = [
    ...new Set(
      product
        .map((item) => item.category)
        .filter(Boolean)
    ),
  ];

  // ================= SEARCH + FILTER + SORT =================

  const filteredProducts = useMemo(() => {
    let result = [...product];

    const value = search.toLowerCase().trim();

    if (value) {
      result = result.filter((item) =>
        [
          item.productName,
          item.sku,
          item.category,
          item.brand,
          item.price,
          item.stock,
        ].some((field) =>
          String(field ?? "")
            .toLowerCase()
            .includes(value)
        )
      );
    }

    if (categoryFilter !== "All") {
      result = result.filter(
        (item) => item.category === categoryFilter
      );
    }

    if (stockFilter === "In Stock") {
      result = result.filter(
        (item) => Number(item.stock) > 5
      );
    } else if (stockFilter === "Low Stock") {
      result = result.filter(
        (item) =>
          Number(item.stock) > 0 &&
          Number(item.stock) <= 5
      );
    } else if (stockFilter === "Out of Stock") {
      result = result.filter(
        (item) => Number(item.stock) <= 0
      );
    }

    result.sort((a, b) => {
      const first = a[sortField] ?? "";
      const second = b[sortField] ?? "";

      let comparison;

      if (
        typeof first === "number" &&
        typeof second === "number"
      ) {
        comparison = first - second;
      } else {
        comparison = String(first).localeCompare(
          String(second),
          undefined,
          { numeric: true, sensitivity: "base" }
        );
      }

      return sortOrder === "asc"
        ? comparison
        : -comparison;
    });

    return result;
  }, [
    product,
    search,
    categoryFilter,
    stockFilter,
    sortField,
    sortOrder,
  ]);

  // ================= SORT HANDLER =================

  const handleSort = (field) => {
    if (sortField === field) {
      setsortOrder((prev) =>
        prev === "asc" ? "desc" : "asc"
      );
    } else {
      setsortField(field);
      setsortOrder("asc");
    }
  };

  // ================= EDIT PRODUCT =================

  const handleEdit = (id) => {
    navigate(`/admin/edit-product/${id}`);
  };

  // ================= VIEW PRODUCT =================

  const handleView = (id) => {
    navigate(`/admin/single/view/${id}`);
  };

  // ================= DELETE PRODUCT =================

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Product?",
      text: "This product will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await axios.delete(
        `${API}/view/delete-product/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setproduct((prev) =>
        prev.filter((item) => item._id !== id)
      );

      if (
        page > 0 &&
        filteredProducts.length - 1 <= page * rowperpage
      ) {
        setpage((prev) => prev - 1);
      }

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: res.data.message,
        confirmButtonColor: "#4f46e5",
      });
    } catch (er) {
      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text:
          er.response?.data?.message ||
          "Something went wrong",
      });
    }
  };

  // ================= STOCK CHIP =================

  const getStockStatus = (stock) => {
    const quantity = Number(stock) || 0;

    if (quantity <= 0) {
      return {
        label: "Out of Stock",
        color: "error",
        bg: "#fff1f2",
      };
    }

    if (quantity <= 5) {
      return {
        label: "Low Stock",
        color: "warning",
        bg: "#fffbeb",
      };
    }

    return {
      label: "In Stock",
      color: "success",
      bg: "#ecfdf5",
    };
  };

  // ================= STATS CARD =================

  const stats = [
    {
      title: "Total Products",
      value: totalProducts,
      subtitle: "All listed products",
      icon: <Inventory2OutlinedIcon />,
      color: "#4f46e5",
      bg: "#eef2ff",
    },
    {
      title: "Total Stock",
      value: totalStock.toLocaleString("en-IN"),
      subtitle: "Available inventory units",
      icon: <ShoppingBagOutlinedIcon />,
      color: "#0891b2",
      bg: "#ecfeff",
    },
    {
      title: "Low Stock",
      value: lowStock,
      subtitle: "Products need attention",
      icon: <WarningAmberOutlinedIcon />,
      color: "#d97706",
      bg: "#fffbeb",
    },
    {
      title: "Out of Stock",
      value: outOfStock,
      subtitle: "Products unavailable",
      icon: <RemoveShoppingCartOutlinedIcon />,
      color: "#e11d48",
      bg: "#fff1f2",
    },
  ];

  return (
    <AdminDrawer>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#f5f7fc",
          pt: { xs: 3, md: 4 },
          px: { xs: 2, sm: 3, md: 4 },
          pb: 5,
        }}
      >
        {/* ================= PAGE HEADER ================= */}

        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
          mb={4}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              variant="rounded"
              sx={{
                width: 58,
                height: 58,
                bgcolor: "#eef2ff",
                color: "#4f46e5",
                borderRadius: 3,
              }}
            >
              <ShoppingBagOutlinedIcon fontSize="large" />
            </Avatar>

            <Box>
              <Typography
                variant="h4"
                fontWeight={800}
                color="#172554"
                sx={{
                  fontSize: { xs: 24, md: 30 },
                  letterSpacing: -0.7,
                }}
              >
                Products
              </Typography>

              <Typography
                variant="body2"
                color="#64748b"
                sx={{ mt: 0.5 }}
              >
                Manage your product catalog and inventory
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1.5}>
            <Tooltip title="Refresh Products">
              <IconButton
                onClick={FetchProducts}
                disabled={loading}
                sx={{
                  width: 44,
                  height: 44,
                  bgcolor: "#ffffff",
                  border: "1px solid #e2e8f0",
                  color: "#475569",
                  borderRadius: 2.5,
                  "&:hover": {
                    bgcolor: "#eef2ff",
                    color: "#4f46e5",
                  },
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate("/admin/add-product")}
              sx={{
                bgcolor: "#4f46e5",
                borderRadius: 2.5,
                px: 2.5,
                py: 1.3,
                textTransform: "none",
                fontWeight: 700,
                boxShadow: "0 5px 14px rgba(79,70,229,0.2)",
                "&:hover": {
                  bgcolor: "#4338ca",
                },
              }}
            >
              Add Product
            </Button>
          </Stack>
        </Stack>

        {/* ================= STATS CARDS ================= */}

        <Grid container spacing={2.5} mb={4}>
          {stats.map((item) => (
            <Grid item xs={12} sm={6} lg={3} key={item.title}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  height: "100%",
                  borderRadius: 3,
                  border: "1px solid #e8edf5",
                  bgcolor: "#ffffff",
                  transition: "0.25s",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0 10px 25px rgba(15,23,42,0.06)",
                  },
                  mt:2
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                >
                  <Box>
                    <Typography
                      variant="body2"
                      color="#64748b"
                      fontWeight={600}
                    >
                      {item.title}
                    </Typography>

                    <Typography
                      variant="h4"
                      fontWeight={800}
                      color="#172554"
                      sx={{ mt: 1 }}
                    >
                      {item.value}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="#94a3b8"
                      sx={{ display: "block", mt: 1 }}
                    >
                      {item.subtitle}
                    </Typography>
                  </Box>

                  <Avatar
                    variant="rounded"
                    sx={{
                      width: 48,
                      height: 48,
                      bgcolor: item.bg,
                      color: item.color,
                      borderRadius: 2.5,
                    }}
                  >
                    {item.icon}
                  </Avatar>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* ================= INVENTORY SUMMARY ================= */}

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 2.5 },
            mb: 1,
            borderRadius: 3,
            border: "1px solid #e8edf5",
            bgcolor: "#ffffff",
            mt:8
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={2}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar
                sx={{
                  bgcolor: "#ecfdf5",
                  color: "#059669",
                  width: 42,
                  height: 42,
                }}
              >
                <TrendingUpIcon />
              </Avatar>

              <Box>
                <Typography fontWeight={700} color="#172554">
                  Inventory Overview
                </Typography>

                <Typography variant="caption" color="#64748b">
                  Current estimated inventory value
                </Typography>
              </Box>
            </Stack>

            <Box>
              <Typography
                variant="h5"
                fontWeight={800}
                color="#059669"
              >
                ₹{inventoryValue.toLocaleString("en-IN")}
              </Typography>
              <Typography
                variant="caption"
                color="#94a3b8"
              >
                Price × Available stock
              </Typography>
            </Box>
          </Stack>
        </Paper>

        {/* ================= PRODUCTS TABLE CARD ================= */}

        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            border: "1px solid #e8edf5",
            overflow: "hidden",
            bgcolor: "#ffffff",
          }}
        >
          {/* TABLE HEADER */}

          <Box sx={{ p: { xs: 2, md: 2.5 } }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              spacing={1}
            >
              <Box>
                <Typography
                  variant="h6"
                  fontWeight={800}
                  color="#172554"
                >
                  All Products
                </Typography>

                <Typography variant="body2" color="#94a3b8">
                  View, search and manage your products
                </Typography>
              </Box>

              <Chip
                label={`${filteredProducts.length} Products`}
                sx={{
                  bgcolor: "#eef2ff",
                  color: "#4f46e5",
                  fontWeight: 700,
                  borderRadius: 2,
                }}
              />
            </Stack>
          </Box>

          <Divider sx={{ borderColor: "#edf0f5" }} />

          {/* SEARCH AND FILTER */}

          <Box
            sx={{
              p: { xs: 2, md: 2.5 },
              display: "flex",
              gap: 1.5,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <TextField
              size="small"
              placeholder="Search name, SKU, brand..."
              value={search}
              onChange={(e) => {
                setsearch(e.target.value);
                setpage(0);
              }}
              sx={{
                flex: 1,
                minWidth: { xs: "100%", sm: 230 },
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2.5,
                  bgcolor: "#f8fafc",
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#94a3b8" }} />
                  </InputAdornment>
                ),
              }}
            />

            <FormControl
              size="small"
              sx={{ minWidth: 155 }}
            >
              <Select
                value={categoryFilter}
                onChange={(e) => {
                  setcategoryFilter(e.target.value);
                  setpage(0);
                }}
                displayEmpty
                startAdornment={
                  <InputAdornment position="start">
                    <CategoryOutlinedIcon
                      sx={{ color: "#64748b", fontSize: 19 }}
                    />
                  </InputAdornment>
                }
                sx={{
                  borderRadius: 2.5,
                  bgcolor: "#f8fafc",
                }}
              >
                <MenuItem value="All">All Categories</MenuItem>

                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl
              size="small"
              sx={{ minWidth: 155 }}
            >
              <Select
                value={stockFilter}
                onChange={(e) => {
                  setstockFilter(e.target.value);
                  setpage(0);
                }}
                startAdornment={
                  <InputAdornment position="start">
                    <FilterListIcon
                      sx={{ color: "#64748b", fontSize: 19 }}
                    />
                  </InputAdornment>
                }
                sx={{
                  borderRadius: 2.5,
                  bgcolor: "#f8fafc",
                }}
              >
                <MenuItem value="All">All Stock</MenuItem>
                <MenuItem value="In Stock">In Stock</MenuItem>
                <MenuItem value="Low Stock">Low Stock</MenuItem>
                <MenuItem value="Out of Stock">
                  Out of Stock
                </MenuItem>
              </Select>
            </FormControl>

            <Tooltip title="Clear Filters">
              <Button
                variant="outlined"
                onClick={() => {
                  setsearch("");
                  setcategoryFilter("All");
                  setstockFilter("All");
                  setpage(0);
                }}
                sx={{
                  borderRadius: 2.5,
                  textTransform: "none",
                  borderColor: "#e2e8f0",
                  color: "#475569",
                  height: 40,
                }}
              >
                Clear
              </Button>
            </Tooltip>
          </Box>

          {/* TABLE */}

          <TableContainer sx={{ overflowX: "auto" }}>
            <Table sx={{ minWidth: 1050 }}>
              <TableHead>
                <TableRow
                  sx={{
                    bgcolor: "#f8fafc",
                    "& th": {
                      color: "#64748b",
                      fontSize: 11,
                      fontWeight: 800,
                      letterSpacing: 0.7,
                      py: 2,
                      borderBottom: "1px solid #e8edf5",
                      whiteSpace: "nowrap",
                    },
                  }}
                >
                  {[
                    { label: "SKU", field: "sku" },
                    { label: "PRODUCT", field: "productName" },
                    { label: "CATEGORY", field: "category" },
                    { label: "BRAND", field: "brand" },
                    { label: "PRICE", field: "price" },
                    { label: "STOCK", field: "stock" },
                    { label: "STATUS", field: "" },
                    { label: "ACTIONS", field: "" },
                  ].map((col) => (
                    <TableCell
                      key={col.label}
                      onClick={() =>
                        col.field && handleSort(col.field)
                      }
                      sx={{
                        cursor: col.field ? "pointer" : "default",
                      }}
                    >
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        {col.label}
                        {col.field && (
                          <SortIcon
                            sx={{
                              fontSize: 15,
                              color:
                                sortField === col.field
                                  ? "#4f46e5"
                                  : "#cbd5e1",
                            }}
                          />
                        )}
                        {sortField === col.field && col.field && (
                          <Typography
                            component="span"
                            fontSize={10}
                            color="#4f46e5"
                          >
                            {sortOrder === "asc" ? "↑" : "↓"}
                          </Typography>
                        )}
                      </Stack>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                      <CircularProgress
                        size={35}
                        sx={{ color: "#4f46e5" }}
                      />
                      <Typography
                        color="#94a3b8"
                        variant="body2"
                        sx={{ mt: 2 }}
                      >
                        Loading products...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                      <Avatar
                        sx={{
                          width: 55,
                          height: 55,
                          bgcolor: "#f1f5f9",
                          color: "#94a3b8",
                          mx: "auto",
                          mb: 1.5,
                        }}
                      >
                        <ShoppingBagOutlinedIcon fontSize="large" />
                      </Avatar>

                      <Typography fontWeight={700} color="#334155">
                        No Products Found
                      </Typography>

                      <Typography
                        variant="body2"
                        color="#94a3b8"
                        sx={{ mt: 0.5 }}
                      >
                        Try changing your search or filters
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts
                    .slice(
                      page * rowperpage,
                      page * rowperpage + rowperpage
                    )
                    .map((item) => {
                      const imageUrl = item.productImage
                        ? item.productImage.startsWith("http")
                          ? item.productImage
                          : `${API}/${item.productImage.replace(/^\/+/, "")}`
                        : "";

                      const stock = getStockStatus(item.stock);

                      return (
                        <TableRow
                          key={item._id}
                          hover
                          sx={{
                            transition: "0.2s",
                            "&:hover": {
                              bgcolor: "#f8faff",
                            },
                            "& td": {
                              borderBottom: "1px solid #f1f5f9",
                              py: 2,
                            },
                          }}
                        >
                          {/* SKU */}

                          <TableCell>
                            <Typography
                              fontSize={12}
                              fontWeight={700}
                              color="#64748b"
                            >
                              {item.sku || "—"}
                            </Typography>
                          </TableCell>

                          {/* PRODUCT */}

                          <TableCell>
                            <Stack
                              direction="row"
                              spacing={1.5}
                              alignItems="center"
                            >
                              <Avatar
                                variant="rounded"
                                src={imageUrl}
                                alt={item.productName}
                                sx={{
                                  width: 48,
                                  height: 48,
                                  borderRadius: 2,
                                  bgcolor: "#f1f5f9",
                                  border: "1px solid #e8edf5",
                                }}
                              >
                                <ShoppingBagOutlinedIcon />
                              </Avatar>

                              <Box>
                                <Typography
                                  fontWeight={700}
                                  fontSize={13}
                                  color="#1e293b"
                                >
                                  {item.productName}
                                </Typography>

                                <Typography
                                  variant="caption"
                                  color="#94a3b8"
                                >
                                  ID: {item._id?.slice(-8)}
                                </Typography>
                              </Box>
                            </Stack>
                          </TableCell>

                          {/* CATEGORY */}

                          <TableCell>
                            <Chip
                              label={item.category || "Uncategorized"}
                              size="small"
                              sx={{
                                bgcolor: "#f1f5f9",
                                color: "#475569",
                                fontWeight: 600,
                                borderRadius: 1.5,
                              }}
                            />
                          </TableCell>

                          {/* BRAND */}

                          <TableCell>
                            <Typography
                              fontSize={13}
                              fontWeight={600}
                              color="#475569"
                            >
                              {item.brand || "—"}
                            </Typography>
                          </TableCell>

                          {/* PRICE */}

                          <TableCell>
                            <Typography
                              fontWeight={800}
                              fontSize={14}
                              color="#172554"
                            >
                              ₹{Number(item.price || 0).toLocaleString("en-IN")}
                            </Typography>
                          </TableCell>

                          {/* STOCK */}

                          <TableCell>
                            <Box sx={{ minWidth: 90 }}>
                              <Typography
                                fontWeight={700}
                                fontSize={13}
                                color="#334155"
                              >
                                {Number(item.stock) || 0} Units
                              </Typography>

                              <LinearProgress
                                variant="determinate"
                                value={Math.min(
                                  ((Number(item.stock) || 0) / 50) * 100,
                                  100
                                )}
                                sx={{
                                  height: 5,
                                  borderRadius: 5,
                                  mt: 0.8,
                                  bgcolor: "#e2e8f0",
                                  "& .MuiLinearProgress-bar": {
                                    borderRadius: 5,
                                    bgcolor:
                                      Number(item.stock) <= 0
                                        ? "#e11d48"
                                        : Number(item.stock) <= 5
                                          ? "#d97706"
                                          : "#10b981",
                                  },
                                }}
                              />
                            </Box>
                          </TableCell>

                          {/* STATUS */}

                          <TableCell>
                            <Chip
                              label={stock.label}
                              size="small"
                              color={stock.color}
                              sx={{
                                fontWeight: 700,
                                bgcolor: stock.bg,
                                borderRadius: 1.5,
                                "& .MuiChip-label": {
                                  px: 1.3,
                                },
                              }}
                            />
                          </TableCell>

                          {/* ACTIONS */}

                          <TableCell>
                            <Stack direction="row" spacing={0.7}>
                              <Tooltip title="View Product">
                                <IconButton
                                  onClick={() => handleView(item._id)}
                                  size="small"
                                  sx={{
                                    width: 34,
                                    height: 34,
                                    bgcolor: "#eef2ff",
                                    color: "#4f46e5",
                                    borderRadius: 2,
                                    "&:hover": {
                                      bgcolor: "#e0e7ff",
                                    },
                                  }}
                                >
                                  <VisibilityOutlinedIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>

                              <Tooltip title="Edit Product">
                                <IconButton
                                  onClick={() => handleEdit(item._id)}
                                  size="small"
                                  sx={{
                                    width: 34,
                                    height: 34,
                                    bgcolor: "#ecfeff",
                                    color: "#0891b2",
                                    borderRadius: 2,
                                    "&:hover": {
                                      bgcolor: "#cffafe",
                                    },
                                  }}
                                >
                                  <EditOutlinedIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>

                              <Tooltip title="Delete Product">
                                <IconButton
                                  onClick={() => handleDelete(item._id)}
                                  size="small"
                                  sx={{
                                    width: 34,
                                    height: 34,
                                    bgcolor: "#fff1f2",
                                    color: "#e11d48",
                                    borderRadius: 2,
                                    "&:hover": {
                                      bgcolor: "#ffe4e6",
                                    },
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      );
                    })
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* PAGINATION */}

          <Divider sx={{ borderColor: "#edf0f5" }} />

          <TablePagination
            component="div"
            count={filteredProducts.length}
            page={page}
            rowsPerPage={rowperpage}
            rowsPerPageOptions={[5, 10, 25]}
            onPageChange={(e, newPage) => setpage(newPage)}
            onRowsPerPageChange={(e) => {
              setrowperpage(Number(e.target.value));
              setpage(0);
            }}
            sx={{
              bgcolor: "#fafbff",
              "& .MuiTablePagination-toolbar": {
                minHeight: 60,
              },
              "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                color: "#64748b",
                fontSize: 12,
                fontWeight: 600,
              },
            }}
          />
        </Paper>

        {/* ================= BOTTOM INVENTORY INSIGHT ================= */}

        <Grid container spacing={2.5} mt={1}>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3,
                border: "1px solid #e8edf5",
                bgcolor: "#ffffff",
                height: "100%",
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar
                  sx={{
                    bgcolor: "#fffbeb",
                    color: "#d97706",
                  }}
                >
                  <WarningAmberOutlinedIcon />
                </Avatar>

                <Box>
                  <Typography fontWeight={800} color="#172554">
                    Low Stock Alert
                  </Typography>

                  <Typography
                    variant="body2"
                    color="#64748b"
                  >
                    Products that need restocking
                  </Typography>
                </Box>
              </Stack>

              <Typography
                variant="h4"
                fontWeight={800}
                color="#d97706"
                sx={{ mt: 2 }}
              >
                {lowStock}
              </Typography>

              <Typography
                variant="caption"
                color="#94a3b8"
              >
                Products with 1 to 5 units remaining
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3,
                border: "1px solid #e8edf5",
                bgcolor: "#ffffff",
                height: "100%",
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar
                  sx={{
                    bgcolor: "#eef2ff",
                    color: "#4f46e5",
                  }}
                >
                  <CategoryOutlinedIcon />
                </Avatar>

                <Box>
                  <Typography fontWeight={800} color="#172554">
                    Product Categories
                  </Typography>

                  <Typography
                    variant="body2"
                    color="#64748b"
                  >
                    Categories in your product catalog
                  </Typography>
                </Box>
              </Stack>

              <Typography
                variant="h4"
                fontWeight={800}
                color="#4f46e5"
                sx={{ mt: 2 }}
              >
                {categories.length}
              </Typography>

              <Typography
                variant="caption"
                color="#94a3b8"
              >
                Total unique product categories
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </AdminDrawer>
  );
}
