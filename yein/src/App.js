// src/App.js
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Redirection from "./modules/Redirection";
import KakaoLogin from "./utils/KakaoLogin";
import Signup from "./pages/Signup";

export default function App() {
  return (
    <BrowserRouter>
      {/* 라우팅 설정 */}
      <Routes>
        <Route
          path="/oidc-callback"
          element={<Redirection />}
        />
        <Route
          path="/login"
          element={<Signup />}
        />
        <Route
          path="/loginSuccess"
          element={<div style={{ padding: 32 }}>로그인 성공</div>}
        />
      </Routes>
    </BrowserRouter>
  );
}
