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

// 게시글 삭제
export const deletePost = async (postId) => {
  try {
    const res = await api.delete(`/api/posts/${postId}`);
    return res.data;
  } catch (error) {
    console.error("게시글 삭제 실패:", error);
    throw error;
  }
};

// 게시글 수정
export const updatePost = async (postId, form, image) => {
  try {
    const formData = new FormData();
    formData.append(
      "data",
      new Blob([JSON.stringify(form)], { type: "application/json" })
    );
    if (image) formData.append("image", image);

    const res = await api.patch(`/api/posts/${postId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error) {
    console.error("게시글 수정 실패:", error);
    throw error;
  }
};

// 게시글 좋아요 토글
export const toggleLike = async (postId) => {
  try {
    const res = await api.post(`/api/posts/${postId}/likes`);
    return res.data;
  } catch (error) {
    console.error("게시글 좋아요 토글 실패:", error);
    throw error;
  }
};

// 게시글 스크랩 (북마크) 토글
export const toggleScrap = async (postId) => {
  try {
    const res = await api.post(`/api/scraps/${postId}`);
    return res.data;
  } catch (error) {
    console.error("스크랩 토글 실패:", error);
    throw error;
  }
};

// 댓글 조회
export const getComments = async (postId, page = 0, size = 10) => {
  const res = await api.get(`/api/comments/posts/${postId}`, {
    params: { page, size },
  });
  return res.data.data;
};

// 댓글 작성
export const createComment = async (postId, content) => {
  const res = await api.post(`/api/comments/posts/${postId}`, { content });
  return res.data.data;
};

// 댓글 수정
export const editComment = async (commentId, content) => {
  const res = await api.put(`/api/comments/${commentId}`, { content });
  return res.data.data;
};

// 댓글 삭제
export const deleteComment = async (commentId) => {
  const res = await api.delete(`/api/comments/${commentId}`);
  return res.data.data;
};
