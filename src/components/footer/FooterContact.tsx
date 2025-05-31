// components/footer/FooterContact.tsx
import React from 'react';

const FooterContact: React.FC = () => {
  return (
    <div>
      <h4 className="text-lg font-medium text-white mb-6">Contact</h4>
      <ul className="space-y-3">
        <li className="flex items-start">
          <i className="fas fa-map-marker-alt mt-1 mr-3 text-primary-400" />
          <span>123 Design Street, Creative City, CA 90210</span>
        </li>
        <li className="flex items-center">
          <i className="fas fa-envelope mr-3 text-primary-400" />
          <span>hello@elegantblog.com</span>
        </li>
        <li className="flex items-center">
          <i className="fas fa-phone-alt mr-3 text-primary-400" />
          <span>+1 (555) 123-4567</span>
        </li>
      </ul>
    </div>
  );
};

export default FooterContact;
