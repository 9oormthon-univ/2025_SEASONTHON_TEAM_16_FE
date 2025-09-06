import { api } from "./client";

/**
 * 게시글 목록 조회
 */
export const getPosts = async ({
  keyword = "",
  sortBy = "latest",
  page = 0,
  size = 10,
}) => {
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

/**
 * 내 게시글 목록 조회
 */
export const getMyPosts = async ({ keyword = "", page = 0, size = 10 }) => {
  try {
    const res = await api.get("/api/posts/my", {
      params: { keyword, page, size },
    });
    return res.data.data;
  } catch (error) {
    console.error("내 게시글 목록 조회 실패:", error);
    throw error;
  }
};

/**
 * 게시글 상세 조회
 */
export const getPostDetail = async (postId) => {
  try {
    const res = await api.get(`/api/posts/${postId}`);
    return res.data.data;
  } catch (error) {
    console.error("게시글 상세 조회 실패:", error);
    throw error;
  }
};

/**
 * 게시글 생성
 */
export const createPost = async (formData) => {
  try {
    const res = await api.post("/api/posts", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
  } catch (error) {
    console.error("게시글 생성 실패:", error);
    throw error;
  }
};
