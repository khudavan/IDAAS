// src/components/AppLayout.jsx
import { useState } from "react";
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Button,
  Divider,
  Tooltip,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PersonIcon from "@mui/icons-material/Person";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate, useLocation } from "react-router-dom"; 
import { useAuth } from "../context/AuthContext";

const drawerWidth = 240;

export default function AppLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();   
  const { logout, user } = useAuth();

  const menu = [
    { text: "Dashboard", icon: <DashboardIcon />, to: "/dashboard" },
    { text: "Alerts", icon: <NotificationsIcon />, to: "/alerts" },
    { text: "Profile", icon: <PersonIcon />, to: "/profile" },
  ];

  const drawer = (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Toolbar />
      <List sx={{ flexGrow: 1 }}>
        {menu.map((m) => {
          const active = location.pathname === m.to;  
          return (
            <ListItem key={m.text} disablePadding>
              <Tooltip title={m.text} placement="right" arrow>
                <ListItemButton
                  onClick={() => {
                    navigate(m.to);
                    setMobileOpen(false);
                  }}
                  sx={{
                    borderRadius: "12px",
                    mx: 1,
                    my: 0.5,
                    transition: "0.3s",
                    bgcolor: active ? "primary.main" : "transparent",  
                    color: active ? "white" : "inherit",
                    "&:hover": {
                      bgcolor: active ? "primary.dark" : "primary.light",
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: active ? "white" : "primary.main",  
                    }}
                  >
                    {m.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={m.text}
                    primaryTypographyProps={{
                      fontWeight: active ? 700 : 500,   
                      fontSize: "0.95rem",
                    }}
                  />
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ my: 1 }} />

      <Box px={2} py={2}>
        <Button
          startIcon={<LogoutIcon />}
          fullWidth
          variant="contained"
          color="error"
          sx={{
            textTransform: "none",
            borderRadius: "12px",
            fontWeight: 600,
            py: 1.2,
            transition: "0.3s",
            "&:hover": { transform: "scale(1.05)" },
          }}
          onClick={() => {
            logout();
            navigate("/");
          }}
        >
          Logout
        </Button>
      </Box>
    </div>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "grey.50" }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          borderBottom: "1px solid rgba(0,0,0,0.08)",
          bgcolor: "white",
          color: "text.primary",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setMobileOpen(!mobileOpen)}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            IDaaS — Main App
          </Typography>
          {user && (
            <Typography
              variant="body2"
              sx={{
                bgcolor: "primary.light",
                px: 2,
                py: 0.5,
                borderRadius: "8px",
                fontWeight: 500,
              }}
            >
              {user.username || user.name || user.email.split("@")[0]}
            </Typography>
          )}
        </Toolbar>
      </AppBar>

    
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="sidebar"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              borderRight: "1px solid rgba(0,0,0,0.08)",
            },
          }}
        >
          {drawer}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              borderRight: "1px solid rgba(0,0,0,0.08)",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          transition: "0.3s",
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
