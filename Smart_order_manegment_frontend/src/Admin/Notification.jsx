
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import AdminDrawer from "./AdminDrawer";

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Tooltip from '@mui/material/Tooltip';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import MailIcon from '@mui/icons-material/Mail';
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import RefreshIcon from "@mui/icons-material/Refresh";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DeleteIcon from '@mui/icons-material/Delete';
const API = "http://localhost:5600/notification";

export default function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const showMessage = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  // Fetch all notifications
  const FetchNotifications = useCallback(async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${API}/all`, config);

      const data = response.data.deta;

      const list = Array.isArray(data)
        ? data
        : data.notifications ||
          data.result ||
          data.data ||
          [];

      setNotifications(Array.isArray(list) ? list : []);
    } catch (error) {
      console.log("Notification Fetch Error:", error);
      showMessage(
        error.response?.data?.message || "Unable to fetch notifications",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    FetchNotifications();
  }, [FetchNotifications]);

  // Mark single notification as read
  const MarkAsRead = async (id) => {
    try {
      await axios.put(`${API}/read/${id}`, {}, config);

      setNotifications((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, isRead: true } : item
        )
      );

      showMessage("Notification marked as read");
    } catch (error) {
      showMessage("Unable to mark notification as read", "error");
    }
  };

  // Mark all notifications as read
  const MarkAllRead = async () => {
    try {
      await axios.put(`${API}/read-all`, {}, config);

      setNotifications((prev) =>
        prev.map((item) => ({ ...item, isRead: true }))
      );

      showMessage("All notifications marked as read");
    } catch (error) {
      showMessage("Unable to mark all as read", "error");
    }
  };

  // Delete notification
  const DeleteNotification = async (id) => {
    try {
      await axios.delete(`${API}/delete/${id}`, config);

      setNotifications((prev) =>
        prev.filter((item) => item._id !== id)
      );

      showMessage("Notification deleted successfully");
    } catch (error) {
      showMessage("Unable to delete notification", "error");
    }
  };

  const unreadCount = notifications.filter(
    (item) => !item.isRead
  ).length;

  const readCount = notifications.length - unreadCount;

  const filteredNotifications = notifications.filter((item) => {
    if (filter === "unread") return !item.isRead;
    if (filter === "read") return item.isRead;
    return true;
  });

  const GetNotificationIcon = (type) => {
    switch (type) {
      case "order":
        return <ShoppingBagIcon />;

      case "lowstock":
        return <WarningAmberIcon />;

      case "stockout":
        return <Inventory2Icon />;

      case "contact":
        return <MailIcon />;

      case "cancellation":
        return <DeleteIcon />;

      default:
        return <NotificationsActiveIcon />;
    }
  };

  const GetNotificationColor = (type) => {
    switch (type) {
      case "order":
        return "#2563eb";

      case "lowstock":
        return "#d97706";

      case "stockout":
        return "#dc2626";

      case "contact":
        return "#7c3aed";

      case "cancellation":
        return "#e11d48";

      default:
        return "#64748b";
    }
  };

  const FormatDate = (date) => {
    if (!date) return "Date unavailable";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <AdminDrawer>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#f8fafc",
          p: { xs: 2, md: 3 },
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
          <Box>
            <Typography
              variant="h4"
              fontWeight={800}
              color="#0f172a"
            >
              Notifications
            </Typography>

            <Typography color="text.secondary" mt={0.5}>
              Manage all your store activities and updates
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} >
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={FetchNotifications}
              sx={{ borderRadius: 2, textTransform: "none" }}
            >
              Refresh
            </Button>

            <Button
              variant="contained"
              startIcon={<DoneAllIcon />}
              onClick={MarkAllRead}
              disabled={unreadCount === 0}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                bgcolor: "#4f46e5",
                "&:hover": { bgcolor: "#4338ca" },
              }}
            >
              Mark all read
            </Button>
          </Stack>
        </Stack>

        {/* Statistics */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(3, 1fr)",
            },
            gap: 2,
            mb: 3,
            mt:6
          }}
        >
          {[
            {
              title: "Total Notifications",
              value: notifications.length,
              icon: <NotificationsActiveIcon />,
              color: "#4f46e5",
              bg: "#eef2ff",
            },
            {
              title: "Unread Notifications",
              value: unreadCount,
              icon: <MailIcon />,
              color: "#ea580c",
              bg: "#fff7ed",
            },
            {
              title: "Read Notifications",
              value: readCount,
              icon: <DoneAllIcon />,
              color: "#059669",
              bg: "#ecfdf5",
            },
          ].map((item, index) => (
            <Paper
              key={index}
              elevation={0}
              sx={{
                p: 2.5,
                border: "1px solid #e2e8f0",
                borderRadius: 3,
              }}
            >
              <Stack direction="row" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" fontSize={14}>
                    {item.title}
                  </Typography>

                  <Typography
                    variant="h4"
                    fontWeight={800}
                    mt={1}
                    color="#0f172a"
                  >
                    {item.value}
                  </Typography>
                </Box>

                <Avatar
                  sx={{
                    bgcolor: item.bg,
                    color: item.color,
                    width: 48,
                    height: 48,
                  }}
                >
                  {item.icon}
                </Avatar>
              </Stack>
            </Paper>
          ))}
        </Box>

        {/* Notification List */}
        <Paper
          elevation={0}
          sx={{
            border: "1px solid #e2e8f0",
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <Box sx={{ px: 2.5, pt: 2 }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              spacing={1}
            >
              <Typography variant="h6" fontWeight={800}>
                Recent Activity
              </Typography>

              <Chip
                label={`${unreadCount} Unread`}
                color="primary"
                size="small"
                variant="outlined"
              />
            </Stack>

            <Tabs
              value={filter}
              onChange={(e, value) => setFilter(value)}
              sx={{
                mt: 1,
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 600,
                },
              }}
            >
              <Tab label={`All (${notifications.length})`} value="all" />
              <Tab label={`Unread (${unreadCount})`} value="unread" />
              <Tab label={`Read (${readCount})`} value="read" />
            </Tabs>
          </Box>

          <Divider />

          {loading ? (
            <Box py={8} textAlign="center">
              <CircularProgress />
              <Typography color="text.secondary" mt={2}>
                Loading notifications...
              </Typography>
            </Box>
          ) : filteredNotifications.length === 0 ? (
            <Box py={8} textAlign="center">
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  mx: "auto",
                  mb: 2,
                  bgcolor: "#f1f5f9",
                  color: "#64748b",
                }}
              >
                <NotificationsActiveIcon fontSize="large" />
              </Avatar>

              <Typography fontWeight={700} fontSize={18}>
                No notifications found
              </Typography>

              <Typography color="text.secondary" mt={0.5}>
                You're all caught up!
              </Typography>
            </Box>
          ) : (
            <Stack divider={<Divider />}>
              {filteredNotifications.map((item) => {
                const color = GetNotificationColor(item.type);

                return (
                  <Box
                    key={item._id}
                    sx={{
                      p: { xs: 2, md: 2.5 },
                      bgcolor: item.isRead ? "#fff" : "#f8faff",
                      transition: "0.2s",
                      "&:hover": { bgcolor: "#f1f5f9" },
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={2}
                      alignItems="flex-start"
                    >
                      <Avatar
                        sx={{
                          bgcolor: `${color}15`,
                          color: color,
                          width: 46,
                          height: 46,
                        }}
                      >
                        {GetNotificationIcon(item.type)}
                      </Avatar>

                      <Box flex={1} minWidth={0}>
                        <Stack
                          direction="row"
                          alignItems="center"
                          flexWrap="wrap"
                          gap={1}
                        >
                          <Typography fontWeight={700} color="#0f172a">
                            {item.title}
                          </Typography>

                          {!item.isRead && (
                            <Chip
                              label="New"
                              size="small"
                              color="primary"
                              sx={{ height: 22, fontSize: 11 }}
                            />
                          )}
                        </Stack>

                        <Typography
                          color="text.secondary"
                          fontSize={14}
                          mt={0.5}
                        >
                          {item.message}
                        </Typography>

                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={0.7}
                          mt={1.2}
                        >
                          <AccessTimeIcon
                            sx={{ fontSize: 15, color: "#94a3b8" }}
                          />

                          <Typography
                            fontSize={12}
                            color="text.secondary"
                          >
                            {FormatDate(item.createdAt)}
                          </Typography>

                          <Chip
                            label={item.type}
                            size="small"
                            sx={{
                              height: 21,
                              fontSize: 11,
                              bgcolor: `${color}15`,
                              color: color,
                              fontWeight: 700,
                            }}
                          />
                        </Stack>
                      </Box>

                      <Stack direction="row" spacing={0.5}>
                        {!item.isRead && (
                          <Tooltip title="Mark as read">
                            <IconButton
                              size="small"
                              onClick={() => MarkAsRead(item._id)}
                              sx={{ color: "#4f46e5" }}
                            >
                              <MarkEmailReadIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}

                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => DeleteNotification(item._id)}
                            sx={{
                              color: "#ef4444",
                              "&:hover": { bgcolor: "#fef2f2" },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </Stack>
                  </Box>
                );
              })}
            </Stack>
          )}
        </Paper>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() =>
          setSnackbar((prev) => ({ ...prev, open: false }))
        }
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() =>
            setSnackbar((prev) => ({ ...prev, open: false }))
          }
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </AdminDrawer>
  );
}
