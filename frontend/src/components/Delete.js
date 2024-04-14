import { React, useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import axios from "axios";

import { useNavigate, useParams } from "react-router-dom";

function Delete() {
  const MyParam = useParams();
  const myid = MyParam.id;

  const [mydata, setMyData] = useState([]);
  const [loading, setLoading] = useState(true);
  console.log(mydata);
  const AxiosInstance = axios.create({
    baseURL: "http://localhost:8000/",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  const GetData = () => {
    AxiosInstance.get("Bookings/").then((response) => {
      setMyData(response.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    AxiosInstance.get(`Bookings/${myid}/`)
      .then((response) => {
        setMyData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was an error fetching the booking data:", error);
        setLoading(false);
      });
  }, [myid]);

  const navigate = useNavigate();

  const submission = (data) => {
    AxiosInstance.delete(`Bookings/${myid}/`)
      .then((response) => {
        navigate("/");
      })
      .catch((error) => {
        console.error("Error during deletion:", error);
        alert(
          "Failed to delete: " +
            (error.response?.data.message || "Server error")
        );

        if (error.response?.status === 401 || error.response?.status === 403) {
        }
      });
  };

  return (
    <div>
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <div>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              background: "#003f",
              marginBottom: "10px",
            }}
          >
            <Typography sx={{ marginLeft: "20px", color: "#fff", flexGrow: 1 }}>
              Delete Meeting Room : {mydata.booking_room}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              width: "100%",
              boxShadow: 3,
              padding: 4,
            }}
          >
            Are you sure that you want to meeting room:{mydata.booking_room}
            <Button
              variant="contained"
              onClick={submission}
              sx={{ marginLeft: 2 }}
            >
              Delete
            </Button>
          </Box>
        </div>
      )}
    </div>
  );
}

export default Delete;
