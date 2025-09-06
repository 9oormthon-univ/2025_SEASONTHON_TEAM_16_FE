import { Routes, Route } from "react-router-dom";
import Signup from "../pages/Signup/Signup";
import Redirection from "../modules/Redirection";
import HomePage from "../pages/Home/HomePage";
import PetPage from "../pages/Pet/PetPage";
import TranscriptionPage from "../pages/Transcription/TranscriptionPage";
import GalleryPage from "../pages/Gallery/GalleryPage";
import CommunityPage from "../pages/Community/CommunityPage";
import MyPostsPage from "../pages/Community/MyPostsPage";
import PostCreatePage from "../pages/Community/PostCreatePage";
import LoginSuccess from "../pages/Login/LoginSuccess";
import ProfilePage from "../pages/Profile/ProfilePage";
import AnalyzePage from "../pages/Analyze/AnalyzePage";
import DetailPage from "../pages/Gallery/DetailPage";
import RankPage from "../pages/Gallery/RankPage";
import Intro from "../pages/Introduce/IntroPage";
import BestPostsPage from "../pages/Community/BestPostsPage";
import PostDetailPage from "../pages/Community/PostDetailPage";

export default function AppRoutes() {
  return (
    <Routes>
      {/* 인증 관련 */}
      <Route path="/" element={<Signup />} />
      <Route path="/login" element={<Signup />} />
      <Route path="/login/success" element={<LoginSuccess />} />
      <Route path="/oidc-callback" element={<Redirection />} />

      {/* 메인 페이지 */}
      <Route path="/home" element={<HomePage />} />
      <Route path="/pet" element={<PetPage />} />
      <Route path="/transcription" element={<TranscriptionPage />} />

      {/* 갤러리 */}
      <Route path="/gallery" element={<GalleryPage />} />
      <Route path="/detail/:galleryId" element={<DetailPage />} />
      <Route path="/analyze" element={<AnalyzePage />} />

      {/* 랭크 */}
      <Route path="/rank" element={<RankPage />} />

      {/* 커뮤니티 */}
      <Route path="/community" element={<CommunityPage />} />
      <Route path="/community/myposts" element={<MyPostsPage />} />
      <Route path="/community/write" element={<PostCreatePage />} />
      <Route path="/best-posts" element={<BestPostsPage />} />
      <Route path="/post/:postId" element={<PostDetailPage />} />

      {/* 프로필 */}
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/intro" element={<Intro />} />
    </Routes>
  );
}
