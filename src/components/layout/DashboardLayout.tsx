"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { logoutUser } from "@/store/slices/authSlice";
import { UserRole } from "@/types/auth";
import {
  AccountCircle,
  Add,
  Assessment,
  ContactMail,
  Dashboard,
  Event,
  Group,
  Image,
  Logout,
  Menu as MenuIcon,
  People,
  PhotoLibrary,
  Settings,
} from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Box,
  Chip,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";

const drawerWidth = 280;

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface NavigationItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  roles?: UserRole[];
}

const navigationItems: NavigationItem[] = [
  { label: "Dashboard", icon: <Dashboard />, path: "/dashboard" },
  { label: "Artists", icon: <People />, path: "/artists" },
  { label: "Artworks", icon: <Image />, path: "/artworks" },
  { label: "Galleries", icon: <PhotoLibrary />, path: "/galleries" },
  { label: "Contacts", icon: <ContactMail />, path: "/contacts" },
  { label: "Staff", icon: <Group />, path: "/staff" },
  { label: "Events", icon: <Event />, path: "/events" },
  { label: "Reports", icon: <Assessment />, path: "/reports" },
  {
    label: "Users",
    icon: <People />,
    path: "/users",
    roles: [UserRole.ADMIN],
  },
  { label: "Settings", icon: <Settings />, path: "/settings" },
];

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, role } = useAppSelector((state) => state.auth);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.push("/auth");
    handleClose();
  };

  const handleProfile = () => {
    router.push("/account/profile");
    handleClose();
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return "error";
      case UserRole.GALLERY_MANAGER:
        return "primary";
      case UserRole.ARTIST:
        return "secondary";
      case UserRole.VIEWER:
        return "default";
      default:
        return "default";
    }
  };

  const drawer = (
    <Box>
      <Box
        sx={{
          p: 3,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          textAlign: "center",
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          ArtCloud
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          Gallery Management
        </Typography>
      </Box>

      <Box sx={{ p: 2 }}>
        {user && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              p: 2,
              backgroundColor: "rgba(0,0,0,0.02)",
              borderRadius: 2,
              mb: 2,
            }}
          >
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: "primary.main",
              }}
            >
              {user?.firstName?.charAt(0)}
              {user?.lastName?.charAt(0)}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="subtitle2" noWrap>
                {user.firstName} {user.lastName}
              </Typography>
              <Chip
                label={user?.role?.replace("_", " ").toLowerCase()}
                size="small"
                color={getRoleColor(user.role) as any}
                sx={{ mt: 0.5 }}
              />
            </Box>
          </Box>
        )}
      </Box>

      <Divider />

      <List sx={{ px: 1 }}>
        {navigationItems.map((item) => {
          // Check if user has required role for this item
          if (item.roles && user && !item.roles.includes(user.role)) {
            return null;
          }

          return (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: 2,
                  mx: 1,
                  my: 0.5,
                  "&:hover": {
                    backgroundColor: "primary.lighter",
                  },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          width: { lg: `calc(100% - ${drawerWidth}px)` },
          ml: { lg: `${drawerWidth}px` },
          backgroundColor: "white",
          color: "text.primary",
          boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { lg: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>

          <IconButton
            size="large"
            aria-label="add new"
            color="inherit"
            sx={{ mr: 1 }}
          >
            <Add />
          </IconButton>

          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>

          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleProfile}>
              <AccountCircle sx={{ mr: 1 }} />
              Profile
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { lg: drawerWidth }, flexShrink: { lg: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", lg: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", lg: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
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
          width: { lg: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
          backgroundColor: "#f8fafc",
          minHeight: "calc(100vh - 64px)",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
