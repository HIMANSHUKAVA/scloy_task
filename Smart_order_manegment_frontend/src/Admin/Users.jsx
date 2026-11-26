
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import AdminDrawer from "./AdminDrawer";

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
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
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import TableSortLabel from '@mui/material/TableSortLabel';
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import PersonOffRoundedIcon from "@mui/icons-material/PersonOffRounded";

import Swal from "sweetalert2";

export default function Users() {
  const navigate = useNavigate();

  // STATES
  const [deta, setdeta] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setpage] = useState(0);
  const [rowperpage, setrowperpage] = useState(5);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // SORTING STATES
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("username");

  const token = localStorage.getItem("token");

  // FETCH USERS
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
    } catch (error) {
      console.log(error);

      Swal.fire(
        "Error",
        error.response?.data?.message || "Unable to fetch users",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // TOTAL COUNTS
  const totalUsers = deta.length;

  const activeUsers = deta.filter(
    (user) => Boolean(user.isActive)
  ).length;

  const disabledUsers = totalUsers - activeUsers;

  // SEARCH AND STATUS FILTER
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

  // SORTING FUNCTION
  const handleSort = (property) => {
    const isAscending =
      orderBy === property && order === "asc";

    setOrder(isAscending ? "desc" : "asc");
    setOrderBy(property);
  };

  // SORTED USERS
  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      let valueA;
      let valueB;

      if (orderBy === "isActive") {
        valueA = a.isActive ? 1 : 0;
        valueB = b.isActive ? 1 : 0;
      } else {
        valueA = a[orderBy] || "";
        valueB = b[orderBy] || "";
      }

      if (
        typeof valueA === "string" &&
        typeof valueB === "string"
      ) {
        return order === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      return order === "asc"
        ? valueA - valueB
        : valueB - valueA;
    });
  }, [filteredUsers, order, orderBy]);

  // PAGINATION
  const handlePageChange = (event, newPage) => {
    setpage(newPage);
  };

  const handleRowsChange = (event) => {
    setrowperpage(parseInt(event.target.value, 10));
    setpage(0);
  };

  // EDIT USER
  const handleEdit = (id) => {
    navigate(`/admin/edit/${id}`);
  };

  // DELETE USER
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
          page * rowperpage >= updated.filter((user) => {
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
          }).length
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
      } catch (error) {
        Swal.fire(
          "Error!",
          error.response?.data?.message || "Something went wrong",
          "error"
        );
      }
    }
  };

  // TOGGLE USER STATUS
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
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Unable to update status",
        "error"
      );
    }
  };

  return (
    <AdminDrawer>
      <Box
        sx={{
          width: "100%",
          minWidth: 0,
          minHeight: "100vh",
          boxSizing: "border-box",
          p: {
            xs: 1.5,
            sm: 2.5,
            md: 3,
            lg: 4,
          },
          background: "#f8fafc",
          overflowX: "hidden",
        }}
      >
        {/* PAGE HEADER */}

        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Box>
            <Typography
              fontSize={{ xs: 23, sm: 27 }}
              fontWeight={800}
              color="#111827"
            >
              User Management
            </Typography>

            <Typography
              fontSize={12}
              color="#94a3b8"
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
              width: { xs: "100%", sm: "auto" },
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 700,
              px: 2.5,
              py: 1,
              borderColor: "#dbe1ea",
              color: "#475569",
            }}
          >
            Refresh Data
          </Button>
        </Stack>

        {/* STATISTICS CARDS */}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "minmax(0, 1fr)",
              sm: "repeat(3, minmax(0, 1fr))",
            },
            gap: 2,
            mb: 3,
          }}
        >
          {[
            {
              title: "Total Users",
              value: totalUsers,
              subtitle: "All registered accounts",
              icon: <PeopleAltRoundedIcon />,
              color: "#4f46e5",
              bg: "#eef2ff",
            },
            {
              title: "Active Users",
              value: activeUsers,
              subtitle: "Currently enabled accounts",
              icon: <PersonAddAlt1RoundedIcon />,
              color: "#059669",
              bg: "#d1fae5",
            },
            {
              title: "Disabled Users",
              value: disabledUsers,
              subtitle: "Currently disabled accounts",
              icon: <PersonOffRoundedIcon />,
              color: "#dc2626",
              bg: "#fee2e2",
            },
          ].map((item) => (
            <Paper
              key={item.title}
              elevation={0}
              sx={{
                p: { xs: 2, sm: 2.5 },
                border: "1px solid #e5e7eb",
                borderRadius: 3,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                minWidth: 0,
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  fontSize={13}
                  color="#64748b"
                  fontWeight={600}
                >
                  {item.title}
                </Typography>

                <Typography
                  fontSize={28}
                  fontWeight={800}
                  color="#111827"
                  sx={{ mt: 0.5 }}
                >
                  {item.value}
                </Typography>

                <Typography
                  fontSize={11}
                  color="#94a3b8"
                  sx={{ mt: 0.5 }}
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
                  flexShrink: 0,
                }}
              >
                {item.icon}
              </Avatar>
            </Paper>
          ))}
        </Box>

        {/* USERS TABLE */}

        <Paper
          elevation={0}
          sx={{
            width: "100%",
            minWidth: 0,
            border: "1px solid #e5e7eb",
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          {/* TABLE HEADER */}

          <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "stretch", md: "center" }}
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
              >
                <TextField
                  size="small"
                  fullWidth
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
                  fullWidth
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

          {/* TABLE DATA */}

          <TableContainer sx={{ overflowX: "auto" }}>
            <Table sx={{ minWidth: 750 }}>
              <TableHead>
                <TableRow
                  sx={{
                    bgcolor: "#f8fafc",
                    "& th": {
                      color: "#64748b",
                      fontSize: 11,
                      fontWeight: 800,
                      letterSpacing: 0.5,
                      whiteSpace: "nowrap",
                      py: 2,
                    },
                  }}
                >
                  <TableCell>SR NO.</TableCell>

                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "username"}
                      direction={
                        orderBy === "username" ? order : "asc"
                      }
                      onClick={() => handleSort("username")}
                    >
                      USER DETAILS
                    </TableSortLabel>
                  </TableCell>

                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "email"}
                      direction={
                        orderBy === "email" ? order : "asc"
                      }
                      onClick={() => handleSort("email")}
                    >
                      EMAIL ADDRESS
                    </TableSortLabel>
                  </TableCell>

                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "isActive"}
                      direction={
                        orderBy === "isActive" ? order : "asc"
                      }
                      onClick={() => handleSort("isActive")}
                    >
                      ACCOUNT STATUS
                    </TableSortLabel>
                  </TableCell>

                  <TableCell align="center">
                    ACTIONS
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <CircularProgress
                        size={30}
                        sx={{ my: 4 }}
                      />
                    </TableCell>
                  </TableRow>
                ) : sortedUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Box sx={{ py: 6 }}>
                        <PeopleAltRoundedIcon
                          sx={{
                            fontSize: 45,
                            color: "#cbd5e1",
                            mb: 1,
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
                          sx={{ mt: 0.5 }}
                        >
                          Try changing your search or filter.
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedUsers
                    .slice(
                      page * rowperpage,
                      page * rowperpage + rowperpage
                    )
                    .map((user, index) => (
                      <TableRow
                        key={user._id}
                        hover
                        sx={{
                          "& td": {
                            py: 2,
                            borderBottom: "1px solid #f1f5f9",
                          },
                        }}
                      >
                        {/* SERIAL NUMBER */}

                        <TableCell>
                          <Typography
                            fontSize={13}
                            fontWeight={700}
                            color="#64748b"
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
                              {user.username
                                ?.charAt(0)
                                .toUpperCase()}
                            </Avatar>

                            <Box>
                              <Typography
                                fontWeight={700}
                                fontSize={13}
                                color="#1e293b"
                              >
                                {user.username}
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
                              sx={{ whiteSpace: "nowrap" }}
                            >
                              {user.email}
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
                              checked={Boolean(user.isActive)}
                              onChange={(e) =>
                                handleToggle(
                                  user._id,
                                  e.target.checked
                                )
                              }
                              color="success"
                            />

                            <Chip
                              size="small"
                              label={
                                user.isActive
                                  ? "Active"
                                  : "Disabled"
                              }
                              sx={{
                                fontWeight: 700,
                                fontSize: 10,
                                bgcolor: user.isActive
                                  ? "#dcfce7"
                                  : "#fee2e2",
                                color: user.isActive
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
                                  handleEdit(user._id)
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
                                  handleDelete(user._id)
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
            count={sortedUsers.length}
            page={page}
            onPageChange={handlePageChange}
            rowsPerPage={rowperpage}
            onRowsPerPageChange={handleRowsChange}
            rowsPerPageOptions={[5, 10, 15, 25]}
            sx={{
              bgcolor: "#fafbfc",
              "& .MuiTablePagination-toolbar": {
                minHeight: 58,
                px: { xs: 1, sm: 2 },
                flexWrap: { xs: "wrap", sm: "nowrap" },
              },
              "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                {
                  fontSize: 12,
                  color: "#64748b",
                },
            }}
          />
        </Paper>

        {/* FOOTER */}

        <Box sx={{ textAlign: "center", mt: 3, pb: 2 }}>
          <Typography fontSize={11} color="#94a3b8">
            OrderFlow Admin Panel • User Management
          </Typography>
        </Box>
      </Box>
    </AdminDrawer>
  );
}
