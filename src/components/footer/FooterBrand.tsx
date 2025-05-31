// components/footer/FooterBrand.tsx
import React from "react";

const FooterBrand: React.FC = () => {
  return (
    <div>
      <h3 className="text-2xl font-serif font-bold text-white mb-6 gradient-text">
        Engneer
      </h3>
      <p className="md-6">
        React、Java、AWS ...
        <br />
        学びと試行錯誤のプロセスをそのまま記録する成長のためのログ
      </p>
      {/* <div className="flex space-x-4 mt-6">
        {["twitter", "instagram", "pinterest", "youtube"].map((icon) => (
          <a
            key={icon}
            href="#"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <i className={`fab fa-${icon}`} />
          </a>
        ))}
      </div> */}
    </div>
  );
};

export default FooterBrand;
