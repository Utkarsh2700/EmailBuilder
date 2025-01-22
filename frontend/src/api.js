import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

export const fetchEmailLayout = () => API.get("/getEmailLayout");
export const uploadImage = (id, formdata) =>
  API.post(`/uploadImage/${id}`, formdata);
export const saveEmailConfig = (config) => API.post(`/upload`, config);
export const renderAndDownloadTemplate = (formdata) =>
  API.post(`/renderAndDownloadTemplate`, formdata);
export const updateEmailConfig = (id) => API.post(`/update/${id}`);
