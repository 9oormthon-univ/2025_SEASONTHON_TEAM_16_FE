// src/App.js
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Redirection from "./modules/Redirection";
import KakaoLogin from "./utils/KakaoLogin";

export default function App() {
  return (
    <BrowserRouter>
      {/* 네비게이션 메뉴 */}
      <nav style={{ padding: 16, background: "#eee", display: "flex", gap: 12 }}>
        <Link to="/login">로그인</Link>
      </nav>

      {/* 라우팅 설정 */}
      <Routes>
        <Route
          path="/oidc-callback"
          element={<Redirection />}
        />
        <Route
          path="/login"
          element={<KakaoLogin />}
        />
        <Route
          path="/loginSuccess"
          element={<div style={{ padding: 32 }}>✅ 로그인 성공</div>}
        />
      </Routes>
    </BrowserRouter>
  );
}
