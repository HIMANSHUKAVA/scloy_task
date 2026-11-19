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

import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function Ragister() {
  const [deta, setdeta] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showpassword, setshowpassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Individual field validation
  const validateField = (name, value) => {
    switch (name) {
      case "username":
        if (!value.trim()) {
          return "Username is required";
        }

        if (value.trim().length < 3) {
          return "Username must be at least 3 characters";
        }

        if (!/^[a-zA-Z ]+$/.test(value.trim())) {
          return "Username can contain only letters and spaces";
        }

        return "";

      case "email":
        if (!value.trim()) {
          return "Email is required";
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          return "Please enter a valid email address";
        }

        return "";

      case "password":
        if (!value) {
          return "Password is required";
        }

        if (value.length < 8) {
          return "Password must contain at least 8 characters";
        }

        if (!/[A-Z]/.test(value)) {
          return "At least one uppercase letter is required";
        }

        if (!/[a-z]/.test(value)) {
          return "At least one lowercase letter is required";
        }

        if (!/[0-9]/.test(value)) {
          return "At least one number is required";
        }

        if (!/[^A-Za-z0-9]/.test(value)) {
          return "At least one special character is required";
        }

        return "";

      default:
        return "";
    }
  };

  // Handle input changes
  const handlchaneevent = (e) => {
    const { name, value } = e.target;

    setdeta((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));

    setError("");
  };

  // Validate all fields
  const validateForm = () => {
    const newErrors = {};

    Object.keys(deta).forEach((key) => {
      newErrors[key] = validateField(key, deta[key]);
    });

    setErrors(newErrors);

    return Object.values(newErrors).every((item) => item === "");
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        username: deta.username.trim(),
        email: deta.email.trim().toLowerCase(),
        password: deta.password,
      };

      const res = await axios.post(
        "http://localhost:5600/auth/ragister",
        payload,
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.data.role);
      localStorage.setItem("username", res.data.data.username);
      localStorage.setItem("email", res.data.data.email);

      setdeta({
        username: "",
        email: "",
        password: "",
      });

      setErrors({});

      Swal.fire({
        text: res.data.message,
        icon: "success",
        title: "Ragisterd",
      });

      navigate("/home");
    } catch (er) {
      Swal.fire({
        icon: "error",
        title: "Ragisterd Failed!",
        text: er.response?.data?.message || "Registration failed",
      });
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

          <Box component="form" onSubmit={handleSubmit} noValidate>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {/* Username */}

            <Typography fontWeight={600} sx={{ mb: 1 }}>
              Username
            </Typography>

            <TextField
              fullWidth
              name="username"
              placeholder="Enter your name"
              value={deta.username}
              onChange={handlchaneevent}
              error={Boolean(errors.username)}
              helperText={errors.username}
              required
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: "#64748b" }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ mb: 2.5 }}
            />

            {/* Email */}

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
              error={Boolean(errors.email)}
              helperText={errors.email}
              required
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: "#64748b" }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ mb: 2.5 }}
            />

            {/* Password */}

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
              error={Boolean(errors.password)}
              helperText={
                errors.password ||
                "Min 8 characters, uppercase, lowercase, number & special character"
              }
              required
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
              sx={{ mb: 3 }}
            />

            {/* Submit Button */}

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

          <Typography
            color="text.secondary"
            sx={{ mt: 3, textAlign: "center" }}
          >
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
