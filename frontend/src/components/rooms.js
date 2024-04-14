import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const AxiosInstance = axios.create({
  baseURL: "http://localhost:8000/",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

function Room() {
  const [mydata, setMyData] = useState([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomCapacity, setNewRoomCapacity] = useState("");
  const [editRoom, setEditRoom] = useState(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = () => {
    AxiosInstance.get("Room/")
      .then((response) => setMyData(response.data))
      .catch((error) => console.error("Error fetching data:", error));
  };

  const handleAddRoom = () => {
    const newRoom = {
      room_name: newRoomName,
      room_capacity: parseInt(newRoomCapacity, 10),
    };
    AxiosInstance.post("Room/", newRoom)
      .then((response) => {
        setMyData((prevData) => [...prevData, response.data]);
        setOpen(false);
        setNewRoomName("");
        setNewRoomCapacity("");
      })
      .catch((error) => console.error("Error adding room:", error));
  };

  const handleEditRoomInit = (rowData) => {
    setEditRoom(rowData);
    setNewRoomName(rowData.room_name);
    setNewRoomCapacity(rowData.room_capacity.toString());
    setEditOpen(true);
  };
  const handleEditRoom = () => {
    if (editRoom) {
      const updatedRoom = {
        room_name: newRoomName,
        room_capacity: parseInt(newRoomCapacity, 10),
      };

      const roomId = editRoom.id;

      AxiosInstance.put(`Room/${roomId}/`, updatedRoom)
        .then((response) => {
          const { id, room_url, room_name, room_capacity } = response.data;
          const updatedData = {
            id,
            room_url: room_url.startsWith("/")
              ? `http://localhost:8000${room_url}`
              : room_url,
            room_name,
            room_capacity,
          };
          setMyData(
            mydata.map((room) => (room.id === editRoom.id ? updatedData : room))
          );
          handleClose();
        })
        .catch((error) => console.error("Error updating room:", error));
    } else {
      console.error("No room selected for editing.");
    }
  };
  const handleDeleteRoom = (rowData) => {
    const roomId = rowData.id;
    console.log(roomId);
    AxiosInstance.delete(`Room/${roomId}/`)
      .then(() => {
        setMyData(mydata.filter((room) => room.id !== roomId));
        handleClose();
      })
      .catch((error) => {
        console.error("Error deleting room:", error);
        if (error.response && error.response.status === 404) {
          alert("Room not found. It may have already been deleted.");
        } else {
          alert("An unexpected error occurred. Please try again.");
        }
      });
  };

  const handleClose = () => {
    setOpen(false);
    setEditOpen(false);
    setEditRoom(null);
    setNewRoomName("");
    setNewRoomCapacity("");
  };

  const columns = [
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      width: 200,
      renderCell: (params) => (
        <Box>
          <IconButton onClick={() => handleEditRoomInit(params.row)}>
            <EditIcon sx={{ color: "orange" }} />
          </IconButton>
          <IconButton onClick={() => handleDeleteRoom(params.row)}>
            <DeleteIcon sx={{ color: "red" }} />
          </IconButton>
        </Box>
      ),
    },
    { field: "room_name", headerName: "Room Name", width: 500 },
    { field: "room_capacity", headerName: "Capacity", width: 500 },
  ];

  return (
    <div style={{ height: 400, width: "100%" }}>
      <IconButton
        onClick={() => setOpen(true)}
        color="primary"
        aria-label="add"
      >
        <AddIcon />
      </IconButton>
      <DataGrid
        rows={mydata}
        columns={columns}
        pageSize={5}
        getRowId={(row) => row.room_url}
      />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Room</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Room Name"
            type="text"
            fullWidth
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Capacity"
            type="number"
            fullWidth
            value={newRoomCapacity}
            onChange={(e) => setNewRoomCapacity(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddRoom}>Add</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editOpen} onClose={handleClose}>
        <DialogTitle>Edit Room</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Room Name"
            type="text"
            fullWidth
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Capacity"
            type="number"
            fullWidth
            value={newRoomCapacity}
            onChange={(e) => setNewRoomCapacity(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleEditRoom}>Save Changes</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Room;
