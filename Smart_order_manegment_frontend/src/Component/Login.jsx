import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "axios";

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

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(deta);

    axios
      .post("http://localhost:5600/auth/login-check", deta)
      .then((res) => {
        console.log(res.data);
        alert("login successfull");
        setdeta({
          email : "",
          password : ""
        })
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
<br /><br />
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
<br /><br />
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          Login
        </Button>
      </form>
    </>
  );
}
