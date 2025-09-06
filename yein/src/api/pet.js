import { api } from "./client";

// 펫 상태 조회
export const getPetStatus = async () => {
  const res = await api.get("/api/pets/me");
  return res.data.data;
};

// 펫 종류 변경
export const updatePetType = async (petType) => {
  const res = await api.patch("/api/pets/me", { petType });
  return res.data.data;
};

// 펫 이름 변경
export const updatePetName = async (name) => {
  const res = await api.patch("/api/pets/me/name", { name });
  return res.data.data;
};
