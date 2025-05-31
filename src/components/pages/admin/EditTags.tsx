import { useEffect, useState } from "react";
import { getCategoryColor } from "../../../functions/ArticleCardFunction";
import { categoryColorProps } from "../../types/AtricleCardProps";
import { useAppContext } from "../../../hooks/AppContext";
import { updateCategories } from "../../../functions/firestoreFetchers";

const EditTags: React.FC = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const { state, dispatch} = useAppContext();

  const handleAddCategory = async () => {

    // 1. 新しいカテゴリが空でないか確認
    if (newCategory.trim() === "") {
      alert("タグを入力してください。");
      return;
    }; 

    // 2. スペースを含む場合は無効
    if (newCategory.includes(" ")) {  
      alert("スペースを含むタグは無効です。");
      return;
    }

    // 3. 2文字未満は無効
    if (newCategory.length < 2) { 
      alert("タグは2文字以上で入力してください。");
      return;
    }

    // 4. 20文字以上は無効
    if (newCategory.length > 20) { 
      alert("タグは20文字以内で入力してください。");
      return;
    }

    // 5. 半角英数字以外は無効
    if (newCategory.match(/^[0-9a-zA-Z]+$/) === null) { 
      
      alert("半角英数字以外は無効です。");
      return;
    }

    // 6. 半角英字で始まらない場合は無効
    if (newCategory.match(/^[a-zA-Z]/) === null) { 
      alert("半角英字で始まるタグを入力してください。");
      return;
    }

    // 7. 新しいカテゴリが既に存在しないか確認
    if (categories.includes(newCategory)) {
      alert("このタグは既に存在します。");
      return;
    }

    // 8. 確認メッセージを表示
    const confirmed = window.confirm(
      `新しいタグ "${newCategory}" を追加しますか？`
    );
    if (!confirmed) return;

    // 9. Firestoreに新しいカテゴリを追加
    const updated = [...categories, newCategory];
    await updateCategories(updated); // Firestoreの更新

    // 10. カテゴリを更新
    setCategories(updated); // カテゴリを更新
    dispatch({ type: "SET_CATEGORIES", payload: updated }); // カテゴリを更新
    setNewCategory(""); // 入力フィールドをリセット
  };

  const handleSelectCategory = (cat: string) => {
    setSelected((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleBulkDelete = async () => {
    if (selected.length === 0) return;

    // 1. 使用されているタグと対応するtitleを収集
    const usedTags: { tag: string; title: string }[] = [];

    // 2. 記事リストがnullでない場合、使用中のタグを収集
    //    記事リストがnullの場合、全てのタグを削除可能
    if (state.articlesList !== null) {
      state.articlesList.forEach((data) => {
        if (!data || data.delFlag) return;

        selected.forEach((tag) => {
          if (data.categories?.includes(tag)) {
            usedTags.push({ tag, title: data.title });
          }
        });
      });

      // 3. 使用中なら削除キャンセル
      if (usedTags.length > 0) {
        const messages = usedTags
          .map((u) => `・${u.tag}（"${u.title}"で使用中）`)
          .join("\n");
        alert(`選択のタグは以下タイトル記事で使用中のため削除できません:\n${messages}`);
        return;
      }
    }

    // 4. 確認して削除処理へ
    const confirmed = window.confirm("選択しているタグを削除しますか？");
    if (!confirmed) return;

    const updated = categories.filter((c) => !selected.includes(c));
    await updateCategories(updated); // Firestoreの更新
    dispatch({ type: "SET_CATEGORIES", payload: updated }); // カテゴリを更新
    setCategories(updated); // カテゴリを更新
    setSelected([]); // リセット
  };

  useEffect(() => {
    setCategories(state.categories!);
  }, [state.categories]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8 bg-gray-100 dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
        Edit Tags
      </h1>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="新しいタグを追加"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="p-2 rounded border dark:bg-gray-800 dark:text-white"
        />
        <button
          onClick={handleAddCategory}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          追加
        </button>
        <button
          onClick={handleBulkDelete}
          disabled={selected.length === 0}
          className={`px-4 py-2 rounded text-white ${
            selected.length === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          削除
        </button>
      </div>

      <div className="flex flex-wrap justify-center">
        {categories.map((category) => {
          const colors: categoryColorProps = getCategoryColor();
          const isSelected = selected.includes(category);
          return (
            <button
              key={category}
              onClick={() => handleSelectCategory(category)}
              className={`px-3 py-1 rounded mr-2 mb-2 text-xs font-medium transition border
                ${
                  isSelected
                    ? "border-red-500 ring-2 ring-red-300 dark:ring-red-400"
                    : "border-transparent"
                }
                ${colors.categoryColor} ${colors.categotryTextColor} dark:${
                colors.categoryColorDark
              } dark:${colors.categotryTextColorDark}`}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default EditTags;
