// src/components/ui/TitleInput.tsx
import React from "react";

type TitleInputProps = {
  title: string;
  onChange: (newTitle: string) => void;
};

const TitleInput: React.FC<TitleInputProps> = ({ title, onChange }) => {
  return (
    <div className="mb-2 mr-2">
      <label className="block text-xl font-bold mb-2">記事のタイトル</label>
      <input
        type="text"
        value={title}
        onChange={(e) => onChange(e.target.value)}
        placeholder="タイトルを入力"
        className="w-full p-2 rounded-lg border dark:bg-gray-900"
      />
    </div>
  );
};

export default TitleInput;
