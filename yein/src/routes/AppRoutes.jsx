import { Routes, Route } from "react-router-dom";
import Signup from "../pages/Signup/Signup";
import Redirection from "../modules/Redirection";
import HomePage from "../pages/Home/HomePage";
import PetPage from "../pages/Pet/PetPage";
import TranscriptionPage from "../pages/Transcription/TranscriptionPage";
import GalleryPage from "../pages/Gallery/GalleryPage";
import CommunityPage from "../pages/Community/CommunityPage";
import LoginSuccess from "../pages/Login/LoginSuccess";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Signup />} />
      <Route path="/login" element={<Signup />} />
      <Route path="/login/success" element={<LoginSuccess />} />
      <Route path="/oidc-callback" element={<Redirection />} />

      <Route path="/home" element={<HomePage />} />
      <Route path="/pet" element={<PetPage />} />
      <Route path="/transcription" element={<TranscriptionPage />} />
      <Route path="/gallery" element={<GalleryPage />} />
      <Route path="/community" element={<CommunityPage />} />
    </Routes>
  );
}
