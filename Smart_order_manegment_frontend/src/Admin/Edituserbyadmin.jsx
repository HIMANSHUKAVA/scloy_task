import React, { useEffect, useState } from "react";
import AdminDashboard from "./AdminDashboard ";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import SnackBar from "../Component/SnackBar";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";

import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import Swal from "sweetalert2";

export default function Edituserbyadmin() {
  const { id } = useParams();

  const [open, setopen] = useState(false);

  const [deta, setdeta] = useState({
    username: "",
    email: "",
  });

  const [buttonstate, setbuttonstate] = useState(false);

  const naviagate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5600/auth/admin/finduserbyid/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setdeta(res.data.deta);
      })
      .catch((er) => {
        console.log(er);
      });
  }, [id]);

  const field = [
    {
      id: 1,
      label: "Username",
      name: "username",
      ids: "username",
      icon: <PersonIcon />,
    },
    {
      id: 2,
      label: "Email Address",
      name: "email",
      ids: "email",
      icon: <EmailIcon />,
    },
  ];

  const HandlSubmit = (e) => {
    e.preventDefault();

    setbuttonstate(true);

    axios
      .put(`http://localhost:5600/auth/admin/updatebyuser/${id}`, deta, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        Swal.fire({
          // title: "sucess",
          text: "updated successfully",
          icon: "success",
        });
          naviagate("/admin/home");

      })
      .catch((er) => {
        if (er.response?.status === 409) {
          

          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Email already registered. Please use a different email.",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong. Please try again.",
          });
        }
      })
      .finally(() => {
        setbuttonstate(false);
      });
  };

  return (
    <>
      <AdminDashboard />

      <Box
        sx={{
          bgcolor: "#f4f6fb",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: 5,
          px: 2,
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 4 },
              borderRadius: 4,
              border: "1px solid #e8eaf0",
              boxShadow: "0 12px 40px rgba(0,0,0,0.06)",
              transition: "0.3s",
              "&:hover": {
                boxShadow: "0 16px 45px rgba(0,0,0,0.09)",
              },
            }}
          >
            {/* Heading */}

            <Stack alignItems="center" spacing={1.5} sx={{ mb: 4 }}>
              <Avatar
                sx={{
                  width: 65,
                  height: 65,
                  bgcolor: "#e0eaff",
                  color: "#2563eb",
                }}
              >
                <EditIcon sx={{ fontSize: 32 }} />
              </Avatar>

              <Typography variant="h4" fontWeight={800} color="#1e293b">
                Edit User
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Update registered user information
              </Typography>
            </Stack>

            {/* Form */}

            <Box component="form" onSubmit={HandlSubmit}>
              {field.map((s) => (
                <TextField
                  key={s.id}
                  name={s.name}
                  id={s.ids}
                  label={s.label}
                  value={deta[s.name] || ""}
                  fullWidth
                  required
                  sx={{
                    mb: 3,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2.5,
                      bgcolor: "#fafbff",
                      "&:hover fieldset": {
                        borderColor: "#2563eb",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#2563eb",
                      },
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#2563eb",
                    },
                  }}
                  onChange={(e) =>
                    setdeta({
                      ...deta,
                      [s.name]: e.target.value,
                    })
                  }
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Box sx={{ color: "#64748b", display: "flex" }}>
                            {s.icon}
                          </Box>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              ))}

              {/* Update Button */}

              <Button
                type="submit"
                disabled={buttonstate}
                fullWidth
                startIcon={<SaveIcon />}
                sx={{
                  bgcolor: "#2563EB",
                  color: "#fff",
                  borderRadius: 2.5,
                  py: 1.5,
                  fontWeight: 700,
                  fontSize: 16,
                  textTransform: "none",
                  boxShadow: "0 5px 15px rgba(37,99,235,0.2)",
                  "&:hover": {
                    bgcolor: "#1D4ED8",
                    boxShadow: "0 7px 20px rgba(37,99,235,0.3)",
                  },
                  "&.Mui-disabled": {
                    bgcolor: "#93C5FD",
                    color: "#fff",
                  },
                }}
              >
                {buttonstate ? "Updating..." : "Update User"}
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    </>
  );
}
