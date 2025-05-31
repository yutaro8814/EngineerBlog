import React, { useState, useEffect, useRef } from "react";
import Logo from "./Logo";
import NavLinks from "./NavLinks";
import ThemeToggle from "./ThemeToggle";
import MobileMenuButton from "./MobileMenuButton";
import MobileMenu from "./MobileMenu";

const Header: React.FC = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const stored = localStorage.getItem("theme");
    if (stored) return stored as "light" | "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Logo />
          <NavLinks />
          <div className="flex items-center space-x-4">
            <ThemeToggle
              theme={theme}
              toggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")}
            />
            <MobileMenuButton onClick={toggleMobileMenu} buttonRef={buttonRef} />
          </div>
        </div>
      </div>
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        toggleButtonRef={buttonRef} // ← 追加！
      />
    </header>
  );
};

export default Header;
