import { api } from "./client";

// 갤러리 상세 조회
export const getGalleryDetail = async (galleryId) => {
  try {
    const res = await api.get(`/api/galleries/${galleryId}`);
    console.log("갤러리 상세 API 응답:", res.data);
    return res.data.data;
  } catch (error) {
    console.error("갤러리 상세 조회 실패:", error);
    throw error;
  }
};
