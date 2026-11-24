
import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";

import Drawer1 from "../Component/Drawers1";

import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";

export default function About() {
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

  return (
    <Drawer1>
      <Box
        sx={{
          width: "100%",
          maxWidth: 1500,
          mx: "auto",
          pb: 4,
          mt:7
        }}
      >
        {/* Page Heading */}
        <Box sx={{ mb: 3.5 }}>
          <Typography
            variant="h5"
            fontWeight={800}
            color="#172033"
            mb={0.7}
          >
            About Us
          </Typography>

          <Typography fontSize={14} color="#8490a5">
            Learn more about our shopping platform.
          </Typography>
        </Box>

        {/* Hero Section */}
        <Paper
          elevation={0}
          sx={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 4,
            p: { xs: 3, sm: 4, md: 6 },
            color: "#fff",
            background:
              "linear-gradient(115deg, #1e1b4b 0%, #3730a3 55%, #6366f1 100%)",
            mb: 4,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              width: 230,
              height: 230,
              borderRadius: "50%",
              border: "35px solid rgba(255,255,255,0.06)",
              right: -50,
              top: -90,
            }}
          />

          <Box
            sx={{
              position: "absolute",
              width: 170,
              height: 170,
              borderRadius: "50%",
              bgcolor: "rgba(255,255,255,0.05)",
              right: 100,
              bottom: -110,
            }}
          />

          <Box sx={{ position: "relative", zIndex: 1, maxWidth: 700 }}>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              mb={2}
            >
              <AutoAwesomeOutlinedIcon sx={{ color: "#c7d2fe" }} />

              <Typography
                fontSize={12}
                fontWeight={800}
                letterSpacing={2}
                color="#c7d2fe"
              >
                WELCOME TO OUR PLATFORM
              </Typography>
            </Stack>

            <Typography
              sx={{
                fontSize: { xs: 29, sm: 38, md: 46 },
                fontWeight: 900,
                lineHeight: 1.2,
                mb: 2,
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
                fontSize: { xs: 14, md: 16 },
                lineHeight: 1.9,
                maxWidth: 620,
              }}
            >
              We aim to make your shopping experience easy, convenient and
              reliable. Discover products, manage your orders and enjoy a
              smooth shopping journey through our platform.
            </Typography>
          </Box>
        </Paper>

        {/* About Content */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper
              elevation={0}
              sx={{
                height: "100%",
                p: { xs: 2.5, md: 3.5 },
                borderRadius: 3.5,
                border: "1px solid #e8edf5",
                bgcolor: "#fff",
              }}
            >
              <Typography
                fontSize={11}
                fontWeight={800}
                letterSpacing={1.5}
                color="#6366f1"
                mb={1.5}
              >
                WHO WE ARE
              </Typography>

              <Typography
                variant="h5"
                fontWeight={800}
                color="#172033"
                mb={2}
              >
                Your Convenient Shopping Partner
              </Typography>

              <Typography
                color="#64748b"
                fontSize={14}
                lineHeight={2}
                mb={2}
              >
                Our platform is designed to provide users with a convenient
                way to explore products, place orders and manage their
                purchases.
              </Typography>

              <Typography
                color="#64748b"
                fontSize={14}
                lineHeight={2}
              >
                From product discovery to order tracking, we focus on making
                every step simple and easy to understand. Our goal is to
                create a smooth and user-friendly shopping experience.
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Paper
              elevation={0}
              sx={{
                height: "100%",
                p: 3,
                borderRadius: 3.5,
                border: "1px solid #e8edf5",
                background: "#f8faff",
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
                  bgcolor: "#eef2ff",
                  color: "#4f46e5",
                  mb: 2,
                }}
              >
                <ShoppingBagOutlinedIcon sx={{ fontSize: 42 }} />
              </Avatar>

              <Typography
                variant="h5"
                fontWeight={900}
                color="#172033"
              >
                Smart Shopping
              </Typography>

              <Typography
                fontSize={13}
                color="#8490a5"
                mt={1}
                maxWidth={300}
                lineHeight={1.8}
              >
                Browse products, manage your wishlist and keep track of
                your orders in one place.
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Features */}
        <Box mb={2.5}>
          <Typography
            fontSize={21}
            fontWeight={800}
            color="#172033"
          >
            What We Offer
          </Typography>

          <Typography fontSize={13} color="#94a3b8" mt={0.5}>
            Features designed to improve your shopping experience.
          </Typography>
        </Box>

        <Grid container spacing={2.5}>
          {features.map((item) => (
            <Grid key={item.title} size={{ xs: 12, sm: 6, lg: 3 }}>
              <Paper
                elevation={0}
                sx={{
                  height: "100%",
                  p: 2.8,
                  borderRadius: 3,
                  border: "1px solid #e8edf5",
                  bgcolor: "#fff",
                  transition: "all 0.25s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 12px 28px rgba(30,41,59,0.07)",
                    borderColor: "#c7d2fe",
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 50,
                    height: 50,
                    bgcolor: item.bg,
                    color: item.color,
                    borderRadius: 2.5,
                    mb: 2.2,
                  }}
                >
                  {item.icon}
                </Avatar>

                <Typography
                  fontWeight={800}
                  color="#172033"
                  fontSize={15}
                  mb={1}
                >
                  {item.title}
                </Typography>

                <Typography
                  fontSize={12.5}
                  color="#8490a5"
                  lineHeight={1.8}
                >
                  {item.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Drawer1>
  );
}
