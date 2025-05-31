// src/contexts/AppContext.tsx
import React, { createContext, useContext, useEffect, useReducer } from "react";
import { ArticleCardProps } from "../components/types/AtricleCardProps";
import { fetchArticles, fetchCategories } from "../functions/firestoreFetchers";

// ---------- 型定義 ----------
type State = {
  categories: string[] | null;
  articlesList: ArticleCardProps[] | null;
  loading: boolean;
};

type Action =
  | { type: "SET_CATEGORIES"; payload: string[] }
  | { type: "SET_ARTICLES_LIST"; payload: ArticleCardProps[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "RESET" }
  | { type: "RESET_ARTICLES_LIST" };

// ---------- 初期状態 ----------
const initialState: State = {
  categories: null,
  articlesList: null,
  loading: true,
};

// ---------- reducer ----------
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_CATEGORIES":
      return { ...state, categories: action.payload };
    case "SET_ARTICLES_LIST":
      return { ...state, articlesList: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "RESET":
      return initialState;
    case "RESET_ARTICLES_LIST":
      return { ...state, articlesList: null };
    default:
      return state;
  }
};

// ---------- Context ----------
const AppContext = createContext<
  | {
      state: State;
      dispatch: React.Dispatch<Action>;
    }
  | undefined
>(undefined);

// ---------- Provider ----------
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({ type: "SET_LOADING", payload: true });
  
    const fetchData = async () => {
      try {
        const categories = await fetchCategories();
        dispatch({ type: "SET_CATEGORIES", payload: categories });
        const articles = await fetchArticles();
        dispatch({ type: "SET_ARTICLES_LIST", payload: articles });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };
  
    fetchData();
  }, []); 

  console.log("AppContext state:", state); // 追加: stateの内容をログに出力

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// ---------- カスタムフック ----------
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
