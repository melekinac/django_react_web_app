import React, { useEffect, useState, useMemo } from "react";
import AxiosInstance from "./axios";
import { MaterialReactTable } from "material-react-table";
import dayjs from "dayjs";
import { Box, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";
import axios from "axios";
function Home() {
  const [mydata, setMyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const GetData = () => {
    axios
      .get("http://localhost:8000/Bookings")
      .then((response) => {
        setMyData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching rooms:", error.response);
        setError(
          `Failed to fetch rooms: ${error.response?.status} ${error.response?.data?.message}`
        );
        setLoading(false);
      });
  };

  useEffect(() => {
    GetData();
  }, []);

  const columns = useMemo(
    () => [
      { accessorKey: "booking_room", header: "Room", size: 150 },
      {
        accessorFn: (row) => dayjs(row.booking_start_time).format("DD-MM-YYYY"),
        header: "Start Date",
        size: 150,
      },
      {
        accessorFn: (row) => dayjs(row.booking_end_time).format("DD-MM-YYYY"),
        header: "End Date",
        size: 150,
      },
      { accessorKey: "booking_attendee", header: "Booking Peoples", size: 150 },
    ],
    []
  );

  return (
    <div>
      <MaterialReactTable
        columns={columns}
        data={mydata}
        enableRowActions
        renderRowActions={({ row }) => (
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
            <IconButton
              color="error"
              component={Link}
              to={`/meeting-room/delete/${row.original.id}`}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        )}
      />
    </div>
  );
}

export default Home;
