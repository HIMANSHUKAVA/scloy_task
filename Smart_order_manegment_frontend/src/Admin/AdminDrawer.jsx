
import React, { useState } from "react";
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import useMediaQuery from '@mui/material/useMediaQuery';
import Badge from '@mui/material/Badge';
import InputBase from '@mui/material/InputBase';
import { useTheme } from "@mui/material/styles";
import { Link, useNavigate, useLocation } from "react-router-dom";

import MenuIcon from "@mui/icons-material/Menu";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import PhoneIcon from '@mui/icons-material/Phone';
import Swal from "sweetalert2";
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

const drawerWidth = 260;
const collapsedWidth = 82;

export default function AdminDrawer({ children }) {
  const [expanded, setExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("md"));

  const navigate = useNavigate();
  const location = useLocation();

  const username = localStorage.getItem("username") || "Admin";

  const menuItems = [
    {
      text: "Dashboard",
      icon: <DashboardRoundedIcon />,
      to: "/admin/home",
    },
    {
      text: "Products",
      icon: <Inventory2RoundedIcon />,
      to: "/admin/view-product",
    },
    {
      text: "Orders",
      icon: <ShoppingBagRoundedIcon />,
      to: "/admin/vieworder",
    },
    {
      text : "Contects",
      icon: <PhoneIcon/>,
      to:"/admin/contectsreq"
    },
    {
      text : "Users",
      icon: <PeopleAltIcon/>,
      to : "/admin/viewuser"
    }
  ];

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("email");

      navigate("/");

      Swal.fire({
        title: "Logged Out",
        text: "You have successfully logged out.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  const currentWidth = mobile
    ? drawerWidth
    : expanded
      ? drawerWidth
      : collapsedWidth;

  const sidebarContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#111827",
        color: "#fff",
      }}
    >
      {/* Logo */}

      <Box
        sx={{
          height: 76,
          display: "flex",
          alignItems: "center",
          px: 2.5,
          gap: 1.5,
        }}
      >
        <Avatar
          variant="rounded"
          sx={{
            width: 42,
            height: 42,
            bgcolor: "#4f46e5",
            borderRadius: 2.5,
          }}
        >
          <DashboardRoundedIcon />
        </Avatar>

        {(expanded || mobile) && (
          <Box>
            <Typography fontWeight={800} fontSize={18}>
              Order<span style={{ color: "#818cf8" }}>Flow</span>
            </Typography>

            <Typography fontSize={10} color="#9ca3af">
              ADMINISTRATION
            </Typography>
          </Box>
        )}

        {!mobile && (
          <Box sx={{ flexGrow: 1 }} />
        )}

        {mobile && (
          <IconButton
            onClick={() => setMobileOpen(false)}
            sx={{ color: "#fff", ml: "auto" }}
          >
            <ChevronLeftRoundedIcon />
          </IconButton>
        )}
      </Box>

      <Divider sx={{ borderColor: "#293548" }} />

      {/* Admin Profile */}



      {/* Navigation */}

      <Box sx={{ px: 1.5, mt: 1 }}>
        {(expanded || mobile) && (
          <Typography
            sx={{
              px: 1.5,
              mb: 1.5,
              color: "#64748b",
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: 1.5,
            }}
          >
            MAIN MENU
          </Typography>
        )}

        <List disablePadding>
          {menuItems.map((item) => {
            const active = location.pathname === item.to;

            return (
              <ListItem
                key={item.to}
                disablePadding
                sx={{ mb: 0.8 }}
              >
                <Tooltip
                  title={!expanded && !mobile ? item.text : ""}
                  placement="right"
                >
                  <ListItemButton
                    component={Link}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    sx={{
                      minHeight: 49,
                      borderRadius: 2.5,
                      px: 1.8,
                      color: active ? "#fff" : "#9ca3af",
                      background: active
                        ? "linear-gradient(100deg, #4f46e5, #6366f1)"
                        : "transparent",

                      justifyContent:
                        expanded || mobile ? "initial" : "center",

                      "&:hover": {
                        background: active
                          ? "#4f46e5"
                          : "#1f2937",
                        color: "#fff",
                      },

                      transition: "all 0.2s",
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: "inherit",
                        minWidth: 0,
                        mr: expanded || mobile ? 2 : 0,
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>

                    {(expanded || mobile) && (
                      <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{
                          fontSize: 13,
                          fontWeight: active ? 700 : 500,
                        }}
                      />
                    )}
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            );
          })}
        </List>
      </Box>

      <Box sx={{ flexGrow: 1 }} />

      {/* Logout */}

      <Divider sx={{ borderColor: "#293548" }} />

      <Box sx={{ p: 1.5 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2.5,
            color: "#f87171",
            minHeight: 48,
            justifyContent:
              expanded || mobile ? "initial" : "center",
            px: 1.8,
            "&:hover": {
              background: "#3f1d25",
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: expanded || mobile ? 2 : 0,
              color: "inherit",
            }}
          >
            <LogoutRoundedIcon />
          </ListItemIcon>

          {(expanded || mobile) && (
            <ListItemText
              primary="Logout"
              primaryTypographyProps={{
                fontSize: 13,
                fontWeight: 600,
              }}
            />
          )}
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>

      {/* Top Navbar */}

      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: mobile
            ? "100%"
            : `calc(100% - ${currentWidth}px)`,

          ml: mobile ? 0 : `${currentWidth}px`,

          background: "#ffffff",
          color: "#111827",
          borderBottom: "1px solid #e5e7eb",

          transition: "all 0.25s",
        }}
      >
        <Toolbar sx={{ minHeight: "76px !important", px: 3 }}>
          <IconButton
            onClick={() => {
              if (mobile) {
                setMobileOpen(true);
              } else {
                setExpanded(!expanded);
              }
            }}
            sx={{ mr: 2, color: "#374151" }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ flexGrow: 1 }}>
            <Typography
              fontWeight={800}
              fontSize={{ xs: 16, sm: 19 }}
              color="#111827"
            >
              Welcome back, {username}
            </Typography>

            <Typography
              fontSize={11}
              color="#9ca3af"
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              Manage your business from one place
            </Typography>
          </Box>

          {/* Search */}

          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              alignItems: "center",
              bgcolor: "#f3f4f6",
              px: 1.5,
              py: 0.8,
              borderRadius: 2,
              mr: 2,
              width: 190,
            }}
          >
            <SearchRoundedIcon
              sx={{ color: "#9ca3af", fontSize: 20 }}
            />

            <InputBase
              placeholder="Search..."
              sx={{ ml: 1, fontSize: 13, width: "100%" }}
            />
          </Box>

          {/* Notifications */}

          <IconButton sx={{ color: "#64748b", mr: 1 }} onClick={()=>{
            navigate("/admin/notification")
          }}>
            <Badge color="error" variant="dot">
              <NotificationsNoneRoundedIcon />
            </Badge>
          </IconButton>

          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: "#4f46e5",
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            {username.charAt(0).toUpperCase()}
          </Avatar>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}

      <Drawer
        variant={mobile ? "temporary" : "permanent"}
        open={mobile ? mobileOpen : true}
        onClose={() => setMobileOpen(false)}
        sx={{
          width: mobile ? drawerWidth : currentWidth,
          flexShrink: 0,

          "& .MuiDrawer-paper": {
            width: mobile ? drawerWidth : currentWidth,
            boxSizing: "border-box",
            border: "none",
            overflowX: "hidden",
            transition: "width 0.25s",
          },
        }}
      >
        {sidebarContent}
      </Drawer>

      {/* Main Content */}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          minHeight: "100vh",
          background: "#f8fafc",
          transition: "all 0.25s",
        }}
      >
        <Toolbar sx={{ minHeight: "76px !important" }} />

        {children}
      </Box>
    </Box>
  );
}
