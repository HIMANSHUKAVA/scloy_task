import React, { useEffect, useState } from "react";
import Drawers1 from "../Component/Drawers1";
import axios from "axios";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import CachedIcon from "@mui/icons-material/Cached";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

// Backend URL
const API_BASE_URL = "http://localhost:5600";

// Image URL Function
const getImageUrl = (image) => {
  if (!image) return "";

  // If image is already a complete URL
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  // Add slash if missing
  const imagePath = image.startsWith("/") ? image : `/${image}`;

  // Encode filename spaces and special characters
  const encodedPath = imagePath
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");

  return `${API_BASE_URL}${encodedPath}`;
};

export default function Myorder() {
  const [order, setorder] = useState([]);
  const [loading, setLoading] = useState(false);

  // Selected order for tracking
  const [selectedOrder, setSelectedOrder] = useState(null);

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

  // Track Order Function
  const handleTrackOrder = (item) => {
    setSelectedOrder(item);
  };

  // Close Tracking Dialog
  const handleCloseTracking = () => {
    setSelectedOrder(null);
  };

  // Tracking Steps
  const trackingSteps = [
    "Pending",
    "Confirmed",
    "Shipped",
    "Out for Delivery",
    "Delivered",
  ];

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
      (history) => history.status?.toLowerCase() === step.toLowerCase(),
    );
  };

  // Status Colors
  const getStatusStyle = (status) => {
    if (status?.toLowerCase() === "cancelled") {
      return {
        bgcolor: "#fee2e2",
        color: "#dc2626",
      };
    }

    if (status?.toLowerCase() === "delivered") {
      return {
        bgcolor: "#dcfce7",
        color: "#15803d",
      };
    }

    return {
      bgcolor: "#e0ebff",
      color: "#1746c7",
    };
  };

  const [cancelReason, setCancelReason] = useState("");

  const navigate = useNavigate()
  const handlcancelrequest = (id) => {
    Swal.fire({
      title: "Cancel Order Request",
      text: "Please enter the reason for cancelling your order.",
      input: "textarea",
      inputPlaceholder: "Enter your cancellation reason...",
      inputAttributes: {
        "aria-label": "Cancellation reason",
      },
      showCancelButton: true,
      confirmButtonText: "Submit Request",
      cancelButtonText: "Close",
      confirmButtonColor: "#d33",

      inputValidator: (value) => {
        if (!value || !value.trim()) {
          return "Please enter a cancellation reason!";
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const reason = result.value.trim();

        // Store reason in state
        setCancelReason(reason);

        axios
          .post(
            `http://localhost:5600/order/user/cancelrequest/${id}`,
            {
              reason: reason,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            },
          )
          .then((res) => {
            console.log(res.data);

            Swal.fire({
              title: "Request Sent!",
              text: res.data.message,
              icon: "success",
            });

            navigate("/home")
          })
          .catch((er) => {
            console.log(er);

            Swal.fire({
              title: "Error!",
              text: er.response?.data?.message || "Something went wrong!",
              icon: "error",
            });
          });
      }
    });

    
    
    
  };

  return (
    <Drawers1>
      <Box
        sx={{
          minHeight: "100vh",
          background: "#f4f7fc",
          pt: 5,
          px: { xs: 2, sm: 3, md: 5 },
          pb: 5,
        }}
      >
        {/* PAGE HEADER */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
            mb: 4,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Avatar
              sx={{
                width: 65,
                height: 65,
                bgcolor: "#e0eaff",
                color: "#2563eb",
              }}
            >
              <ShoppingBagOutlinedIcon fontSize="large" />
            </Avatar>

            <Box>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  color: "#111827",
                }}
              >
                My Orders
              </Typography>

              <Typography color="text.secondary">
                Track And Manage Your Orders
              </Typography>
            </Box>
          </Box>

          <Button
            variant="outlined"
            startIcon={<CachedIcon />}
            onClick={getOrders}
            disabled={loading}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1.2,
              fontWeight: 600,
            }}
          >
            {loading ? "Refreshing..." : "Refresh Orders"}
          </Button>
        </Box>

        {/* LOADING */}

        {loading && order.length === 0 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              p: 5,
            }}
          >
            <CircularProgress />
          </Box>
        )}

        {/* NO ORDERS */}

        {!loading && order.length === 0 && (
          <Paper
            sx={{
              p: 5,
              textAlign: "center",
              borderRadius: 3,
            }}
          >
            <Typography variant="h5" fontWeight={700}>
              No Orders Found
            </Typography>

            <Typography color="text.secondary">
              You have not placed any orders yet.
            </Typography>
          </Paper>
        )}

        {/* ORDER LIST */}

        {order.map((item) => {
          const status = item.orderStatus || "Pending";
          const activeStep = getStatusIndex(status);
          const statusStyle = getStatusStyle(status);

          return (
            <Paper
              key={item._id}
              elevation={1}
              sx={{
                mb: 3,
                p: { xs: 2, md: 3 },
                borderRadius: 3,
                border: "1px solid #e5eaf3",
              }}
            >
              {/* ORDER HEADER */}

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 2,
                  pb: 2,
                  borderBottom: "1px solid #e5eaf3",
                }}
              >
                <Typography fontWeight={700} color="#111827">
                  Order #{item.orderNumber}
                </Typography>

                <CalendarMonthIcon color="action" />

                <Typography color="text.secondary">
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "Date unavailable"}
                </Typography>

                <Typography
                  sx={{
                    bgcolor: "#e0ebff",
                    color: "#1746c7",
                    px: 2,
                    py: 1,
                    borderRadius: 5,
                    fontWeight: 700,
                  }}
                >
                  ₹{item.grandTotal}
                </Typography>

                <Box sx={{ flexGrow: 1 }} />

                <Box
                  sx={{
                    ...statusStyle,
                    px: 2,
                    py: 1,
                    borderRadius: 5,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    fontWeight: 700,
                  }}
                >
                  {status === "Cancelled" ? (
                    <CloseIcon fontSize="small" />
                  ) : (
                    <CheckCircleIcon fontSize="small" />
                  )}

                  {status}
                </Box>
              </Box>

              {/* PRODUCT AND TRACKING SECTION */}

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    md: "1.6fr 1fr",
                  },
                  gap: 3,
                  mt: 3,
                }}
              >
                {/* PRODUCT DETAILS */}

                <Box>
                  {item.products?.length > 0 ? (
                    item.products.map((p, index) => {
                      const quantity = p.quantity || 1;
                      const imageUrl = getImageUrl(p.image);

                      return (
                        <Box
                          key={p._id || index}
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 3,
                            mb: 3,
                            flexWrap: "wrap",
                          }}
                        >
                          {/* PRODUCT IMAGE */}

                          <Box
                            sx={{
                              width: { xs: "100%", sm: 180 },
                              maxWidth: 180,
                              height: 150,
                              bgcolor: "#f3f6fc",
                              borderRadius: 3,
                              border: "1px solid #e5eaf3",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              overflow: "hidden",
                              flexShrink: 0,
                              // bgcolor:"red"
                            }}
                          >
                            {imageUrl ? (
                              <>
                                <Box
                                  component="img"
                                  src={imageUrl}
                                  alt={p.name}
                                  onError={(e) => {
                                    console.log("Image URL Error:", imageUrl);

                                    e.currentTarget.style.display = "none";

                                    const fallback =
                                      e.currentTarget.nextElementSibling;

                                    if (fallback) {
                                      fallback.style.display = "block";
                                    }
                                  }}
                                  sx={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "contain",
                                    p: 1,
                                  }}
                                />

                                <ShoppingBagOutlinedIcon
                                  sx={{
                                    display: "none",
                                    fontSize: 55,
                                    color: "#94a3b8",
                                  }}
                                />
                              </>
                            ) : (
                              <ShoppingBagOutlinedIcon
                                sx={{
                                  fontSize: 55,
                                  color: "#94a3b8",
                                }}
                              />
                            )}
                          </Box>

                          {/* PRODUCT INFORMATION */}

                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "flex-start",
                              gap: 1,
                              flex: 1,
                            }}
                          >
                            <Typography
                              variant="h6"
                              fontWeight={700}
                              color="#172554"
                            >
                              {p.name}
                            </Typography>

                            <Typography>Qty: {quantity}</Typography>

                            <Typography
                              variant="h6"
                              fontWeight={700}
                              color="#1746c7"
                            >
                              ₹{p.total ?? p.price * quantity}
                            </Typography>

                            {/* ACTION BUTTONS */}

                            <Stack
                              direction={{
                                xs: "column",
                                sm: "row",
                              }}
                              spacing={1.5}
                              sx={{ mt: 1 }}
                            >
                              <Button
                                variant="contained"
                                startIcon={<LocationOnIcon />}
                                onClick={() => handleTrackOrder(item)}
                                sx={{
                                  px: 3,
                                  py: 1.2,
                                  borderRadius: 2,
                                  bgcolor: "#155dfb",
                                  textTransform: "none",
                                  fontWeight: 700,
                                  whiteSpace: "nowrap",
                                }}
                              >
                                Track Order
                              </Button>

                              <Button
                                variant="outlined"
                                color="error"
                                startIcon={<CancelOutlinedIcon />}
                                disabled={
                                  status.toLowerCase() === "cancelled" ||
                                  status.toLowerCase() === "delivered" ||
                                  item.cancellation?.requested
                                }
                                sx={{
                                  px: 3,
                                  py: 1.2,
                                  borderRadius: 2,
                                  textTransform: "none",
                                  fontWeight: 700,
                                  whiteSpace: "nowrap",
                                }}
                                onClick={() => {
                                  handlcancelrequest(item._id);
                                }}
                              >
                                Cancel Order
                              </Button>
                            </Stack>
                          </Box>
                        </Box>
                      );
                    })
                  ) : (
                    <Typography color="text.secondary">
                      No Products Found
                    </Typography>
                  )}
                </Box>

                {/* ORDER TRACKING */}

                <Box
                  sx={{
                    bgcolor: "#f3f6fd",
                    borderRadius: 3,
                    p: 3,
                    // bgcolor:"green"
                  }}
                >
                  {/* header */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      mb: 3,
                      // bgcolor:"red"
                    }}
                  >
                    <LocalShippingIcon
                      sx={{
                        fontSize: 30,
                        color: "#172554",
                      }}
                    />

                    <Typography variant="h6" fontWeight={700} color="#172554">
                      Order Tracking
                    </Typography>
                  </Box>

                  {status === "Cancelled" ? (
                    <Box
                      sx={{
                        bgcolor: "#fee2e2",
                        p: 2,
                        borderRadius: 2,
                        color: "#dc2626",
                      }}
                    >
                      <Typography fontWeight={700}>Order Cancelled</Typography>

                      <Typography variant="body2">
                        {item.cancellation?.reason ||
                          "This order has been cancelled."}
                      </Typography>
                    </Box>
                  ) : (
                    trackingSteps.map((step, index) => {
                      const completed =
                        activeStep !== -1 && index <= activeStep;

                      const current = index === activeStep;

                      const history = getStepHistory(item, step);

                      return (
                        <Box
                          key={step}
                          sx={{
                            display: "flex",
                            gap: 2,
                            minHeight: 55,
                            position: "relative",
                          }}
                        >
                          {/* TIMELINE CIRCLE */}

                          <Box
                            sx={{
                              width: 30,
                              height: 30,
                              borderRadius: "50%",
                              bgcolor: completed ? "#155dfb" : "#fff",
                              border: completed ? "none" : "2px solid #b9c8df",
                              color: "#fff",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              zIndex: 1,
                              flexShrink: 0,
                            }}
                          >
                            {completed && <CheckCircleIcon fontSize="small" />}
                          </Box>

                          {/* TIMELINE LINE */}

                          {index !== trackingSteps.length - 1 && (
                            <Box
                              sx={{
                                position: "absolute",
                                left: 14,
                                top: 30,
                                height: 25,
                                width: 2,
                                bgcolor:
                                  completed && index < activeStep
                                    ? "#155dfb"
                                    : "#cbd5e1",
                              }}
                            />
                          )}

                          {/* STEP DETAILS */}

                          <Box sx={{ pb: 2 }}>
                            <Typography
                              fontWeight={current ? 700 : 500}
                              color={completed ? "#172554" : "#64748b"}
                            >
                              {step}
                            </Typography>

                            {history && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                display="block"
                              >
                                {new Date(history.updatedAt).toLocaleString(
                                  "en-IN",
                                )}
                              </Typography>
                            )}

                            {current && (
                              <Typography variant="caption" color="primary">
                                Current Order Status
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      );
                    })
                  )}
                </Box>
              </Box>
            </Paper>
          );
        })}

        {/* TRACK ORDER DIALOG */}

        <Dialog
          open={Boolean(selectedOrder)}
          onClose={handleCloseTracking}
          fullWidth
          maxWidth="sm"
        >
          {selectedOrder && (
            <>
              <DialogTitle
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  fontWeight: 700,
                }}
              >
                <LocalShippingIcon color="primary" />
                Order Tracking
              </DialogTitle>

              <DialogContent dividers>
                <Typography fontWeight={700}>
                  Order #{selectedOrder.orderNumber}
                </Typography>

                <Typography
                  color="text.secondary"
                  variant="body2"
                  sx={{ mt: 1, mb: 2 }}
                >
                  Current Status: {selectedOrder.orderStatus}
                </Typography>

                <Divider sx={{ mb: 3 }} />

                {selectedOrder.orderStatus === "Cancelled" ? (
                  <Box
                    sx={{
                      bgcolor: "#fee2e2",
                      color: "#dc2626",
                      p: 2,
                      borderRadius: 2,
                    }}
                  >
                    <Typography fontWeight={700}>Order Cancelled</Typography>

                    <Typography variant="body2">
                      {selectedOrder.cancellation?.reason ||
                        "This order has been cancelled."}
                    </Typography>
                  </Box>
                ) : (
                  trackingSteps.map((step, index) => {
                    const currentIndex = getStatusIndex(
                      selectedOrder.orderStatus,
                    );

                    const completed =
                      currentIndex !== -1 && index <= currentIndex;

                    const current = index === currentIndex;

                    const history = getStepHistory(selectedOrder, step);

                    return (
                      <Box
                        key={step}
                        sx={{
                          display: "flex",
                          gap: 2,
                          minHeight: 75,
                          position: "relative",
                        }}
                      >
                        {/* Circle */}

                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            bgcolor: completed ? "#155dfb" : "#fff",
                            border: completed ? "none" : "2px solid #cbd5e1",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            color: "#fff",
                            zIndex: 1,
                            flexShrink: 0,
                          }}
                        >
                          {completed && <CheckCircleIcon fontSize="small" />}
                        </Box>

                        {/* Line */}

                        {index !== trackingSteps.length - 1 && (
                          <Box
                            sx={{
                              position: "absolute",
                              left: 15,
                              top: 32,
                              height: 43,
                              width: 2,
                              bgcolor:
                                completed && index < currentIndex
                                  ? "#155dfb"
                                  : "#cbd5e1",
                            }}
                          />
                        )}

                        {/* History */}

                        <Box sx={{ pb: 2 }}>
                          <Typography
                            fontWeight={current ? 700 : 500}
                            color={completed ? "#172554" : "text.secondary"}
                          >
                            {step}
                          </Typography>

                          {history ? (
                            <>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                display="block"
                              >
                                {new Date(history.updatedAt).toLocaleString(
                                  "en-IN",
                                )}
                              </Typography>

                              <Typography variant="caption">
                                {history.note}
                              </Typography>
                            </>
                          ) : (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Not completed yet
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    );
                  })
                )}
              </DialogContent>

              <DialogActions sx={{ p: 2 }}>
                <Button variant="contained" onClick={handleCloseTracking}>
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
