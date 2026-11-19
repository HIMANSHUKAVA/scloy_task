import React, { useState } from "react";

import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Alert from "@mui/material/Alert";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [deta, setdeta] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showpassword, setshowpassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setError("");

    setdeta({
      ...deta,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:5600/auth/login-check",
        deta,
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.data.username);
      localStorage.setItem("email", res.data.data.email);
      localStorage.setItem("role", res.data.data.role);

    

      setdeta({
        email: "",
        password: "",
      });

      alert(res.data.message)
      if (res.data.data.role === "User") {
        navigate("/home");
      } else if (res.data.data.role === "Admin") {
        navigate("/admin/home");
      } else {
        localStorage.clear();
        setError("Invalid user role");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Invalid email or password");
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
              <LockOutlinedIcon fontSize="large" />
            </Box>

            <Typography variant="h4" fontWeight={700} color="#172554">
              Welcome Back
            </Typography>

            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Login to your account to continue
            </Typography>
          </Box>

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Typography fontWeight={600} sx={{ mb: 1 }}>
              Email Address
            </Typography>

            <TextField
              fullWidth
              type="email"
              name="email"
              placeholder="Enter your email"
              value={deta.email}
              onChange={handleChange}
              required
              sx={{ mb: 2.5 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: "#64748b", fontSize: 22 }} />
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
              onChange={handleChange}
              required
              sx={{ mb: 3 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: "#64748b", fontSize: 22 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        type="button"
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
              {loading ? "Logging in..." : "Login"}
            </Button>
          </Box>

          {/* Register Link */}
          <Typography
            color="text.secondary"
            sx={{ mt: 3, textAlign: "center" }}
          >
            Don't have an account?{" "}
            <Box
              component={Link}
              to="/ragister"
              sx={{
                color: "#2563eb",
                fontWeight: 600,
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Register Now
            </Box>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
