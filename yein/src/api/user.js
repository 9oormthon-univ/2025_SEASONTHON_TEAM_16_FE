import { api } from "./client";

export const getMyProfile = () => api.get("/api/users/me");

export const getMyPet = () => api.get("/api/pets/me");

export const logout = () => api.post("/auth/logout");

export const deleteAccount = () => api.delete("/api/users/me");
