
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Switch from '@mui/material/Switch';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import LinearProgress from '@mui/material/LinearProgress';
import Button from '@mui/material/Button';
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import PersonOffRoundedIcon from "@mui/icons-material/PersonOffRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";

import Swal from "sweetalert2";
import AdminDrawer from "./AdminDrawer";

export default function AdminHome() {
  const [deta, setdeta] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setpage] = useState(0);
  const [rowperpage, setrowperpage] = useState(5);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // --------------------------------
  // Fetch Users
  // --------------------------------

  const fetchUsers = async () => {
    setLoading(true);

    try {
      const res = await axios.get(
        "http://localhost:5600/auth/admin/getdeta",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setdeta(res.data.data || []);
    } catch (er) {
      console.log(er);

      Swal.fire(
        "Error",
        er.response?.data?.message || "Unable to fetch users",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --------------------------------
  // Dynamic Statistics
  // --------------------------------

  const totalUsers = deta.length;

  const activeUsers = deta.filter(
    (user) => Boolean(user.isActive)
  ).length;

  const disabledUsers = totalUsers - activeUsers;

  const activePercentage =
    totalUsers > 0
      ? Math.round((activeUsers / totalUsers) * 100)
      : 0;

  // --------------------------------
  // Search and Filter
  // --------------------------------

  const filteredUsers = useMemo(() => {
    return deta.filter((user) => {
      const username = user.username?.toLowerCase() || "";
      const email = user.email?.toLowerCase() || "";

      const searchMatch =
        username.includes(search.toLowerCase()) ||
        email.includes(search.toLowerCase());

      const statusMatch =
        filterStatus === "All" ||
        (filterStatus === "Active" && user.isActive) ||
        (filterStatus === "Disabled" && !user.isActive);

      return searchMatch && statusMatch;
    });
  }, [deta, search, filterStatus]);

  // --------------------------------
  // Pagination
  // --------------------------------

  const handlePageChange = (event, newPage) => {
    setpage(newPage);
  };

  const handleRowsChange = (event) => {
    setrowperpage(parseInt(event.target.value, 10));
    setpage(0);
  };

  // --------------------------------
  // Edit User
  // --------------------------------

  const handleEdit = (id) => {
    navigate(`/admin/edit/${id}`);
  };

  // --------------------------------
  // Delete User
  // --------------------------------

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete User?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const res = await axios.delete(
          `http://localhost:5600/auth/admin/deletebyid/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const updated = deta.filter(
          (user) => user._id !== id
        );

        setdeta(updated);

        if (
          page > 0 &&
          page * rowperpage >= updated.length
        ) {
          setpage(page - 1);
        }

        Swal.fire({
          title: "Deleted!",
          text: res.data.message,
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (er) {
        Swal.fire(
          "Error!",
          er.response?.data?.message || "Something went wrong",
          "error"
        );
      }
    }
  };

  // --------------------------------
  // Toggle User Status
  // --------------------------------

  const handleToggle = async (id, isActive) => {
    try {
      const res = await axios.put(
        `http://localhost:5600/auth/admin/toggleroute/${id}`,
        { isActive },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setdeta((prev) =>
        prev.map((user) =>
          user._id === id
            ? {
                ...user,
                isActive: res.data.isActive,
              }
            : user
        )
      );

      Swal.fire({
        title: "Status Updated",
        text: res.data.message,
        icon: "success",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (er) {
      Swal.fire(
        "Error",
        er.response?.data?.message || "Unable to update status",
        "error"
      );
    }
  };

  // --------------------------------
  // Statistics Card Component
  // --------------------------------

  const StatCard = ({
    title,
    value,
    subtitle,
    icon,
    color,
    background,
  }) => (
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
            <Typography
              color="#64748b"
              fontWeight={600}
              fontSize={13}
            >
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

            <Typography
              fontSize={11}
              color="#94a3b8"
              sx={{ mt: 0.7 }}
            >
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
  // Main UI
  // --------------------------------

  return (
    <AdminDrawer>
      <Box
        sx={{
          minHeight: "100vh",
          p: { xs: 2, sm: 3, md: 4 },
          background: "#f8fafc",
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
            <Typography
              fontSize={26}
              fontWeight={800}
              color="#111827"
            >
              User Management
            </Typography>

            <Typography
              color="#94a3b8"
              fontSize={13}
              sx={{ mt: 0.7 }}
            >
              Dashboard / Users / Manage Users
            </Typography>
          </Box>

          <Button
            variant="outlined"
            startIcon={<RefreshRoundedIcon />}
            onClick={fetchUsers}
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
            Refresh Data
          </Button>
        </Stack>

        {/* STATISTICS CARDS */}

        <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="Total Users"
              value={totalUsers}
              subtitle="All registered accounts"
              icon={<PeopleAltRoundedIcon />}
              color="#4f46e5"
              background="#eef2ff"
            />
          </Grid>

          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="Active Users"
              value={activeUsers}
              subtitle="Currently enabled accounts"
              icon={<PersonAddAlt1RoundedIcon />}
              color="#059669"
              background="#d1fae5"
            />
          </Grid>

          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="Disabled Users"
              value={disabledUsers}
              subtitle="Currently disabled accounts"
              icon={<PersonOffRoundedIcon />}
              color="#dc2626"
              background="#fee2e2"
            />
          </Grid>

          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="Active Rate"
              value={`${activePercentage}%`}
              subtitle="Active accounts percentage"
              icon={<TrendingUpRoundedIcon />}
              color="#d97706"
              background="#fef3c7"
            />
          </Grid>
        </Grid>

        {/* USER TABLE SECTION */}

        <Paper
          elevation={0}
          sx={{
            border: "1px solid #e5e7eb",
            borderRadius: 3,
            overflow: "hidden",
            mb: 3,
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
                <Typography
                  fontSize={18}
                  fontWeight={800}
                  color="#111827"
                >
                  Registered Users
                </Typography>

                <Typography
                  fontSize={12}
                  color="#94a3b8"
                  sx={{ mt: 0.5 }}
                >
                  Manage and monitor all user accounts
                </Typography>
              </Box>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                width={{ xs: "100%", md: "auto" }}
              >
                <TextField
                  size="small"
                  placeholder="Search name or email..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setpage(0);
                  }}
                  sx={{
                    width: { xs: "100%", sm: 235 },
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      bgcolor: "#fff",
                      fontSize: 13,
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchRoundedIcon
                          sx={{ color: "#94a3b8" }}
                        />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  select
                  size="small"
                  value={filterStatus}
                  onChange={(e) => {
                    setFilterStatus(e.target.value);
                    setpage(0);
                  }}
                  sx={{
                    width: { xs: "100%", sm: 140 },
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      fontSize: 13,
                    },
                  }}
                >
                  <MenuItem value="All">All Status</MenuItem>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Disabled">Disabled</MenuItem>
                </TextField>
              </Stack>
            </Stack>
          </Box>

          <Divider />

          {/* TABLE */}

          <TableContainer sx={{ overflowX: "auto" }}>
            <Table sx={{ minWidth: 750 }}>
              <TableHead>
                <TableRow
                  sx={{
                    background: "#f8fafc",
                    "& th": {
                      color: "#64748b",
                      fontSize: 11,
                      fontWeight: 800,
                      letterSpacing: 0.7,
                      py: 2,
                      whiteSpace: "nowrap",
                      borderBottom: "1px solid #e5e7eb",
                    },
                  }}
                >
                  <TableCell>SR NO.</TableCell>
                  <TableCell>USER DETAILS</TableCell>
                  <TableCell>EMAIL ADDRESS</TableCell>
                  <TableCell>ACCOUNT STATUS</TableCell>
                  <TableCell align="center">ACTIONS</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography
                        color="#64748b"
                        sx={{ py: 5 }}
                      >
                        Loading users...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Stack
                        alignItems="center"
                        spacing={1}
                        sx={{ py: 6 }}
                      >
                        <GroupRoundedIcon
                          sx={{
                            fontSize: 45,
                            color: "#cbd5e1",
                          }}
                        />

                        <Typography
                          fontWeight={700}
                          color="#475569"
                        >
                          No Users Found
                        </Typography>

                        <Typography
                          fontSize={12}
                          color="#94a3b8"
                        >
                          Try changing your search or filter.
                        </Typography>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers
                    .slice(
                      page * rowperpage,
                      page * rowperpage + rowperpage
                    )
                    .map((er, index) => (
                      <TableRow
                        key={er._id}
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
                        {/* SERIAL NUMBER */}

                        <TableCell>
                          <Typography
                            fontWeight={700}
                            color="#64748b"
                            fontSize={13}
                          >
                            {page * rowperpage + index + 1}
                          </Typography>
                        </TableCell>

                        {/* USER DETAILS */}

                        <TableCell>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1.5}
                          >
                            <Avatar
                              sx={{
                                width: 40,
                                height: 40,
                                bgcolor: "#e0e7ff",
                                color: "#4338ca",
                                fontWeight: 800,
                                fontSize: 15,
                              }}
                            >
                              {er.username
                                ?.charAt(0)
                                .toUpperCase()}
                            </Avatar>

                            <Box>
                              <Typography
                                fontWeight={700}
                                fontSize={13}
                                color="#1e293b"
                              >
                                {er.username}
                              </Typography>

                              <Typography
                                fontSize={10}
                                color="#94a3b8"
                              >
                                Registered User
                              </Typography>
                            </Box>
                          </Stack>
                        </TableCell>

                        {/* EMAIL */}

                        <TableCell>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                          >
                            <EmailRoundedIcon
                              sx={{
                                fontSize: 17,
                                color: "#94a3b8",
                              }}
                            />

                            <Typography
                              fontSize={12}
                              color="#475569"
                            >
                              {er.email}
                            </Typography>
                          </Stack>
                        </TableCell>

                        {/* STATUS */}

                        <TableCell>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                          >
                            <Switch
                              size="small"
                              checked={Boolean(er.isActive)}
                              onChange={(e) =>
                                handleToggle(
                                  er._id,
                                  e.target.checked
                                )
                              }
                              color="success"
                            />

                            <Chip
                              size="small"
                              label={
                                er.isActive
                                  ? "Active"
                                  : "Disabled"
                              }
                              sx={{
                                fontWeight: 700,
                                fontSize: 10,
                                bgcolor: er.isActive
                                  ? "#dcfce7"
                                  : "#fee2e2",
                                color: er.isActive
                                  ? "#15803d"
                                  : "#dc2626",
                                borderRadius: 1.5,
                              }}
                            />
                          </Stack>
                        </TableCell>

                        {/* ACTIONS */}

                        <TableCell align="center">
                          <Stack
                            direction="row"
                            justifyContent="center"
                            spacing={1}
                          >
                            <Tooltip title="Edit User">
                              <IconButton
                                onClick={() =>
                                  handleEdit(er._id)
                                }
                                size="small"
                                sx={{
                                  bgcolor: "#eef2ff",
                                  color: "#4f46e5",
                                  borderRadius: 1.8,
                                  "&:hover": {
                                    bgcolor: "#c7d2fe",
                                  },
                                }}
                              >
                                <EditRoundedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Delete User">
                              <IconButton
                                onClick={() =>
                                  handleDelete(er._id)
                                }
                                size="small"
                                sx={{
                                  bgcolor: "#fee2e2",
                                  color: "#dc2626",
                                  borderRadius: 1.8,
                                  "&:hover": {
                                    bgcolor: "#fecaca",
                                  },
                                }}
                              >
                                <DeleteRoundedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* PAGINATION */}

          <Divider />

          <TablePagination
            component="div"
            count={filteredUsers.length}
            page={page}
            onPageChange={handlePageChange}
            rowsPerPage={rowperpage}
            onRowsPerPageChange={handleRowsChange}
            rowsPerPageOptions={[5, 10, 15, 25]}
            sx={{
              bgcolor: "#fafbfc",
              border: "none",
              "& .MuiTablePagination-toolbar": {
                minHeight: 58,
              },
              "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                fontSize: 12,
                color: "#64748b",
              },
            }}
          />
        </Paper>

        {/* USER ACCESS OVERVIEW */}

        <Grid container spacing={2.5}>
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
                    <ShieldRoundedIcon />
                  </Avatar>

                  <Box>
                    <Typography
                      fontWeight={800}
                      fontSize={16}
                      color="#111827"
                    >
                      User Access Overview
                    </Typography>

                    <Typography
                      color="#94a3b8"
                      fontSize={11}
                    >
                      Current account status distribution
                    </Typography>
                  </Box>
                </Stack>

                {/* ACTIVE USERS */}

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  sx={{ mb: 1 }}
                >
                  <Typography
                    fontSize={12}
                    fontWeight={600}
                    color="#475569"
                  >
                    Active Accounts
                  </Typography>

                  <Typography
                    fontSize={12}
                    fontWeight={800}
                    color="#059669"
                  >
                    {activeUsers} ({activePercentage}%)
                  </Typography>
                </Stack>

                <LinearProgress
                  variant="determinate"
                  value={activePercentage}
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

                {/* DISABLED USERS */}

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  sx={{ mt: 3, mb: 1 }}
                >
                  <Typography
                    fontSize={12}
                    fontWeight={600}
                    color="#475569"
                  >
                    Disabled Accounts
                  </Typography>

                  <Typography
                    fontSize={12}
                    fontWeight={800}
                    color="#dc2626"
                  >
                    {disabledUsers} (
                    {100 - activePercentage}%)
                  </Typography>
                </Stack>

                <LinearProgress
                  variant="determinate"
                  value={
                    totalUsers > 0
                      ? (disabledUsers / totalUsers) * 100
                      : 0
                  }
                  sx={{
                    height: 9,
                    borderRadius: 5,
                    bgcolor: "#e5e7eb",
                    "& .MuiLinearProgress-bar": {
                      bgcolor: "#ef4444",
                      borderRadius: 5,
                    },
                  }}
                />

                <Divider sx={{ my: 3 }} />

                <Stack
                  direction="row"
                  justifyContent="space-between"
                >
                  <Typography
                    fontSize={12}
                    color="#64748b"
                  >
                    Total Registered Accounts
                  </Typography>

                  <Typography
                    fontWeight={800}
                    fontSize={14}
                    color="#111827"
                  >
                    {totalUsers}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* MANAGEMENT INFORMATION */}

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
                      bgcolor: "#fef3c7",
                      color: "#d97706",
                      borderRadius: 2,
                    }}
                  >
                    <PeopleAltRoundedIcon />
                  </Avatar>

                  <Box>
                    <Typography
                      fontWeight={800}
                      fontSize={16}
                      color="#111827"
                    >
                      Account Management
                    </Typography>

                    <Typography
                      fontSize={11}
                      color="#94a3b8"
                    >
                      User administration summary
                    </Typography>
                  </Box>
                </Stack>

                <Stack spacing={2}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography
                      fontSize={13}
                      color="#64748b"
                    >
                      Total Accounts
                    </Typography>

                    <Typography
                      fontWeight={800}
                      color="#111827"
                    >
                      {totalUsers}
                    </Typography>
                  </Stack>

                  <Divider />

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography
                      fontSize={13}
                      color="#64748b"
                    >
                      Enabled Accounts
                    </Typography>

                    <Chip
                      label={activeUsers}
                      size="small"
                      color="success"
                    />
                  </Stack>

                  <Divider />

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography
                      fontSize={13}
                      color="#64748b"
                    >
                      Disabled Accounts
                    </Typography>

                    <Chip
                      label={disabledUsers}
                      size="small"
                      color="error"
                    />
                  </Stack>

                  <Divider />

                  <Typography
                    fontSize={11}
                    color="#94a3b8"
                    sx={{ lineHeight: 1.7 }}
                  >
                    Manage user permissions and account
                    availability using the controls in the
                    registered users table.
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* FOOTER */}

        <Box
          sx={{
            textAlign: "center",
            mt: 4,
            pb: 2,
          }}
        >
          <Typography
            fontSize={11}
            color="#94a3b8"
          >
            OrderFlow Admin Panel • User Management
          </Typography>
        </Box>
      </Box>
    </AdminDrawer>
  );
}
