import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box } from "@mui/material";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/token/", {
        username: username,
        password: password,
      });
      console.log("Login successful:", response.data);

      localStorage.setItem("accessToken", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);
      localStorage.setItem(
        "userInfo",
        JSON.stringify({
          username: response.data.username,
          email: response.data.email,
          is_staff: response.data.is_staff,
        })
      );

      navigate("/Home");
    } catch (error) {
      setErrorMessage("Invalid username or password");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <form onSubmit={handleLogin} className="login-form">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "300px",
            padding: "20px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <TextField
            label="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ marginBottom: 2 }}
          />
          <Button type="submit" variant="contained" sx={{ width: "100%" }}>
            Login
          </Button>
          {errorMessage && <p>{errorMessage}</p>}
        </Box>
      </form>
    </Box>
  );
}

export default LoginForm;
