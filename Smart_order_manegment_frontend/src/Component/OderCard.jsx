
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { io } from "socket.io-client";

import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import CancelPresentationRoundedIcon from "@mui/icons-material/CancelPresentationRounded";

export default function OderCard() {
  const [deta, setdeta] = useState([]);
  const [loading, setloading] = useState(true);

  const token = localStorage.getItem("token");

  const FetchOrders = useCallback(async () => {
    setloading(true);

    try {
      const res = await axios.get(
        "http://localhost:5600/order/admin/fetchorderbyadmin",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setdeta(res.data.deta || []);
    } catch (er) {
      console.log(er.response?.data || er.message);
    } finally {
      setloading(false);
    }
  }, [token]);

  useEffect(() => {
    FetchOrders();

    const socket = io("http://localhost:5600");

    const handleStockUpdate = () => {
      FetchOrders();
    };

    socket.on("stockupdated", handleStockUpdate);

    return () => {
      socket.off("stockupdated", handleStockUpdate);
      socket.disconnect();
    };
  }, [FetchOrders]);

  // Order Calculations

  const totalOrders = deta.length;

  const pendingOrders = deta.filter(
    (item) => item.orderStatus === "Pending"
  ).length;

  const deliveredOrders = deta.filter(
    (item) => item.orderStatus === "Delivered"
  ).length;

  const cancellationRequests = deta.filter(
    (item) =>
      item.cancellation?.status === "Requested" ||
      item.cancellation?.status === "Pending"
  ).length;

  const approvedRequests = deta.filter(
    (item) => item.cancellation?.status === "Approved"
  ).length;

  const rejectedRequests = deta.filter(
    (item) => item.cancellation?.status === "Rejected"
  ).length;

  const deliveredPercentage =
    totalOrders > 0
      ? Math.round((deliveredOrders / totalOrders) * 100)
      : 0;

  if (loading) {
    return <Typography>Loading order overview...</Typography>;
  }

  return (
    <Grid container spacing={2.5} sx={{ mt: 0.5 }}>
      {/* DELIVERY OVERVIEW */}

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
                <TrendingUpRoundedIcon />
              </Avatar>

              <Box>
                <Typography fontSize={16} fontWeight={800} color="#111827">
                  Order Fulfillment Overview
                </Typography>

                <Typography fontSize={11} color="#94a3b8">
                  Delivered orders compared to total orders
                </Typography>
              </Box>
            </Stack>

            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{ mb: 1 }}
            >
              <Typography fontSize={12} color="#475569" fontWeight={600}>
                Delivered Orders
              </Typography>

              <Typography fontSize={12} color="#059669" fontWeight={800}>
                {deliveredOrders} ({deliveredPercentage}%)
              </Typography>
            </Stack>

            <LinearProgress
              variant="determinate"
              value={deliveredPercentage}
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

            <Divider sx={{ my: 3 }} />

            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography fontSize={11} color="#94a3b8">
                  Total Orders
                </Typography>
                <Typography fontWeight={800} fontSize={19} color="#111827">
                  {totalOrders}
                </Typography>
              </Grid>

              <Grid item xs={4}>
                <Typography fontSize={11} color="#94a3b8">
                  Delivered
                </Typography>
                <Typography fontWeight={800} fontSize={19} color="#059669">
                  {deliveredOrders}
                </Typography>
              </Grid>

              <Grid item xs={4}>
                <Typography fontSize={11} color="#94a3b8">
                  Pending
                </Typography>
                <Typography fontWeight={800} fontSize={19} color="#d97706">
                  {pendingOrders}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* CANCELLATION OVERVIEW */}

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
                  bgcolor: "#fee2e2",
                  color: "#dc2626",
                  borderRadius: 2,
                }}
              >
                <CancelPresentationRoundedIcon />
              </Avatar>

              <Box>
                <Typography fontSize={16} fontWeight={800} color="#111827">
                  Cancellation Overview
                </Typography>

                <Typography fontSize={11} color="#94a3b8">
                  Current cancellation request summary
                </Typography>
              </Box>
            </Stack>

            <Stack spacing={2}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography fontSize={12} color="#64748b">
                  Awaiting Review
                </Typography>

                <Chip
                  size="small"
                  label={cancellationRequests}
                  sx={{
                    bgcolor: "#fef3c7",
                    color: "#b45309",
                    fontWeight: 800,
                  }}
                />
              </Stack>

              <Divider />

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography fontSize={12} color="#64748b">
                  Approved Requests
                </Typography>

                <Chip
                  size="small"
                  label={approvedRequests}
                  color="success"
                />
              </Stack>

              <Divider />

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography fontSize={12} color="#64748b">
                  Rejected Requests
                </Typography>

                <Chip
                  size="small"
                  label={rejectedRequests}
                  color="error"
                />
              </Stack>

              <Typography
                fontSize={11}
                color="#94a3b8"
                sx={{ lineHeight: 1.7 }}
              >
                Review pending cancellation requests directly from the
                orders table.
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
