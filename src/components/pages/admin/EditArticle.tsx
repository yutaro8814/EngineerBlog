// src/components/pages/EditArticle.tsx
import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { db } from "../../../firebase";
import { collection, getDocs, updateDoc } from "firebase/firestore";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import {
  categoryColorProps,
  ArticleCardProps,
} from "../../types/AtricleCardProps";
import { getCategoryColor } from "../../../functions/ArticleCardFunction";
import LinkCard from "../../cards/LinkCard";
import { Element } from "hast";
import ActionButton from "../../ui/ActionButton";

/* ---------- Fireforce 設定 ---------- */
const COLLECTION = import.meta.env.VITE_FIREFORCE_COLLECTION!;
const CATEGORY_TYPE = import.meta.env.VITE_FIREFORCE_CATEGORY_TYPE!;

/* ---------- AWS 設定 ---------- */
const REGION = import.meta.env.VITE_S3_REGION!;
const BUCKET = import.meta.env.VITE_S3_BUCKET!;

const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY!,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_KEY!,
  },
});

const EditArticle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [categories, setCategories] = useState<string[]>([]);
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [articleMdURL, setArticleMdURL] = useState<string | null>(null);
  // const [isDrafe, setIsDraft] = useState<boolean>(false);
  const [uploading, setUploading] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;

      try {
        const categorySnapshots = await getDocs(collection(db, CATEGORY_TYPE));
        const categories: string[] = [];
        categorySnapshots.forEach((doc) => {
          const data = doc.data();
          data.type.forEach((cat: string) => {
            if (!categories.includes(cat)) {
              categories.push(cat);
            }
          });
        });
        setCategories(categories);

        // ① Firestoreからコレクションを全部取得
        const snapshot = await getDocs(collection(db, COLLECTION));

        // ② idが一致するドキュメントを探す
        const doc = snapshot.docs.find((doc) => {
          const data = doc.data();
          return data.id === Number(id); // idは数値型なのでNumber変換する
        });

        if (!doc) {
          return;
        }

        const data = doc.data() as ArticleCardProps;
        setTitle(data.title);
        setImageURL(data.imageURL ?? null);
        setArticleMdURL(data.articleMdURL ?? null);
        setSelectedCategories(data.categories ?? []);
        if (data.imageURL) setPreviewImage(data.imageURL);

        if (data.articleMdURL) {
          const res = await fetch(data.articleMdURL);
          if (!res.ok) throw new Error("Markdown取得失敗");
          const text = await res.text();
          setMarkdown(text);
        }
      } catch (error) {
        console.error(error);
        alert("記事の読み込みに失敗しました");
      }
    };

    fetchArticle();
  }, [id, navigate]);

  const handleTitleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const key = `uploads/${Date.now()}_${crypto.randomUUID()}.${file.name
        .split(".")
        .pop()}`;
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      await s3.send(
        new PutObjectCommand({
          Bucket: BUCKET,
          Key: key,
          Body: uint8Array, // ←これで型エラー解消！
          ContentType: file.type,
        })
      );

      const url = `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;
      setPreviewImage(URL.createObjectURL(file));
      setImageURL(url);
    } catch (err) {
      console.error(err);
      alert("タイトル画像アップロードに失敗しました");
    } finally {
      setUploading(false);
    }
  };

  const handleBodyImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const key = `uploads/${Date.now()}_${crypto.randomUUID()}.${file.name
        .split(".")
        .pop()}`;
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      await s3.send(
        new PutObjectCommand({
          Bucket: BUCKET,
          Key: key,
          Body: uint8Array, // ←これで型エラー解消！
          ContentType: file.type,
        })
      );

      const url = `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;
      setMarkdown((prev) => prev + `\n\n![${file.name}](${url})\n\n`);
    } catch (err) {
      console.error(err);
      alert("本文画像アップロードに失敗しました");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      void handleBodyImageUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleUpdateArticle = async (isDraft: boolean) => {
    if (!id || !articleMdURL) return;
    if (!title.trim()) return alert("タイトルを入力してください");
    if (!imageURL) return alert("タイトル画像を選択してください");
    if (!selectedCategories.length)
      return alert("少なくとも1つタグを選択してください");

    const confirmed = window.confirm(
      isDraft ? "下書きとして保存しますか？" : "記事を投稿しますか？"
    );
    if (!confirmed) return;

    try {
      setUploading(true);

      // ① S3へMarkdown更新
      const url = new URL(articleMdURL);
      const key = url.pathname.slice(1);
      const encoder = new TextEncoder();
      await s3.send(
        new PutObjectCommand({
          Bucket: BUCKET,
          Key: key,
          Body: encoder.encode(markdown), // ← テキストをUint8Arrayにして渡す！
          ContentType: "text/markdown; charset=utf-8",
        })
      );

      // ② Firestoreのドキュメントを探して更新
      const snapshot = await getDocs(collection(db, COLLECTION));
      const targetDoc = snapshot.docs.find((doc) => {
        const data = doc.data();
        return data.id === Number(id); // 数値比較
      });

      if (!targetDoc) {
        alert("記事が見つかりませんでした");
        return;
      }

      await updateDoc(targetDoc.ref, {
        title,
        imageURL,
        categories: selectedCategories,
        isDraft,
      });

      // 完了メッセージを出してOKを押したら遷移！
      window.alert(isDraft ? "下書きを保存しました" : "記事を投稿しました");

      // 下書き保存でない場合は、記事ページに遷移
      if (!isDraft) navigate(`/articles/${id}`);
    } catch (error) {
      console.error(error);
      alert("更新に失敗しました");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteArticle = async () => {
    if (!id) return;

    const confirmed = window.confirm("本当にこの記事を削除しますか？");
    if (!confirmed) return;

    try {
      setUploading(true);

      // Firestoreからコレクション取得
      const snapshot = await getDocs(collection(db, COLLECTION));
      const targetDoc = snapshot.docs.find((doc) => {
        const data = doc.data();
        return data.id === Number(id);
      });

      if (targetDoc) {
        await updateDoc(targetDoc.ref, {
          delFlag: true,
        });

        window.alert("記事を削除しました！");
        navigate("/");
      } else {
        throw new Error("対象記事が見つかりませんでした");
      }
    } catch (error) {
      console.error(error);
      alert("記事の削除に失敗しました");
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="min-h-screen py-8 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-center">
          Edit Article
        </h2>

        <div className="grid grid-cols-2">
          {/* タイトル・画像アップロード */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-2">
            <div className="mb-2 mr-2">
              <label className="block text-xl font-bold mb-2">
                記事のタイトル
              </label>
              <input
                className="w-full p-2 rounded-lg border dark:bg-gray-900"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="mb-2">
              <label className="block text-xl font-bold mb-2">
                タイトル画像をアップロード
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                id="fileInput"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void handleTitleImageUpload(file);
                }}
                {...(uploading && { disabled: true })} // アップロード中はボタンを無効化
              />
              <div className="flex items-left">
                <label
                  htmlFor="fileInput"
                  className="inline-block px-3 py-2 rounded-lg bg-primary-600 text-white
                     cursor-pointer hover:bg-primary-700 transition w-32 flex items-center justify-center"
                >
                  画像選択
                </label>

                {previewImage && (
                  <span className="mx-2 text-sm flex items-center">
                    タイトル画像選択済み
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* タグ選択 */}
          <div>
            <label className="block text-xl font-bold mb-2">タグを選択</label>
            {categories.map((category) => {
              const categoryColors: categoryColorProps = getCategoryColor();
              const isSelected = selectedCategories.includes(category);

              const handleCategoryClick = () => {
                if (isSelected) {
                  setSelectedCategories((prev) =>
                    prev.filter((c) => c !== category)
                  );
                } else {
                  setSelectedCategories((prev) => [...prev, category]);
                }
              };

              return (
                <button
                  key={category}
                  onClick={handleCategoryClick}
                  className={`inline-block px-3 py-1 rounded cursor-pointer mr-2 mb-2 text-xs font-medium transition
                    ${
                      isSelected
                        ? `${categoryColors.categoryColor} ${categoryColors.categotryTextColor} dark:${categoryColors.categoryColorDark} dark:${categoryColors.categotryTextColorDark}`
                        : `bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200`
                    }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Editor / Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="font-bold mb-3">Markdown Editor</h3>
            <div onDrop={handleDrop} onDragOver={handleDragOver}>
              <textarea
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                placeholder="ここに Markdown..."
                className="w-full h-[550px] p-4 rounded-lg border dark:bg-gray-900 overflow-auto"
              />
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-3">プレビュー</h3>
            <div className="w-full min-h-[550px] prose lg:prose-lg dark:prose-invert max-w-none bg-white dark:bg-gray-900 p-4 rounded-lg border overflow-auto space-y-6">
              {previewImage && (
                <div className="relative w-full aspect-[16/9] overflow-hidden rounded">
                  <img
                    src={previewImage}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              )}
              {title && <h1>{title}</h1>}
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
            </div>
          </div>
        </div>

        {/* Updateボタン */}
        <div className="mt-2 flex items-center gap-4">
          <ActionButton
            onClick={() => handleUpdateArticle(false)}
            label="記事を投稿"
            colorScheme="primary"
            {...(uploading && { disabled: true })} // アップロード中はボタンを無効化
          />
          <ActionButton
            onClick={() => handleUpdateArticle(true)}
            label="下書き保存"
            colorScheme="info"
            {...(uploading && { disabled: true })} // アップロード中はボタンを無効化
          />
          <ActionButton
            onClick={() => handleDeleteArticle}
            label="記事を削除"
            colorScheme="danger" // ← こっちは赤色ボタン
            {...(uploading && { disabled: true })} // アップロード中はボタンを無効化
          />
        </div>
      </div>
    </section>
  );
};

export default EditArticle;
