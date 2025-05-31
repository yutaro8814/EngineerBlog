// BackToTopButton.tsx
import React from 'react';

const BackToTopButton: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 p-3 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-colors"
      aria-label="Back to top"
    >
      <i className="fas fa-arrow-up" />
    </button>
  );
};

export default BackToTopButton;