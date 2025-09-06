import { api } from "./client";

export const getMyProfile = async () => {
  const res = await api.get("/auth/me");
  return res.data?.data ?? res.data;
};
export const getMyPet = async () => {
  const res = await api.get("/api/pets/me");
  return res.data; 
};
export const logout = () => api.post("/auth/logout");

