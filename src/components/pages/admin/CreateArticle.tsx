// src/components/pages/CreateArticle.tsx
import React, { useEffect, useRef, useState } from "react"; // ← useRef 追加
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import rehypeSlug from "rehype-slug";
import LinkCard from "../../cards/LinkCard";
import { Element } from "hast";
import { categoryColorProps } from "../../types/AtricleCardProps";
import { getCategoryColor } from "../../../functions/ArticleCardFunction";
import { addDoc, collection, getDocs, Timestamp } from "firebase/firestore";
import { db } from "../../../firebase";
import { useNavigate } from "react-router-dom";
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

const CreateArticle: React.FC = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [markdown, setMarkdown] = useState("");
  const [title, setTitle] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate(); //

  useEffect(() => {
    const fetchCategories = async () => {
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
    };
  
    fetchCategories(); // 非同期関数を呼び出す
  }, []);
  

  /* 画像アップロード（タイトル画像用） ------------------------ */
  const handleTitleImageUpload = async (file: File) => {
    try {
      setUploading(true);

      const key = `uploads/${Date.now()}_${crypto.randomUUID()}.${file.name
        .split(".")
        .pop()}`;
      await new Upload({
        client: s3,
        params: {
          Bucket: BUCKET,
          Key: key,
          Body: file,
          ContentType: file.type,
        },
      }).done();

      const url = `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;
      setPreviewImage(URL.createObjectURL(file)); // プレビュー表示用
      setImageURL(url); // Firestoreに保存用
      console.log("タイトル画像アップロード成功:", url);
    } catch (err) {
      console.error(err);
      alert("タイトル画像アップロードに失敗しました");
    } finally {
      setUploading(false);
    }
  };

  /* 画像アップロード（本文用） ------------------------ */
  const handleBodyImageUpload = async (file: File) => {
    try {
      setUploading(true);

      const key = `uploads/${Date.now()}_${crypto.randomUUID()}.${file.name
        .split(".")
        .pop()}`;
      await new Upload({
        client: s3,
        params: {
          Bucket: BUCKET,
          Key: key,
          Body: file,
          ContentType: file.type,
        },
      }).done();

      const url = `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;
      setMarkdown((prev) => prev + `\n\n![${file.name}](${url})\n\n`);
      console.log("本文用画像アップロード成功:", url);
    } catch (err) {
      console.error(err);
      alert("本文画像アップロードに失敗しました");
    } finally {
      setUploading(false);
    }
  };

  /* ドラッグ＆ドロップ（本文画像用） ------------------------ */
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      void handleBodyImageUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  /* Markdown を .md として保存 ------------------------------- */
  const handleSaveArticle = async (isDraft: boolean) => {
    if (!title.trim()) return alert("タイトルを入力してください");
    if (!previewImage) return alert("タイトル画像を選択してください");
    if (!markdown.trim()) return alert("本文が空です");
    if (selectedCategories.length === 0)
      return alert("少なくとも1つタグを選択してください");

    const confirmed = window.confirm(
      isDraft ? "下書きとして保存しますか？" : "記事を投稿しますか？"
    );
    if (!confirmed) return;

    try {
      setUploading(true);
      setMessage(null);

      const date = new Date().toISOString().slice(0, 10);
      const key = `articles/${date}/${crypto.randomUUID()}.md`;

      // ① MarkdownファイルをS3にアップロード
      await new Upload({
        client: s3,
        params: {
          Bucket: BUCKET,
          Key: key,
          Body: markdown,
          ContentType: "text/markdown; charset=utf-8",
        },
      }).done();

      const articleMdURL = `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;

      // ② ここで現在のドキュメント数を取得
      const snapshot = await getDocs(collection(db, COLLECTION));
      const nextId = snapshot.size + 1; // ← ドキュメント数 + 1

      // ③ Firestoreに記事メタデータを保存
      await addDoc(collection(db, COLLECTION), {
        id: nextId,
        title,
        articleMdURL,
        imageURL: imageURL,
        createDate: Timestamp.now(),
        categories: selectedCategories,
        isDraft,
        delFlag: false, // ← 新規作成時はfalse
      });

      // 完了メッセージを出してOKを押したら遷移！
      window.alert(isDraft ? "下書きを保存しました" : "記事を投稿しました");

      // 下書き保存でない場合は、記事ページに遷移
      if (!isDraft) navigate(`/articles/${nextId}`);
    } catch (err) {
      console.error(err);
      setMessage("記事の保存に失敗しました😢");
    } finally {
      setTitle("");
      setMarkdown("");
      setPreviewImage(null);
      setImageURL(null);
      setSelectedCategories([]);
      if (fileInputRef.current) fileInputRef.current.value = ""; // inputの値をリセット
      setUploading(false);
    }
  };

  /* ---------- UI ---------- */
  return (
    <section className="min-h-screen py-8 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-center">
          Create Article
        </h2>
        <div className="grid grid-cols-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-2">
            {/* タイトル入力 */}
            <div className="mb-2 mr-2">
              <label className="block text-xl font-bold mb-2">
                記事のタイトル
              </label>
              <input
                className="w-full p-2 rounded-lg border dark:bg-gray-900"
                placeholder="タイトルを入力"
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* タイトル画像アップロード */}
            <div className="mb-2">
              <label className="block text-xl font-bold mb-2">
                タイトル画像をアップロード
              </label>

              {/* 見せない input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                id="fileInput"
                className="sr-only" /* 画面から隠す */
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    void handleTitleImageUpload(file); // ←★ここを新しいhandleTitleImageUploadに変える！
                  }
                }}
              />
              <div className="flex items-left">
                {/* カスタムボタン */}
                <label
                  htmlFor="fileInput"
                  className="inline-block px-3 py-2 rounded-lg bg-primary-600 text-white
               cursor-pointer hover:bg-primary-700 transition w-32 flex items-center justify-center"
                >
                  画像選択
                </label>

                {/* 選択済みファイル名表示 */}
                {(previewImage && (
                  <span className="mx-2 text-sm flex items-center">
                    タイトル画像選択済み
                  </span>
                )) || (
                  <span className="mx-2 text-sm flex items-center">
                    タイトル画像が選択されていません
                  </span>
                )}
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xl font-bold mb-2">タグを選択</label>
            {categories.map((category) => {
              const categoryColors: categoryColorProps = getCategoryColor();
              const isSelected = selectedCategories.includes(category);

              const handleCategoryClick = () => {
                if (isSelected) {
                  // すでに選択されていたら除外
                  setSelectedCategories((prev) =>
                    prev.filter((c) => c !== category)
                  );
                } else {
                  // 選択されていなかったら追加
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
          {/* Editor */}
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
            {uploading && (
              <p className="text-primary-600 mt-2">Uploading image…</p>
            )}
          </div>

          {/* Preview */}
          <div>
            <h3 className="font-bold mb-3">プレビュー</h3>
            <div
              className="w-full min-h-[550px] prose lg:prose-lg dark:prose-invert max-w-none                 
                bg-white dark:bg-gray-900 p-4 rounded-lg border
                overflow-auto space-y-6"
            >
              {previewImage && (
                <div className="relative w-full aspect-[16/9] overflow-hidden rounded">
                  <img
                    src={previewImage}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {/* × ボタン */}
                  <button
                    onClick={() => {
                      setPreviewImage(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="absolute top-2 right-2 bg-black/60 text-white rounded-full
                               w-7 h-7 flex items-center justify-center hover:bg-black/80"
                  >
                    ×
                  </button>
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

        {/* Save button */}
        <div className="mt-2 flex items-center gap-4">
          <ActionButton
            label="記事を投稿"
            onClick={() => handleSaveArticle(false)}
            colorScheme="primary" // ← ここで色を指定
          />
          <ActionButton
            label="下書き保存"
            onClick={() => handleSaveArticle(true)} // 下書き保存
            colorScheme="info" // ← ここで色を指定
          />
          {message && <span>{message}</span>}
        </div>
      </div>
    </section>
  );
};

export default CreateArticle;
