import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import Accountcircle from "@mui/icons-material/AccountCircle";
import PhoneIcon from "@mui/icons-material/Phone";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import { Link, useNavigate } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import GroupIcon from "@mui/icons-material/Group";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import LogoutIcon from "@mui/icons-material/Logout";
import ListItemButton from "@mui/material/ListItemButton";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Swal from "sweetalert2";
export default function AdminDrawer({ children }) {
  const [open, setopen] = useState(false);
  const navigate = useNavigate();

  const handlopen = (e) => {
    setopen(true);
  };

  const drawerwidth = open ? 240 : 65;

  const theme = useTheme();

  const mobile = useMediaQuery(theme.breakpoints.down("sm"));

  const menuitem = [
    { id: 1, text: "Users", icon: <GroupIcon />, to: "/admin/home" },
    {
      id: 2,
      text: "Product Link",
      icon: <Inventory2Icon />,
      to: "/admin/view-product",
    },
    {
      id:3,
      text : "Order",
      icon: <Inventory2Icon/>,
      to : "/admin/vieworder"
    },
    { id: 3, text: "LogOut", icon: <LogoutIcon /> },
  ];

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
        {menuitem.map((er) => (
          <>
            <ListItem key={er.id} component={Link} to={er.to}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
                onClick={() => {
                  if (er.text === "LogOut") {
                    handllogout();
                  }
                }}
              >
                <ListItemIcon
                  sx={{
                    mr: open ? 2 : "auto",
                    justifyContent: "center",
                    minHeight: 0,
                  }}
                >
                  {er.icon}
                </ListItemIcon>
                <ListItemText
                  primary={er.text}
                  sx={{
                    opacity: open ? 1 : 0,
                    whiteSpace: "nowrap",
                  }}
                />
              </ListItemButton>
            </ListItem>
          </>
        ))}
      </List>
    </>
  );
  return (
    <>
      <Box sx={{ display: "flex" }}>
        <AppBar
          position="fixed"
          sx={{
            width: mobile ? "100%" : `calc(100% - ${drawerwidth}px)`,
            ml: mobile ? 0 : `${drawerwidth}px`,
            transition: "all 0.3s",
          }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              onClick={() => setopen(!open)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h5">Welcome Admin</Typography>
          </Toolbar>
        </AppBar>

        <Drawer
          variant={mobile ? "temporary" : "permanent"}
          open={mobile ? open : true}
          onClose={() => setopen(false)}
          sx={{
            width: mobile ? 240 : drawerwidth,
            flexShrink: 0,

            "& .MuiDrawer-paper": {
              width: mobile ? 240 : drawerwidth,
              boxSizing: "border-box",
              overflowX: "hidden",
              transition: "width 0.3s",
            },
          }}
        >
          {Dr}
        </Drawer>

        {/* main content */}

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            // p: 3,
            widows: `calc(100%- ${drawerwidth})`,
          }}
        >
          <Toolbar />
          {children}
        </Box>
      </Box>
    </>
  );
}
