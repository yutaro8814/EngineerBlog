// components/footer/Footer.tsx
import React from "react";
import FooterBrand from "./FooterBrand";
import FooterQuickLinks from "./FooterQuickLinks";
import FooterCategories from "./FooterCategories";

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-gray-800 bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          <FooterBrand />
          <FooterQuickLinks />
          <FooterCategories />
          {/* <FooterContact /> */}
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 mb-4 md:mb-0">
            © 202t Engineer Blog. All rights reserved.
          </p>
          <div className="flex space-x-6"></div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
