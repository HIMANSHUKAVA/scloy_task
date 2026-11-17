import React, { useState } from "react";

import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";

import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Ragister() {
  const [deta, setdeta] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
  });

  const naviagate = useNavigate();
  const handlchaneevent = (e) => {
    setdeta({
      ...deta,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5600/auth/ragister", deta);

      alert("Form has been submitted");

      console.log(res.data);
      localStorage.setItem("token", res.data.token);

      localStorage.setItem("role", res.data.data.role);

      localStorage.setItem("username", res.data.data.username);

      localStorage.setItem("email", res.data.data.email);

      naviagate("/welcome");

      setdeta({
        username: "",
        email: "",
        password: "",
        role: "",
      });
    } catch (er) {
      console.log(er);
      alert(er.response?.data?.message || "Registration failed");
    }
  };

  return (
    <>
      <Typography variant="h4">Register Form</Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          name="username"
          label="Enter the name"
          value={deta.username}
          onChange={handlchaneevent}
          required
        />
        <br />
        <br />
        <TextField
          type="email"
          name="email"
          label="Enter the email"
          value={deta.email}
          onChange={handlchaneevent}
          required
        />
        <br />
        <br />
        <TextField
          type="password"
          name="password"
          label="Enter the password"
          value={deta.password}
          onChange={handlchaneevent}
          required
        />

        <br />
        <br />
        <FormControl>
          <InputLabel id="role-label">Select the role</InputLabel>

          <Select
            labelId="role-label"
            name="role"
            value={deta.role}
            label="Select the role"
            onChange={handlchaneevent}
            required
          >
            <MenuItem value="User">User</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
          </Select>
        </FormControl>
        <br />
        <br />
        <Button variant="outlined" type="submit">
          Submit
        </Button>
      </form>

      <Typography variant="body1" component={Link} to="/">
        Already Login
      </Typography>
    </>
  );
}
