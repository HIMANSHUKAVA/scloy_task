import React, { useEffect, useState, useMemo, useCallback } from "react";

import axios from "axios";
import AdminDrawer from "./AdminDrawer";
import FileCopyOutlinedIcon from "@mui/icons-material/FileCopyOutlined";
import Swal from "sweetalert2";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
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
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CircularProgress from "@mui/material/CircularProgress";
import TablePagination from "@mui/material/TablePagination";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import LinearProgress from "@mui/material/LinearProgress";
import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded";
import PendingActionsRoundedIcon from "@mui/icons-material/PendingActionsRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import CancelPresentationRoundedIcon from "@mui/icons-material/CancelPresentationRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";

export default function ViewOrder() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // --------------------------------
  // STATES
  // --------------------------------

  const [deta, setdeta] = useState([]);
  const [loading, setloading] = useState(true);

  const [status, setstatus] = useState({});
  const [cancelstatus, setcancelstatus] = useState({});

  const [page, setpage] = useState(0);
  const [rowperpage, setrowperpage] = useState(5);

  const [search, setsearch] = useState("");
  const [orderfilter, setorderfilter] = useState("All");
  const [cancelfilter, setcancelfilter] = useState("All");

  // --------------------------------
  // FETCH ORDERS
  // --------------------------------

  const FetchOrders = useCallback(async () => {
    try {
      const res = await axios.get(
        "http://localhost:5600/order/admin/fetchorderbyadmin",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setdeta(res.data.deta || []);
    } catch (er) {
      console.log(er.response?.data || er.message);
    } finally {
      setloading(false);
    }
  }, [token]);

  // --------------------------------
  // SOCKET CONNECTION
  // --------------------------------

  useEffect(() => {
    FetchOrders();

    const socket = io("http://localhost:5600");

    const handleStockUpdate = () => {
      // Refresh order information after stock update
      FetchOrders();
    };

    socket.on("stockupdated", handleStockUpdate);

    return () => {
      socket.off("stockupdated", handleStockUpdate);
      socket.disconnect();
    };
  }, [FetchOrders]);

  // --------------------------------
  // ORDER STATISTICS
  // --------------------------------

  const totalOrders = deta.length;

  const pendingOrders = deta.filter(
    (item) => item.orderStatus === "Pending",
  ).length;

  const deliveredOrders = deta.filter(
    (item) => item.orderStatus === "Delivered",
  ).length;

  const cancellationRequests = deta.filter(
    (item) =>
      item.cancellation?.status === "Requested" ||
      item.cancellation?.status === "Pending",
  ).length;

  const deliveredPercentage =
    totalOrders > 0 ? Math.round((deliveredOrders / totalOrders) * 100) : 0;

  // --------------------------------
  // SEARCH AND FILTER
  // --------------------------------

  const filteredOrders = useMemo(() => {
    return deta.filter((item) => {
      const searchText = search.toLowerCase().trim();

      const searchMatch =
        !searchText ||
        item.orderNumber?.toLowerCase().includes(searchText) ||
        item.userId?.toString().toLowerCase().includes(searchText) ||
        item.orderStatus?.toLowerCase().includes(searchText) ||
        item.cancellation?.status?.toLowerCase().includes(searchText) ||
        item.cancellation?.reason?.toLowerCase().includes(searchText) ||
        item.grandTotal?.toString().includes(searchText) ||
        item.subtotal?.toString().includes(searchText) ||
        item.products?.some(
          (product) =>
            product.name?.toLowerCase().includes(searchText) ||
            product.productId?.toString().toLowerCase().includes(searchText) ||
            product.price?.toString().includes(searchText) ||
            product.quantity?.toString().includes(searchText),
        );

      const orderMatch =
        orderfilter === "All" || item.orderStatus === orderfilter;

      const cancelMatch =
        cancelfilter === "All" ||
        (cancelfilter === "No Request" && !item.cancellation?.status) ||
        item.cancellation?.status === cancelfilter;

      return searchMatch && orderMatch && cancelMatch;
    });
  }, [deta, search, orderfilter, cancelfilter]);

  // --------------------------------
  // PAGINATION
  // --------------------------------

  const handlePageChange = (event, newPage) => {
    setpage(newPage);
  };

  const handleRowsChange = (event) => {
    setrowperpage(parseInt(event.target.value, 10));
    setpage(0);
  };

  // --------------------------------
  // UPDATE ORDER STATUS
  // --------------------------------

  const handlstatusupdate = (orderId, newStatus) => {
    setstatus((prev) => ({
      ...prev,
      [orderId]: newStatus,
    }));
  };

  const handlupdate = async (id, selectedStatus) => {
    const currentOrder = deta.find((item) => item._id === id);

    if (!currentOrder || currentOrder.orderStatus === selectedStatus) {
      setstatus((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
      return;
    }

    const confirm = await Swal.fire({
      title: "Update Order Status?",
      text: `Change status to ${selectedStatus}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#4f46e5",
      confirmButtonText: "Yes, Update",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await axios.put(
        `http://localhost:5600/order/admin/orderstatus/${id}`,
        { status: selectedStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
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
        title: "Status Updated!",
        text: res.data.message,
        confirmButtonColor: "#4f46e5",
      });
    } catch (er) {
      Swal.fire({
        icon: "error",
        title: "Update Failed!",
        text: er.response?.data?.message || er.message,
      });
    }
  };

  // --------------------------------
  // CANCELLATION APPROVE / REJECT
  // --------------------------------

  const handlcancelselect = (orderId, newStatus) => {
    setcancelstatus((prev) => ({
      ...prev,
      [orderId]: newStatus,
    }));
  };

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
      confirmButtonColor: isApproved ? "#059669" : "#dc2626",
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
            Authorization: `Bearer ${token}`,
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
        confirmButtonColor: "#4f46e5",
      });
    } catch (er) {
      Swal.fire({
        icon: "error",
        title: "Request Failed!",
        text: er.response?.data?.message || er.message,
      });
    }
  };

  // --------------------------------
  // STATUS CHIP
  // --------------------------------

  const getOrderColor = (value) => {
    const colors = {
      Pending: {
        bg: "#fef3c7",
        color: "#b45309",
      },
      Confirmed: {
        bg: "#e0e7ff",
        color: "#4338ca",
      },
      Shipped: {
        bg: "#dbeafe",
        color: "#1d4ed8",
      },
      "Out for Delivery": {
        bg: "#f3e8ff",
        color: "#7e22ce",
      },
      Delivered: {
        bg: "#dcfce7",
        color: "#15803d",
      },
      Cancelled: {
        bg: "#fee2e2",
        color: "#dc2626",
      },
    };

    return (
      colors[value] || {
        bg: "#f1f5f9",
        color: "#475569",
      }
    );
  };

  const getCancelColor = (value) => {
    const colors = {
      Requested: { bg: "#fef3c7", color: "#b45309" },
      Pending: { bg: "#fef3c7", color: "#b45309" },
      Approved: { bg: "#dcfce7", color: "#15803d" },
      Rejected: { bg: "#fee2e2", color: "#dc2626" },
    };

    return (
      colors[value] || {
        bg: "#f1f5f9",
        color: "#64748b",
      }
    );
  };

  // --------------------------------
  // STAT CARD
  // --------------------------------

  const StatCard = ({ title, value, subtitle, icon, color, background }) => (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        border: "1px solid #e5e7eb",
        borderRadius: 3,
        transition: "0.25s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 10px 25px rgba(15,23,42,0.07)",
        },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography fontSize={13} color="#64748b" fontWeight={600}>
              {title}
            </Typography>

            <Typography
              fontSize={29}
              fontWeight={800}
              color="#111827"
              sx={{ mt: 1 }}
            >
              {value}
            </Typography>

            <Typography fontSize={11} color="#94a3b8" sx={{ mt: 0.7 }}>
              {subtitle}
            </Typography>
          </Box>

          <Avatar
            variant="rounded"
            sx={{
              width: 52,
              height: 52,
              bgcolor: background,
              color: color,
              borderRadius: 2.5,
            }}
          >
            {icon}
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );

  // --------------------------------
  // MAIN UI
  // --------------------------------

  const handlinvoicegeneretion = async (id) => {
    console.log("order id ", id);

    const responce = await axios.get(`http://localhost:5600/pdf/admin/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      responseType: "blob",
    });


    console.log(responce);
    
    const url = window.URL.createObjectURL(responce.data);

    console.log(url);

    const link = document.createElement("a");
    link.href = url;
    link.download = `Invoice-${id}.pdf`;
    link.click();

    window.URL.revokeObjectURL(url);
  };

  return (
    <AdminDrawer>
      <Box
        sx={{
          minHeight: "100vh",
          p: { xs: 2, sm: 3, md: 4 },
          bgcolor: "#f8fafc",
        }}
      >
        {/* PAGE HEADER */}

        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
          sx={{ mb: 3.5 }}
        >
          <Box>
            <Typography fontSize={26} fontWeight={800} color="#111827">
              Order Management
            </Typography>

            <Typography color="#94a3b8" fontSize={13} sx={{ mt: 0.7 }}>
              Dashboard / Orders / Manage Orders
            </Typography>
          </Box>

          <Button
            variant="outlined"
            startIcon={<RefreshRoundedIcon />}
            onClick={FetchOrders}
            disabled={loading}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              borderRadius: 2,
              borderColor: "#dbe1ea",
              color: "#475569",
              px: 2,
            }}
          >
            Refresh Orders
          </Button>
        </Stack>

        {/* STATISTICS */}

        <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="Total Orders"
              value={totalOrders}
              subtitle="All customer orders"
              icon={<ShoppingBagRoundedIcon />}
              color="#4f46e5"
              background="#eef2ff"
            />
          </Grid>

          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="Pending Orders"
              value={pendingOrders}
              subtitle="Orders waiting for processing"
              icon={<PendingActionsRoundedIcon />}
              color="#d97706"
              background="#fef3c7"
            />
          </Grid>

          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="Delivered Orders"
              value={deliveredOrders}
              subtitle="Successfully delivered orders"
              icon={<LocalShippingRoundedIcon />}
              color="#059669"
              background="#d1fae5"
            />
          </Grid>

          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="Cancellation Requests"
              value={cancellationRequests}
              subtitle="Requests awaiting review"
              icon={<CancelPresentationRoundedIcon />}
              color="#dc2626"
              background="#fee2e2"
            />
          </Grid>
        </Grid>

        {/* ORDER TABLE */}

        <Paper
          elevation={0}
          sx={{
            border: "1px solid #e5e7eb",
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          {/* TABLE HEADER */}

          <Box sx={{ p: 2.5 }}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", md: "center" }}
              spacing={2}
            >
              <Box>
                <Typography fontSize={18} fontWeight={800} color="#111827">
                  All Orders
                </Typography>

                <Typography fontSize={12} color="#94a3b8" sx={{ mt: 0.5 }}>
                  View, track and manage customer orders
                </Typography>
              </Box>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                width={{ xs: "100%", md: "auto" }}
              >
                <TextField
                  size="small"
                  placeholder="Search orders..."
                  value={search}
                  onChange={(e) => {
                    setsearch(e.target.value);
                    setpage(0);
                  }}
                  sx={{
                    width: { xs: "100%", sm: 240 },
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      fontSize: 13,
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchRoundedIcon sx={{ color: "#94a3b8" }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <FormControl
                  size="small"
                  sx={{ minWidth: { xs: "100%", sm: 150 } }}
                >
                  <InputLabel>Order Status</InputLabel>

                  <Select
                    value={orderfilter}
                    label="Order Status"
                    onChange={(e) => {
                      setorderfilter(e.target.value);
                      setpage(0);
                    }}
                    sx={{ borderRadius: 2, fontSize: 13 }}
                  >
                    <MenuItem value="All">All Orders</MenuItem>
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Confirmed">Confirmed</MenuItem>
                    <MenuItem value="Shipped">Shipped</MenuItem>
                    <MenuItem value="Out for Delivery">
                      Out for Delivery
                    </MenuItem>
                    <MenuItem value="Delivered">Delivered</MenuItem>
                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>

                <FormControl
                  size="small"
                  sx={{ minWidth: { xs: "100%", sm: 155 } }}
                >
                  <InputLabel>Cancellation</InputLabel>

                  <Select
                    value={cancelfilter}
                    label="Cancellation"
                    onChange={(e) => {
                      setcancelfilter(e.target.value);
                      setpage(0);
                    }}
                    sx={{ borderRadius: 2, fontSize: 13 }}
                  >
                    <MenuItem value="All">All Requests</MenuItem>
                    <MenuItem value="Requested">Requested</MenuItem>
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Approved">Approved</MenuItem>
                    <MenuItem value="Rejected">Rejected</MenuItem>
                    <MenuItem value="No Request">No Request</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Stack>
          </Box>

          <Divider />

          {/* TABLE */}

          <TableContainer sx={{ overflowX: "auto" }}>
            <Table sx={{ minWidth: 1250 }}>
              <TableHead>
                <TableRow
                  sx={{
                    bgcolor: "#f8fafc",
                    "& th": {
                      color: "#64748b",
                      fontSize: 11,
                      fontWeight: 800,
                      letterSpacing: 0.6,
                      py: 2,
                      whiteSpace: "nowrap",
                      borderBottom: "1px solid #e5e7eb",
                    },
                  }}
                >
                  <TableCell>ORDER DETAILS</TableCell>
                  <TableCell>CUSTOMER ID</TableCell>
                  <TableCell>PRODUCT DETAILS</TableCell>
                  <TableCell>ORDER DATE</TableCell>
                  <TableCell>AMOUNT</TableCell>
                  <TableCell>ORDER STATUS</TableCell>
                  <TableCell>CANCELLATION</TableCell>
                  <TableCell align="center">ACTIONS</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Stack alignItems="center" spacing={1.5} sx={{ py: 6 }}>
                        <CircularProgress size={30} />
                        <Typography color="#64748b" fontSize={13}>
                          Loading orders...
                        </Typography>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ) : filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Stack alignItems="center" spacing={1} sx={{ py: 6 }}>
                        <ShoppingBagRoundedIcon
                          sx={{
                            fontSize: 45,
                            color: "#cbd5e1",
                          }}
                        />

                        <Typography fontWeight={700} color="#475569">
                          No Orders Found
                        </Typography>

                        <Typography fontSize={12} color="#94a3b8">
                          Try changing your search or filters.
                        </Typography>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders
                    .slice(page * rowperpage, page * rowperpage + rowperpage)
                    .map((item, index) => {
                      const orderColor = getOrderColor(item.orderStatus);

                      const cancellationColor = getCancelColor(
                        item.cancellation?.status,
                      );

                      const cancellationPending = [
                        "Requested",
                        "Pending",
                      ].includes(item.cancellation?.status);

                      const selectedCancel = cancelstatus[item._id] || "";

                      return (
                        <TableRow
                          key={item._id}
                          hover
                          sx={{
                            "& td": {
                              py: 2,
                              borderBottom: "1px solid #f1f5f9",
                            },
                            "&:hover": {
                              bgcolor: "#f8faff",
                            },
                          }}
                        >
                          {/* ORDER DETAILS */}

                          <TableCell>
                            <Typography
                              fontWeight={800}
                              fontSize={13}
                              color="#1e293b"
                            >
                              {item.orderNumber}
                            </Typography>

                            <Typography
                              fontSize={10}
                              color="#94a3b8"
                              sx={{ mt: 0.5 }}
                            >
                              ID: {item._id.slice(-8)}
                            </Typography>
                          </TableCell>

                          {/* CUSTOMER ID */}

                          <TableCell>
                            <Typography
                              fontSize={12}
                              fontWeight={600}
                              color="#475569"
                            >
                              {String(item.userId)}
                            </Typography>
                          </TableCell>

                          {/* PRODUCT DETAILS */}

                          <TableCell>
                            <Stack spacing={1.5}>
                              {item.products?.map((product, index) => (
                                <Stack
                                  key={product._id || index}
                                  direction="row"
                                  spacing={1.2}
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
                                      width: 42,
                                      height: 42,
                                      bgcolor: "#f1f5f9",
                                      borderRadius: 2,
                                    }}
                                  >
                                    <Inventory2RoundedIcon fontSize="small" />
                                  </Avatar>

                                  <Box>
                                    <Typography
                                      fontSize={12}
                                      fontWeight={700}
                                      color="#334155"
                                    >
                                      {product.name}
                                    </Typography>

                                    <Typography fontSize={10} color="#94a3b8">
                                      Qty: {product.quantity} × ₹
                                      {Number(
                                        product.price || 0,
                                      ).toLocaleString("en-IN")}
                                    </Typography>
                                  </Box>
                                </Stack>
                              ))}
                            </Stack>
                          </TableCell>

                          {/* ORDER DATE */}

                          <TableCell>
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                            >
                              <CalendarMonthOutlinedIcon
                                sx={{
                                  fontSize: 17,
                                  color: "#94a3b8",
                                }}
                              />

                              <Typography fontSize={12} color="#475569">
                                {item.createdAt
                                  ? new Date(item.createdAt).toLocaleDateString(
                                      "en-IN",
                                    )
                                  : "N/A"}
                              </Typography>
                            </Stack>
                          </TableCell>

                          {/* AMOUNT */}

                          <TableCell>
                            <Typography
                              fontWeight={800}
                              fontSize={13}
                              color="#4f46e5"
                            >
                              ₹
                              {Number(item.grandTotal || 0).toLocaleString(
                                "en-IN",
                              )}
                            </Typography>
                          </TableCell>

                          {/* ORDER STATUS */}

                          <TableCell>
                            <Stack spacing={1}>
                              <Chip
                                size="small"
                                label={item.orderStatus}
                                sx={{
                                  width: "fit-content",
                                  bgcolor: orderColor.bg,
                                  color: orderColor.color,
                                  fontWeight: 800,
                                  fontSize: 10,
                                  borderRadius: 1.5,
                                }}
                              />

                              <Select
                                size="small"
                                value={status[item._id] ?? item.orderStatus}
                                onChange={(e) =>
                                  handlstatusupdate(item._id, e.target.value)
                                }
                                sx={{
                                  minWidth: 145,
                                  fontSize: 11,
                                  borderRadius: 1.8,
                                  bgcolor: "#fff",
                                }}
                              >
                                <MenuItem value="Pending">Pending</MenuItem>
                                <MenuItem value="Confirmed">Confirmed</MenuItem>
                                <MenuItem value="Shipped">Shipped</MenuItem>
                                <MenuItem value="Out for Delivery">
                                  Out for Delivery
                                </MenuItem>
                                <MenuItem value="Delivered">Delivered</MenuItem>
                              </Select>

                              {status[item._id] &&
                                status[item._id] !== item.orderStatus && (
                                  <Button
                                    variant="contained"
                                    size="small"
                                    onClick={() =>
                                      handlupdate(item._id, status[item._id])
                                    }
                                    sx={{
                                      textTransform: "none",
                                      fontSize: 10,
                                      fontWeight: 700,
                                      bgcolor: "#4f46e5",
                                      borderRadius: 1.5,
                                      boxShadow: "none",
                                      "&:hover": {
                                        bgcolor: "#4338ca",
                                        boxShadow: "none",
                                      },
                                    }}
                                  >
                                    Save Status
                                  </Button>
                                )}
                            </Stack>
                          </TableCell>

                          {/* CANCELLATION */}

                          <TableCell>
                            <Stack spacing={1}>
                              {item.cancellation?.status ? (
                                <Chip
                                  size="small"
                                  label={item.cancellation.status}
                                  sx={{
                                    width: "fit-content",
                                    bgcolor: cancellationColor.bg,
                                    color: cancellationColor.color,
                                    fontWeight: 800,
                                    fontSize: 10,
                                  }}
                                />
                              ) : (
                                <Typography fontSize={11} color="#94a3b8">
                                  No Request
                                </Typography>
                              )}

                              {item.cancellation?.reason && (
                                <Tooltip title={item.cancellation.reason}>
                                  <Typography
                                    fontSize={10}
                                    color="#64748b"
                                    sx={{
                                      maxWidth: 145,
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    Reason: {item.cancellation.reason}
                                  </Typography>
                                </Tooltip>
                              )}

                              {cancellationPending && (
                                <>
                                  <Select
                                    size="small"
                                    displayEmpty
                                    value={selectedCancel}
                                    onChange={(e) =>
                                      handlcancelselect(
                                        item._id,
                                        e.target.value,
                                      )
                                    }
                                    sx={{
                                      minWidth: 125,
                                      fontSize: 11,
                                      borderRadius: 1.8,
                                    }}
                                  >
                                    <MenuItem value="" disabled>
                                      Select Action
                                    </MenuItem>
                                    <MenuItem value="Approved">
                                      Approve
                                    </MenuItem>
                                    <MenuItem value="Rejected">Reject</MenuItem>
                                  </Select>

                                  {selectedCancel && (
                                    <Button
                                      size="small"
                                      variant="contained"
                                      color={
                                        selectedCancel === "Approved"
                                          ? "success"
                                          : "error"
                                      }
                                      onClick={() =>
                                        handlcancelstatus(
                                          item._id,
                                          selectedCancel,
                                        )
                                      }
                                      sx={{
                                        fontSize: 10,
                                        textTransform: "none",
                                        boxShadow: "none",
                                      }}
                                    >
                                      Confirm
                                    </Button>
                                  )}
                                </>
                              )}
                            </Stack>
                          </TableCell>

                          {/* ACTIONS */}

                          <TableCell align="center">
                            <Tooltip title="View Order Details">
                              <IconButton
                                onClick={() => {
                                  const productId =
                                    item.products?.[0]?.productId;

                                  if (!productId) {
                                    Swal.fire(
                                      "Details unavailable",
                                      "No product is available for this order.",
                                      "info",
                                    );
                                    return;
                                  }

                                  navigate(`/admin/single/view/${productId}`);
                                }}
                                sx={{
                                  bgcolor: "#eef2ff",
                                  color: "#4f46e5",
                                  borderRadius: 2,
                                  "&:hover": {
                                    bgcolor: "#c7d2fe",
                                  },
                                  m: 2,
                                }}
                              >
                                <VisibilityOutlinedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Download Invoice">
                              <IconButton
                                sx={{
                                  bgcolor: "#E8EEFF",
                                  color: "#3457D5",
                                  borderRadius: 2,
                                  transition: "all 0.2s ease",

                                  "&:hover": {
                                    bgcolor: "#3457D5",
                                    color: "#FFFFFF",
                                    transform: "translateY(-2px)",
                                    boxShadow:
                                      "0 4px 10px rgba(52,87,213,0.25)",
                                  },
                                }}
                                onClick={() => {
                                  handlinvoicegeneretion(item._id);
                                }}
                              >
                                <FileCopyOutlinedIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      );
                    })
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* PAGINATION */}

          <Divider />

          <TablePagination
            component="div"
            count={filteredOrders.length}
            page={Math.min(
              page,
              Math.max(0, Math.ceil(filteredOrders.length / rowperpage) - 1),
            )}
            rowsPerPage={rowperpage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsChange}
            rowsPerPageOptions={[5, 10, 15, 25]}
            sx={{
              bgcolor: "#fafbfc",
              border: "none",
              "& .MuiTablePagination-toolbar": {
                minHeight: 60,
              },
              "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                {
                  fontSize: 12,
                  color: "#64748b",
                },
            }}
          />
        </Paper>

        {/* ORDER OVERVIEW */}

        <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
          {/* DELIVERY OVERVIEW */}

          <Grid item xs={12} md={7}>
            <Card
              elevation={0}
              sx={{
                height: "100%",
                border: "1px solid #e5e7eb",
                borderRadius: 3,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1.5}
                  sx={{ mb: 3 }}
                >
                  <Avatar
                    variant="rounded"
                    sx={{
                      bgcolor: "#eef2ff",
                      color: "#4f46e5",
                      borderRadius: 2,
                    }}
                  >
                    <TrendingUpRoundedIcon />
                  </Avatar>

                  <Box>
                    <Typography fontSize={16} fontWeight={800} color="#111827">
                      Order Fulfillment Overview
                    </Typography>

                    <Typography fontSize={11} color="#94a3b8">
                      Delivered orders compared to total orders
                    </Typography>
                  </Box>
                </Stack>

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  sx={{ mb: 1 }}
                >
                  <Typography fontSize={12} color="#475569" fontWeight={600}>
                    Delivered Orders
                  </Typography>

                  <Typography fontSize={12} color="#059669" fontWeight={800}>
                    {deliveredOrders} ({deliveredPercentage}%)
                  </Typography>
                </Stack>

                <LinearProgress
                  variant="determinate"
                  value={deliveredPercentage}
                  sx={{
                    height: 9,
                    borderRadius: 5,
                    bgcolor: "#e5e7eb",
                    "& .MuiLinearProgress-bar": {
                      bgcolor: "#10b981",
                      borderRadius: 5,
                    },
                  }}
                />

                <Divider sx={{ my: 3 }} />

                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography fontSize={11} color="#94a3b8">
                      Total Orders
                    </Typography>
                    <Typography fontWeight={800} fontSize={19} color="#111827">
                      {totalOrders}
                    </Typography>
                  </Grid>

                  <Grid item xs={4}>
                    <Typography fontSize={11} color="#94a3b8">
                      Delivered
                    </Typography>
                    <Typography fontWeight={800} fontSize={19} color="#059669">
                      {deliveredOrders}
                    </Typography>
                  </Grid>

                  <Grid item xs={4}>
                    <Typography fontSize={11} color="#94a3b8">
                      Pending
                    </Typography>
                    <Typography fontWeight={800} fontSize={19} color="#d97706">
                      {pendingOrders}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* CANCELLATION OVERVIEW */}

          <Grid item xs={12} md={5}>
            <Card
              elevation={0}
              sx={{
                height: "100%",
                border: "1px solid #e5e7eb",
                borderRadius: 3,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1.5}
                  sx={{ mb: 2.5 }}
                >
                  <Avatar
                    variant="rounded"
                    sx={{
                      bgcolor: "#fee2e2",
                      color: "#dc2626",
                      borderRadius: 2,
                    }}
                  >
                    <CancelPresentationRoundedIcon />
                  </Avatar>

                  <Box>
                    <Typography fontSize={16} fontWeight={800} color="#111827">
                      Cancellation Overview
                    </Typography>

                    <Typography fontSize={11} color="#94a3b8">
                      Current cancellation request summary
                    </Typography>
                  </Box>
                </Stack>

                <Stack spacing={2}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography fontSize={12} color="#64748b">
                      Awaiting Review
                    </Typography>

                    <Chip
                      size="small"
                      label={cancellationRequests}
                      sx={{
                        bgcolor: "#fef3c7",
                        color: "#b45309",
                        fontWeight: 800,
                      }}
                    />
                  </Stack>

                  <Divider />

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography fontSize={12} color="#64748b">
                      Approved Requests
                    </Typography>

                    <Chip
                      size="small"
                      label={
                        deta.filter(
                          (item) => item.cancellation?.status === "Approved",
                        ).length
                      }
                      color="success"
                    />
                  </Stack>

                  <Divider />

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography fontSize={12} color="#64748b">
                      Rejected Requests
                    </Typography>

                    <Chip
                      size="small"
                      label={
                        deta.filter(
                          (item) => item.cancellation?.status === "Rejected",
                        ).length
                      }
                      color="error"
                    />
                  </Stack>

                  <Typography
                    fontSize={11}
                    color="#94a3b8"
                    sx={{ lineHeight: 1.7 }}
                  >
                    Review pending cancellation requests directly from the
                    orders table.
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* FOOTER */}

        <Box sx={{ textAlign: "center", mt: 4, pb: 2 }}>
          <Typography fontSize={11} color="#94a3b8">
            OrderFlow Admin Panel • Order Management
          </Typography>
        </Box>
      </Box>
    </AdminDrawer>
  );
}
