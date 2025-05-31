import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from "react";
import { db } from '../../firebase';

/* ---------- Firestore 設定 ---------- */
const CATEGORY_TYPE = import.meta.env.VITE_FIREFORCE_CATEGORY_TYPE!;

const FooterCategories: React.FC = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const categorySnapshots = await getDocs(collection(db, CATEGORY_TYPE));
        const fetchedCategories: string[] = [];

        categorySnapshots.forEach((doc) => {
          const data = doc.data();
          data.type.forEach((cat: string) => {
            if (!fetchedCategories.includes(cat)) {
              fetchedCategories.push(cat);
            }
          });
        });

        setCategories(fetchedCategories);
      } catch (err) {
        console.error("カテゴリ取得エラー:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p className="text-white">Loading categories...</p>;
  }

  return (
    <div>
      <h4 className="text-lg font-medium text-white mb-6">Categories</h4>
      <ul className="space-y-3">
        {categories.map((text) => (
          <li key={text}>
            <a href="#" className="hover:text-white transition-colors">
              {text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FooterCategories;
