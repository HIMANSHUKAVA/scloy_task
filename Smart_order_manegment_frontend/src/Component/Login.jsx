import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
export default function Login() {
  const [deta, setdeta] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setdeta({
      ...deta,
      [e.target.name]: e.target.value,
    });
  };

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(deta);

    axios
      .post("http://localhost:5600/auth/login-check", deta)
      .then((res) => {
        console.log(res.data);
        localStorage.setItem("token", res.data.token);

        localStorage.setItem("username", res.data.data.username);

        localStorage.setItem("email", res.data.data.email);
        alert("login successfull");
        navigate("/welcome");
        setdeta({
          email: "",
          password: "",
        });
      })
      .catch((er) => {
        console.log(er);
      });
  };

  return (
    <>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Login Form
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          // fullWidth
          margin="normal"
          type="email"
          name="email"
          label="Enter Email"
          value={deta.email}
          onChange={handleChange}
          required
        />
        <br />
        <br />
        <TextField
          // fullWidth
          margin="normal"
          type="password"
          name="password"
          label="Enter Password"
          value={deta.password}
          onChange={handleChange}
          required
        />
        <br />
        <br />
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          Login
        </Button>
      </form>

      <Typography variant="body1" component={Link} to="/ragister">
        Don't Haven Account
      </Typography>
    </>
  );
}
