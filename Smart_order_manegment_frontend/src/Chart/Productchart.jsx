
import React, { useEffect, useState } from "react";
import axios from "axios";

import { BarChart } from "@mui/x-charts/BarChart";
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
export default function Productchart() {

  const [productchart, setproductchart] = useState([]);

  useEffect(() => {

    axios.get("http://localhost:5600/view/admin/productchart", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
    .then((res) => {
      setproductchart(res.data.data);
    })
    .catch((error) => {
      console.log(error.message);
    });

  }, []);

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        width: "100%",
        minWidth: 0
      }}
    >

      <Typography variant="h6" fontWeight={700} mb={2}>
        Product Price Analytics
      </Typography>

      <BarChart
        dataset={productchart}
        xAxis={[
          {
            scaleType: "band",
            dataKey: "productName",
            label: "Products"
          }
        ]}
        series={[
          {
            dataKey: "price",
            label: "Product Price",
            valueFormatter: (value) =>
              `₹${value?.toLocaleString("en-IN")}`
          }
        ]}
        height={350}
        borderRadius={6}
        grid={{ horizontal: true }}
        margin={{ left: 80, right: 30, top: 30, bottom: 70 }}
      />

    </Paper>
  );
}
