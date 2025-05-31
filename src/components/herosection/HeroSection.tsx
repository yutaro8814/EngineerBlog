import React from 'react';
import heroImage from '../../assets/herosection.png';

const HeroSection: React.FC = () => {
  return (
    // <section className="relative bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-20 md:py-32 overflow-hidden">
    <section className="relative text-white py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-cover bg-center" 
        style={{ backgroundImage: `url(${heroImage})` }}>
        </div>
      </div>
      {/* 黒いオーバーレイ */}
      <div className="absolute inset-0 bg-black/50 z-10" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">
          My Engineering Notes
          </h1>
          <p className="text-xl md:text-2xl opacity-90 mb-8">
          React、Java、AWS ...
          <br/>
          学びと試行錯誤のプロセスをそのまま記録する成長のためのログ
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;