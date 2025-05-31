import { Link } from "react-router-dom";
import { navigationLinks } from "../constants/links";
import { useAuth } from "../../hooks/AuthContext";

const NavLinks = () => {
  const { currentUser } = useAuth();
  const filterNavigationLinks = navigationLinks.filter((item) => {
    // currentUserがnull（未ログイン）のときだけ管理者リンクを非表示にする
    
    if (currentUser === null && item.isAdminPage) return false;
    return true;
  });

  return (
    <nav className="hidden lg:flex space-x-8">
      {filterNavigationLinks.map((item) => (
        <Link
          to={item.href}
          key={item.label}
          className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

export default NavLinks;
