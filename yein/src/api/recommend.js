import { api } from "./client";

export async function getTodayRecommendation(signal) {
  try {
    const res = await api.get("/api/recommendations/today", { signal });
    const sentence = res?.data?.data?.quote;
    return sentence ?? "";
  } catch (err) {
    console.error("추천 문구 API 호출 실패:", err);
    throw err;
  }
}
