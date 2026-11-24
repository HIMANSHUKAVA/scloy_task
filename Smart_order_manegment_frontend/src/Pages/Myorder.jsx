
import React, { useEffect, useState } from "react";
import Drawers1 from "../Component/Drawers1";
import axios from "axios";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import CachedIcon from "@mui/icons-material/Cached";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:5600";

// Image URL Function
const getImageUrl = (image) => {
  if (!image) return "";

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  const imagePath = image.startsWith("/") ? image : `/${image}`;

  const encodedPath = imagePath
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");

  return `${API_BASE_URL}${encodedPath}`;
};

const trackingSteps = [
  "Pending",
  "Confirmed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

export default function Myorder() {
  const [order, setorder] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const navigate = useNavigate();

  // Fetch Orders
  const getOrders = async () => {
    setLoading(true);

    try {
      const res = await axios.get(`${API_BASE_URL}/order/user/orderview`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("Order Data:", res.data.deta);
      setorder(res.data.deta || []);
    } catch (error) {
      console.log("Order Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  // Get Current Status Index
  const getStatusIndex = (status) => {
    const value = status?.toLowerCase();

    if (value === "pending") return 0;
    if (value === "confirmed" || value === "processing") return 1;
    if (value === "shipped") return 2;
    if (value === "out for delivery") return 3;
    if (value === "delivered") return 4;

    return -1;
  };

  // Get History for Each Step
  const getStepHistory = (item, step) => {
    return item.statusHistory?.find(
      (history) => history.status?.toLowerCase() === step.toLowerCase()
    );
  };

  // Status Colors
  const getStatusStyle = (status) => {
    const value = status?.toLowerCase();

    if (value === "cancelled") {
      return {
        bgcolor: "#fee2e2",
        color: "#dc2626",
        border: "#fecaca",
      };
    }

    if (value === "delivered") {
      return {
        bgcolor: "#dcfce7",
        color: "#15803d",
        border: "#bbf7d0",
      };
    }

    return {
      bgcolor: "#eef2ff",
      color: "#4338ca",
      border: "#c7d2fe",
    };
  };

  // Cancel Order Request
  const handlcancelrequest = async (id) => {
    const result = await Swal.fire({
      title: "Cancel Order",
      text: "Please enter the reason for cancelling your order.",
      input: "textarea",
      inputPlaceholder: "Enter your cancellation reason...",
      inputAttributes: {
        "aria-label": "Cancellation reason",
      },
      showCancelButton: true,
      confirmButtonText: "Cancel Order",
      cancelButtonText: "Close",
      confirmButtonColor: "#dc2626",

      inputValidator: (value) => {
        if (!value || !value.trim()) {
          return "Please enter a cancellation reason!";
        }
      },
    });

    if (!result.isConfirmed) return;

    const reason = result.value.trim();

    try {
      const res = await axios.post(
        `${API_BASE_URL}/order/user/cancelrequest/${id}`,
        {
          reason: reason,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      Swal.fire({
        title: "Cancellation Request Submitted!",
        text: res.data.message,
        icon: "success",
        confirmButtonColor: "#4f46e5",
      });

      getOrders();
    } catch (er) {
      console.log(er);

      Swal.fire({
        title: "Error!",
        text: er.response?.data?.message || "Something went wrong!",
        icon: "error",
        confirmButtonColor: "#4f46e5",
      });
    }
  };

  // Tracking Timeline
  const TrackingTimeline = ({ item, compact = false }) => {
    const activeStep = getStatusIndex(item.orderStatus);

    if (item.orderStatus?.toLowerCase() === "cancelled") {
      return (
        <Box
          sx={{
            p: 2,
            borderRadius: 2.5,
            bgcolor: "#fff1f2",
            border: "1px solid #fecdd3",
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center" mb={1}>
            <CancelOutlinedIcon sx={{ color: "#dc2626" }} />
            <Typography fontWeight={800} color="#dc2626">
              Order Cancelled
            </Typography>
          </Stack>

          <Typography fontSize={13} color="#991b1b">
            {item.cancellation?.reason ||
              "This order has been cancelled."}
          </Typography>
        </Box>
      );
    }

    return (
      <Box sx={{ mt: 1 }}>
        {trackingSteps.map((step, index) => {
          const completed = activeStep !== -1 && index <= activeStep;
          const current = index === activeStep;
          const history = getStepHistory(item, step);

          return (
            <Box
              key={step}
              sx={{
                display: "flex",
                gap: 2,
                minHeight: compact ? 57 : 68,
                position: "relative",
              }}
            >
              {/* Timeline Circle */}
              <Box
                sx={{
                  width: 31,
                  height: 31,
                  borderRadius: "50%",
                  flexShrink: 0,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  bgcolor: completed ? "#4f46e5" : "#fff",
                  border: completed ? "none" : "2px solid #cbd5e1",
                  color: "#fff",
                  zIndex: 1,
                  boxShadow: current
                    ? "0 0 0 5px rgba(79,70,229,0.12)"
                    : "none",
                }}
              >
                {completed && <CheckCircleIcon sx={{ fontSize: 19 }} />}
              </Box>

              {/* Timeline Line */}
              {index !== trackingSteps.length - 1 && (
                <Box
                  sx={{
                    position: "absolute",
                    left: 14,
                    top: 31,
                    height: compact ? 26 : 37,
                    width: 2,
                    bgcolor:
                      completed && index < activeStep
                        ? "#4f46e5"
                        : "#e2e8f0",
                  }}
                />
              )}

              {/* Step Details */}
              <Box sx={{ pb: 2 }}>
                <Typography
                  fontSize={13}
                  fontWeight={current ? 800 : 600}
                  color={completed ? "#172033" : "#94a3b8"}
                >
                  {step}
                </Typography>

                {history?.updatedAt && (
                  <Typography
                    variant="caption"
                    display="block"
                    color="#94a3b8"
                    sx={{ mt: 0.3 }}
                  >
                    {new Date(history.updatedAt).toLocaleString("en-IN")}
                  </Typography>
                )}

                {current && (
                  <Chip
                    label="Current Status"
                    size="small"
                    sx={{
                      mt: 0.7,
                      height: 21,
                      fontSize: 10,
                      fontWeight: 700,
                      bgcolor: "#eef2ff",
                      color: "#4338ca",
                    }}
                  />
                )}
              </Box>
            </Box>
          );
        })}
      </Box>
    );
  };

  const handleCloseTracking = () => {
    setSelectedOrder(null);
  };

  return (
    <Drawers1>
      <Box
        sx={{
          width: "100%",
          maxWidth: 1500,
          mx: "auto",
        }}
      >
        {/* Page Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            flexWrap: "wrap",
            gap: 2,
            mb: 3.5,
          }}
        >
          <Box>
            <Typography
              variant="h5"
              fontWeight={800}
              color="#172033"
              mb={0.7}
            >
              My Orders
            </Typography>

            <Typography fontSize={14} color="#8490a5">
              Track and manage all your purchases in one place.
            </Typography>
          </Box>

          <Button
            variant="outlined"
            startIcon={
              loading ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <CachedIcon />
              )
            }
            onClick={getOrders}
            disabled={loading}
            sx={{
              borderRadius: 2.5,
              px: 2.5,
              py: 1.2,
              fontWeight: 700,
              textTransform: "none",
              color: "#4338ca",
              borderColor: "#c7d2fe",
              bgcolor: "#fff",
              "&:hover": {
                bgcolor: "#eef2ff",
                borderColor: "#818cf8",
              },
            }}
          >
            {loading ? "Refreshing..." : "Refresh Orders"}
          </Button>
        </Box>

        {/* Summary Banner */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, md: 3 },
            mb: 3.5,
            borderRadius: 3.5,
            color: "#fff",
            background:
              "linear-gradient(110deg, #1e1b4b 0%, #3730a3 60%, #6366f1 100%)",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Avatar
            sx={{
              width: 54,
              height: 54,
              bgcolor: "rgba(255,255,255,0.15)",
              color: "#fff",
              borderRadius: 2.5,
            }}
          >
            <ShoppingBagOutlinedIcon fontSize="large" />
          </Avatar>

          <Box>
            <Typography fontSize={20} fontWeight={800}>
              Your Shopping Activity
            </Typography>

            <Typography fontSize={13} color="#e0e7ff">
              You have {order.length} order{order.length !== 1 ? "s" : ""} in
              your account.
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              alignItems: "center",
              gap: 1,
              bgcolor: "rgba(255,255,255,0.13)",
              px: 2,
              py: 1,
              borderRadius: 2,
            }}
          >
            <Inventory2OutlinedIcon />
            <Typography fontWeight={800}>{order.length}</Typography>
          </Box>
        </Paper>

        {/* Loading */}
        {loading && order.length === 0 && (
          <Paper
            elevation={0}
            sx={{
              py: 8,
              textAlign: "center",
              borderRadius: 3,
              border: "1px solid #e9edf5",
            }}
          >
            <CircularProgress sx={{ color: "#4f46e5" }} />
            <Typography color="#8490a5" mt={2} fontSize={14}>
              Loading your orders...
            </Typography>
          </Paper>
        )}

        {/* No Orders */}
        {!loading && order.length === 0 && (
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 6 },
              textAlign: "center",
              borderRadius: 3.5,
              border: "1px solid #e9edf5",
            }}
          >
            <Avatar
              sx={{
                width: 85,
                height: 85,
                mx: "auto",
                mb: 2,
                bgcolor: "#eef2ff",
                color: "#6366f1",
              }}
            >
              <ShoppingBagOutlinedIcon sx={{ fontSize: 42 }} />
            </Avatar>

            <Typography variant="h5" fontWeight={800} color="#172033">
              No Orders Found
            </Typography>

            <Typography color="#94a3b8" fontSize={14} mt={1} mb={3}>
              You have not placed any orders yet. Explore products to get
              started.
            </Typography>

            <Button
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate("/view-product")}
              sx={{
                bgcolor: "#4f46e5",
                borderRadius: 2,
                px: 3,
                py: 1.2,
                fontWeight: 700,
                textTransform: "none",
                "&:hover": { bgcolor: "#4338ca" },
              }}
            >
              Explore Products
            </Button>
          </Paper>
        )}

        {/* Orders List */}
        <Stack spacing={3}>
          {order.map((item) => {
            const status = item.orderStatus || "Pending";
            const statusStyle = getStatusStyle(status);
            const isCancelled = status.toLowerCase() === "cancelled";
            const isDelivered = status.toLowerCase() === "delivered";

            return (
              <Paper
                key={item._id}
                elevation={0}
                sx={{
                  overflow: "hidden",
                  borderRadius: 3.5,
                  border: "1px solid #e5eaf3",
                  bgcolor: "#fff",
                  transition: "all 0.25s ease",
                  "&:hover": {
                    boxShadow: "0 12px 30px rgba(30,41,59,0.07)",
                    borderColor: "#c7d2fe",
                  },
                }}
              >
                {/* Order Header */}
                <Box
                  sx={{
                    p: { xs: 2, md: 2.5 },
                    background: "#fafbff",
                    borderBottom: "1px solid #edf0f5",
                  }}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    flexWrap="wrap"
                    gap={2}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        fontSize={11}
                        fontWeight={700}
                        color="#94a3b8"
                        mb={0.5}
                      >
                        ORDER NUMBER
                      </Typography>

                      <Typography
                        fontWeight={800}
                        color="#172033"
                        fontSize={15}
                        sx={{ overflowWrap: "anywhere" }}
                      >
                        #{item.orderNumber}
                      </Typography>
                    </Box>

                    <Divider
                      orientation="vertical"
                      flexItem
                      sx={{ display: { xs: "none", sm: "block" } }}
                    />

                    <Box>
                      <Stack direction="row" spacing={0.8} alignItems="center">
                        <CalendarMonthIcon
                          sx={{ fontSize: 17, color: "#94a3b8" }}
                        />

                        <Typography fontSize={11} color="#94a3b8">
                          ORDER DATE
                        </Typography>
                      </Stack>

                      <Typography
                        fontSize={13}
                        fontWeight={700}
                        color="#475569"
                        mt={0.5}
                      >
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "Date unavailable"}
                      </Typography>
                    </Box>

                    <Box sx={{ flexGrow: 1 }} />

                    <Box
                      sx={{
                        px: 1.8,
                        py: 0.9,
                        borderRadius: 2,
                        bgcolor: "#eef2ff",
                      }}
                    >
                      <Typography
                        fontSize={10}
                        fontWeight={700}
                        color="#818cf8"
                      >
                        TOTAL AMOUNT
                      </Typography>

                      <Typography
                        fontSize={18}
                        fontWeight={800}
                        color="#4338ca"
                      >
                        ₹{item.grandTotal}
                      </Typography>
                    </Box>

                    <Chip
                      icon={
                        isCancelled ? (
                          <CloseIcon />
                        ) : (
                          <CheckCircleIcon />
                        )
                      }
                      label={status}
                      sx={{
                        height: 35,
                        px: 0.5,
                        fontWeight: 800,
                        bgcolor: statusStyle.bgcolor,
                        color: statusStyle.color,
                        border: `1px solid ${statusStyle.border}`,
                        "& .MuiChip-icon": {
                          color: statusStyle.color,
                        },
                      }}
                    />
                  </Stack>
                </Box>

                {/* Order Body */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      lg: "minmax(0, 1.5fr) minmax(280px, 0.85fr)",
                    },
                    gap: 3,
                    p: { xs: 2, md: 3 },
                  }}
                >
                  {/* Product Details */}
                  <Box>
                    <Typography
                      fontWeight={800}
                      fontSize={14}
                      color="#172033"
                      mb={2.5}
                    >
                      Ordered Products
                    </Typography>

                    {item.products?.length > 0 ? (
                      item.products.map((p, index) => {
                        const quantity = p.quantity || 1;
                        const imageUrl = getImageUrl(p.image);

                        return (
                          <Box key={p._id || index}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2.5,
                                mb: 2.5,
                                flexWrap: "wrap",
                              }}
                            >
                              {/* Product Image */}
                              <Box
                                sx={{
                                  width: { xs: 95, sm: 125 },
                                  height: { xs: 95, sm: 125 },
                                  borderRadius: 2.5,
                                  bgcolor: "#f8faff",
                                  border: "1px solid #edf0f5",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  overflow: "hidden",
                                  flexShrink: 0,
                                }}
                              >
                                {imageUrl ? (
                                  <Box
                                    component="img"
                                    src={imageUrl}
                                    alt={p.name}
                                    onError={(e) => {
                                      e.currentTarget.style.display = "none";
                                    }}
                                    sx={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "contain",
                                      p: 1,
                                    }}
                                  />
                                ) : (
                                  <ShoppingBagOutlinedIcon
                                    sx={{ fontSize: 42, color: "#94a3b8" }}
                                  />
                                )}
                              </Box>

                              {/* Product Info */}
                              <Box sx={{ flex: 1, minWidth: 150 }}>
                                <Typography
                                  fontWeight={800}
                                  color="#172033"
                                  fontSize={15}
                                >
                                  {p.name}
                                </Typography>

                                <Typography
                                  fontSize={12}
                                  color="#94a3b8"
                                  mt={0.8}
                                >
                                  Quantity: {quantity}
                                </Typography>

                                <Typography
                                  fontSize={19}
                                  fontWeight={800}
                                  color="#4338ca"
                                  mt={1}
                                >
                                  ₹{p.total ?? p.price * quantity}
                                </Typography>
                              </Box>
                            </Box>

                            {index !== item.products.length - 1 && (
                              <Divider sx={{ mb: 2.5 }} />
                            )}
                          </Box>
                        );
                      })
                    ) : (
                      <Typography color="text.secondary" fontSize={13}>
                        No Products Found
                      </Typography>
                    )}

                    {/* Order Actions */}
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={1.5}
                      sx={{ mt: 2 }}
                    >
                      <Button
                        variant="contained"
                        startIcon={<LocationOnIcon />}
                        onClick={() => setSelectedOrder(item)}
                        sx={{
                          borderRadius: 2,
                          px: 2.5,
                          py: 1.2,
                          bgcolor: "#4f46e5",
                          textTransform: "none",
                          fontWeight: 700,
                          "&:hover": { bgcolor: "#4338ca" },
                        }}
                      >
                        Track Order
                      </Button>

                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<CancelOutlinedIcon />}
                        disabled={
                          isCancelled ||
                          isDelivered ||
                          item.cancellation?.requested
                        }
                        onClick={() => handlcancelrequest(item._id)}
                        sx={{
                          borderRadius: 2,
                          px: 2.5,
                          py: 1.2,
                          textTransform: "none",
                          fontWeight: 700,
                          "&.Mui-disabled": {
                            borderColor: "#e2e8f0",
                            color: "#94a3b8",
                          },
                        }}
                      >
                        {item.cancellation?.requested
                          ? "Cancellation Requested"
                          : "Cancel Order"}
                      </Button>
                    </Stack>
                  </Box>

                  {/* Tracking Panel */}
                  <Box
                    sx={{
                      bgcolor: "#f8faff",
                      border: "1px solid #edf0f5",
                      borderRadius: 3,
                      p: { xs: 2, md: 2.5 },
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1.2}
                      mb={2.5}
                    >
                      <Avatar
                        sx={{
                          width: 37,
                          height: 37,
                          bgcolor: "#eef2ff",
                          color: "#4f46e5",
                        }}
                      >
                        <LocalShippingIcon fontSize="small" />
                      </Avatar>

                      <Box>
                        <Typography
                          fontWeight={800}
                          color="#172033"
                          fontSize={14}
                        >
                          Order Tracking
                        </Typography>

                        <Typography fontSize={11} color="#94a3b8">
                          Delivery progress
                        </Typography>
                      </Box>
                    </Stack>

                    <Divider sx={{ mb: 2.5 }} />

                    <TrackingTimeline item={item} compact />
                  </Box>
                </Box>
              </Paper>
            );
          })}
        </Stack>

        {/* Tracking Dialog */}
        <Dialog
          open={Boolean(selectedOrder)}
          onClose={handleCloseTracking}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            sx: {
              borderRadius: 3.5,
              overflow: "hidden",
            },
          }}
        >
          {selectedOrder && (
            <>
              <Box
                sx={{
                  p: 2.5,
                  color: "#fff",
                  background:
                    "linear-gradient(110deg, #1e1b4b, #4f46e5)",
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: "rgba(255,255,255,0.15)",
                    color: "#fff",
                  }}
                >
                  <LocalShippingIcon />
                </Avatar>

                <Box sx={{ flexGrow: 1 }}>
                  <Typography fontWeight={800} fontSize={17}>
                    Order Tracking
                  </Typography>

                  <Typography fontSize={12} color="#e0e7ff">
                    #{selectedOrder.orderNumber}
                  </Typography>
                </Box>

                <IconButton
                  onClick={handleCloseTracking}
                  sx={{ color: "#fff" }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>

              <DialogContent sx={{ p: 3 }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2.5}
                  gap={1}
                >
                  <Typography fontWeight={700} color="#172033">
                    Delivery Progress
                  </Typography>

                  <Chip
                    size="small"
                    label={selectedOrder.orderStatus || "Pending"}
                    sx={{
                      fontWeight: 700,
                      bgcolor: getStatusStyle(
                        selectedOrder.orderStatus
                      ).bgcolor,
                      color: getStatusStyle(
                        selectedOrder.orderStatus
                      ).color,
                    }}
                  />
                </Stack>

                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: 2.5,
                    bgcolor: "#f8faff",
                    border: "1px solid #edf0f5",
                  }}
                >
                  <TrackingTimeline item={selectedOrder} />
                </Paper>
              </DialogContent>

              <DialogActions sx={{ p: 2.5, pt: 0 }}>
                <Button
                  variant="contained"
                  onClick={handleCloseTracking}
                  sx={{
                    px: 3,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 700,
                    bgcolor: "#4f46e5",
                    "&:hover": { bgcolor: "#4338ca" },
                  }}
                >
                  Close
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Box>
    </Drawers1>
  );
}
