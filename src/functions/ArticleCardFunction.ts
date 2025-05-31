import { CardType } from "../components/constants/ArticleProps";
import { categoryColorProps } from "../components/types/AtricleCardProps";

export const setCardBgColor = (cardType: CardType): string => {
  switch (cardType) {
    case CardType.FeaturedCard:
      return "bg-gray-700";
    case CardType.AtricleList:
      return "bg-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getCategoryColor = (): categoryColorProps => {
  return {
    categoryColor: "bg-green-100",
    categotryTextColor: "text-green-600",
    categoryColorDark: "bg-green-900",
    categotryTextColorDark: "text-green-300",
  };
};
