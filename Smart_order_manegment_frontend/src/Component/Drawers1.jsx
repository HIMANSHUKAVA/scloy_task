import React, { useState } from "react";

import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { Link, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import GridViewIcon from "@mui/icons-material/GridView";
import InfoIcon from "@mui/icons-material/Info";
import PhoneIcon from "@mui/icons-material/Phone";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import LogoutIcon from "@mui/icons-material/Logout";
import Swal from "sweetalert2";

export default function Drawers1({ children }) {
  const [open, setopen] = useState(true);

  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));

  const drawerWidth = open ? 240 : 65;

  const menuItems = [
    { text: "Dashboard", icon: <GridViewIcon />, to: "/home" },
    { text: "About", icon: <InfoIcon />, to: "/about" },
    { text: "Contact", icon: <PhoneIcon />, to: "/contect" },
    { text: "Products", icon: <Inventory2Icon />, to: "/view-product" },
    { text: "LOG OUT", icon: <LogoutIcon /> },
  ];

  const navigate = useNavigate();

  const handllogout = () => {
    Swal.fire({
      title: "log-out",
      text: "you have successfully logout",
      icon: "success",
    });
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    navigate("/");
  };
  const Dr = (
    <>
      <Toolbar />

      <List>
        {menuItems.map((item, index) => (
          <ListItem key={index} disablePadding component={Link} to={item.to}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
              onClick={() => {
                if (item.text == "LOG OUT") {
                  handllogout();
                }
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 2 : "auto",
                  justifyContent: "center",
                }}
              >
                {item.icon}
              </ListItemIcon>

              <ListItemText
                primary={item.text}
                sx={{
                  opacity: open ? 1 : 0,
                  whiteSpace: "nowrap",
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );

  return (
    <Box sx={{ display: "flex" }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: mobile ? "100%" : `calc(100% - ${drawerWidth}px)`,
          ml: mobile ? 0 : `${drawerWidth}px`,
          transition: "all 0.3s",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setopen(!open)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6">My Dashboard</Typography>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer
        variant={mobile ? "temporary" : "permanent"}
        open={mobile ? open : true}
        onClose={() => setopen(false)}
        sx={{
          width: mobile ? 240 : drawerWidth,
          flexShrink: 0,

          "& .MuiDrawer-paper": {
            width: mobile ? 240 : drawerWidth,
            boxSizing: "border-box",
            overflowX: "hidden",
            transition: "width 0.3s",
          },
        }}
      >
        {Dr}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 2,
          width: 0,
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
