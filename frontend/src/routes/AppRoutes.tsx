import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../modules/dashboard/pages/HomePage";
import ProfilePage from "../modules/profile/pages/ProfilePage";
import CoursePage from "../modules/course/pages/CoursePage";
import LoginPage from "../modules/auth/pages/LoginPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/courses" element={<CoursePage />} />
      </Route>
      <Route path="*" element={<div>Not Found</div>} />
    </Routes>
  );
}