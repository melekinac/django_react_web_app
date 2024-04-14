import React, { useState, useEffect } from "react";
import { FormControl, Select, MenuItem, InputLabel } from "@mui/material";
import axios from "axios";

function MeetingRoomSelectBox({ onChange }) {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");

  useEffect(() => {
    async function fetchRooms() {
      try {
        const response = await axios.get("http://localhost:8000/Room");
        setRooms(response.data);
        if (response.data.length > 0) {
          setSelectedRoom(response.data[0].id.toString());

          onChange(response.data[0].id.toString());
        } else {
          setSelectedRoom("");
          onChange("");
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
        setSelectedRoom("");
        onChange("");
      }
    }
    fetchRooms();
  }, [onChange]);

  const handleRoomChange = (event) => {
    const selectedRoomId = event.target.value;
    setSelectedRoom(selectedRoomId);
    onChange(selectedRoomId);
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="room-select-label">Room</InputLabel>
      <Select
        labelId="room-select-label"
        id="room-select"
        value={selectedRoom || ""}
        onChange={handleRoomChange}
        label="Room"
      >
        {rooms.map((room) => (
          <MenuItem key={room.id} value={room.id}>
            {room.room_name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default MeetingRoomSelectBox;
