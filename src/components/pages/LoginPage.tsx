import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { useAuth } from "../../hooks/AuthContext";
import ActionButton from "../ui/ActionButton";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { currentUser } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin"); // 成功したら管理画面へリダイレクト
    } catch (err) {
      console.error(err);
      setError(
        "ログインに失敗しました。メールアドレスとパスワードを確認してください。"
      );
    }
  };

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

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-800">
      <div className="bg-white dark:bg-gray-900 p-8 rounded shadow-md w-full max-w-md">
        {!currentUser ? (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-center">ログイン</h2>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">メールアドレス</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border rounded dark:bg-gray-700"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">パスワード</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border rounded dark:bg-gray-700"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition"
              >
                ログイン
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-lg font-semibold mb-4">ログイン中</p>
            <ActionButton
              onClick={handleLogout}
              label="ログアウト"
              colorScheme="danger"
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default LoginPage;
