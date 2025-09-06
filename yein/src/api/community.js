import { api } from "./client";

// 게시글 목록 조회
export const getPosts = async ({
  keyword = "",
  sortBy = "latest",
  page = 0,
  size = 10,
} = {}) => {
  try {
    const res = await api.get("/api/posts", {
      params: { keyword, sortBy, page, size },
    });
    return res.data.data;
  } catch (error) {
    console.error("게시글 목록 조회 실패:", error);
    throw error;
  }
};
