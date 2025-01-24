import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data.code === "token_not_valid"
    ) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/";
    }
    return Promise.reject(error); 
  }
);

export default API;

