// src/hooks/firestoreFetchers.ts
import { collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { ArticleCardProps } from "../components/types/AtricleCardProps";
import { setCardBgColor } from "../functions/ArticleCardFunction";
import { CardType } from "../components/constants/ArticleProps";

/* ---------- Firestore 設定 ---------- */
const COLLECTION = import.meta.env.VITE_FIREFORCE_COLLECTION!;
const CATEGORY_COLLECTION = import.meta.env.VITE_FIREFORCE_CATEGORY_TYPE!;
const CATEGORY_DOC_ID = import.meta.env.VITE_FIREFORCE_CATEGORY_DOC_ID;

export const fetchCategories = async (): Promise<string[]> => {
  const docRef = doc(db, CATEGORY_COLLECTION, CATEGORY_DOC_ID);
  const categorySnapshot = await getDoc(docRef);
  const data = categorySnapshot.data();

  if (data && Array.isArray(data.type)) {
    return data.type;
  }

  return [];
};

export const updateCategories = async (updated: string[]): Promise<void> => {
  const docRef = doc(db, CATEGORY_COLLECTION, CATEGORY_DOC_ID);
  await updateDoc(docRef, { type: updated });
};

export const fetchArticles = async (): Promise<ArticleCardProps[]> => {
  const snapshot = await getDocs(collection(db, COLLECTION));
  const articles: ArticleCardProps[] = [];

  snapshot.forEach((doc) => {
    const data = doc.data();
    const dateObj = data.createDate.toDate();
    const formattedDate = `${dateObj.getFullYear()}/${(dateObj.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${dateObj.getDate().toString().padStart(2, "0")}`;

    articles.push({
      categories: data.categories,
      id: data.id,
      title: data.title,
      imageURL: data.imageURL,
      createDate: formattedDate,
      cardBgColorDark: setCardBgColor(CardType.FeaturedCard),
      delFlag: data.delFlag ?? false,
      isDraft: data.isDraft ?? false,
    });
  });

  return articles;
};
