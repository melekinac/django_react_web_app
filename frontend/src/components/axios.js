import axios from "axios";

const AxiosInstance = axios.create({
  baseURL: "http://localhost:8000/",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

AxiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

AxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data.code === "token_not_valid"
    ) {
      const originalRequest = error.config;
      const refreshToken = localStorage.getItem("refreshToken");
      try {
        const response = await axios.post(
          "http://localhost:8000/refresh-token",
          { refresh_token: refreshToken }
        );
        const { accessToken } = response.data;
        localStorage.setItem("accessToken", accessToken);
        AxiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        return AxiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default AxiosInstance;
