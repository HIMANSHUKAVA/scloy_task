
import React from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";

import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import Drawers1 from "../Component/Drawers1";


export default function Home() {
  const navigate = useNavigate();

  const username = localStorage.getItem("username") || "User";
  const email = localStorage.getItem("email") || "Email not available";

  const userInitial = username.charAt(0).toUpperCase();

  return (
    <Drawers1>
      <Box
        sx={{
          width: "100%",
          maxWidth: 1500,
          mx: "auto",
          mt:7
        }}
      >
        {/* Page Heading */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h5"
            fontWeight={800}
            color="#172033"
            sx={{ mb: 0.7 }}
          >
            Dashboard Overview
          </Typography>

          <Typography fontSize={14} color="#8490a5">
            Manage your account and explore your shopping activity.
          </Typography>
        </Box>

        {/* Welcome Banner */}
        <Paper
          elevation={0}
          sx={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 4,
            p: { xs: 3, md: 4 },
            mb: 3,
            color: "#fff",
            background:
              "linear-gradient(115deg, #1e1b4b 0%, #3730a3 55%, #6366f1 100%)",
            boxShadow: "0 12px 35px rgba(55,48,163,0.16)",
          }}
        >
          {/* Decorative Circles */}
          <Box
            sx={{
              position: "absolute",
              width: 230,
              height: 230,
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.12)",
              right: -60,
              top: -110,
            }}
          />

          <Box
            sx={{
              position: "absolute",
              width: 180,
              height: 180,
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.12)",
              right: 80,
              bottom: -130,
            }}
          />

          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Typography
              fontSize={13}
              fontWeight={600}
              sx={{
                color: "#c7d2fe",
                mb: 1,
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              Customer Dashboard
            </Typography>

            <Typography
              variant="h4"
              fontWeight={800}
              sx={{
                mb: 1.2,
                fontSize: { xs: 25, md: 32 },
              }}
            >
              Welcome back, {username}!
            </Typography>

            <Typography
              fontSize={14}
              sx={{
                color: "#e0e7ff",
                maxWidth: 500,
                lineHeight: 1.8,
                mb: 3,
              }}
            >
              Your account is ready. Explore products, manage your orders and
              enjoy a smooth shopping experience.
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <Button
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate("/view-product")}
                sx={{
                  bgcolor: "#fff",
                  color: "#3730a3",
                  textTransform: "none",
                  fontWeight: 700,
                  px: 2.5,
                  py: 1.1,
                  borderRadius: 2,
                  "&:hover": {
                    bgcolor: "#eef2ff",
                  },
                }}
              >
                Explore Products
              </Button>

              <Button
                variant="outlined"
                onClick={() => navigate("/user/myorder")}
                sx={{
                  color: "#fff",
                  borderColor: "rgba(255,255,255,0.45)",
                  textTransform: "none",
                  fontWeight: 600,
                  px: 2.5,
                  py: 1.1,
                  borderRadius: 2,
                  "&:hover": {
                    borderColor: "#fff",
                    bgcolor: "rgba(255,255,255,0.08)",
                  },
                }}
              >
                My Orders
              </Button>
            </Stack>
          </Box>
        </Paper>

        {/* Dashboard Content */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "minmax(0, 1.5fr) minmax(260px, 1fr)",
            },
            gap: 3,
          }}
        >
          {/* Account Information */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, md: 3 },
              borderRadius: 3,
              border: "1px solid #e9edf5",
              background: "#fff",
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing={1.5}
              sx={{ mb: 3 }}
            >
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: 2,
                  display: "grid",
                  placeItems: "center",
                  bgcolor: "#eef2ff",
                  color: "#4f46e5",
                }}
              >
                <AccountCircleIcon />
              </Box>

              <Box>
                <Typography fontWeight={800} color="#172033">
                  Account Information
                </Typography>
                <Typography fontSize={12} color="#94a3b8">
                  Your registered account details
                </Typography>
              </Box>
            </Stack>

            <Divider sx={{ mb: 3, borderColor: "#edf0f5" }} />

            {/* User Name */}
            <Stack
              direction="row"
              alignItems="center"
              spacing={2}
              sx={{ mb: 3 }}
            >
              <Avatar
                sx={{
                  width: 52,
                  height: 52,
                  bgcolor: "#e0e7ff",
                  color: "#4338ca",
                  fontWeight: 800,
                  fontSize: 21,
                }}
              >
                {userInitial}
              </Avatar>

              <Box>
                <Typography fontSize={12} color="#94a3b8" mb={0.4}>
                  Username
                </Typography>
                <Typography fontWeight={700} color="#172033">
                  {username}
                </Typography>
              </Box>
            </Stack>

            <Divider sx={{ mb: 2.5, borderColor: "#edf0f5" }} />

            {/* Email */}
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: 2,
                  display: "grid",
                  placeItems: "center",
                  bgcolor: "#f1f5f9",
                  color: "#64748b",
                }}
              >
                <EmailOutlinedIcon />
              </Box>

              <Box sx={{ minWidth: 0 }}>
                <Typography fontSize={12} color="#94a3b8" mb={0.4}>
                  Email Address
                </Typography>
                <Typography
                  fontWeight={600}
                  color="#334155"
                  sx={{ overflowWrap: "anywhere" }}
                >
                  {email}
                </Typography>
              </Box>
            </Stack>
          </Paper>

          {/* Quick Actions */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, md: 3 },
              borderRadius: 3,
              border: "1px solid #e9edf5",
              background: "#fff",
            }}
          >
            <Typography fontWeight={800} color="#172033" mb={0.5}>
              Quick Actions
            </Typography>

            <Typography fontSize={12} color="#94a3b8" mb={3}>
              Navigate to your account sections
            </Typography>

            <Stack spacing={1.5}>
              <Button
                fullWidth
                onClick={() => navigate("/view-product")}
                startIcon={<ShoppingBagOutlinedIcon />}
                endIcon={<ArrowForwardIcon />}
                sx={{
                  justifyContent: "space-between",
                  px: 2,
                  py: 1.6,
                  borderRadius: 2.5,
                  bgcolor: "#eef2ff",
                  color: "#4338ca",
                  textTransform: "none",
                  fontWeight: 700,
                  "&:hover": { bgcolor: "#e0e7ff" },
                }}
              >
                Browse Products
              </Button>

              <Button
                fullWidth
                onClick={() => navigate("/user/myorder")}
                startIcon={<DashboardCustomizeIcon />}
                endIcon={<ArrowForwardIcon />}
                sx={{
                  justifyContent: "space-between",
                  px: 2,
                  py: 1.6,
                  borderRadius: 2.5,
                  bgcolor: "#f1f5f9",
                  color: "#334155",
                  textTransform: "none",
                  fontWeight: 700,
                  "&:hover": { bgcolor: "#e2e8f0" },
                }}
              >
                View My Orders
              </Button>
            </Stack>

            <Box
              sx={{
                mt: 3,
                p: 2,
                borderRadius: 2.5,
                bgcolor: "#f0fdf4",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <VerifiedUserOutlinedIcon
                sx={{ color: "#16a34a", fontSize: 25 }}
              />

              <Box>
                <Typography
                  fontSize={13}
                  fontWeight={700}
                  color="#166534"
                >
                  Account Details
                </Typography>
                <Typography fontSize={11} color="#15803d">
                  Your account information is displayed here.
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Drawers1>
  );
}
