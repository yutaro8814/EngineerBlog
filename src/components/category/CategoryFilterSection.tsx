// CategoryFilterSection.tsx
import React, { useEffect, useState } from "react";
import ArticleCard from "../cards/ArticleCard";
import { ArticleCardProps } from "../types/AtricleCardProps";
import {
  //getCategoryType,
  setCardBgColor,
} from "../../functions/ArticleCardFunction";
import { CardType} from "../constants/ArticleProps";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

/* ---------- Fireforce 設定 ---------- */
const COLLECTION = import.meta.env.VITE_FIREFORCE_COLLECTION!;
const CATEGORY_TYPE = import.meta.env.VITE_FIREFORCE_CATEGORY_TYPE!;

const CategoryFilterSection: React.FC = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [item, setItem] = useState<ArticleCardProps[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // 1. カテゴリの取得
      const categorySnapshots = await getDocs(collection(db, CATEGORY_TYPE));

      const categories: string[] = [];
      categorySnapshots.forEach((doc) => { 
        const data = doc.data();
        categories.push("all"); // "All"を追加
        data.type.forEach((cat: string) => {
          if (!categories.includes(cat)) {
            categories.push(cat);
          }
        });
      });

      setCategories(categories);

      const atricleSnapshots = await getDocs(collection(db, COLLECTION));

      const articles: ArticleCardProps[] = [];

      atricleSnapshots.forEach((doc) => {
        const data = doc.data();

        const dateObj = data.createDate.toDate();
        const formattedDate = `${dateObj.getFullYear()}/${(
          dateObj.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}/${dateObj.getDate().toString().padStart(2, "0")}`;

        articles.push({
          categories:data.categories,
          id: data.id,
          title: data.title,
          imageURL: data.imageURL,
          createDate: formattedDate,
          cardBgColorDark: setCardBgColor(CardType.FeaturedCard),
          delFlag: data.delFlag ?? false,
          isDraft: data.isDraft ?? false,
        });
      });

      setItem(articles);
      setLoading(false);
    };

    fetchData();
  }, []);

  const filtered = item
    .filter((a) => !a.delFlag && !a.isDraft)
    .filter((a) => a.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((a) =>
      selectedCategory === "all"
        ? true
        : a.categories.some(
            (category) => category === selectedCategory
          )
    );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <section className="py-12 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-serif font-bold">
            Latest Articles
          </h2>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-2 items-center w-full md:w-auto justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === cat
                      ? "bg-primary-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
                  }`}
                  onClick={() => {
                    setCurrentPage(1); // Reset to the first page when category changes
                    return setSelectedCategory(cat);
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="px-4 py-2 border rounded-md text-sm ml-auto"
              value={searchTerm}
              onChange={(e) => {
                setCurrentPage(1); // Reset to the first page when category changes
                return setSearchTerm(e.target.value);
              }}
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">読み込み中...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentItems.map((article) => (
                <ArticleCard key={article.id} {...article} />
              ))}
            </div>
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-3 py-1 rounded-md text-sm font-medium border transition ${
                    currentPage === index + 1
                      ? "bg-primary-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default CategoryFilterSection;
