import React from "react";
import { Box, FormControl, TextField } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Controller } from "react-hook-form";
import dayjs from "dayjs";

function MeetingRoomDateBox({ control, label, name }) {
  return (
    <Box sx={{ width: "100%" }}>
      <FormControl fullWidth>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Controller
            name={name}
            control={control}
            defaultValue={null}
            render={({ field }) => (
              <DateTimePicker
                label={label}
                value={field.value ? dayjs(field.value) : null}
                onChange={(newValue) => field.onChange(newValue)}
                renderInput={(params) => <TextField {...params} />}
              />
            )}
          />
        </LocalizationProvider>
      </FormControl>
    </Box>
  );
}

export default MeetingRoomDateBox;
