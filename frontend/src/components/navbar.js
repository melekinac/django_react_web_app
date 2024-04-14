import React, { useEffect, useState } from "react";
import {
  Box,
  Drawer,
  AppBar,
  CssBaseline,
  Toolbar,
  List,
  Typography,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Snackbar,
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import RoomIcon from "@mui/icons-material/Room";
import MenuIcon from "@mui/icons-material/Menu";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import AxiosInstance from "./axios";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Navbar(props) {
  const { drawerWidth, content } = props;
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const response = await AxiosInstance.get("/UserInfo/");
        setUserInfo(response.data);
      } catch (error) {
        console.error("Failed to retrieve user info:", error);
      }
    }

    fetchUserInfo();
  }, [navigate]);

  const logout = async () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    await setUserInfo(null);
    navigate("/login", { replace: true });
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  function MyDrawer() {
    return (
      <Box sx={{ overflow: "auto" }}>
        <Toolbar />
        <List>
          {userInfo && (
            <>
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to="/home"
                  selected={"/home" === location.pathname}
                >
                  <ListItemIcon>
                    <HomeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Home" />
                </ListItemButton>
              </ListItem>
              <Divider />
            </>
          )}

          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/meeting-room"
              selected={"/meeting-room" === location.pathname}
            >
              <ListItemIcon>
                <MeetingRoomIcon />
              </ListItemIcon>
              <ListItemText primary="Meeting Room" />
            </ListItemButton>
          </ListItem>
          <Divider />

          {userInfo && (userInfo.is_staff || userInfo.is_admin) && (
            <>
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to="/room"
                  selected={"/room" === location.pathname}
                >
                  <ListItemIcon>
                    <RoomIcon />
                  </ListItemIcon>
                  <ListItemText primary="Room" />
                </ListItemButton>
              </ListItem>
              <Divider />
            </>
          )}

          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to={userInfo ? "/" : "/login"}
              onClick={userInfo ? logout : null}
            >
              <ListItemIcon>
                {userInfo ? <LogoutIcon /> : <LoginIcon />}
              </ListItemIcon>
              <ListItemText primary={userInfo ? "Logout" : "Login"} />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={toggleDrawer}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Meeting Room Applications
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" },
        }}
      >
        <MyDrawer />
      </Drawer>
      <Drawer
        variant="temporary"
        open={open}
        onClose={toggleDrawer}
        sx={{
          display: { xs: "block", sm: "none" },
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" },
        }}
      >
        <MyDrawer />
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {content}
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {userInfo ? "Successfully logged out!" : "Logged in successfully!"}
        </Alert>
      </Snackbar>
    </Box>
  );
}
