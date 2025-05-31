import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext";
import { navigationLinks } from "../constants/links";
import { useRef, useEffect } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  toggleButtonRef: React.RefObject<HTMLButtonElement | null>; // ← 修正点
}

const MobileMenu: React.FC<Props> = ({ isOpen, onClose, toggleButtonRef }) => {
  const { currentUser } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose, toggleButtonRef]);

  if (!isOpen) return null;

  const filteredLinks = navigationLinks.filter((item) => {
    if (currentUser === null && item.isAdminPage) return false;
    return true;
  });

  return (
    <div
      ref={menuRef}
      className="lg:hidden fixed top-16 left-0 w-full h-full z-50 backdrop-blur-sm bg-gray-800/80 opacity-85"
    >
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {filteredLinks.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              onClick={onClose}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
