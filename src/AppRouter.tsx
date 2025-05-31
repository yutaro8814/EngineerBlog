// AppRouter.tsx
import { Routes, Route } from "react-router-dom";
import AppLayout from "./components/layouts/AppLayout";
import AdminLayout from "./components/layouts/AdminLayout";
import NotFound from "./components/pages/NotFound";
import CommingSoon from "./components/pages/CommingSoon";
import ArticleViewer from "./components/pages/ArticleViewer";
import CreateArticle from "./components/pages/admin/CreateArticle";
import EditArticle from "./components/pages/admin/EditArticle";
import LoginPage from "./components/pages/LoginPage";
import AdminDashboard from "./components/pages/admin/AdminDashboard";
import PublicArticleList from "./components/pages/publicArticleList";
import EditTags from "./components/pages/admin/EditTags";

const AppRouter = () => {
  return (
    <Routes>
      {/* === 一般ユーザー用ルート === */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<PublicArticleList />} />
        <Route path="/articles/:id" element={<ArticleViewer />} />
        <Route path="/commingsoon" element={<CommingSoon />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* === 管理者用ルート === */}
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/createarticle" element={<CreateArticle />} />
        <Route path="/edit/:id" element={<EditArticle />} />
        <Route path="/edittag" element={<EditTags />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
