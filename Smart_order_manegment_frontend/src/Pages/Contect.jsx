import React, { useState } from "react";
import Drawers1 from "../Component/Drawers1";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import axios from "axios";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import ContactSupportOutlinedIcon from "@mui/icons-material/ContactSupportOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SubjectOutlinedIcon from "@mui/icons-material/SubjectOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";

export default function Contect() {
  // LocalStorage se user details
  const savedName =
    localStorage.getItem("username") || localStorage.getItem("name") || "";

  const savedEmail = localStorage.getItem("email") || "";

  const [formData, setFormData] = useState({
    name: savedName,
    email: savedEmail,
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Input change
  const HandleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // Validation
  const ValidateForm = () => {
    let newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Please enter your name";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Please enter a subject";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Please enter your message";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must contain at least 10 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Submit form

  const HandleSubmit = async (e) => {
    e.preventDefault();

    if (!ValidateForm()) return;

    setLoading(true);

    const payload = {
      userid: localStorage.getItem("userId"),
      email: formData.email.trim(),
      subject: formData.subject.trim(),
      message: formData.message.trim(),
    };

    console.log("Sending Payload:", payload);

    try {
      const token = localStorage.getItem("token");


      const response = await axios.post(
        "http://localhost:5600/contect/user/contect/add",
        {
          payload,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      Swal.fire({
        title: "Message Submitted!",
        text:
          response.data.message ||
          "Your message has been submitted successfully.",
        icon: "success",
        confirmButtonColor: "#253b80",
      });

      setFormData((prev) => ({
        ...prev,
        subject: "",
        message: "",
      }));

      setErrors({});
    } catch (error) {
      console.log("STATUS:", error.response?.status);
      console.log("BACKEND ERROR:", error.response?.data);

      Swal.fire({
        title: "Something went wrong!",
        text: error.response?.data?.message || "Unable to submit your message.",
        icon: "error",
        confirmButtonColor: "#253b80",
      });
    } finally {
      setLoading(false);
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <Drawers1>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#f5f7fc",
          pt: { xs: 10, md: 12 },
          px: { xs: 2, sm: 3, md: 4 },
          pb: 6,
        }}
      >
        <Box sx={{ maxWidth: 1450, mx: "auto" }}>
          {/* Page Heading */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" fontWeight={850} color="#172554">
                Contact Us
              </Typography>

              <Typography color="text.secondary" sx={{ mt: 0.8 }}>
                Have a question? Send us a message. We're happy to help.
              </Typography>
            </Box>
          </motion.div>

          <Grid container spacing={3} alignItems="stretch">
            {/* Left Information Section */}
            <Grid size={{ xs: 12, md: 5 }}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                style={{ height: "100%" }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    height: "100%",
                    minHeight: { xs: 350, md: 570 },
                    borderRadius: 4,
                    p: { xs: 3, md: 4 },
                    color: "#fff",
                    overflow: "hidden",
                    position: "relative",
                    background:
                      "linear-gradient(145deg,#172554 0%,#253b80 55%,#536dce 100%)",
                  }}
                >
                  {/* Decorative circles */}
                  <Box
                    sx={{
                      position: "absolute",
                      width: 250,
                      height: 250,
                      borderRadius: "50%",
                      border: "1px solid rgba(255,255,255,0.12)",
                      top: -100,
                      right: -80,
                    }}
                  />

                  <Box
                    sx={{
                      position: "absolute",
                      width: 180,
                      height: 180,
                      borderRadius: "50%",
                      bgcolor: "rgba(255,255,255,0.06)",
                      bottom: -70,
                      left: -60,
                    }}
                  />

                  <Box sx={{ position: "relative", zIndex: 1 }}>
                    <Avatar
                      sx={{
                        width: 75,
                        height: 75,
                        bgcolor: "rgba(255,255,255,0.15)",
                        mb: 3,
                      }}
                    >
                      <ContactSupportOutlinedIcon sx={{ fontSize: 40 }} />
                    </Avatar>

                    <Typography
                      variant="h4"
                      fontWeight={850}
                      sx={{ mb: 2, lineHeight: 1.3 }}
                    >
                      Let's Talk!
                      <br />
                      We're Here For You.
                    </Typography>

                    <Typography
                      sx={{
                        color: "#dbe5ff",
                        lineHeight: 1.9,
                        fontSize: 14,
                        mb: 5,
                      }}
                    >
                      Whether you have questions about products, orders, or your
                      shopping experience, send us a message. We'll be glad to
                      help.
                    </Typography>

                    <Divider
                      sx={{
                        borderColor: "rgba(255,255,255,0.2)",
                        mb: 3,
                      }}
                    />

                    <Stack spacing={3}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar
                          sx={{
                            bgcolor: "rgba(255,255,255,0.15)",
                            width: 45,
                            height: 45,
                          }}
                        >
                          <SupportAgentOutlinedIcon />
                        </Avatar>

                        <Box>
                          <Typography fontWeight={750}>
                            Customer Support
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: "#dbe5ff" }}
                          >
                            We're here to assist you
                          </Typography>
                        </Box>
                      </Stack>

                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar
                          sx={{
                            bgcolor: "rgba(255,255,255,0.15)",
                            width: 45,
                            height: 45,
                          }}
                        >
                          <ShoppingBagOutlinedIcon />
                        </Avatar>

                        <Box>
                          <Typography fontWeight={750}>
                            Order Assistance
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: "#dbe5ff" }}
                          >
                            Get help with your orders
                          </Typography>
                        </Box>
                      </Stack>

                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar
                          sx={{
                            bgcolor: "rgba(255,255,255,0.15)",
                            width: 45,
                            height: 45,
                          }}
                        >
                          <EmailOutlinedIcon />
                        </Avatar>

                        <Box>
                          <Typography fontWeight={750}>
                            Email Support
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: "#dbe5ff" }}
                          >
                            Send us your queries
                          </Typography>
                        </Box>
                      </Stack>
                    </Stack>
                  </Box>
                </Paper>
              </motion.div>
            </Grid>

            {/* Contact Form */}
            <Grid size={{ xs: 12, md: 7 }}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 4,
                    p: { xs: 2.5, sm: 3.5, md: 4 },
                    border: "1px solid #e7ebf3",
                    bgcolor: "#fff",
                  }}
                >
                  <Typography variant="h5" fontWeight={850} color="#172554">
                    Send Us a Message
                  </Typography>

                  <Typography
                    color="text.secondary"
                    fontSize={13}
                    sx={{ mt: 0.8, mb: 3 }}
                  >
                    Fill in the details below to contact our team.
                  </Typography>

                  <Box component="form" onSubmit={HandleSubmit}>
                    <Stack spacing={2.5}>
                      {/* Name */}
                      <Box>
                        <Typography
                          fontWeight={700}
                          fontSize={13}
                          sx={{ mb: 1, color: "#334155" }}
                        >
                          Full Name
                        </Typography>

                        <TextField
                          fullWidth
                          name="name"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={HandleChange}
                          error={!!errors.name}
                          helperText={errors.name}
                          InputProps={{
                            startAdornment: (
                              <AccountCircleOutlinedIcon
                                sx={{ color: "#64748b", mr: 1 }}
                              />
                            ),
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2.5,
                              bgcolor: "#fafbff",
                            },
                          }}
                        />
                      </Box>

                      {/* Email */}
                      <Box>
                        <Typography
                          fontWeight={700}
                          fontSize={13}
                          sx={{ mb: 1, color: "#334155" }}
                        >
                          Email Address
                        </Typography>

                        <TextField
                          fullWidth
                          name="email"
                          type="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={HandleChange}
                          error={!!errors.email}
                          helperText={errors.email}
                          InputProps={{
                            startAdornment: (
                              <EmailOutlinedIcon
                                sx={{ color: "#64748b", mr: 1 }}
                              />
                            ),
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2.5,
                              bgcolor: "#fafbff",
                            },
                          }}
                        />
                      </Box>

                      {/* Subject */}
                      <Box>
                        <Typography
                          fontWeight={700}
                          fontSize={13}
                          sx={{ mb: 1, color: "#334155" }}
                        >
                          Subject
                        </Typography>

                        <TextField
                          fullWidth
                          name="subject"
                          placeholder="What is your query about?"
                          value={formData.subject}
                          onChange={HandleChange}
                          error={!!errors.subject}
                          helperText={errors.subject}
                          InputProps={{
                            startAdornment: (
                              <SubjectOutlinedIcon
                                sx={{ color: "#64748b", mr: 1 }}
                              />
                            ),
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2.5,
                              bgcolor: "#fafbff",
                            },
                          }}
                        />
                      </Box>

                      {/* Message */}
                      <Box>
                        <Typography
                          fontWeight={700}
                          fontSize={13}
                          sx={{ mb: 1, color: "#334155" }}
                        >
                          Your Message
                        </Typography>

                        <TextField
                          fullWidth
                          multiline
                          rows={5}
                          name="message"
                          placeholder="Write your message here..."
                          value={formData.message}
                          onChange={HandleChange}
                          error={!!errors.message}
                          helperText={errors.message}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2.5,
                              bgcolor: "#fafbff",
                            },
                          }}
                        />

                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: "block", textAlign: "right", mt: 0.5 }}
                        >
                          {formData.message.length} characters
                        </Typography>
                      </Box>

                      {/* Submit */}
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loading}
                        endIcon={<SendOutlinedIcon />}
                        sx={{
                          py: 1.6,
                          borderRadius: 2.5,
                          fontWeight: 800,
                          fontSize: 15,
                          textTransform: "none",
                          background: "linear-gradient(135deg,#253b80,#536dce)",
                          boxShadow: "0 8px 20px rgba(37,59,128,0.2)",
                          "&:hover": {
                            background:
                              "linear-gradient(135deg,#192c65,#4059b4)",
                          },
                        }}
                      >
                        {loading ? "Submitting..." : "Send Message"}
                      </Button>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                        textAlign="center"
                      >
                        Thank you for getting in touch with us.
                      </Typography>
                    </Stack>
                  </Box>
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Drawers1>
  );
}
