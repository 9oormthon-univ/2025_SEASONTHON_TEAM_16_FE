import api from "./axiosInstance";

// 내 정보 조회
export const getMyProfile = () => api.get("/users/me");

// 내 펫 정보 조회
export const getMyPet = () => api.get("/pets/me");

// 로그아웃
export const logout = () => api.post("/auth/logout");

// 회원 탈퇴
export const deleteAccount = () => api.delete("/users/me");
