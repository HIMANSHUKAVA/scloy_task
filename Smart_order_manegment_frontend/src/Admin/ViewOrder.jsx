import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminDrawer from "./AdminDrawer";
import Swal from "sweetalert2";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import { useNavigate } from "react-router-dom";
import TablePagination from "@mui/material/TablePagination";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import { io } from "socket.io-client";
export default function ViewOrder() {
  const [deta, setdeta] = useState([]);
  const navigate = useNavigate();
  const [loading, setloading] = useState(true);

  const [status, setstatus] = useState({});
  const [cancelstatus, setcancelstatus] = useState({});

  // Fetch All Orders
  const FetchOrders = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5600/order/admin/fetchorderbyadmin",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      setdeta(res.data.deta || []);
    } catch (er) {
      console.log(er.response?.data || er.message);
    } finally {
      setloading(false);
    }
  };

  const socket = io("http://localhost:5600");

  useEffect(() => {
    FetchOrders();

    const handleStockUpdate = (data) => {
      setdeta((prev) =>
        prev.map((item) => {
          const updatedProduct = data.products.find(
            (p) => String(p.productId) === String(item._id),
          );

          return updatedProduct
            ? { ...item, stock: updatedProduct.stock }
            : item;
        }),
      );
    };

    socket.on("stockupdated", (data) => {
      console.log("Stock Updated:", handleStockUpdate);
    });

    return () => {
      socket.off("stockupdated" , handleStockUpdate);
    };
  }, []);


  // Order Status Select
  const handlstatusupdate = (orderId, newStatus) => {
    setstatus((prev) => ({
      ...prev,
      [orderId]: newStatus,
    }));
  };

  // Cancellation Status Select
  const handlcancelselect = (orderId, newStatus) => {
    setcancelstatus((prev) => ({
      ...prev,
      [orderId]: newStatus,
    }));
  };

  // Update Order Status
  const handlupdate = async (id, selectedStatus) => {
    try {
      const res = await axios.put(
        `http://localhost:5600/order/admin/orderstatus/${id}`,
        { status: selectedStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      setdeta((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, ...res.data.deta } : item,
        ),
      );

      setstatus((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: res.data.message,
        confirmButtonColor: "#2563eb",
      });
    } catch (er) {
      Swal.fire({
        icon: "error",
        title: "Update Failed!",
        text: er.response?.data?.message || er.message,
        confirmButtonColor: "#d32f2f",
      });
    }
  };

  // Approve / Reject Cancellation
  const handlcancelstatus = async (id, selectedStatus) => {
    if (!["Approved", "Rejected"].includes(selectedStatus)) {
      return;
    }

    const isApproved = selectedStatus === "Approved";

    const confirm = await Swal.fire({
      icon: "warning",
      title: isApproved ? "Approve Cancellation?" : "Reject Cancellation?",
      text: isApproved
        ? "Are you sure you want to approve this cancellation?"
        : "Are you sure you want to reject this cancellation?",
      showCancelButton: true,
      confirmButtonText: isApproved ? "Yes, Approve" : "Yes, Reject",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      const endpoint = isApproved ? "approvedrequest" : "rejectrequest";

      const res = await axios.put(
        `http://localhost:5600/order/admin/${endpoint}/${id}`,
        { status: selectedStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      setdeta((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, ...res.data.deta } : item,
        ),
      );

      setcancelstatus((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });

      Swal.fire({
        icon: "success",
        title: isApproved ? "Cancellation Approved!" : "Cancellation Rejected!",
        text: res.data.message,
        confirmButtonColor: "#2e7d32",
      });
    } catch (er) {
      Swal.fire({
        icon: "error",
        title: "Request Failed!",
        text: er.response?.data?.message || er.message,
        confirmButtonColor: "#d32f2f",
      });
    }
  };

  // pagignetion

  const [page, setpage] = useState(0);
  const [rowperpage, setrowperpage] = useState(5);

  // serch filter state
  const [search, setsearch] = useState("");
  const [cancelfilter, setcancelfilter] = useState("All");
  // const [orderFilter, setorderFilter] = useState("");

  const [sort, setsort] = useState("");
  const [orderfilter, setorderfilter] = useState("All");

  const filterdeta = deta.filter((item) => {
    if (orderfilter === "All") return true;

    return item.orderStatus === orderfilter;
  });
  return (
    <AdminDrawer>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#f5f7fb",
          pt: 10,
          px: { xs: 2, sm: 3, md: 4 },
          pb: 4,
        }}
      >
        {/* Header */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
          mb={3}
        >
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
                Orders
              </Typography>

              <Typography color="text.secondary">
                Manage and organize all your orders
              </Typography>
            </Box>
          </Stack>
        </Stack>

        {/* Orders Table */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            border: "1px solid #e5e7eb",
            overflow: "hidden",
            mt: 3,
          }}
        >
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={700}>
              All Orders
            </Typography>

            <Typography variant="body2" color="text.secondary">
              View and manage all customer orders
            </Typography>

            <Box
              sx={{
                px: 3,
                pb: 3,
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <TextField
                size="small"
                placeholder="Search Order, Customer ID, Product..."
                value={search}
                onChange={(e) => setsearch(e.target.value)}
                sx={{ flex: 1, minWidth: 220 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />

              <FormControl size="small" sx={{ minWidth: 170 }}>
                <InputLabel>Order Status</InputLabel>
                <Select
                  value={orderfilter}
                  label="Order Status"
                  onChange={(e) => {
                    setorderfilter(e.target.value);
                    setpage(0);
                  }}
                >
                  <MenuItem value="All">All Orders</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Confirmed">Confirmed</MenuItem>
                  <MenuItem value="Shipped">Shipped</MenuItem>
                  <MenuItem value="Out for Delivery">Out for Delivery</MenuItem>
                  <MenuItem value="Delivered">Delivered</MenuItem>
                  
                </Select>
              </FormControl>

              
            </Box>
          </Box>

          <TableContainer>
            <Table sx={{ minWidth: 1200 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f8fafc" }}>
                  {[
                    "Order Details",
                    "Customer ID",
                    "Product",
                    "Date",
                    "Amount",
                    "Order Status",
                    "Cancellation",
                    "Action",
                  ].map((heading) => (
                    <TableCell
                      key={heading}
                      sx={{ fontWeight: 700, color: "#475569" }}
                    >
                      {heading}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : deta.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                      No Orders Found
                    </TableCell>
                  </TableRow>
                ) : (
                  filterdeta
                    .filter((er) => {
                      const searchText = search.toLowerCase().trim();

                      return (
                        er.orderNumber?.toLowerCase().includes(searchText) ||
                        er.userId
                          ?.toString()
                          .toLowerCase()
                          .includes(searchText) ||
                        er.products?.some(
                          (p) =>
                            p.name?.toLowerCase().includes(searchText) ||
                            p.productId
                              ?.toString()
                              .toLowerCase()
                              .includes(searchText) ||
                            p.price?.toString().includes(searchText) ||
                            p.quantity?.toString().includes(searchText),
                        ) ||
                        er.orderStatus?.toLowerCase().includes(searchText) ||
                        er.cancellation?.status
                          ?.toLowerCase()
                          .includes(searchText) ||
                        er.cancellation?.reason
                          ?.toLowerCase()
                          .includes(searchText) ||
                        er.grandTotal?.toString().includes(searchText) ||
                        er.subtotal?.toString().includes(searchText) ||
                        er.taxAmount?.toString().includes(searchText)
                      );
                    })
                    .slice(page * rowperpage, page * rowperpage + rowperpage)
                    .map((item) => (
                      <TableRow
                        key={item._id}
                        hover
                        sx={{
                          "&:hover": { bgcolor: "#f8fafc" },
                        }}
                      >
                        {/* Order Details */}
                        <TableCell>
                          <Typography fontWeight={700} fontSize={13}>
                            {item.orderNumber}
                          </Typography>

                          <Typography variant="caption" color="text.secondary">
                            ID: {item._id.slice(-8)}
                          </Typography>
                        </TableCell>

                        {/* Customer */}
                        <TableCell>
                          <Typography fontSize={13}>{item.userId}</Typography>
                        </TableCell>

                        {/* Products */}
                        <TableCell>
                          <Stack spacing={1}>
                            {item.products?.map((product) => (
                              <Stack
                                key={product._id}
                                direction="row"
                                spacing={1}
                                alignItems="center"
                              >
                                <Avatar
                                  variant="rounded"
                                  src={
                                    product.image
                                      ? product.image.startsWith("http")
                                        ? product.image
                                        : `http://localhost:5600/${product.image.replace(/^\/+/, "")}`
                                      : ""
                                  }
                                  sx={{
                                    width: 40,
                                    height: 40,
                                    bgcolor: "#f1f5f9",
                                  }}
                                >
                                  <ShoppingBagIcon fontSize="small" />
                                </Avatar>

                                <Box>
                                  <Typography fontWeight={600} fontSize={13}>
                                    {product.name}
                                  </Typography>

                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    Qty: {product.quantity}
                                  </Typography>
                                </Box>
                              </Stack>
                            ))}
                          </Stack>
                        </TableCell>

                        {/* Date */}
                        <TableCell>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <CalendarMonthOutlinedIcon
                              sx={{ fontSize: 17, color: "#64748b" }}
                            />

                            <Typography fontSize={13}>
                              {new Date(item.createdAt).toLocaleDateString(
                                "en-IN",
                              )}
                            </Typography>
                          </Stack>
                        </TableCell>

                        {/* Amount */}
                        <TableCell>
                          <Typography fontWeight={700} color="#2563eb">
                            ₹{item.grandTotal?.toLocaleString("en-IN")}
                          </Typography>
                        </TableCell>

                        {/* Order Status */}
                        <TableCell>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <Select
                              size="small"
                              value={status[item._id] ?? item.orderStatus}
                              sx={{ minWidth: 170 }}
                              onChange={(e) =>
                                handlstatusupdate(item._id, e.target.value)
                              }
                            >
                              <MenuItem value="Pending">Pending</MenuItem>
                              <MenuItem value="Confirmed">Confirmed</MenuItem>
                              <MenuItem value="Shipped">Shipped</MenuItem>
                              <MenuItem value="Out for Delivery">
                                Out for Delivery
                              </MenuItem>
                              <MenuItem value="Delivered">Delivered</MenuItem>
                            </Select>

                            <Button
                              variant="contained"
                              size="small"
                              onClick={() =>
                                handlupdate(
                                  item._id,
                                  status[item._id] ?? item.orderStatus,
                                )
                              }
                            >
                              Update
                            </Button>
                          </Stack>
                        </TableCell>

                        {/* Cancellation */}
                        <TableCell>
                          {item.cancellation?.status}
                        </TableCell>
                        {/* Action */}
                        <TableCell>
                          <Tooltip title="View Order Details">
                            <IconButton
                              color="primary"
                              onClick={() => {
                                navigate(
                                  `/admin/single/view/${item.products[0].productId}`,
                                );
                              }}
                            >
                              <VisibilityOutlinedIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>

              <TablePagination
                component="div"
                count={filterdeta.length}
                page={page}
                rowsPerPage={rowperpage}
                rowsPerPageOptions={[1, 2, 5, 10]}
                onPageChange={(e, newpage) => setpage(newpage)}
                onRowsPerPageChange={(e) => {
                  setrowperpage(parseInt(e.target.value, 10));
                  setpage(0);
                }}
              />
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </AdminDrawer>
  );
}
