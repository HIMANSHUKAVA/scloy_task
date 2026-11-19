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
import TablePagination from "@mui/material/TablePagination";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import EmailIcon from "@mui/icons-material/Email";
import Switch from "@mui/material/Switch";

export default function AdminHome() {
  const [deta, setdeta] = useState([]);
  const token = localStorage.getItem("token");

  const [page, setpage] = useState(0);
  const [rowperpage, setrowperpage] = useState(4);

  const HandlPageChange = (e, newpage) => {
    setpage(newpage);
  };

  const HandlChange = (e) => {
    setrowperpage(Number(e.target.value));
    setpage(0);
  };

  useEffect(() => {
    axios
      .get("http://localhost:5600/auth/admin/getdeta", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setdeta(res.data.data);
      })
      .catch((er) => {
        console.log(er.message);
      });
  }, []);

  const navigate = useNavigate();

  const handlclickofedit = (id) => {
    navigate(`/admin/edit/${id}`);
  };

  const HandlDeleteButton = (id) => {
    const cr = confirm("Are you sure you want to delete");

    if (cr) {
      axios
        .delete(`http://localhost:5600/auth/admin/deletebyid/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          alert(res.data.message);

          setdeta((prev) => {
            const updated = prev.filter((e) => e._id !== id);

            if (page > 0 && updated.length <= page * rowperpage) {
              setpage(page - 1);
            }

            return updated;
          });
        })
        .catch((er) => {
          console.log(er.message);
        });
    }
  };

  const HandlToggle = (id, isActive) => {
    axios
      .put(
        `http://localhost:5600/auth/admin/toggleroute/${id}`,
        { isActive },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((res) => {
        alert(res.data.message);

        setdeta((prev) =>
          prev.map((user) =>
            user._id === id ? { ...user, isActive: res.data.isActive } : user,
          ),
        );
      })
      .catch((er) => {
        console.log(er);
      });
  };

  return (
    <>
      <AdminDashboard />

      <Box
        sx={{
          minHeight: "100vh",
          background: "#f5f7fb",
          pt: 10,
          px: { xs: 2, sm: 3, md: 5 },
          pb: 4,
        }}
      >
        {/* Page Heading */}

        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
          <Avatar
            sx={{
              width: 55,
              height: 55,
              bgcolor: "#e0eaff",
              color: "#2563eb",
            }}
          >
            <PeopleAltIcon fontSize="large" />
          </Avatar>

          <Box>
            <Typography variant="h4" fontWeight={800} color="#172554">
              Registered Users
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Manage all registered users
            </Typography>
          </Box>
        </Stack>

        {/* Table Container */}

        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            borderRadius: 3,
            border: "1px solid #e2e8f0",
            overflowX: "auto",
            width: "100%",
            boxShadow: "0px 5px 25px rgba(0,0,0,0.04)",
          }}
        >
          <Table
            sx={{
              minWidth: 750,
              whiteSpace: "nowrap",
            }}
          >
            <TableHead>
              <TableRow sx={{ background: "#eff4ff" }}>
                {[
                  "SR NO.",
                  "USER NAME",
                  "EMAIL ADDRESS",
                  "STATUS",
                  "ACTIONS",
                ].map((heading) => (
                  <TableCell
                    key={heading}
                    sx={{
                      fontWeight: 800,
                      color: "#334155",
                      py: 2.5,
                      fontSize: 13,
                      letterSpacing: 0.5,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {heading}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {deta
                .slice(page * rowperpage, page * rowperpage + rowperpage)
                .map((er, index) => (
                  <TableRow
                    key={er._id}
                    hover
                    sx={{
                      "&:hover": {
                        backgroundColor: "#f8faff",
                      },
                      "& td": {
                        borderBottom: "1px solid #edf0f5",
                        py: 2,
                      },
                    }}
                  >
                    {/* Serial Number */}

                    <TableCell>
                      <Typography fontWeight={700} color="#64748b">
                        {page * rowperpage + index + 1}
                      </Typography>
                    </TableCell>

                    {/* Username */}

                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Avatar
                          sx={{
                            bgcolor: "#dbeafe",
                            color: "#2563eb",
                            width: 38,
                            height: 38,
                            fontWeight: 700,
                          }}
                        >
                          {er.username?.charAt(0).toUpperCase()}
                        </Avatar>

                        <Typography fontWeight={600} color="#1e293b">
                          {er.username}
                        </Typography>
                      </Stack>
                    </TableCell>

                    {/* Email */}

                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <EmailIcon
                          sx={{
                            color: "#94a3b8",
                            fontSize: 19,
                          }}
                        />

                        <Typography color="#475569">{er.email}</Typography>
                      </Stack>
                    </TableCell>

                    {/* Status */}

                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Switch
                          checked={Boolean(er.isActive)}
                          onChange={(e) =>
                            HandlToggle(er._id, e.target.checked)
                          }
                          color="success"
                        />

                        <Typography
                          variant="body2"
                          color={
                            er.isActive ? "success.main" : "text.secondary"
                          }
                          fontWeight={600}
                        >
                          {er.isActive ? "Active" : "Disabled"}
                        </Typography>
                      </Stack>
                    </TableCell>

                    {/* Actions */}

                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Tooltip title="Edit User">
                          <IconButton
                            onClick={() => handlclickofedit(er._id)}
                            sx={{
                              bgcolor: "#e0ecff",
                              color: "#2563eb",
                              borderRadius: 2,
                              "&:hover": {
                                bgcolor: "#bfdbfe",
                              },
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete User">
                          <IconButton
                            onClick={() => HandlDeleteButton(er._id)}
                            sx={{
                              bgcolor: "#fee2e2",
                              color: "#dc2626",
                              borderRadius: 2,
                              "&:hover": {
                                bgcolor: "#fecaca",
                              },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}

              {deta.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography color="text.secondary" sx={{ py: 4 }}>
                      No Registered Users Found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}

          <Box
            sx={{
              borderTop: "1px solid #e2e8f0",
              background: "#fafbff",
            }}
          >
            <TablePagination
              count={deta.length}
              page={page}
              rowsPerPage={rowperpage}
              onPageChange={HandlPageChange}
              onRowsPerPageChange={HandlChange}
              rowsPerPageOptions={[2, 4, 6]}
            />
          </Box>
        </TableContainer>
      </Box>
    </>
  );
}
