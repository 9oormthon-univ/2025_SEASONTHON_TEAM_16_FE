import { api } from "./client";

// 갤러리 목록 조회
export const getGalleries = async ({
  page = 0,
  size = 20,
  period = "all",
  minScore,
  maxScore,
  sortBy = "date_desc",
}) => {
  try {
    const res = await api.get("/api/galleries", {
      params: { page, size, period, minScore, maxScore, sortBy },
    });
    return res.data.data;
  } catch (error) {
    console.error("갤러리 목록 조회 실패:", error);
    throw error;
  }
};

// 갤러리 상세 조회
export const getGalleryDetail = async (galleryId) => {
  try {
    const res = await api.get(`/api/galleries/${galleryId}`);
    return res.data.data;
  } catch (error) {
    console.error("갤러리 상세 조회 실패:", error);
    throw error;
  }
};
