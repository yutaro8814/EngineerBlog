// src/components/pages/ArticleViewer.tsx
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { useHeadings } from "../../hooks/useHeadings";
import LinkCard from "../cards/LinkCard";
import { Element } from "hast";
import { useParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import {
  ArticleCardProps,
  categoryColorProps,
} from "../types/AtricleCardProps";
import { getCategoryColor } from "../../functions/ArticleCardFunction";

/* ---------- Fireforce 設定 ---------- */
const COLLECTION = import.meta.env.VITE_FIREFORCE_COLLECTION!;

const ArticleViewer: React.FC = () => {
  const [markdown, setMarkdown] = useState<string | null>(null);
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[] | null>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string>();
  const { id } = useParams<{ id: string }>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const headings = useHeadings(markdown);
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        // ① Firestoreからコレクションを全部取得
        const snapshot = await getDocs(collection(db, COLLECTION));

        // ② idが一致するドキュメントを探す
        const doc = snapshot.docs.find((doc) => {
          const data = doc.data();
          return data.id === Number(id); // idは数値型なのでNumber変換する
        });

        if (!doc) {
          setError("記事が見つかりませんでした");
          return;
        }

        const docDate = doc.data() as ArticleCardProps;

        const { categories, articleMdURL, imageURL, title } = docDate;

        if (!articleMdURL) {
          setError("記事本文のURLが登録されていません");
          return;
        }

        // ③ そのURLからMarkdownをfetch
        const res = await fetch(articleMdURL);
        if (!res.ok) throw new Error(res.statusText);

        setMarkdown(await res.text());
        setTitle(title || null); // タイトルがない場合はnullをセット
        setImageURL(imageURL || null); // 画像URLがない場合はnullをセット
        setCategories(categories); // カテゴリがない場合はnullをセット
      } catch (err) {
        console.error(err);
        setError("記事の読み込みに失敗しました");
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id]);

  useEffect(() => {
    const onScroll = () => {
      const offset = 100; // 固定ヘッダーぶんのオフセット
      const current = [...headings]
        .reverse() // 下から探す
        .find((h) => {
          const el = document.getElementById(h.id);
          return el && el.getBoundingClientRect().top - offset <= 0;
        });
      setActiveId(current?.id);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [headings]);

  if (error) return <p className="p-8 text-red-500">{error}</p>;
  if (!markdown) return <p className="p-8">Loading…</p>;

  return (
    <section className="min-h-screen py-4 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 lg:px-8 grid lg:grid-cols-[240px_1fr] gap-8">
        {/* ── 目次サイドバー ───────────────── */}
        <nav className="hidden lg:block sticky top-24 self-start max-h-[80vh] overflow-auto pr-4">
          <h2 className="font-bold mb-4">目次</h2>

          <ul className="space-y-2 text-sm">
            {headings.map((h) => (
              <li
                key={h.id}
                style={{ paddingLeft: `${(h.level - 1) * 8}px` }}
                className={`leading-relaxed
                         ${
                           h.level === 1
                             ? "font-bold"
                             : h.level === 2
                             ? "font-semibold"
                             : ""
                         }
                         ${activeId === h.id ? "text-primary-600" : ""}`}
              >
                <a href={`#${h.id}`} className="hover:underline">
                  {h.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* ── 記事本文カード ───────────────── */}
        <article
          className="prose prose-base dark:prose-invert bg-white dark:bg-gray-900 
               rounded-lg border px-6 pt-2 py-8 max-w-4xl w-full
               [&_h1]:scroll-mt-24 [&_h2]:scroll-mt-24 [&_h3]:scroll-mt-24
               [&_h4]:scroll-mt-24 [&_h5]:scroll-mt-24 [&_h6]:scroll-mt-24"
        >
          {imageURL && (
            <>
              <div
                className="relative w-full aspect-[16/9] overflow-hidden rounded mb-6 cursor-pointer"
                onClick={() => setIsModalOpen(true)}
              >
                <img
                  alt="記事のタイトル画像"
                  src={imageURL}
                  className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              {isModalOpen && (
                <div
                  className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center"
                  onClick={() => setIsModalOpen(false)}
                >
                  <div
                    className="relative"
                    onClick={(e) => e.stopPropagation()} // モーダル内クリックで閉じないようにする
                  >
                    <img
                      src={imageURL}
                      alt="拡大画像"
                      className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-lg"
                    />
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/80"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
          {title && <h1 className="text-3xl font-bold mt-0">{title}</h1>}
          <div>
            <label className="block text-xl font-bold mb-2">タグ</label>
            {categories && categories.map((category) => {
              const categoryColors: categoryColorProps = getCategoryColor();
              return (
                <p
                  key={category}
                  className={`inline-block px-3 py-1 rounded mr-2 mb-2 text-xs font-medium transition
                ${`${categoryColors.categoryColor} ${categoryColors.categotryTextColor} dark:${categoryColors.categoryColorDark} dark:${categoryColors.categotryTextColorDark}`}`}
                >
                  {category}
                </p>
              );
            })}
          </div>
          {title && <hr className="my-2" />}
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeSlug]}
            components={{
              p({ node, children }) {
                if (
                  node &&
                  "children" in node &&
                  Array.isArray(node.children) &&
                  node.children.length === 1 &&
                  node.children[0].type === "element" &&
                  (node.children[0] as Element).tagName === "a"
                ) {
                  const href = (node.children[0] as Element).properties
                    ?.href as string;
                  return <LinkCard url={href} />;
                }
                return <p>{children}</p>;
              },
            }}
          >
            {markdown}
          </ReactMarkdown>
        </article>
      </div>
    </section>
  );
};

export default ArticleViewer;
