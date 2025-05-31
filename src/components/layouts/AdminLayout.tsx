// src/components/layouts/AdminLayout.tsx
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext";
import ReadingProgressBar from "../ReadingProgressBar";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import BackToTopButton from "../BackToTopButton";

const AdminLayout: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.pageYOffset > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (currentUser === null) {
      // 未ログインならアラート＋強制リダイレクト
      alert("管理者ログインが必要です");
      navigate("/login");
    }
  }, [currentUser, navigate]);

  if (currentUser === undefined) {
    // Firebaseの認証確認中 → まだ何も出さない
    return null;
  }

  if (currentUser === null) {
    // 未ログイン → useEffectでリダイレクト中なのでここでも何も表示しない
    return null;
  }

  // ログイン済みなら中身（子コンポーネント）を表示
  return (
    <div className="bg-white dark:bg-gray-900 font-sans text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <ReadingProgressBar />
      <Header />
      <main><Outlet/></main>
      <Footer />
      {showBackToTop && <BackToTopButton />}
    </div>
  );
};

export default AdminLayout;
