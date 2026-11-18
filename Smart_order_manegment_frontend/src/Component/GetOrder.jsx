
import TableHead from "@mui/material/TableHead";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";

import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

import axios from "axios";
import React, { useEffect, useState } from "react";
import AdminDashboard from "../Admin/AdminDashboard ";
import Box from "@mui/material/Box";

export default function GetOrder() {

  const [order, setorder] = useState([]);

  useEffect(() => {

    axios.get("http://localhost:5600/api/check-order")
      .then((res) => {
        setorder(res.data);
      })
      .catch((error) => {
        console.log(error);
      });

  }, [order]);

  return (
    <>

    <AdminDashboard/>
      <Box sx={{mt:8}}>
        <Typography variant="h4" sx={{ mb: 3 }}>
        Order Details
      </Typography>

      <TableContainer component={Paper}>
        <Table>

          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Order</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>

            {order.map((er) => (
              <TableRow key={er._id}>

                <TableCell>{er._id}</TableCell>
                <TableCell>{er.name}</TableCell>
                <TableCell>{er.email}</TableCell>
                <TableCell>{er.order}</TableCell>

              </TableRow>
            ))}

          </TableBody>

        </Table>
      </TableContainer>
      </Box>
    </>
  );
}
