import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import ArticleCard from "../cards/ArticleCard";
import { ArticleCardProps } from "../types/AtricleCardProps";
import { CardType } from "../constants/ArticleProps";
import { setCardBgColor } from "../../functions/ArticleCardFunction";

interface ArticleWithDate extends ArticleCardProps {
  _createdAt: Date;
}

/* ---------- Fireforce 設定 ---------- */
const COLLECTION = import.meta.env.VITE_FIREFORCE_COLLECTION!;

const FeaturedPostsSection: React.FC = () => {
  const [item, setItem] = useState<ArticleCardProps[]>([]);

  useEffect(() => {
    const fetchData = async () => {

      const querySnapshots = await getDocs(collection(db, COLLECTION));
      const articles: ArticleWithDate[] = [];

      querySnapshots.forEach((doc) => {
        const data = doc.data();

        const dateObj = data.createDate.toDate();
        const formattedDate = `${dateObj.getFullYear()}/${(
          dateObj.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}/${dateObj.getDate().toString().padStart(2, "0")}`;

        articles.push({
          id: data.id,
          title: data.title,
          imageURL: data.imageURL,
          createDate: formattedDate,
          cardBgColorDark: setCardBgColor(CardType.FeaturedCard),
          categories:data.categories,
          delFlag: data.delFlag ?? false,
          isDraft: data.isDraft ?? false,
          _createdAt: dateObj, // 🔸型に追加して使う
        });
      });

      const picked = articles
        .filter((post) => !post.delFlag && !post.isDraft)
        .sort((a, b) => b._createdAt.getTime() - a._createdAt.getTime())
        .slice(0, 3);

      setItem(picked);
    };

    fetchData();
  }, []);

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-primary-600 dark:text-primary-400 font-medium">
            FEATURED CONTENT
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold mt-2">
            Editor&apos;s Picks
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto mt-4"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {item.map((post) => (
            <ArticleCard key={post.id} {...post} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedPostsSection;
