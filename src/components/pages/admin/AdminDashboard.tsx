import { signOut } from "firebase/auth";
import { auth, db } from "../../../firebase";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import ActionButton from "../../ui/ActionButton";
import { useAuth } from "../../../hooks/AuthContext";

type Article = {
  id: number;
  title: string;
  isDraft: boolean;
  delFlag: boolean;
  docId: string; // FirestoreドキュメントIDも保持！
};

/* ---------- Fireforce 設定 ---------- */
const COLLECTION = import.meta.env.VITE_FIREFORCE_COLLECTION!;

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    if (!currentUser) return;
    const fetchArticles = async () => {
      const snapshot = await getDocs(collection(db, COLLECTION));
      const fetchedArticles: Article[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: data.id,
          title: data.title,
          isDraft: data.isDraft ?? false,
          delFlag: data.delFlag ?? false,
          docId: doc.id, // ← これが必要
        };
      });
      setArticles(fetchedArticles);
    };

    fetchArticles();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.alert("ログアウトしました");
      navigate("/login");
    } catch (error) {
      console.error(error);
      window.alert("ログアウトに失敗しました");
    }
  };

  const handleDeleteArticle = async (docId: string) => {
    const confirmed = window.confirm("この記事を削除しますか？");
    if (!confirmed) return;

    try {
      const docRef = doc(db, COLLECTION, docId);
      await updateDoc(docRef, { delFlag: true });

      window.alert("削除しました");
      setArticles((prev) =>
        prev.map((a) => (a.docId === docId ? { ...a, delFlag: true } : a))
      );
    } catch (error) {
      console.error(error);
      window.alert("削除に失敗しました");
    }
  };

  const publishedArticles = articles.filter(
    (article) => !article.isDraft && !article.delFlag
  );
  const draftArticles = articles.filter(
    (article) => article.isDraft && !article.delFlag
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">管理者ダッシュボード</h2>
        <div className="flex gap-4">
          <Link
            to="/edittag"
            className="px-6 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
          >
            タグ編集
          </Link>
          <Link
            to="/createarticle"
            className="px-6 py-3 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition"
          >
            新規作成
          </Link>
          <ActionButton
            onClick={handleLogout}
            label="ログアウト"
            colorScheme="danger"
          />
        </div>
      </div>

      {/* 下書き一覧 */}
      <section className="mb-12">
        <h3 className="text-xl font-semibold mb-4">下書き一覧</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {draftArticles.map((article) => (
            <div
              key={article.id}
              className="border rounded-lg p-4 bg-white dark:bg-gray-900 flex justify-between items-center"
            >
              <div>
                <Link
                  to={`/edit/${article.id}`}
                  className="text-primary-600 hover:underline text-lg font-semibold block"
                >
                  {article.title}
                </Link>
                <span className="inline-block mt-2 px-2 py-1 text-xs bg-gray-400 text-white rounded">
                  下書き
                </span>
              </div>
              <button
                onClick={() => handleDeleteArticle(article.docId)}
                className="text-red-500 hover:text-red-700 transition ml-4"
                title="削除"
              >
                <i
                  className="fas fa-trash text-red-500 hover:text-red-700 cursor-pointer ml-2"
                  onClick={() => handleDeleteArticle(article.docId)}
                ></i>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 公開記事一覧 */}
      <section>
        <h3 className="text-xl font-semibold mb-4">公開記事一覧</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {publishedArticles.map((article) => (
            <div
              key={article.id}
              className="border rounded-lg p-4 bg-white dark:bg-gray-900 flex justify-between items-center"
            >
              <div>
                <Link
                  to={`/edit/${article.id}`}
                  className="text-primary-600 hover:underline text-lg font-semibold block"
                >
                  {article.title}
                </Link>
                <span className="inline-block mt-2 px-2 py-1 text-xs bg-green-500 text-white rounded">
                  公開中
                </span>
              </div>
              <button
                onClick={() => handleDeleteArticle(article.docId)}
                className="text-red-500 hover:text-red-700 transition ml-4"
                title="削除"
              >
                <i
                  className="fas fa-trash text-red-500 hover:text-red-700 cursor-pointer ml-2"
                  onClick={() => handleDeleteArticle(article.docId)}
                ></i>
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
