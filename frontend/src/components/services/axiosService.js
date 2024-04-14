import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

async function refreshToken() {
  const refreshToken = localStorage.getItem("refreshToken");
  try {
    const response = await axios.post("http://localhost:8000/refresh/", {
      refresh: refreshToken,
    });
    const { accessToken } = response.data;
    localStorage.setItem("accessToken", accessToken);
    return accessToken;
  } catch (error) {
    throw new Error("Failed to refresh token");
  }
}

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshToken();
        axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);

        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export { axiosInstance, refreshToken };
