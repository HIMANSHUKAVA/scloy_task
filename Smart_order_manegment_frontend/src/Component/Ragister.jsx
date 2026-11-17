import React, { useState } from "react";

import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Ragister() {
  const [deta, setdeta] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
  });

  const [showpassword, setshowpassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handlchaneevent = (e) => {
    setdeta({
      ...deta,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5600/auth/ragister", deta);

      alert("Registration successful");

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.data.role);
      localStorage.setItem("username", res.data.data.username);
      localStorage.setItem("email", res.data.data.email);

      setdeta({
        username: "",
        email: "",
        password: "",
        role: "",
      });

      navigate("/home");
    } catch (er) {
      console.log(er);
      alert(er.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f4f6fb",
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 4,
            border: "1px solid #e8eaf0",
            boxShadow: "0 12px 40px rgba(0,0,0,0.06)",
          }}
        >
          {/* Heading */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Box
              sx={{
                width: 55,
                height: 55,
                borderRadius: 3,
                bgcolor: "#e8efff",
                color: "#2563eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 2,
              }}
            >
              <PersonIcon fontSize="large" />
            </Box>

            <Typography variant="h4" fontWeight={700} color="#172554">
              Create Account
            </Typography>

            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Register to get started
            </Typography>
          </Box>

          {/* Registration Form */}
          <Box component="form" onSubmit={handleSubmit}>
            <Typography fontWeight={600} sx={{ mb: 1 }}>
              Username
            </Typography>

            <TextField
              fullWidth
              name="username"
              placeholder="Enter your name"
              value={deta.username}
              onChange={handlchaneevent}
              required
              sx={{ mb: 2.5 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: "#64748b" }} />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Typography fontWeight={600} sx={{ mb: 1 }}>
              Email Address
            </Typography>

            <TextField
              fullWidth
              type="email"
              name="email"
              placeholder="Enter your email"
              value={deta.email}
              onChange={handlchaneevent}
              required
              sx={{ mb: 2.5 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: "#64748b" }} />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Typography fontWeight={600} sx={{ mb: 1 }}>
              Password
            </Typography>

            <TextField
              fullWidth
              type={showpassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={deta.password}
              onChange={handlchaneevent}
              required
              sx={{ mb: 2.5 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: "#64748b" }} />
                    </InputAdornment>
                  ),

                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setshowpassword(!showpassword)}
                        edge="end"
                        aria-label="Toggle password visibility"
                      >
                        {showpassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                py: 1.5,
                borderRadius: 2,
                textTransform: "none",
                fontSize: "16px",
                fontWeight: 600,
                bgcolor: "#2563eb",
                "&:hover": {
                  bgcolor: "#1d4ed8",
                },
              }}
            >
              {loading ? "Registering..." : "Create Account"}
            </Button>
          </Box>

          {/* Login Link */}
          <Typography textAlign="center" color="text.secondary" sx={{ mt: 3 }}>
            Already have an account?{" "}
            <Box
              component={Link}
              to="/"
              sx={{
                color: "#2563eb",
                fontWeight: 600,
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Login Now
            </Box>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
