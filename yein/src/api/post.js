import { api } from "./client";

// 게시글 상세 조회
export const getPostDetail = async (postId) => {
  const res = await api.get(`/api/posts/${postId}`);
  console.log("API 응답:", res);
  return res.data.data;
};
