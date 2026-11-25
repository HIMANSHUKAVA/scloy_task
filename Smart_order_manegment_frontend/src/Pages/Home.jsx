
import React from "react";
import { useNavigate } from "react-router-dom";
import Drawers1 from "../Component/Drawers1";

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";

export default function Home() {
  const navigate = useNavigate();

  const username = localStorage.getItem("username") || "User";
  const email = localStorage.getItem("email") || "Email not available";

  const userInitial = username.charAt(0).toUpperCase();

  const categories = [
    {
      title: "Electronics",
      description: "Explore electronic products",
      icon: <DashboardCustomizeIcon />,
      color: "#4f46e5",
      bg: "#eef2ff",
    },
    {
      title: "Fashion",
      description: "Discover your style",
      icon: <ShoppingBagOutlinedIcon />,
      color: "#db2777",
      bg: "#fce7f3",
    },
    {
      title: "Home & Living",
      description: "Make your home better",
      icon: <Inventory2OutlinedIcon />,
      color: "#0891b2",
      bg: "#e0f2fe",
    },
    {
      title: "Accessories",
      description: "Find your perfect match",
      icon: <FavoriteBorderOutlinedIcon />,
      color: "#ea580c",
      bg: "#fff7ed",
    },
  ];

  const benefits = [
    {
      title: "Quality Products",
      description: "Shop with confidence and discover quality products.",
      icon: <VerifiedUserOutlinedIcon />,
      color: "#16a34a",
      bg: "#f0fdf4",
    },
    {
      title: "Secure Shopping",
      description: "Enjoy a safer and more reliable shopping experience.",
      icon: <SecurityOutlinedIcon />,
      color: "#4f46e5",
      bg: "#eef2ff",
    },
    {
      title: "Order Tracking",
      description: "Stay updated about your order progress.",
      icon: <LocalShippingOutlinedIcon />,
      color: "#0284c7",
      bg: "#e0f2fe",
    },
    {
      title: "Customer Support",
      description: "Get assistance whenever you need help.",
      icon: <SupportAgentOutlinedIcon />,
      color: "#d97706",
      bg: "#fffbeb",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Explore Products",
      description: "Discover products from our collection.",
    },
    {
      number: "02",
      title: "Add to Cart",
      description: "Choose your products and quantities.",
    },
    {
      number: "03",
      title: "Place Your Order",
      description: "Continue to checkout when ready.",
    },
    {
      number: "04",
      title: "Track Your Order",
      description: "Follow your order status from your account.",
    },
  ];

  return (
    <Drawers1>
      <Box
        sx={{
          width: "100%",
          maxWidth: 1500,
          mx: "auto",
          mt: { xs: 10, md: 11 },
          px: { xs: 2, sm: 3, md: 3 },
          pb: 6,
        }}
      >
        {/* PAGE HEADING */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h4"
            fontWeight={850}
            color="#172554"
            sx={{ letterSpacing: -0.8 }}
          >
            Dashboard Overview
          </Typography>

          <Typography fontSize={14} color="#8490a5" sx={{ mt: 0.7 }}>
            Manage your account and explore your shopping activity.
          </Typography>
        </Box>

        {/* WELCOME BANNER */}
        <Paper
          elevation={0}
          sx={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 4,
            p: { xs: 3, md: 4 },
            mb: 4,
            color: "#fff",
            background:
              "linear-gradient(115deg,#1e1b4b 0%,#3730a3 55%,#6366f1 100%)",
            boxShadow: "0 12px 35px rgba(55,48,163,0.16)",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              width: 250,
              height: 250,
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.12)",
              right: -60,
              top: -120,
            }}
          />

          <Box
            sx={{
              position: "absolute",
              width: 180,
              height: 180,
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.12)",
              right: 120,
              bottom: -130,
            }}
          />

          <Stack
            direction={{ xs: "column", md: "row" }}
            alignItems={{ xs: "flex-start", md: "center" }}
            justifyContent="space-between"
            spacing={3}
            sx={{ position: "relative", zIndex: 1 }}
          >
            <Box sx={{ maxWidth: 650 }}>
              <Chip
                label="CUSTOMER DASHBOARD"
                size="small"
                sx={{
                  bgcolor: "rgba(255,255,255,0.13)",
                  color: "#e0e7ff",
                  fontWeight: 750,
                  letterSpacing: 1,
                  mb: 2,
                }}
              />

              <Typography
                variant="h4"
                fontWeight={850}
                sx={{
                  mb: 1.2,
                  fontSize: { xs: 25, md: 34 },
                }}
              >
                Welcome back, {username}!
              </Typography>

              <Typography
                fontSize={14}
                sx={{
                  color: "#e0e7ff",
                  maxWidth: 520,
                  lineHeight: 1.9,
                  mb: 3,
                }}
              >
                Your shopping journey starts here. Explore our products,
                manage your cart and keep track of your orders.
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
                    fontWeight: 750,
                    px: 2.5,
                    py: 1.2,
                    borderRadius: 2,
                    "&:hover": { bgcolor: "#eef2ff" },
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
                    fontWeight: 700,
                    px: 2.5,
                    py: 1.2,
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

            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                width: 150,
                height: 150,
                borderRadius: "50%",
                bgcolor: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.2)",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ShoppingBagOutlinedIcon sx={{ fontSize: 75, color: "#fff" }} />
            </Box>
          </Stack>
        </Paper>

        {/* SHOPPING OVERVIEW */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight={850} color="#172554">
            Your Shopping Overview
          </Typography>
          <Typography fontSize={13} color="#94a3b8" sx={{ mt: 0.5, mb: 2 }}>
            Quick access to your shopping sections
          </Typography>

          <Grid container spacing={2.5}>
            {[
              {
                title: "Browse Products",
                subtitle: "Discover products",
                icon: <ShoppingBagOutlinedIcon />,
                color: "#4f46e5",
                bg: "#eef2ff",
                action: () => navigate("/view-product"),
              },
              {
                title: "My Cart",
                subtitle: "Review selected items",
                icon: <Inventory2OutlinedIcon />,
                color: "#0284c7",
                bg: "#e0f2fe",
                action: () => navigate("/cart"),
              },
              {
                title: "My Orders",
                subtitle: "Manage your orders",
                icon: <DashboardCustomizeIcon />,
                color: "#d97706",
                bg: "#fffbeb",
                action: () => navigate("/user/myorder"),
              },
              {
                title: "Contact Us",
                subtitle: "Get shopping assistance",
                icon: <SupportAgentOutlinedIcon />,
                color: "#16a34a",
                bg: "#f0fdf4",
                action: () => navigate("/contect"),
              },
            ].map((item) => (
              <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={item.title}>
                <Paper
                  onClick={item.action}
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    border: "1px solid #e9edf5",
                    cursor: "pointer",
                    transition: "0.25s",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 10px 25px rgba(37,59,128,0.09)",
                      borderColor: "#c7d2fe",
                    },
                  }}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2.5,
                        display: "grid",
                        placeItems: "center",
                        bgcolor: item.bg,
                        color: item.color,
                      }}
                    >
                      {item.icon}
                    </Box>

                    <ArrowForwardIcon sx={{ color: "#94a3b8" }} />
                  </Stack>

                  <Typography
                    fontWeight={800}
                    color="#172554"
                    sx={{ mt: 2 }}
                  >
                    {item.title}
                  </Typography>

                  <Typography fontSize={12} color="#94a3b8" sx={{ mt: 0.5 }}>
                    {item.subtitle}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* ACCOUNT INFORMATION AND QUICK ACTIONS */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, md: 3 },
                height: "100%",
                borderRadius: 3,
                border: "1px solid #e9edf5",
                bgcolor: "#fff",
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

              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                <Avatar
                  sx={{
                    width: 55,
                    height: 55,
                    bgcolor: "#e0e7ff",
                    color: "#4338ca",
                    fontWeight: 800,
                    fontSize: 22,
                  }}
                >
                  {userInitial}
                </Avatar>

                <Box>
                  <Typography fontSize={12} color="#94a3b8">
                    Username
                  </Typography>
                  <Typography fontWeight={750} color="#172033">
                    {username}
                  </Typography>
                </Box>
              </Stack>

              <Divider sx={{ mb: 2.5, borderColor: "#edf0f5" }} />

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
                  <Typography fontSize={12} color="#94a3b8">
                    Email Address
                  </Typography>
                  <Typography
                    fontWeight={650}
                    color="#334155"
                    sx={{ overflowWrap: "anywhere" }}
                  >
                    {email}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, md: 3 },
                height: "100%",
                borderRadius: 3,
                border: "1px solid #e9edf5",
                bgcolor: "#fff",
              }}
            >
              <Typography fontWeight={800} color="#172033" mb={0.5}>
                Account Security
              </Typography>

              <Typography fontSize={12} color="#94a3b8" mb={3}>
                Your account information
              </Typography>

              <Box
                sx={{
                  p: 2,
                  borderRadius: 2.5,
                  bgcolor: "#f0fdf4",
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                <VerifiedUserOutlinedIcon
                  sx={{ color: "#16a34a", fontSize: 28 }}
                />

                <Box>
                  <Typography fontSize={13} fontWeight={750} color="#166534">
                    Account Details
                  </Typography>
                  <Typography fontSize={11} color="#15803d">
                    Your registered information is available here.
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2.5 }} />

              <Stack spacing={1.5}>
                <Button
                  fullWidth
                  onClick={() => navigate("/view-product")}
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    justifyContent: "space-between",
                    px: 2,
                    py: 1.4,
                    borderRadius: 2,
                    bgcolor: "#eef2ff",
                    color: "#4338ca",
                    textTransform: "none",
                    fontWeight: 750,
                    "&:hover": { bgcolor: "#e0e7ff" },
                  }}
                >
                  Start Shopping
                </Button>

                <Button
                  fullWidth
                  onClick={() => navigate("/contect")}
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    justifyContent: "space-between",
                    px: 2,
                    py: 1.4,
                    borderRadius: 2,
                    bgcolor: "#f1f5f9",
                    color: "#334155",
                    textTransform: "none",
                    fontWeight: 750,
                    "&:hover": { bgcolor: "#e2e8f0" },
                  }}
                >
                  Need Help?
                </Button>
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        {/* EXPLORE CATEGORIES */}
        <Box sx={{ mb: 4  , mt:7}}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Box>
              <Typography variant="h6" fontWeight={850} color="#172554">
                Explore Categories
              </Typography>
              <Typography fontSize={13} color="#94a3b8" sx={{ mt: 0.5 }}>
                Find something you will love
              </Typography>
            </Box>

            <Button
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate("/view-product")}
              sx={{
                color: "#4338ca",
                fontWeight: 750,
                textTransform: "none",
              }}
            >
              View All
            </Button>
          </Stack>

          <Grid container spacing={2.5}>
            {categories.map((item) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item.title}>
                <Paper
                  onClick={() => navigate("/view-product")}
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    bgcolor: "#fff",
                    border: "1px solid #e9edf5",
                    cursor: "pointer",
                    transition: "0.25s",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.07)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 55,
                      height: 55,
                      borderRadius: 2.5,
                      display: "grid",
                      placeItems: "center",
                      bgcolor: item.bg,
                      color: item.color,
                      "& svg": { fontSize: 29 },
                    }}
                  >
                    {item.icon}
                  </Box>

                  <Typography
                    fontWeight={800}
                    color="#172554"
                    sx={{ mt: 2 }}
                  >
                    {item.title}
                  </Typography>

                  <Typography fontSize={12} color="#94a3b8" sx={{ mt: 0.5 }}>
                    {item.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* WHY SHOP WITH US */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight={850} color="#172554">
            Why Shop With Us?
          </Typography>

          <Typography fontSize={13} color="#94a3b8" sx={{ mt: 0.5, mb: 2 }}>
            Enjoy a smooth and convenient shopping experience
          </Typography>

          <Grid container spacing={2.5}>
            {benefits.map((item) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item.title}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    height: "100%",
                    border: "1px solid #e9edf5",
                    bgcolor: "#fff",
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2.5,
                      display: "grid",
                      placeItems: "center",
                      bgcolor: item.bg,
                      color: item.color,
                      "& svg": { fontSize: 27 },
                    }}
                  >
                    {item.icon}
                  </Box>

                  <Typography
                    fontWeight={800}
                    color="#172554"
                    sx={{ mt: 2 }}
                  >
                    {item.title}
                  </Typography>

                  <Typography
                    fontSize={12}
                    color="#94a3b8"
                    lineHeight={1.8}
                    sx={{ mt: 0.7 }}
                  >
                    {item.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* HOW IT WORKS */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, md: 3.5 },
            mb: 4,
            borderRadius: 3.5,
            border: "1px solid #e9edf5",
            bgcolor: "#fff",
            mt:7
          }}
        >
          <Typography variant="h6" fontWeight={850} color="#172554">
            Your Shopping Journey
          </Typography>

          <Typography fontSize={13} color="#94a3b8" sx={{ mt: 0.5, mb: 3 }}>
            Four simple steps to enjoy your shopping
          </Typography>

          <Grid container spacing={2}>
            {steps.map((step, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={step.number}>
                <Box
                  sx={{
                    p: 2,
                    height: "100%",
                    borderRadius: 2.5,
                    bgcolor: "#f8faff",
                    border: "1px solid #edf0fa",
                  }}
                >
                  <Typography
                    variant="h4"
                    fontWeight={900}
                    color="#c7d2fe"
                  >
                    {step.number}
                  </Typography>

                  <Typography
                    fontWeight={800}
                    color="#172554"
                    sx={{ mt: 1 }}
                  >
                    {step.title}
                  </Typography>

                  <Typography
                    fontSize={12}
                    color="#94a3b8"
                    lineHeight={1.7}
                    sx={{ mt: 0.7 }}
                  >
                    {step.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* BOTTOM CALL TO ACTION */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            background:
              "linear-gradient(110deg,#eef2ff 0%,#f5f3ff 100%)",
            border: "1px solid #e0e7ff",
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            alignItems={{ xs: "flex-start", md: "center" }}
            justifyContent="space-between"
            spacing={2}
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight={850}
                color="#172554"
              >
                Ready to Explore?
              </Typography>

              <Typography
                fontSize={13}
                color="#64748b"
                sx={{ mt: 0.8, maxWidth: 550, lineHeight: 1.8 }}
              >
                Discover products, find what you need and enjoy your
                shopping experience with us.
              </Typography>
            </Box>

            <Button
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate("/view-product")}
              sx={{
                px: 3,
                py: 1.4,
                borderRadius: 2.5,
                bgcolor: "#3730a3",
                textTransform: "none",
                fontWeight: 800,
                whiteSpace: "nowrap",
                "&:hover": { bgcolor: "#312e81" },
              }}
            >
              Start Shopping
            </Button>
          </Stack>
        </Paper>

      </Box>
    </Drawers1>
  );
}
