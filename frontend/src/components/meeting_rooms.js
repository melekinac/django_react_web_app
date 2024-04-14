import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import MeetingRoomSelectBox from "./form/meeting_room_selectbox";
import MeetingRoomDateBox from "./form/meeting_room_datebox";
import { useForm } from "react-hook-form";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import MeetingRoomTextbox from "./form/meeting_room_textbox";
import axios from "axios"; // Make sure this import is correct. You might have used a specific instance you created.
import { Controller } from "react-hook-form";

const schema = yup
  .object({
    booking_start_time: yup.date().required("Start Date Required Field"),
    booking_end_time: yup.date().required("End Date Required Field"),
  })
  .required();

function MeetingRoom() {
  const navigate = useNavigate();
  const [selectedRoom, setSelectedRoom] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      booking_room: "",
      booking_start_time: "",
      booking_end_time: "",
      booking_attendee: "",
    },
    resolver: yupResolver(schema),
  });

  const handleRoomChange = (selectedRoom) => {
    setSelectedRoom(selectedRoom);
  };

  const checkAvailability = async (data) => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/bookings/check-availability",
        {
          params: {
            room: data.booking_room,
            start_time: data.booking_start_time,
            end_time: data.booking_end_time,
          },
        }
      );
      return response.data.isAvailable;
    } catch (error) {
      console.error("Availability check failed:", error);
      return false; // Assume unavailable if there is an error
    }
  };

  const submission = async (data) => {
    const payload = {
      booking_room: selectedRoom,
      booking_start_time: dayjs(data.booking_start_time).toISOString(),
      booking_end_time: dayjs(data.booking_end_time).toISOString(),
      booking_attendee: data.booking_attendee,
    };

    try {
      const response = await axios.post(
        "http://localhost:8000/Bookings/",
        payload
      );
      setDialogOpen(true);
    } catch (error) {
      console.error("API error:", error.response?.data);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    navigate("/meeting-room");
  };

  return (
    <Box>
      <form onSubmit={handleSubmit(submission)}>
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="h5"
            sx={{ bgcolor: "#003f", color: "white", p: 2 }}
          >
            Create Meeting Room
          </Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <MeetingRoomSelectBox
              label="Meeting Room"
              name="booking_room"
              control={control}
              onChange={(selectedValue) => handleRoomChange(selectedValue)}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <MeetingRoomDateBox
              label="Start Date"
              name="booking_start_time"
              control={control}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <MeetingRoomDateBox
              label="End Date"
              name="booking_end_time"
              control={control}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <MeetingRoomTextbox
              label="Booking Create Name Surname"
              name="booking_attendee"
              control={control}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained">
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Success"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Booking created successfully!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default MeetingRoom;
