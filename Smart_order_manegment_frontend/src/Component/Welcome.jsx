import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Link, useNavigate } from "react-router-dom";
export default function Welcome() {
  const [open, setopen] = useState(false);
  const [anchoel, setanchoel] = useState(null);
  const handlopen = (e) => {
    setanchoel(e.currentTarget);
  };

  const navigate = useNavigate();
  const handllogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    alert("you have successfully logout");
    navigate("/");
  };

  const handleMenuClick = (path) => {
    setanchoel(null);
    navigate(path);
  };
  return (
    <>
      <AppBar position="fixed" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Scaloy Technology
          </Typography>

          {/* Mobile Menu */}
          <Box sx={{ display: { xs: "block", md: "none" } }}>
            <IconButton color="inherit" onClick={handlopen}>
              <MenuIcon />
            </IconButton>

            <Menu
              anchorEl={anchoel}
              open={Boolean(anchoel)}
              onClose={() => setanchoel(null)}
            >
              <MenuItem onClick={() => handleMenuClick("/home")}>Home</MenuItem>

              <MenuItem onClick={() => handleMenuClick("/about")}>
                About
              </MenuItem>

              <MenuItem onClick={() => handleMenuClick("/contect")}>
                Contact
              </MenuItem>

              <MenuItem onClick={() => handleMenuClick("/logout")}>
                Logout
              </MenuItem>
            </Menu>
          </Box>
          {/* Desktop Menu */}
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <Button color="inherit" component={Link} to="/home">
              Home
            </Button>
            <Button color="inherit" component={Link} to="/about">
              About
            </Button>
            <Button color="inherit" component={Link} to="/contect">
              Contact
            </Button>
            <Button color="inherit" onClick={handllogout}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
}
