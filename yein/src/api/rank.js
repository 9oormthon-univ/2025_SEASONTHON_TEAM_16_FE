import { api } from "./client";

// 필사 갤러리 랭킹 조회
export const getRankings = async ({
  page = 0,
  size = 10,
  period = "all",
  minScore = 0,
  maxScore = 100,
  sortBy = "score_desc",
} = {}) => {
  try {
    const res = await api.get("/api/galleries", {
      params: { page, size, period, minScore, maxScore, sortBy },
    });
    return res.data.data;
  } catch (error) {
    console.error("랭킹 조회 실패:", error);
    throw error;
  }
};
