import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export default API;

/* ======================
   MESSES APIs
====================== */

export const fetchMesses = () =>
  API.get("/api/messes");

export const createMess = (formData) =>
  API.post("/api/messes", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const deleteMess = (id) =>
  API.delete(`/api/messes/${id}`);
