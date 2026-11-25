
import React from "react";
import { useNavigate } from "react-router-dom";
import Drawers1 from "../Component/Drawers1";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";

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

  const quickActions = [
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
  ];

  const cardHover = {
    transition: "transform 0.25s ease, box-shadow 0.25s ease",
    "&:hover": {
      transform: { xs: "none", md: "translateY(-5px)" },
      boxShadow: { xs: "none", md: "0 10px 25px rgba(37,59,128,0.09)" },
      borderColor: { xs: "#e9edf5", md: "#c7d2fe" },
    },
  };

  const gridStyles = {
    display: "grid",
    gridTemplateColumns: {
      xs: "minmax(0, 1fr)",
      sm: "repeat(2, minmax(0, 1fr))",
      lg: "repeat(4, minmax(0, 1fr))",
    },
    gap: { xs: 2, sm: 2.5 },
    width: "100%",
  };

  return (
    <Drawers1>
      <Box
        sx={{
          width: "100%",
          maxWidth: 1500,
          minWidth: 0,
          mx: "auto",
          mt: { xs: 9, sm: 10, md: 11 },
          px: { xs: 1.5, sm: 2.5, md: 3 },
          pb: { xs: 3, md: 6 },
          boxSizing: "border-box",
          overflowX: "hidden",
        }}
      >
        {/* PAGE HEADING */}
        <Box sx={{ mb: { xs: 2.5, md: 3 } }}>
          <Typography
            variant="h4"
            fontWeight={850}
            color="#172554"
            sx={{
              letterSpacing: -0.8,
              fontSize: { xs: 24, sm: 29, md: 34 },
            }}
          >
            Dashboard Overview
          </Typography>

          <Typography
            fontSize={{ xs: 12, sm: 14 }}
            color="#8490a5"
            sx={{ mt: 0.7, lineHeight: 1.7 }}
          >
            Manage your account and explore your shopping activity.
          </Typography>
        </Box>

        {/* WELCOME BANNER */}
        <Paper
          elevation={0}
          sx={{
            position: "relative",
            overflow: "hidden",
            borderRadius: { xs: 3, md: 4 },
            p: { xs: 2.5, sm: 3, md: 4 },
            mb: { xs: 3, md: 4 },
            color: "#fff",
            background:
              "linear-gradient(115deg,#1e1b4b 0%,#3730a3 55%,#6366f1 100%)",
            boxShadow: "0 12px 35px rgba(55,48,163,0.16)",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              width: { xs: 150, md: 250 },
              height: { xs: 150, md: 250 },
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.12)",
              right: { xs: -60, md: -60 },
              top: { xs: -90, md: -120 },
            }}
          />

          <Box
            sx={{
              position: "absolute",
              width: { xs: 120, md: 180 },
              height: { xs: 120, md: 180 },
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.12)",
              right: { xs: 50, md: 120 },
              bottom: -130,
            }}
          />

          <Stack
            direction={{ xs: "column", md: "row" }}
            alignItems={{ xs: "flex-start", md: "center" }}
            justifyContent="space-between"
            spacing={{ xs: 2.5, md: 3 }}
            sx={{ position: "relative", zIndex: 1 }}
          >
            <Box sx={{ maxWidth: 650, width: "100%", minWidth: 0 }}>
              <Chip
                label="CUSTOMER DASHBOARD"
                size="small"
                sx={{
                  bgcolor: "rgba(255,255,255,0.13)",
                  color: "#e0e7ff",
                  fontWeight: 750,
                  letterSpacing: 1,
                  mb: 2,
                  maxWidth: "100%",
                }}
              />

              <Typography
                variant="h4"
                fontWeight={850}
                sx={{
                  mb: 1.2,
                  fontSize: { xs: 23, sm: 28, md: 34 },
                  overflowWrap: "anywhere",
                }}
              >
                Welcome back, {username}!
              </Typography>

              <Typography
                fontSize={{ xs: 12, sm: 14 }}
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

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                sx={{ width: { xs: "100%", sm: "auto" } }}
              >
                <Button
                  fullWidth
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
                    whiteSpace: "nowrap",
                    "&:hover": { bgcolor: "#eef2ff" },
                  }}
                >
                  Explore Products
                </Button>

                <Button
                  fullWidth
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
                    whiteSpace: "nowrap",
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
                flexShrink: 0,
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
        <Box sx={{ mb: { xs: 3, md: 4 } }}>
          <Typography
            variant="h6"
            fontWeight={850}
            color="#172554"
            sx={{ fontSize: { xs: 17, sm: 19 } }}
          >
            Your Shopping Overview
          </Typography>

          <Typography fontSize={13} color="#94a3b8" sx={{ mt: 0.5, mb: 2 }}>
            Quick access to your shopping sections
          </Typography>

          <Box sx={gridStyles}>
            {quickActions.map((item) => (
              <Paper
                key={item.title}
                onClick={item.action}
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 2.5 },
                  minWidth: 0,
                  width: "100%",
                  boxSizing: "border-box",
                  borderRadius: 3,
                  border: "1px solid #e9edf5",
                  cursor: "pointer",
                  ...cardHover,
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  spacing={1}
                >
                  <Box
                    sx={{
                      width: 46,
                      height: 46,
                      flexShrink: 0,
                      borderRadius: 2.5,
                      display: "grid",
                      placeItems: "center",
                      bgcolor: item.bg,
                      color: item.color,
                    }}
                  >
                    {item.icon}
                  </Box>

                  <ArrowForwardIcon
                    sx={{ color: "#94a3b8", flexShrink: 0 }}
                  />
                </Stack>

                <Typography
                  fontWeight={800}
                  color="#172554"
                  sx={{ mt: 2, overflowWrap: "anywhere" }}
                >
                  {item.title}
                </Typography>

                <Typography fontSize={12} color="#94a3b8" sx={{ mt: 0.5 }}>
                  {item.subtitle}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Box>

        {/* ACCOUNT INFORMATION AND QUICK ACTIONS */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "minmax(0, 1fr)",
              md: "minmax(0, 7fr) minmax(0, 5fr)",
            },
            gap: { xs: 2, md: 3 },
            mb: { xs: 3, md: 4 },
            width: "100%",
          }}
        >
          {/* ACCOUNT INFORMATION */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 2.5, md: 3 },
              minWidth: 0,
              borderRadius: 3,
              border: "1px solid #e9edf5",
              bgcolor: "#fff",
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing={1.5}
              sx={{ mb: 2.5 }}
            >
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  flexShrink: 0,
                  borderRadius: 2,
                  display: "grid",
                  placeItems: "center",
                  bgcolor: "#eef2ff",
                  color: "#4f46e5",
                }}
              >
                <AccountCircleIcon />
              </Box>

              <Box sx={{ minWidth: 0 }}>
                <Typography fontWeight={800} color="#172033">
                  Account Information
                </Typography>
                <Typography fontSize={12} color="#94a3b8">
                  Your registered account details
                </Typography>
              </Box>
            </Stack>

            <Divider sx={{ mb: 2.5, borderColor: "#edf0f5" }} />

            <Stack
              direction="row"
              alignItems="center"
              spacing={2}
              sx={{ mb: 2.5 }}
            >
              <Avatar
                sx={{
                  width: 55,
                  height: 55,
                  flexShrink: 0,
                  bgcolor: "#e0e7ff",
                  color: "#4338ca",
                  fontWeight: 800,
                  fontSize: 22,
                }}
              >
                {userInitial}
              </Avatar>

              <Box sx={{ minWidth: 0 }}>
                <Typography fontSize={12} color="#94a3b8">
                  Username
                </Typography>
                <Typography
                  fontWeight={750}
                  color="#172033"
                  sx={{ overflowWrap: "anywhere" }}
                >
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
                  flexShrink: 0,
                  borderRadius: 2,
                  display: "grid",
                  placeItems: "center",
                  bgcolor: "#f1f5f9",
                  color: "#64748b",
                }}
              >
                <EmailOutlinedIcon />
              </Box>

              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography fontSize={12} color="#94a3b8">
                  Email Address
                </Typography>
                <Typography
                  fontWeight={650}
                  color="#334155"
                  sx={{
                    overflowWrap: "anywhere",
                    wordBreak: "break-word",
                  }}
                >
                  {email}
                </Typography>
              </Box>
            </Stack>
          </Paper>

          {/* ACCOUNT SECURITY */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 2.5, md: 3 },
              minWidth: 0,
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
                p: { xs: 1.5, sm: 2 },
                borderRadius: 2.5,
                bgcolor: "#f0fdf4",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <VerifiedUserOutlinedIcon
                sx={{ color: "#16a34a", fontSize: 28, flexShrink: 0 }}
              />

              <Box sx={{ minWidth: 0 }}>
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
        </Box>

        {/* EXPLORE CATEGORIES */}
        <Box sx={{ mb: { xs: 3, md: 4 }, mt: { xs: 4, md: 7 } }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={1}
            sx={{ mb: 2 }}
          >
            <Box>
              <Typography
                variant="h6"
                fontWeight={850}
                color="#172554"
                sx={{ fontSize: { xs: 17, sm: 19 } }}
              >
                Explore Categories
              </Typography>
              <Typography fontSize={13} color="#94a3b8" sx={{ mt: 0.5 }}>
                Find something you will love
              </Typography>
            </Box>

            <Button
              size="small"
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate("/view-product")}
              sx={{
                color: "#4338ca",
                fontWeight: 750,
                textTransform: "none",
                alignSelf: { xs: "flex-end", sm: "center" },
              }}
            >
              View All
            </Button>
          </Stack>

          <Box sx={gridStyles}>
            {categories.map((item) => (
              <Paper
                key={item.title}
                onClick={() => navigate("/view-product")}
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 2.5 },
                  minWidth: 0,
                  width: "100%",
                  boxSizing: "border-box",
                  borderRadius: 3,
                  bgcolor: "#fff",
                  border: "1px solid #e9edf5",
                  cursor: "pointer",
                  ...cardHover,
                }}
              >
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    flexShrink: 0,
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
                  sx={{ mt: 2, overflowWrap: "anywhere" }}
                >
                  {item.title}
                </Typography>

                <Typography fontSize={12} color="#94a3b8" sx={{ mt: 0.5 }}>
                  {item.description}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Box>

        {/* WHY SHOP WITH US */}
        <Box sx={{ mb: { xs: 3, md: 4 } }}>
          <Typography
            variant="h6"
            fontWeight={850}
            color="#172554"
            sx={{ fontSize: { xs: 17, sm: 19 } }}
          >
            Why Shop With Us?
          </Typography>

          <Typography fontSize={13} color="#94a3b8" sx={{ mt: 0.5, mb: 2 }}>
            Enjoy a smooth and convenient shopping experience
          </Typography>

          <Box sx={gridStyles}>
            {benefits.map((item) => (
              <Paper
                key={item.title}
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 2.5 },
                  minWidth: 0,
                  width: "100%",
                  boxSizing: "border-box",
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
                    flexShrink: 0,
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
                  sx={{ mt: 2, overflowWrap: "anywhere" }}
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
            ))}
          </Box>
        </Box>

        {/* HOW IT WORKS */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 2.5, md: 3.5 },
            mb: { xs: 3, md: 4 },
            borderRadius: { xs: 3, md: 3.5 },
            border: "1px solid #e9edf5",
            bgcolor: "#fff",
            mt: { xs: 4, md: 7 },
          }}
        >
          <Typography
            variant="h6"
            fontWeight={850}
            color="#172554"
            sx={{ fontSize: { xs: 17, sm: 19 } }}
          >
            Your Shopping Journey
          </Typography>

          <Typography fontSize={13} color="#94a3b8" sx={{ mt: 0.5, mb: 3 }}>
            Four simple steps to enjoy your shopping
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "minmax(0, 1fr)",
                sm: "repeat(2, minmax(0, 1fr))",
                lg: "repeat(4, minmax(0, 1fr))",
              },
              gap: 2,
            }}
          >
            {steps.map((step) => (
              <Box
                key={step.number}
                sx={{
                  p: { xs: 2, sm: 2 },
                  minWidth: 0,
                  height: "100%",
                  boxSizing: "border-box",
                  borderRadius: 2.5,
                  bgcolor: "#f8faff",
                  border: "1px solid #edf0fa",
                }}
              >
                <Typography
                  variant="h4"
                  fontWeight={900}
                  color="#c7d2fe"
                  sx={{ fontSize: { xs: 30, sm: 34 } }}
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
            ))}
          </Box>
        </Paper>

        {/* BOTTOM CALL TO ACTION */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 3, md: 4 },
            borderRadius: { xs: 3, md: 4 },
            background: "linear-gradient(110deg,#eef2ff 0%,#f5f3ff 100%)",
            border: "1px solid #e0e7ff",
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            alignItems={{ xs: "flex-start", md: "center" }}
            justifyContent="space-between"
            spacing={2}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="h5"
                fontWeight={850}
                color="#172554"
                sx={{ fontSize: { xs: 21, sm: 24 } }}
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
              fullWidth
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate("/view-product")}
              sx={{
                width: { xs: "100%", md: "auto" },
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
