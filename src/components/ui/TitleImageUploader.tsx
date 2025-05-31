// src/components/ui/TitleImageUploader.tsx
import React, { useRef } from "react";

type TitleImageUploaderProps = {
  previewImage: string | null;
  onFileSelect: (file: File) => void;
  onRemoveImage: () => void;
};

const TitleImageUploader: React.FC<TitleImageUploaderProps> = ({
  previewImage,
  onFileSelect,
  onRemoveImage,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mb-2">
      <label className="block text-xl font-bold mb-2">タイトル画像をアップロード</label>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleFileChange}
      />
      <div className="flex items-left">
        <button
          type="button"
          onClick={triggerFileSelect}
          className="inline-block px-3 py-2 rounded-lg bg-primary-600 text-white
                     cursor-pointer hover:bg-primary-700 transition w-32 flex items-center justify-center"
        >
          画像選択
        </button>

        {previewImage ? (
          <span className="mx-2 text-sm flex items-center">タイトル画像選択済み</span>
        ) : (
          <span className="mx-2 text-sm flex items-center">タイトル画像が選択されていません</span>
        )}
      </div>

      {previewImage && (
        <div className="relative w-full aspect-[16/9] overflow-hidden rounded mt-4">
          <img
            src={previewImage}
            className="absolute inset-0 w-full h-full object-cover"
            alt="プレビュー画像"
          />
          <button
            type="button"
            onClick={onRemoveImage}
            className="absolute top-2 right-2 bg-black/60 text-white rounded-full
                       w-7 h-7 flex items-center justify-center hover:bg-black/80"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default TitleImageUploader;
