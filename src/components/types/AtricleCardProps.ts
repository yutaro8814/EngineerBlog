export interface ArticleCardProps {
  categories: string[];
  createDate: string;
  id: number;
  title: string;
  imageURL: string;
  articleMdURL?: string;
  cardBgColorDark?: string;
  delFlag?:boolean;
  isDraft?:boolean;
};

export interface categoryColorProps {
  categoryColor: string;
  categotryTextColor:string;
  categoryColorDark:string;
  categotryTextColorDark:string;
}