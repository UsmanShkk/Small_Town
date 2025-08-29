// types/index.ts
export interface Article {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  date: string;
  author: string;
}

export interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export interface ArticleListProps {
  articles: Article[];
}

export interface ArticleCardProps {
  article: Article;
  index: number;
}

export interface FeaturedArticleProps {
  article: Article | undefined;
}