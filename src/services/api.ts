import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api", // Aquí apuntará a tu backend
});

export default api;
