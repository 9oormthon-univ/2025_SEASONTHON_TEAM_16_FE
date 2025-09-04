import { Routes, Route } from "react-router-dom";
import Signup from "../pages/Signup/Signup";
import Redirection from "../modules/Redirection";
import LoginSuccess from "../pages/LoginSuccess";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Signup />} />
      <Route path="/login" element={<Signup />} />
      <Route path="/oidc-callback" element={<Redirection />} />
      <Route path="/loginSuccess" element={<LoginSuccess />} />
    </Routes>
  );
}
