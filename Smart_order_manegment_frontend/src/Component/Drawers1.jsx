
import React, { useEffect, useState } from "react";

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
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";

import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { Link, useLocation, useNavigate } from "react-router-dom";

import MenuIcon from "@mui/icons-material/Menu";
import GridViewIcon from "@mui/icons-material/GridView";
import InfoIcon from "@mui/icons-material/Info";
import PhoneIcon from "@mui/icons-material/Phone";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import LogoutIcon from "@mui/icons-material/Logout";
import WorkIcon from "@mui/icons-material/Work";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Swal from "sweetalert2";

export default function Drawers1({ children }) {
  // const [open, setOpen] = useState(true);
  const [open, setOpen] = useState(false);

  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));

  const navigate = useNavigate();
  const location = useLocation();

  const drawerWidth = open ? 260 : 76;

  useEffect(() => {
    if (mobile) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [mobile]);

  const menuItems = [
    {
      text: "Dashboard",
      icon: <GridViewIcon />,
      to: "/home",
    },
    {
      text: "About",
      icon: <InfoIcon />,
      to: "/about",
    },
    {
      text: "Contact",
      icon: <PhoneIcon />,
      to: "/contect",
    },
    {
      text: "Products",
      icon: <Inventory2Icon />,
      to: "/view-product",
    },
    {
      text: "My Orders",
      icon: <WorkIcon />,
      to: "/user/myorder",
    },
  ];

  const handleLogout = () => {
    Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to logout?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#4f46e5",
      cancelButtonColor: "#64748b",
      background: "#ffffff",
      color: "#172033",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("email");

        navigate("/");

        Swal.fire({
          title: "Logged Out",
          text: "You have successfully logged out.",
          icon: "success",
          confirmButtonColor: "#4f46e5",
        });
      }
    });
  };

  const handleWishlist = () => {
    navigate("/wishlist");
    if (mobile) setOpen(false);
  };

  const handleCart = () => {
    navigate("/cart");
    if (mobile) setOpen(false);
  };

  const handleMenuClick = () => {
    if (mobile) setOpen(false);
  };

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#111827",
        color: "#fff",
      }}
    >
      {/* Logo / Brand */}
      <Box
        sx={{
          minHeight: 90,
          display: "flex",
          alignItems: "center",
          justifyContent: open ? "flex-start" : "center",
          px: open ? 3 : 1,
          gap: 1.5,
        }}
      >
        <Avatar
          sx={{
            width: 42,
            height: 42,
            borderRadius: 2.5,
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            fontWeight: 800,
          }}
        >
          S
        </Avatar>

        {open && (
          <Box>
            <Typography fontWeight={800} fontSize={18}>
              Smart Order
            </Typography>
            <Typography fontSize={11} color="#9ca3af">
              MANAGEMENT SYSTEM
            </Typography>
          </Box>
        )}
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.09)" }} />

      {open && (
        <Typography
          sx={{
            px: 3,
            pt: 3,
            pb: 1.5,
            color: "#9ca3af",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 1.2,
          }}
        >
          MAIN MENU
        </Typography>
      )}

      <List sx={{ px: 1.5, pt: open ? 0 : 2, flexGrow: 1 }}>
        {menuItems.map((item) => {
          const active = location.pathname === item.to;

          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.8 }}>
              <Tooltip title={!open ? item.text : ""} placement="right">
                <ListItemButton
                  component={Link}
                  to={item.to}
                  onClick={handleMenuClick}
                  sx={{
                    minHeight: 50,
                    px: open ? 2 : 1,
                    justifyContent: open ? "flex-start" : "center",
                    borderRadius: 2.5,
                    color: active ? "#fff" : "#aeb8ca",
                    background: active
                      ? "linear-gradient(100deg, #4f46e5, #6366f1)"
                      : "transparent",
                    boxShadow: active
                      ? "0 6px 18px rgba(79,70,229,0.25)"
                      : "none",
                    "&:hover": {
                      background: active
                        ? "linear-gradient(100deg, #4f46e5, #6366f1)"
                        : "rgba(255,255,255,0.07)",
                      color: "#fff",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 2 : 0,
                      color: "inherit",
                      justifyContent: "center",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>

                  {open && (
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontSize: 14,
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

      {/* User Profile at Bottom */}
      <Box sx={{ px: 1.5, pb: 2 }}>
        <Divider sx={{ mb: 2, borderColor: "rgba(255,255,255,0.09)" }} />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            px: open ? 1 : 0,
            justifyContent: open ? "flex-start" : "center",
            mb: 1.5,
          }}
        >
          <Avatar
            sx={{
              width: 38,
              height: 38,
              bgcolor: "#312e81",
              color: "#c7d2fe",
            }}
          >
            <AccountCircleIcon />
          </Avatar>

          {open && (
            <Box sx={{ minWidth: 0 }}>
              <Typography
                fontSize={13}
                fontWeight={700}
                noWrap
                sx={{ color: "#fff" }}
              >
                {localStorage.getItem("username") || "User"}
              </Typography>
              <Typography fontSize={11} color="#9ca3af">
                Customer Account
              </Typography>
            </Box>
          )}
        </Box>

        <ListItemButton
          onClick={handleLogout}
          sx={{
            minHeight: 46,
            borderRadius: 2.5,
            color: "#fca5a5",
            justifyContent: open ? "flex-start" : "center",
            px: open ? 2 : 1,
            "&:hover": {
              bgcolor: "rgba(239,68,68,0.12)",
              color: "#f87171",
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: open ? 2 : 0,
              color: "inherit",
            }}
          >
            <LogoutIcon />
          </ListItemIcon>

          {open && (
            <ListItemText
              primary="Logout"
              primaryTypographyProps={{
                fontSize: 14,
                fontWeight: 600,
              }}
            />
          )}
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f7fc" }}>
      {/* Topbar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: mobile ? "100%" : `calc(100% - ${drawerWidth}px)`,
          ml: mobile ? 0 : `${drawerWidth}px`,
          bgcolor: "#ffffff",
          color: "#172033",
          borderBottom: "1px solid #e8ecf4",
          transition: "all 0.25s ease",
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ minHeight: "72px !important", px: { xs: 2, md: 3 } }}>
          <IconButton
            onClick={() => setOpen(!open)}
            sx={{
              mr: 2,
              color: "#475569",
              bgcolor: "#f1f5f9",
              borderRadius: 2,
              "&:hover": { bgcolor: "#e2e8f0" },
            }}
          >
            <MenuIcon />
          </IconButton>

          <Box>
            <Typography fontSize={18} fontWeight={800} color="#172033">
              My Dashboard
            </Typography>
            <Typography fontSize={11} color="#94a3b8">
              Welcome to your account
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <Tooltip title="Wishlist">
            <IconButton
              onClick={handleWishlist}
              sx={{
                mr: 1,
                color: "#64748b",
                bgcolor: "#f8fafc",
                borderRadius: 2,
                "&:hover": {
                  color: "#e11d48",
                  bgcolor: "#fff1f2",
                },
              }}
            >
              <FavoriteBorderIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Shopping Cart">
            <IconButton
              onClick={handleCart}
              sx={{
                color: "#64748b",
                bgcolor: "#f8fafc",
                borderRadius: 2,
                "&:hover": {
                  color: "#4f46e5",
                  bgcolor: "#eef2ff",
                },
              }}
            >
              <ShoppingCartOutlinedIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant={mobile ? "temporary" : "permanent"}
        open={mobile ? open : true}
        onClose={() => setOpen(false)}
        // ModalProps={{ keepMounted: true }}
        sx={{
          width: mobile ? 260 : drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: mobile ? 260 : drawerWidth,
            boxSizing: "border-box",
            border: "none",
            overflowX: "hidden",
            background: "#111827",
            transition: "width 0.25s ease",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          minHeight: "100vh",
          p: { xs: 2, sm: 3, md: 3.5 },
          pt: { xs: "88px", sm: "100px" },
          transition: "all 0.25s ease",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
