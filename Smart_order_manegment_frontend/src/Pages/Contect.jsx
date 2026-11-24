
import React from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

import ContactSupportOutlinedIcon from "@mui/icons-material/ContactSupportOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { useNavigate } from "react-router-dom";
import Drawers1 from "../Component/Drawers1";

export default function Contect() {
  const navigate = useNavigate();

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
            Contact Us
          </Typography>

          <Typography fontSize={14} color="#8490a5">
            We're here to help you with your shopping experience.
          </Typography>
        </Box>

        {/* Main Contact Section */}
        <Paper
          elevation={0}
          sx={{
            minHeight: { xs: 450, md: 560 },
            position: "relative",
            overflow: "hidden",
            borderRadius: 4,
            border: "1px solid #e9edf5",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: { xs: 3, md: 6 },
          }}
        >
          {/* Background Decoration */}
          <Box
            sx={{
              position: "absolute",
              width: 300,
              height: 300,
              borderRadius: "50%",
              bgcolor: "#eef2ff",
              top: -150,
              right: -100,
            }}
          />

          <Box
            sx={{
              position: "absolute",
              width: 250,
              height: 250,
              borderRadius: "50%",
              bgcolor: "#f5f3ff",
              bottom: -130,
              left: -90,
            }}
          />

          {/* Content */}
          <Box
            sx={{
              position: "relative",
              zIndex: 1,
              textAlign: "center",
              maxWidth: 600,
            }}
          >
            <Box
              sx={{
                width: 105,
                height: 105,
                mx: "auto",
                mb: 3,
                borderRadius: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                  "linear-gradient(135deg, #4f46e5, #818cf8)",
                boxShadow: "0 12px 28px rgba(79,70,229,0.25)",
              }}
            >
              <ContactSupportOutlinedIcon
                sx={{
                  fontSize: 55,
                  color: "#fff",
                }}
              />
            </Box>

            <Typography
              variant="h4"
              fontWeight={800}
              color="#172033"
              sx={{
                mb: 1.5,
                fontSize: { xs: 26, md: 34 },
              }}
            >
              We'd Love to Hear From You!
            </Typography>

            <Typography
              fontSize={14}
              color="#8490a5"
              lineHeight={1.9}
              sx={{ mb: 3 }}
            >
              Have a question about your orders, products or shopping
              experience? We're always happy to help you. Explore our
              products and manage your orders from your account.
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="center"
              spacing={1.5}
            >
              <Button
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate("/view-product")}
                sx={{
                  px: 3,
                  py: 1.3,
                  borderRadius: 2.5,
                  textTransform: "none",
                  fontWeight: 700,
                  bgcolor: "#4f46e5",
                  boxShadow: "0 6px 16px rgba(79,70,229,0.2)",
                  "&:hover": {
                    bgcolor: "#4338ca",
                  },
                }}
              >
                Explore Products
              </Button>

              <Button
                variant="outlined"
                startIcon={<ShoppingBagOutlinedIcon />}
                onClick={() => navigate("/user/myorder")}
                sx={{
                  px: 3,
                  py: 1.3,
                  borderRadius: 2.5,
                  textTransform: "none",
                  fontWeight: 700,
                  color: "#475569",
                  borderColor: "#dbe1eb",
                  "&:hover": {
                    bgcolor: "#f8fafc",
                    borderColor: "#4f46e5",
                    color: "#4f46e5",
                  },
                }}
              >
                My Orders
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Box>
    </Drawers1>
  );
}
