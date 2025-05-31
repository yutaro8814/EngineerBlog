// PopularTags.tsx
import React from 'react';

const tags = [
  'Travel',
  'Fashion',
  'Technology',
  'Food',
  'Lifestyle',
  'Photography',
  'Design',
  'Art',
  'Wellness',
  'Books',
  'Music',
  'Sustainability',
];

const PopularTags: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold">Popular Tags</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto mt-4"></div>
        </div>
        <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
          {tags.map((tag) => (
            <a
              key={tag}
              href="#"
              className="px-4 py-2 bg-white dark:bg-gray-700 rounded-full shadow-sm hover:shadow-md transition-all duration-300 tag"
            >
              #{tag}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularTags;