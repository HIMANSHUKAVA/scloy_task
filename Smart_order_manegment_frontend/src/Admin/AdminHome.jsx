import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import axios from "axios";
import React, { useEffect, useState } from "react";
import AdminDashboard from "./AdminDashboard ";
import Box from "@mui/material/Box";
export default function AdminHome() {
  const [deta, setdeta] = useState([]);
  const token = localStorage.getItem("token");
  useEffect(() => {
    axios
      .get(`http://localhost:5600/auth/admin/getdeta`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // console.log(res.data.data);

        setdeta(res.data.data);
      })
      .catch((er) => {
        console.log(er.message);
      });
  }, [deta]);

  return (
    <>
      <AdminDashboard />
      <Box sx={{ mt:8}}>
        <Typography variant="h4">Ragisterd User</Typography>

        <TableContainer component={Paper} sx={{p:2}}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {deta.map((er) => (
                <TableRow key={er._id}>
                  <TableCell>{er._id}</TableCell>
                  <TableCell>{er.username}</TableCell>
                  <TableCell>{er.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}
