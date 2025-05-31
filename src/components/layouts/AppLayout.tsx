// AppLayout.tsx
import React, { useEffect, useState } from 'react';
import Header from '../header/Header';
import Footer from '../footer/Footer';
import BackToTopButton from '../BackToTopButton';
import ReadingProgressBar from '../ReadingProgressBar';
import { Outlet } from 'react-router-dom';

const AppLayout: React.FC = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

export default AppLayout;