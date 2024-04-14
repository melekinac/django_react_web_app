import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import Login from "./login";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/navbar";
import { Box } from "@mui/material";
import MeetingRoom from "./components/meeting_rooms.js";
import Delete from "./components/Delete.js";
import Room from "./components/rooms.js";

function App() {
  return (
    <AuthProvider>
      <Navbar drawerWidth={240} />
      <Box component="main" sx={{ pt: 8, pl: 30 }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/room" element={<Room />} />
          <Route path="/meeting-room" element={<MeetingRoom />} />
          <Route path="/meeting-room/delete/:id" element={<Delete />} />
          <Route path="/" element={<Navigate replace to="/home" />} />
        </Routes>
      </Box>
    </AuthProvider>
  );
}

export default App;
