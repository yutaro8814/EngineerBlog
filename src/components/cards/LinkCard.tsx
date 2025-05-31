import React, { useEffect, useState } from "react";
import { Meta } from "../types/Meta";

const ENDPOINT = import.meta.env.VITE_API_ENDPOINT!;

const LinkCard: React.FC<{ url: string }> = ({ url }) => {
  const [meta, setMeta] = useState<Meta | null>(null);

  useEffect(() => {
    (async () => {
      try {
        /* ① url を必ず encodeURIComponent する */
        const api = `${ENDPOINT}?url=${url}`;

        /* ② fetch 成功チェック */
        const res = await fetch(api);
        if (!res.ok) throw new Error(`status ${res.status}`);
        const getMetadata = await res.json();

        /* ③ 取得したメタデータを整形 */
        const metaData: Meta = {
          url: getMetadata.url,
          title: getMetadata.title,
          description: getMetadata.description,
          image: getMetadata.image,
          faviconUrl: `https://www.google.com/s2/favicons?sz=64&domain_url=${
            new URL(getMetadata.url).hostname
          }`,
        };

        setMeta(metaData); // 取得したメタデータをセット
      } catch (e) {
        console.error("OG fetch failed:", e);
        setMeta(null); // フォールバック
      }
    })();
  }, [url]);

  /* 取得失敗 or まだロード中 → テキストリンク */
  if (!meta) {
    return (
      <a href={url} className="text-primary-600 underline" target="_blank">
        {url}
      </a>
    );
  }

  /* ここからカード描画 */
  return (
    <a
      href={meta.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex border rounded-lg overflow-hidden hover:shadow-md transition bg-white dark:bg-gray-800 not-prose"
    >
      {meta.image && (
        <img
          src={meta.image}
          alt=""
          className="w-32 h-32 object-cover flex-shrink-0"
        />
      )}

      <div className="p-2 flex-1">
        <p className="font-semibold mb-1 line-clamp-2">{meta.title}</p>
        {meta.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {meta.description}
          </p>
        )}
        <div className="flex items-center mt-2">
        {meta.faviconUrl && (
            <img
              src={meta.faviconUrl}
              alt=""
              className="w-7 h-7 object-cover flex-shrink-0"
            />
          )}
          <p className="text-xs text-primary-600 mt-2 mb-2 ml-2">
            {new URL(meta.url).hostname}
          </p>
        </div>
      </div>
    </a>
  );
};

export default LinkCard;
