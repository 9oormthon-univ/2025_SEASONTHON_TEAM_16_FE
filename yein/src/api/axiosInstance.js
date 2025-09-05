import axios from "axios";

const api = axios.create({
  baseURL: "https://yein.duckdns.org/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  console.log("요청 URL:", config.url);
  console.log("Authorization 헤더:", token ? `Bearer ${token}` : "없음");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const res = await axios.post(
          "https://yein.duckdns.org/api/auth/reissue",
          { refreshToken }
        );
        const newAccess = res.data.accessToken || res.data.data?.accessToken; // ✅ 서버 응답 키 확인 필요

        if (newAccess) {
          localStorage.setItem("accessToken", newAccess);
          api.defaults.headers.Authorization = `Bearer ${newAccess}`;
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          return api(originalRequest);
        }
      } catch (err) {
        console.error("토큰 갱신 실패", err);
        localStorage.clear();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
