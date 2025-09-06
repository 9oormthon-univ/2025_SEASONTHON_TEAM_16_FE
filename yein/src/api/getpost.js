import { api } from "./client";

// 내 게시물 조회
export const getMyPosts = async (page = 0, size = 10) => {
  try {
    const res = await api.get("/api/posts/my", {
      params: { page, size },
    });
    return res.data;
  } catch (error) {
    console.error("내 게시물 조회 실패:", error);
    throw error;
  }
};
