import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart } from "@mui/x-charts/BarChart";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
export default function Orderchart() {
  const [orderchart, setorderchart] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5600/order/admin/orderchart`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setorderchart(res.data.data);
      })
      .catch((er) => {
        console.log(er);
      });
  }, []);

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const chartdeta = orderchart.map((item) => ({
    month: `${monthNames[item._id.month - 1]} ${item._id.year}`,
    total: item.totalorders,
    pending: item.pendingOrders,
    delivered: item.deliveredOrders,
  }));
  return (
    <>
      <Paper sx={{ p: 3, borderRadius: 3, width: "100%" }}>
        <Typography variant="h6" fontWeight={700} mb={2}>
          Order Analytics
        </Typography>
        <BarChart
          dataset={chartdeta}
          xAxis={[
            {
              scaleType: "band",
              dataKey: "month",
              label: "Months",
            },
          ]}
          series={[
            { dataKey: "total", label: "Total Orders" },
            { dataKey: "pending", label: "Pending Orders" },
            { dataKey: "delivered", label: "Delivered Orders" },
          ]}
          height={350}
          borderRadius={6}
          grid={{ horizontal: true }}
          margin={{ left: 50, right: 20, top: 30, bottom: 50 }}
        />
      </Paper>
    </>
  );
}
