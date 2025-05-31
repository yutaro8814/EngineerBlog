import { Link } from "react-router-dom";
import {
  ArticleCardProps,
  categoryColorProps,
} from "../types/AtricleCardProps";
import { getCategoryColor } from "../../functions/ArticleCardFunction";

const ArticleCard: React.FC<ArticleCardProps> = ({
  categories,
  createDate,
  id,
  title,
  imageURL,
  cardBgColorDark,
}) => {
  return (
    <Link
      to={`/articles/${id}`}
      className={`block bg-white dark:${cardBgColorDark} rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 article-card animate-slide-up`}
    >
      <div className="relative overflow-hidden h-48">
        <img
          src={imageURL}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      <div className="p-6">
        {categories.map((category) => {
          const categoryColors: categoryColorProps = getCategoryColor();
          return (
            <span
              key={category}
              className={`inline-block px-3 py-1 ${categoryColors.categoryColor} ${categoryColors.categotryTextColor} dark:${categoryColors.categotryTextColorDark} dark:${categoryColors.categoryColorDark} text-xs font-medium mr-2 rounded`}
            >
              {category}
            </span>
          );
        })}
        <h3 className="text-lg font-serif font-bold mb-2 mt-2 article-title transition-colors duration-300">
          {title}
        </h3>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <span className="mx-2">create date</span>
          <span>{createDate}</span>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;
