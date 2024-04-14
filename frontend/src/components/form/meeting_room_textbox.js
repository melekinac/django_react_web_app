import * as React from "react";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import { Controller } from "react-hook-form";

function MeetingRoomTextbox(props) {
  const { control, name } = props;

  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      render={({ field, fieldState: { error } }) => (
        <FormControl fullWidth error={!!error} component="fieldset">
          <TextField
            {...field}
            label={name}
            variant="outlined"
            error={!!error}
            helperText={error ? error.message : ""}
          />
          <FormHelperText sx={{ color: "#d32f2f" }}>
            {error?.message}
          </FormHelperText>
        </FormControl>
      )}
    />
  );
}

export default MeetingRoomTextbox;
