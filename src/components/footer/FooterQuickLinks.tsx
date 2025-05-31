// components/footer/FooterQuickLinks.tsx
import React from "react";
import { navigationLinks } from "../constants/links"; // Adjust the import path as necessary
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext";

const FooterQuickLinks: React.FC = () => {
  const { currentUser } = useAuth(); // Assuming you have a useAuth hook to get the current user

  const filterNavigationLinks = navigationLinks.filter((item) => {
    // currentUserがnull（未ログイン）のときだけ管理者リンクを非表示にする
    if (currentUser === null && item.isAdminPage) return false;
    return true;
  });

  return (
    <div>
      <h4 className="text-lg font-medium text-white mb-6">Quick Links</h4>
      <ul className="space-y-3">
        {filterNavigationLinks.map((item) => (
          <li key={item.label}>
            <Link
              to={item.href}
              key={item.label}
              className="hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FooterQuickLinks;
