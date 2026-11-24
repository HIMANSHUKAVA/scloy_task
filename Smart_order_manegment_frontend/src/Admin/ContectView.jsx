import React, { useEffect, useState } from "react";
import axios from "axios";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Tooltip from "@mui/material/Tooltip";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import SendIcon from "@mui/icons-material/Send";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import AdminDrawer from "../Admin/AdminDrawer";
import Swal from "sweetalert2";

export default function ContectView() {
  const [deta, setdeta] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [reply, setReply] = useState({});
  const [updatingId, setUpdatingId] = useState(null);

  const token = localStorage.getItem("token");

  // Fetch All Contact Messages
  const FetchContact = async () => {
    setLoading(true);

    try {
      const res = await axios.get(
        "http://localhost:5600/contect/admin/contect/view",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setdeta(res.data.data || []);

      // Existing replies ko TextField mein show karna
      const replyData = {};

      (res.data.data || []).forEach((item) => {
        replyData[item._id] = item.adminReply || "";
      });

      setReply(replyData);
    } catch (error) {
      console.log(error);

      Swal.fire({
        title: "Error!",
        text:
          error.response?.data?.message || "Unable to fetch contact messages",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    FetchContact();
  }, []);

  // Update Reply
  const HandleUpdate = async (id) => {
    const adminReply = reply[id]?.trim();

    if (!adminReply) {
      Swal.fire({
        title: "Reply Required",
        text: "Please enter your reply before updating.",
        icon: "warning",
      });

      return;
    }

    setUpdatingId(id);

    try {
      const res = await axios.put(
        `http://localhost:5600/contect/admin/contect/update/${id}`,
        {
          adminReply: adminReply,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Updated data ko UI mein bhi update karna
      setdeta((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, ...res.data.data } : item,
        ),
      );

      Swal.fire({
        title: "Reply Updated!",
        text: "Admin reply saved successfully.",
        icon: "success",
        confirmButtonColor: "#253b80",
      });
    } catch (error) {
      console.log(error);

      Swal.fire({
        title: "Update Failed!",
        text: error.response?.data?.message || "Unable to update reply.",
        icon: "error",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  // Search Filter
  const filteredData = deta.filter((item) =>
    [item.userid, item.email, item.subject, item.message]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  // Date Format
  const FormatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <AdminDrawer>
      <Box
        sx={{
          p: { xs: 2, md: 3 },
          minHeight: "100vh",
          bgcolor: "#f5f7fb",
          mt: 7,
        }}
      >
        {/* Header */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Box>
            <Stack direction="row" alignItems="center" spacing={1}>
              <SupportAgentIcon sx={{ fontSize: 32, color: "#253b80" }} />

              <Typography variant="h5" fontWeight={800} color="#172554">
                Contact Management
              </Typography>
            </Stack>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Manage customer queries and respond to messages.
            </Typography>
          </Box>

          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={FetchContact}
            disabled={loading}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 700,
              borderColor: "#253b80",
              color: "#253b80",
            }}
          >
            Refresh
          </Button>
        </Stack>

        {/* Summary Cards */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              flex: 1,
              border: "1px solid #e5e7eb",
              borderRadius: 3,
            }}
          >
            <Typography color="text.secondary" variant="body2">
              Total Messages
            </Typography>

            <Typography variant="h4" fontWeight={800} color="#253b80">
              {deta.length}
            </Typography>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              flex: 1,
              border: "1px solid #e5e7eb",
              borderRadius: 3,
            }}
          >
            <Typography color="text.secondary" variant="body2">
              Pending Replies
            </Typography>

            <Typography variant="h4" fontWeight={800} color="#ed8b00">
              {deta.filter((item) => !item.resolved).length}
            </Typography>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              flex: 1,
              border: "1px solid #e5e7eb",
              borderRadius: 3,
            }}
          >
            <Typography color="text.secondary" variant="body2">
              Resolved Messages
            </Typography>

            <Typography variant="h4" fontWeight={800} color="#16a34a">
              {deta.filter((item) => item.resolved).length}
            </Typography>
          </Paper>
        </Stack>

        {/* Main Table Card */}
        <Paper
          elevation={0}
          sx={{
            border: "1px solid #e5e7eb",
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          {/* Table Header */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", sm: "center" }}
            spacing={2}
            sx={{ p: 2.5 }}
          >
            <Box>
              <Typography fontWeight={800} fontSize={18}>
                Customer Messages
              </Typography>

              <Typography variant="caption" color="text.secondary">
                View queries and send admin replies
              </Typography>
            </Box>

            <TextField
              size="small"
              placeholder="Search contacts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{
                width: { xs: "100%", sm: 280 },
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  bgcolor: "#f9fafb",
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>

          <TableContainer sx={{ maxHeight: 650 }}>
            <Table stickyHeader sx={{ minWidth: 1250 }}>
              <TableHead>
                <TableRow>
                  {[
                    "No.",
                    "User ID",
                    "Customer",
                    "Subject",
                    "Message",
                    "Admin Reply",
                    "Status",
                    "Date",
                    "Action",
                  ].map((heading) => (
                    <TableCell
                      key={heading}
                      sx={{
                        bgcolor: "#172554",
                        color: "#fff",
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {heading}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 7 }}>
                      <CircularProgress />
                      <Typography sx={{ mt: 1 }} color="text.secondary">
                        Loading contact messages...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 7 }}>
                      <Typography fontWeight={700}>
                        No Contact Messages Found
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        No messages match your search.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((item, index) => (
                    <TableRow
                      key={item._id}
                      hover
                      sx={{
                        "&:hover": {
                          bgcolor: "#f8faff",
                        },
                      }}
                    >
                      {/* Number */}
                      <TableCell>{index + 1}</TableCell>

                      {/* User ID */}
                      <TableCell sx={{ minWidth: 170 }}>
                        <Typography
                          variant="caption"
                          fontWeight={600}
                          sx={{ wordBreak: "break-all" }}
                        >
                          {item.userid}
                        </Typography>
                      </TableCell>

                      {/* Customer */}
                      <TableCell sx={{ minWidth: 190 }}>
                        <Typography fontWeight={700} fontSize={13}>
                          {item.email}
                        </Typography>
                      </TableCell>

                      {/* Subject */}
                      <TableCell sx={{ minWidth: 150 }}>
                        <Typography fontWeight={700} fontSize={13}>
                          {item.subject}
                        </Typography>
                      </TableCell>

                      {/* Message */}
                      <TableCell sx={{ minWidth: 220, maxWidth: 260 }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            whiteSpace: "normal",
                            wordBreak: "break-word",
                          }}
                        >
                          {item.message}
                        </Typography>
                      </TableCell>

                      {/* Admin Reply TextField */}

                      <TableCell sx={{ minWidth: 240 }}>
                        {item.resolved && item.adminReply ? (
                          <Paper
                            elevation={0}
                            sx={{
                              p: 1.5,
                              bgcolor: "#ecfdf5",
                              border: "1px solid #bbf7d0",
                              borderRadius: 2,
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="success.dark"
                              fontWeight={800}
                            >
                              Admin Response
                            </Typography>

                            <Typography
                              variant="body2"
                              sx={{
                                mt: 0.5,
                                color: "#166534",
                                whiteSpace: "pre-wrap",
                                wordBreak: "break-word",
                              }}
                            >
                              {item.adminReply}
                            </Typography>
                          </Paper>
                        ) : (
                          <TextField
                            fullWidth
                            size="small"
                            multiline
                            minRows={2}
                            maxRows={4}
                            placeholder="Write admin reply..."
                            value={reply[item._id] ?? ""}
                            onChange={(e) =>
                              setReply((prev) => ({
                                ...prev,
                                [item._id]: e.target.value,
                              }))
                            }
                          />
                        )}
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Chip
                          label={item.resolved ? "Resolved" : "Pending"}
                          size="small"
                          color={item.resolved ? "success" : "warning"}
                          sx={{ fontWeight: 700 }}
                        />
                      </TableCell>

                      {/* Date */}
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        <Typography variant="body2">
                          {FormatDate(item.createdAt)}
                        </Typography>
                      </TableCell>

                      {/* Action */}
                      <TableCell>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={
                            updatingId === item._id ? (
                              <CircularProgress size={15} color="inherit" />
                            ) : (
                              <SendIcon />
                            )
                          }
                          disabled={
                            updatingId === item._id || !reply[item._id]?.trim()
                          }
                          onClick={() => HandleUpdate(item._id)}
                          sx={{
                            bgcolor: "#253b80",
                            borderRadius: 2,
                            textTransform: "none",
                            fontWeight: 700,
                            whiteSpace: "nowrap",
                            "&:hover": {
                              bgcolor: "#172554",
                            },
                          }}
                        >
                          {updatingId === item._id ? "Updating" : "Update"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Footer */}
          <Box
            sx={{
              p: 2,
              borderTop: "1px solid #e5e7eb",
              bgcolor: "#fafbff",
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Showing {filteredData.length} of {deta.length} contact messages
            </Typography>
          </Box>
        </Paper>
      </Box>
    </AdminDrawer>
  );
}
