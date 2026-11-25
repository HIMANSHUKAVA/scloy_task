
import React from "react";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Drawer1 from "../Component/Drawers1";

import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import TrackChangesOutlinedIcon from "@mui/icons-material/TrackChangesOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";

export default function About() {
  const navigate = useNavigate();

  const features = [
    {
      title: "Quality Products",
      description:
        "Explore a collection of products selected to provide quality and value.",
      icon: <VerifiedOutlinedIcon />,
      color: "#4f46e5",
      bg: "#eef2ff",
    },
    {
      title: "Easy Shopping",
      description:
        "Enjoy a simple and convenient shopping experience from browsing to checkout.",
      icon: <ShoppingBagOutlinedIcon />,
      color: "#0891b2",
      bg: "#ecfeff",
    },
    {
      title: "Order Tracking",
      description:
        "Stay updated with your order status and follow your delivery progress.",
      icon: <LocalShippingOutlinedIcon />,
      color: "#059669",
      bg: "#ecfdf5",
    },
    {
      title: "Customer Support",
      description:
        "Get assistance whenever you need help with your shopping experience.",
      icon: <SupportAgentOutlinedIcon />,
      color: "#d97706",
      bg: "#fffbeb",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Discover Products",
      description:
        "Explore our product collection and find items that match your needs.",
      icon: <ShoppingBagOutlinedIcon />,
    },
    {
      number: "02",
      title: "Add to Cart",
      description:
        "Select your favourite products and manage your shopping cart.",
      icon: <ShoppingCartOutlinedIcon />,
    },
    {
      number: "03",
      title: "Place Your Order",
      description:
        "Review your selected products and continue through checkout.",
      icon: <Inventory2OutlinedIcon />,
    },
    {
      number: "04",
      title: "Track Your Order",
      description:
        "View your order status and follow its progress from your account.",
      icon: <LocalShippingOutlinedIcon />,
    },
  ];

  const cardHover = {
    transition: "transform 0.25s ease, box-shadow 0.25s ease",
    "&:hover": {
      transform: { xs: "none", md: "translateY(-5px)" },
      boxShadow: {
        xs: "none",
        md: "0 12px 25px rgba(0,0,0,0.07)",
      },
      borderColor: { xs: "#e8edf5", md: "#c7d2fe" },
    },
  };

  const featureGrid = {
    display: "grid",
    gridTemplateColumns: {
      xs: "minmax(0, 1fr)",
      sm: "repeat(2, minmax(0, 1fr))",
      lg: "repeat(4, minmax(0, 1fr))",
    },
    gap: { xs: 2, sm: 2.5 },
    width: "100%",
  };

  const sectionHeading = {
    fontSize: { xs: 17, sm: 19, md: 20 },
    fontWeight: 850,
    color: "#172554",
  };

  return (
    <Drawer1>
      <Box
        sx={{
          width: "100%",
          maxWidth: 1500,
          minWidth: 0,
          mx: "auto",
          mt: { xs: 9, sm: 10, md: 11 },
          px: { xs: 1.5, sm: 2.5, md: 3 },
          pb: { xs: 3, md: 7 },
          boxSizing: "border-box",
          overflowX: "hidden",
        }}
      >
        {/* PAGE HEADING */}
        <Box sx={{ mb: { xs: 2.5, md: 3.5 } }}>
          <Typography
            variant="h4"
            fontWeight={850}
            color="#172554"
            sx={{
              letterSpacing: -0.8,
              fontSize: { xs: 25, sm: 30, md: 34 },
            }}
          >
            About Us
          </Typography>

          <Typography
            fontSize={{ xs: 12, sm: 14 }}
            color="#8490a5"
            sx={{ mt: 0.7, lineHeight: 1.8 }}
          >
            Get to know our platform and what makes your shopping experience
            special.
          </Typography>
        </Box>

        {/* HERO SECTION */}
        <Paper
          elevation={0}
          sx={{
            position: "relative",
            overflow: "hidden",
            borderRadius: { xs: 3, md: 4 },
            p: { xs: 2.5, sm: 3.5, md: 6 },
            color: "#fff",
            background:
              "linear-gradient(115deg,#1e1b4b 0%,#3730a3 55%,#6366f1 100%)",
            mb: { xs: 3, md: 4 },
            boxShadow: "0 15px 35px rgba(55,48,163,0.14)",
          }}
        >
          {/* DECORATIVE CIRCLES */}
          <Box
            sx={{
              position: "absolute",
              width: { xs: 150, md: 300 },
              height: { xs: 150, md: 300 },
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.14)",
              right: { xs: -60, md: -100 },
              top: { xs: -80, md: -140 },
              animation: "floatCircle 7s ease-in-out infinite",
              "@keyframes floatCircle": {
                "0%,100%": { transform: "translateY(0px)" },
                "50%": { transform: "translateY(18px)" },
              },
            }}
          />

          <Box
            sx={{
              position: "absolute",
              width: { xs: 100, md: 180 },
              height: { xs: 100, md: 180 },
              borderRadius: "50%",
              bgcolor: "rgba(255,255,255,0.06)",
              right: { xs: 40, md: 160 },
              bottom: -120,
            }}
          />

          <Stack
            direction={{ xs: "column", md: "row" }}
            alignItems="center"
            spacing={{ xs: 3, md: 2 }}
            sx={{ position: "relative", zIndex: 1 }}
          >
            <Box sx={{ flex: 1, width: "100%", minWidth: 0 }}>
              <Chip
                icon={
                  <AutoAwesomeOutlinedIcon
                    sx={{ color: "#c7d2fe !important" }}
                  />
                }
                label="WELCOME TO OUR PLATFORM"
                sx={{
                  bgcolor: "rgba(255,255,255,0.12)",
                  color: "#e0e7ff",
                  fontWeight: 750,
                  letterSpacing: 1,
                  mb: 2.5,
                  maxWidth: "100%",
                  "& .MuiChip-label": {
                    fontSize: { xs: 10, sm: 12 },
                  },
                }}
              />

              <Typography
                sx={{
                  fontSize: { xs: 27, sm: 37, md: 48 },
                  fontWeight: 900,
                  lineHeight: 1.2,
                  mb: 2,
                  overflowWrap: "anywhere",
                }}
              >
                Shopping Made
                <Box component="span" sx={{ color: "#c7d2fe" }}>
                  {" "}Simple & Better.
                </Box>
              </Typography>

              <Typography
                sx={{
                  color: "#e0e7ff",
                  fontSize: { xs: 12, sm: 14, md: 16 },
                  lineHeight: 1.9,
                  maxWidth: 620,
                  mb: 3,
                }}
              >
                We believe shopping should be simple, convenient and
                enjoyable. Discover products, manage your orders and
                experience a smarter way to shop.
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
                    px: 2.8,
                    py: 1.3,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 800,
                    whiteSpace: "nowrap",
                    "&:hover": { bgcolor: "#e0e7ff" },
                  }}
                >
                  Explore Products
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate("/contect")}
                  sx={{
                    color: "#fff",
                    borderColor: "rgba(255,255,255,0.5)",
                    px: 2.8,
                    py: 1.3,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                    "&:hover": {
                      borderColor: "#fff",
                      bgcolor: "rgba(255,255,255,0.08)",
                    },
                  }}
                >
                  Contact Us
                </Button>
              </Stack>
            </Box>

            {/* HERO ICON */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                width: 205,
                height: 205,
                flexShrink: 0,
                borderRadius: "50%",
                bgcolor: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.2)",
                alignItems: "center",
                justifyContent: "center",
                animation: "heroFloat 4s ease-in-out infinite",
                "@keyframes heroFloat": {
                  "0%,100%": { transform: "translateY(0px)" },
                  "50%": { transform: "translateY(-12px)" },
                },
              }}
            >
              <ShoppingBagOutlinedIcon sx={{ fontSize: 105 }} />
            </Box>
          </Stack>
        </Paper>

        {/* OUR STORY */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "minmax(0, 1fr)",
              md: "minmax(0, 7fr) minmax(0, 5fr)",
            },
            gap: { xs: 2, md: 3 },
            mb: { xs: 3, md: 4 },
          }}
        >
          <Paper
            elevation={0}
            sx={{
              minWidth: 0,
              p: { xs: 2, sm: 2.5, md: 3.5 },
              borderRadius: 3.5,
              border: "1px solid #e8edf5",
              bgcolor: "#fff",
            }}
          >
            <Chip
              label="OUR STORY"
              size="small"
              sx={{
                mb: 2,
                bgcolor: "#eef2ff",
                color: "#4f46e5",
                fontWeight: 800,
              }}
            />

            <Typography
              variant="h5"
              fontWeight={850}
              color="#172033"
              sx={{ fontSize: { xs: 20, sm: 23, md: 24 } }}
            >
              Your Convenient Shopping Partner
            </Typography>

            <Typography
              color="#64748b"
              fontSize={{ xs: 12, sm: 14 }}
              lineHeight={2}
              sx={{ mt: 2, mb: 2 }}
            >
              Our shopping platform is designed to make online shopping
              easier and more convenient. We bring product discovery,
              shopping cart management and order tracking together in one
              place.
            </Typography>

            <Typography
              color="#64748b"
              fontSize={{ xs: 12, sm: 14 }}
              lineHeight={2}
            >
              We focus on creating a user-friendly experience where
              customers can explore products, manage their purchases and
              access important order information with ease.
            </Typography>

            <Button
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate("/view-product")}
              sx={{
                mt: 2,
                color: "#4f46e5",
                fontWeight: 800,
                textTransform: "none",
              }}
            >
              Start Exploring
            </Button>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              minWidth: 0,
              minHeight: { xs: 240, sm: 280, md: 300 },
              p: { xs: 2.5, md: 3 },
              borderRadius: 3.5,
              border: "1px solid #e8edf5",
              background: "linear-gradient(145deg,#f8faff,#eef2ff)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Avatar
              sx={{
                width: 85,
                height: 85,
                bgcolor: "#fff",
                color: "#4f46e5",
                mb: 2.5,
                boxShadow: "0 8px 25px rgba(79,70,229,0.12)",
              }}
            >
              <ShoppingBagOutlinedIcon sx={{ fontSize: 44 }} />
            </Avatar>

            <Typography
              variant="h5"
              fontWeight={900}
              color="#172033"
              sx={{ fontSize: { xs: 20, sm: 23 } }}
            >
              Smart Shopping
            </Typography>

            <Typography
              fontSize={13}
              color="#8490a5"
              mt={1}
              maxWidth={300}
              lineHeight={1.9}
            >
              Browse products, manage your wishlist and keep track of your
              orders from one convenient place.
            </Typography>
          </Paper>
        </Box>

        {/* MISSION AND VISION */}
        <Box sx={{ mb: { xs: 3, md: 4 }, mt: { xs: 4, md: 7 } }}>
          <Box sx={{ mb: 2.5 }}>
            <Typography sx={sectionHeading}>
              Our Mission & Vision
            </Typography>

            <Typography fontSize={13} color="#94a3b8" sx={{ mt: 0.5 }}>
              What drives us to create a better shopping experience.
            </Typography>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "minmax(0, 1fr)",
                md: "repeat(2, minmax(0, 1fr))",
              },
              gap: { xs: 2, sm: 2.5 },
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, sm: 2.5, md: 3 },
                minWidth: 0,
                borderRadius: 3,
                border: "1px solid #e8edf5",
                ...cardHover,
              }}
            >
              <Avatar
                sx={{
                  bgcolor: "#eef2ff",
                  color: "#4f46e5",
                  width: 55,
                  height: 55,
                  borderRadius: 2.5,
                  mb: 2,
                }}
              >
                <TrackChangesOutlinedIcon fontSize="large" />
              </Avatar>

              <Typography variant="h6" fontWeight={850} color="#172554">
                Our Mission
              </Typography>

              <Typography
                fontSize={13}
                color="#8490a5"
                lineHeight={1.9}
                sx={{ mt: 1 }}
              >
                Our mission is to make shopping simple and accessible by
                providing an easy-to-use platform for product discovery,
                order management and customer assistance.
              </Typography>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, sm: 2.5, md: 3 },
                minWidth: 0,
                borderRadius: 3,
                border: "1px solid #e8edf5",
                ...cardHover,
              }}
            >
              <Avatar
                sx={{
                  bgcolor: "#ecfdf5",
                  color: "#059669",
                  width: 55,
                  height: 55,
                  borderRadius: 2.5,
                  mb: 2,
                }}
              >
                <VisibilityOutlinedIcon fontSize="large" />
              </Avatar>

              <Typography variant="h6" fontWeight={850} color="#172554">
                Our Vision
              </Typography>

              <Typography
                fontSize={13}
                color="#8490a5"
                lineHeight={1.9}
                sx={{ mt: 1 }}
              >
                Our vision is to build a convenient and customer-focused
                shopping platform that makes every interaction smooth,
                reliable and enjoyable.
              </Typography>
            </Paper>
          </Box>
        </Box>

        {/* WHAT WE OFFER */}
        <Box sx={{ mb: { xs: 3, md: 4 }, mt: { xs: 4, md: 8 } }}>
          <Typography sx={sectionHeading}>
            What We Offer
          </Typography>

          <Typography fontSize={13} color="#94a3b8" sx={{ mt: 0.5, mb: 2.5 }}>
            Features designed to improve your shopping experience.
          </Typography>

          <Box sx={featureGrid}>
            {features.map((item) => (
              <Paper
                key={item.title}
                elevation={0}
                sx={{
                  height: "100%",
                  minWidth: 0,
                  p: { xs: 2, sm: 2.5, md: 2.8 },
                  borderRadius: 3,
                  border: "1px solid #e8edf5",
                  bgcolor: "#fff",
                  ...cardHover,
                }}
              >
                <Avatar
                  sx={{
                    width: 52,
                    height: 52,
                    bgcolor: item.bg,
                    color: item.color,
                    borderRadius: 2.5,
                    mb: 2.2,
                  }}
                >
                  {item.icon}
                </Avatar>

                <Typography
                  fontWeight={850}
                  color="#172033"
                  fontSize={15}
                  mb={1}
                  sx={{ overflowWrap: "anywhere" }}
                >
                  {item.title}
                </Typography>

                <Typography
                  fontSize={12.5}
                  color="#8490a5"
                  lineHeight={1.9}
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
            border: "1px solid #e8edf5",
            bgcolor: "#fff",
            mt: { xs: 4, md: 8 },
          }}
        >
          <Typography sx={sectionHeading}>
            How It Works
          </Typography>

          <Typography fontSize={13} color="#94a3b8" sx={{ mt: 0.5, mb: 3 }}>
            Start your shopping journey in four simple steps.
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
                  p: { xs: 2, sm: 2.2 },
                  minWidth: 0,
                  height: "100%",
                  boxSizing: "border-box",
                  borderRadius: 2.5,
                  bgcolor: "#f8faff",
                  border: "1px solid #edf0fa",
                  transition: "0.25s",
                  "&:hover": {
                    bgcolor: { xs: "#f8faff", md: "#eef2ff" },
                    transform: { xs: "none", md: "translateY(-4px)" },
                  },
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography
                    variant="h4"
                    fontWeight={900}
                    color="#c7d2fe"
                  >
                    {step.number}
                  </Typography>

                  <Box sx={{ color: "#536dce" }}>{step.icon}</Box>
                </Stack>

                <Typography
                  fontWeight={850}
                  color="#172554"
                  sx={{ mt: 2 }}
                >
                  {step.title}
                </Typography>

                <Typography
                  fontSize={12}
                  color="#94a3b8"
                  lineHeight={1.8}
                  sx={{ mt: 0.8 }}
                >
                  {step.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>

        {/* CUSTOMER FIRST SECTION */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 3, md: 3.5 },
            mb: { xs: 3, md: 4 },
            borderRadius: 3.5,
            bgcolor: "#f8faff",
            border: "1px solid #e8edf5",
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={{ xs: 2, md: 3 }}
            alignItems="center"
          >
            <Avatar
              sx={{
                width: 85,
                height: 85,
                flexShrink: 0,
                bgcolor: "#e0e7ff",
                color: "#4338ca",
              }}
            >
              <FavoriteBorderOutlinedIcon sx={{ fontSize: 43 }} />
            </Avatar>

            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                variant="h5"
                fontWeight={850}
                color="#172554"
                textAlign={{ xs: "center", md: "left" }}
                sx={{ fontSize: { xs: 20, sm: 23, md: 24 } }}
              >
                Customer Experience Comes First
              </Typography>

              <Typography
                fontSize={13}
                color="#64748b"
                lineHeight={1.9}
                sx={{ mt: 1 }}
                textAlign={{ xs: "center", md: "left" }}
              >
                We believe a great shopping experience goes beyond products.
                That's why our platform brings together easy navigation,
                order management and customer assistance in one place.
              </Typography>
            </Box>
          </Stack>
        </Paper>

        {/* BOTTOM CTA */}
        <Paper
          elevation={0}
          sx={{
            position: "relative",
            overflow: "hidden",
            p: { xs: 2.5, sm: 3, md: 4 },
            borderRadius: { xs: 3, md: 4 },
            color: "#fff",
            background:
              "linear-gradient(110deg,#1e1b4b 0%,#3730a3 60%,#6366f1 100%)",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              width: { xs: 120, md: 180 },
              height: { xs: 120, md: 180 },
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "50%",
              right: -50,
              top: -100,
            }}
          />

          <Stack
            direction={{ xs: "column", md: "row" }}
            alignItems={{ xs: "flex-start", md: "center" }}
            justifyContent="space-between"
            spacing={2.5}
            sx={{ position: "relative", zIndex: 1 }}
          >
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                variant="h5"
                fontWeight={900}
                sx={{ fontSize: { xs: 21, sm: 24 } }}
              >
                Ready to Start Shopping?
              </Typography>

              <Typography
                fontSize={13}
                color="#e0e7ff"
                sx={{ mt: 1, maxWidth: 550, lineHeight: 1.8 }}
              >
                Explore our platform, discover products and enjoy a
                convenient shopping experience.
              </Typography>
            </Box>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              sx={{ width: { xs: "100%", md: "auto" } }}
            >
              <Button
                fullWidth
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate("/view-product")}
                sx={{
                  bgcolor: "#fff",
                  color: "#3730a3",
                  px: 2.5,
                  py: 1.3,
                  borderRadius: 2,
                  fontWeight: 800,
                  textTransform: "none",
                  whiteSpace: "nowrap",
                  "&:hover": { bgcolor: "#e0e7ff" },
                }}
              >
                Explore Products
              </Button>

              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate("/contect")}
                sx={{
                  color: "#fff",
                  borderColor: "rgba(255,255,255,0.5)",
                  px: 2.5,
                  py: 1.3,
                  borderRadius: 2,
                  fontWeight: 750,
                  textTransform: "none",
                  whiteSpace: "nowrap",
                  "&:hover": {
                    borderColor: "#fff",
                    bgcolor: "rgba(255,255,255,0.08)",
                  },
                }}
              >
                Contact Us
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Box>
    </Drawer1>
  );
}
