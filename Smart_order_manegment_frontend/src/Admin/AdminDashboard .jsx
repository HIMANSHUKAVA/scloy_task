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
import Collapse from "@mui/material/Collapse";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function AdminDashboard() {
  const navigate = useNavigate();

  // Mobile main menu
  const [anchorEl, setAnchorEl] = useState(null);

  // Desktop product menu
  const [productOpen, setProductOpen] = useState(null);

  // Mobile product submenu
  const [mobileProductOpen, setMobileProductOpen] = useState(false);

  // Open mobile menu
  const handleOpen = (e) => {
    setAnchorEl(e.currentTarget);
  };

  // Close mobile menu
  const handleClose = () => {
    setAnchorEl(null);
    setMobileProductOpen(false);
  };

  // Navigate from mobile menu
  const handleMenuClick = (path) => {
    handleClose();
    navigate(path);
  };

  // Desktop product menu
  const handleProductOpen = (e) => {
    setProductOpen(e.currentTarget);
  };

  const handleProductClose = () => {
    setProductOpen(null);
  };

  // Logout
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("email");

      navigate("/");
    }
  };

  // Reusable desktop product menu
  const ReusableMenu = ({ anchorEl, onClose }) => {
    return (
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onClose}
        MenuListProps={{
          onMouseLeave: onClose,
        }}
      >
        <MenuItem
          onClick={() => {
            onClose();
            navigate("/admin/add-product");
          }}
        >
          Add Product
        </MenuItem>

        <MenuItem
          onClick={() => {
            onClose();
            navigate("/admin/view-product");
          }}
        >
          View Products
        </MenuItem>
      </Menu>
    );
  };

  return (
    <>
      <AppBar position="fixed" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Welcome {localStorage.getItem("username")}
          </Typography>

          {/* Mobile Menu */}
          <Box sx={{ display: { xs: "block", md: "none" } }}>
            <IconButton color="inherit" onClick={handleOpen}>
              <MenuIcon />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => handleMenuClick("/admin/home")}>
                Users
              </MenuItem>

              {/* Mobile Product */}
              <MenuItem
                onClick={() => handleMenuClick("/admin/view-product")}
              >
                Product Link
              </MenuItem>

              {/* <Collapse in={mobileProductOpen} unmountOnExit timeout="auto">
                <MenuItem
                  sx={{ pl: 4 }}
                  onClick={() => handleMenuClick("/admin/add-product")}
                >
                  Add Product
                </MenuItem>
                <MenuItem
                  sx={{ pl: 4 }}
                  onClick={() => handleMenuClick("/admin/view-product")}
                >
                  View Product
                </MenuItem>
              </Collapse> */}

              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>

          {/* Desktop Menu */}
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <Button color="inherit" component={Link} to="/admin/home">
              Users
            </Button>

            <Button color="inherit" component={Link} to="/admin/view-product">
              Product Link
            </Button>

            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>

            {/* <ReusableMenu anchorEl={productOpen} onClose={handleProductClose} /> */}
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
}
