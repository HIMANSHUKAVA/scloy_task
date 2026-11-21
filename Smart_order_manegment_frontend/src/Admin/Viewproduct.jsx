
import React, { useEffect, useState } from "react";
import AdminDashboard from "./AdminDashboard ";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AdminDrawer from "./AdminDrawer";

export default function Viewproduct() {
  const [product, setproduct] = useState([]);
  const [page, setpage] = useState(0);
  const [rowperpage, setrowperpage] = useState(5);
  const [search, setsearch] = useState("");
  const [loading, setloading] = useState(true);
  const [order, setorder] = useState("asc");
  const [sortField, setsortField] = useState("");

  const navigate = useNavigate();

  // Fetch Products
  useEffect(() => {
    axios.get("http://localhost:5600/view/product/admin/viewdeta", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
    .then((res) => {
      setproduct(res.data.data || []);
    })
    .catch((er) => {
      console.log(er);
    })
    .finally(() => {
      setloading(false);
    });
  }, []);

  // Search Products
  const filteredProducts = product.filter((item) => {
    const value = search.toLowerCase();

    return (
      item.productName?.toLowerCase().includes(value) ||
      item.sku?.toLowerCase().includes(value) ||
      String(item.price).toLowerCase().includes(value) ||
      String(item.stock).toLowerCase().includes(value) ||
      item.category?.toLowerCase().includes(value) ||
      item.brand?.toLowerCase().includes(value)
    );
  });

  // Sorting
  const handleSort = (field) => {
    const sorted = [...product].sort((a, b) => {
      const first = a[field] ?? "";
      const second = b[field] ?? "";

      if (first < second) return order === "asc" ? -1 : 1;
      if (first > second) return order === "asc" ? 1 : -1;
      return 0;
    });

    setproduct(sorted);
    setorder(order === "asc" ? "desc" : "asc");
    setsortField(field);
  };

  // Edit Product
  const handleEdit = (id) => {
    navigate(`/admin/edit-product/${id}`);
  };

  // Delete Product
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this product?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, Delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(
          `http://localhost:5600/view/delete-product/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        )
        .then((res) => {
          Swal.fire("Deleted!", res.data.message, "success");

          setproduct((prev) =>
            prev.filter((item) => item._id !== id)
          );
        })
        .catch((er) => {
          Swal.fire(
            "Error!",
            er.response?.data?.message || "Something went wrong",
            "error"
          );
        });
      }
    });
  };

  return (
    <>
      <AdminDrawer>

      <Box sx={{
        minHeight: "100vh",
        bgcolor: "#f5f7fb",
        pt: 10,
        px: { xs: 2, sm: 3, md: 4 },
        pb: 4
      }}>

        {/* Page Heading */}

        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
          mb={3}
        >
          <Stack direction="row" spacing={2} alignItems="center">

            <Avatar sx={{
              width: 55,
              height: 55,
              bgcolor: "#e0eaff",
              color: "#2563eb"
            }}>
              <ShoppingBagIcon />
            </Avatar>

            <Box>
              <Typography variant="h4" fontWeight="bold">
                Products
              </Typography>

              <Typography color="text.secondary">
                Manage and organize all your products
              </Typography>
            </Box>

          </Stack>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/admin/add-product")}
            sx={{
              bgcolor: "#2563eb",
              borderRadius: 2,
              px: 3,
              py: 1.3,
              textTransform: "none",
              fontWeight: 600
            }}
          >
            Add Product
          </Button>

        </Stack>

        {/* Main Table Card */}

        <Paper
          elevation={0}
          sx={{
            border: "1px solid #e2e8f0",
            borderRadius: 3,
            overflow: "hidden",
            mt:2
          }}
        >

          {/* Search Toolbar */}

          <Box sx={{
            p: 2.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
            bgcolor: "#fff"
          }}>

            <TextField
              size="small"
              placeholder="Search products..."
              value={search}
              onChange={(e) => {
                setsearch(e.target.value);
                setpage(0);
              }}
              sx={{
                width: { xs: "100%", sm: 320 },
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2
                }
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  )
                }
              }}
            />

            <Typography color="text.secondary" variant="body2">
              Total Products: <b>{filteredProducts.length}</b>
            </Typography>

          </Box>

          {/* Product Table */}

          <TableContainer sx={{ overflowX: "auto" }}>
            <Table sx={{ minWidth: 850 }}>

              <TableHead>
                <TableRow sx={{ bgcolor: "#f8fafc" }}>

                  {[
                    { label: "SKU", field: "sku" },
                    { label: "PRODUCT NAME", field: "productName" },
                    { label: "CATEGORY", field: "category" },
                    { label: "BRAND", field: "brand" },
                    { label: "PRICE", field: "price" },
                    { label: "STOCK", field: "stock" },
                    { label: "ACTIONS", field: "" }
                  ].map((col) => (
                    <TableCell
                      key={col.label}
                      onClick={() => col.field && handleSort(col.field)}
                      sx={{
                        fontWeight: 700,
                        color: "#475569",
                        py: 2,
                        whiteSpace: "nowrap",
                        cursor: col.field ? "pointer" : "default"
                      }}
                    >
                      {col.label}
                      {sortField === col.field && col.field
                        ? order === "asc" ? " ↑" : " ↓"
                        : ""}
                    </TableCell>
                  ))}

                </TableRow>
              </TableHead>

              <TableBody>

                {loading ? (

                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <CircularProgress size={30} sx={{ my: 4 }} />
                    </TableCell>
                  </TableRow>

                ) : filteredProducts.length === 0 ? (

                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography color="text.secondary" py={5}>
                        No Products Found
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
                          : `http://localhost:5600/${item.productImage.replace(/^\/+/, "")}`
                        : "";

                      return (
                        <TableRow
                          key={item._id}
                          hover
                          sx={{
                            "&:hover": {
                              bgcolor: "#f8faff"
                            },
                            "& td": {
                              borderBottom: "1px solid #edf0f5",
                              py: 1.8
                            }
                          }}
                        >

                          {/* SKU */}

                          <TableCell>
                            <Typography color="text.secondary">
                              {item.sku}
                            </Typography>
                          </TableCell>

                          {/* Product Name and Image */}

                          <TableCell>
                            <Stack direction="row" spacing={1.5} alignItems="center">

                              <Avatar
                                variant="rounded"
                                src={imageUrl}
                                alt={item.productName}
                                sx={{
                                  width: 48,
                                  height: 48,
                                  bgcolor: "#f1f5f9"
                                }}
                              />

                              <Typography fontWeight={600}>
                                {item.productName}
                              </Typography>

                            </Stack>
                          </TableCell>

                          {/* Category */}

                          <TableCell>
                            {item.category || "—"}
                          </TableCell>

                          {/* Brand */}

                          <TableCell>
                            {item.brand || "—"}
                          </TableCell>

                          {/* Price */}

                          <TableCell>
                            <Typography fontWeight={600}>
                              ₹{item.price}
                            </Typography>
                          </TableCell>

                          {/* Stock */}

                          <TableCell>
                            <Chip
                              label={
                                Number(item.stock) > 0
                                  ? `${item.stock} Available`
                                  : "Out of Stock"
                              }
                              size="small"
                              color={
                                Number(item.stock) > 0
                                  ? "success"
                                  : "error"
                              }
                              variant="outlined"
                            />
                          </TableCell>

                          {/* Actions */}

                          <TableCell>
                            <Stack direction="row" spacing={1}>

                              <Tooltip title="Edit Product">
                                <IconButton
                                  onClick={() => handleEdit(item._id)}
                                  sx={{
                                    border: "1px solid #dbeafe",
                                    color: "#2563eb",
                                    borderRadius: 2
                                  }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>

                              <Tooltip title="Delete Product">
                                <IconButton
                                  onClick={() => handleDelete(item._id)}
                                  sx={{
                                    border: "1px solid #fee2e2",
                                    color: "#dc2626",
                                    borderRadius: 2
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>

                              <Tooltip title="view product">
                                <IconButton sx={{
                                   border: "1px solid #fee2e2",
                                   borderRadius:2,
                                   color:"green"
                                   
                                }}
                                onClick={()=>navigate(`/admin/single/view/${item._id}`)}
                                >
                                  <VisibilityIcon size="large"/>
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

          {/* Pagination */}

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
          />

        </Paper>

      </Box>
      </AdminDrawer>
    </>
  );
}
