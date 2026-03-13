import axios from "axios";

const api = axios.create({
  baseURL: "https://portfolio-admin-i6v3.onrender.com/api"
});

export default api;