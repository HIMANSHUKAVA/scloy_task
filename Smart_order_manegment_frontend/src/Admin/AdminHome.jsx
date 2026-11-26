
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Switch from "@mui/material/Switch";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import LinearProgress from "@mui/material/LinearProgress";
import Button from "@mui/material/Button";

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

// Dashboard charts
import Orderchart from "../Chart/Orderchart";
import Productchart from "../Chart/Productchart";
import OderCard from "../Component/OderCard";

export default function AdminHome() {
  const [deta, setdeta] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setpage] = useState(0);
  const [rowperpage, setrowperpage] = useState(5);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

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

  // STATISTICS
  const totalUsers = deta.length;

  const activeUsers = deta.filter(
    (user) => Boolean(user.isActive)
  ).length;

  const disabledUsers = totalUsers - activeUsers;

  const activePercentage =
    totalUsers > 0
      ? Math.round((activeUsers / totalUsers) * 100)
      : 0;

  // SEARCH AND FILTER
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

        if (page > 0 && page * rowperpage >= updated.length) {
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
    } catch (er) {
      Swal.fire(
        "Error",
        er.response?.data?.message || "Unable to update status",
        "error"
      );
    }
  };

  // STATISTICS CARD
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
        width: "100%",
        minWidth: 0,
        height: "100%",
        boxSizing: "border-box",
        border: "1px solid #e5e7eb",
        borderRadius: 3,
        transition: "0.25s",
        "&:hover": {
          transform: { xs: "none", sm: "translateY(-4px)" },
          boxShadow: "0 10px 25px rgba(15,23,42,0.07)",
        },
      }}
    >
      <CardContent
        sx={{
          p: { xs: 2, sm: 2.5 },
          "&:last-child": {
            pb: { xs: 2, sm: 2.5 },
          },
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={1.5}
        >
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              color="#64748b"
              fontWeight={600}
              fontSize={{ xs: 13, sm: 14 }}
            >
              {title}
            </Typography>

            <Typography
              fontSize={{ xs: 27, sm: 29 }}
              fontWeight={800}
              color="#111827"
              sx={{ mt: 1 }}
            >
              {value}
            </Typography>

            <Typography
              fontSize={{ xs: 11, sm: 12 }}
              color="#94a3b8"
              sx={{
                mt: 0.7,
                lineHeight: 1.5,
              }}
            >
              {subtitle}
            </Typography>
          </Box>

          <Avatar
            variant="rounded"
            sx={{
              width: { xs: 48, sm: 56 },
              height: { xs: 48, sm: 56 },
              flexShrink: 0,
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

  return (
    <AdminDrawer>
      <Box
        sx={{
          width: "100%",
          maxWidth: "100%",
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
          sx={{ mb: { xs: 2.5, sm: 3.5 } }}
        >
          <Box>
            <Typography
              fontSize={{ xs: 22, sm: 26 }}
              fontWeight={800}
              color="#111827"
            >
              User Management
            </Typography>

            <Typography
              color="#94a3b8"
              fontSize={12}
              sx={{ mt: 0.7 }}
            >
              Dashboard / Users / Manage Users
            </Typography>
          </Box>

          <Button
            fullWidth
            variant="outlined"
            startIcon={<RefreshRoundedIcon />}
            onClick={fetchUsers}
            disabled={loading}
            sx={{
              width: { xs: "100%", sm: "auto" },
              textTransform: "none",
              fontWeight: 700,
              borderRadius: 2,
              borderColor: "#dbe1ea",
              color: "#475569",
              px: 2.5,
              py: 1.1,
              whiteSpace: "nowrap",
            }}
          >
            Refresh Data
          </Button>
        </Stack>

        {/* STATISTICS CARDS */}

        <Box
          sx={{
            display: "grid",
            width: "100%",
            minWidth: 0,
            gridTemplateColumns: {
              xs: "minmax(0, 1fr)",
              sm: "repeat(2, minmax(0, 1fr))",
              lg: "repeat(4, minmax(0, 1fr))",
            },
            gap: { xs: 1.5, sm: 2, md: 2.5 },
            mb: { xs: 2.5, sm: 3.5 },
          }}
        >
          <StatCard
            title="Total Users"
            value={totalUsers}
            subtitle="All registered accounts"
            icon={<PeopleAltRoundedIcon />}
            color="#4f46e5"
            background="#eef2ff"
          />

          <StatCard
            title="Active Users"
            value={activeUsers}
            subtitle="Currently enabled accounts"
            icon={<PersonAddAlt1RoundedIcon />}
            color="#059669"
            background="#d1fae5"
          />

          <StatCard
            title="Disabled Users"
            value={disabledUsers}
            subtitle="Currently disabled accounts"
            icon={<PersonOffRoundedIcon />}
            color="#dc2626"
            background="#fee2e2"
          />

          <StatCard
            title="Active Rate"
            value={`${activePercentage}%`}
            subtitle="Active accounts percentage"
            icon={<TrendingUpRoundedIcon />}
            color="#d97706"
            background="#fef3c7"
          />
        </Box>

        {/* ORDER & PRODUCT CHARTS */}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "minmax(0, 1fr)",
              lg: "repeat(2, minmax(0, 1fr))",
            },
            gap: { xs: 2, sm: 2.5 },
            width: "100%",
            minWidth: 0,
            mb: { xs: 2.5, sm: 3.5 },
            alignItems: "stretch",
            "& > *": {
              minWidth: 0,
              width: "100%",
            },
          }}
        >
          <Orderchart />
          <Productchart />
        </Box>

        {/* USER TABLE SECTION */}


     <OderCard/>



        {/* FOOTER */}

        <Box
          sx={{
            textAlign: "center",
            mt: 4,
            pb: 2,
          }}
        >
          <Typography fontSize={11} color="#94a3b8">
            OrderFlow Admin Panel • User Management
          </Typography>
        </Box>
      </Box>
    </AdminDrawer>
  );
}
