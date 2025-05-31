// pages/NotFound.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const CommingSoon: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      {/* <h1 className="text-6xl font-bold mb-4">404</h1> */}
      <p className="text-6xl font-bold text-xl mb-6">Comming soon ...</p>
      <Link
        to="/"
        className="px-6 py-3 rounded-full bg-primary-600 text-white hover:bg-primary-700 transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default CommingSoon;