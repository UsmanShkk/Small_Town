// App.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Header,
  ArticleList,
  FeaturedArticle,
  CategoryFilter,
  Newsletter,
  Footer,
  Contact ,
  LoadingSpinner
} from './components';
import type { Article } from './types';

function App() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/processEmail');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const articlesData: Article[] = Array.isArray(data.articles) ? data.articles : [];
        setArticles(articlesData);
        setFilteredArticles(articlesData);
        
        if (articlesData.length > 0) {
          const categorySet = new Set(articlesData.map((article) => article.category));
          const uniqueCategories = ['all', ...Array.from(categorySet)];
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load news articles. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (activeCategory === 'all') {
      setFilteredArticles(articles);
    } else {
      setFilteredArticles(articles.filter(article => article.category === activeCategory));
    }
  }, [activeCategory, articles]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {error ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6 shadow-md"
            role="alert"
          >
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </motion.div>
        ) : (
          <AnimatePresence>
            {loading ? (
              <LoadingSpinner />
            ) : (
              <>
                {articles.length > 0 && (
                  <>
                    <FeaturedArticle article={articles[0]} />
                    <CategoryFilter 
                      categories={categories} 
                      activeCategory={activeCategory} 
                      onCategoryChange={handleCategoryChange} 
                    />
                    <ArticleList articles={filteredArticles} />
                  </>
                )}
              </>
            )}
          </AnimatePresence>
        )}
        <Newsletter />
        <Contact></Contact>
      </main>
      <Footer />
    </div>
  );
}

export default App;