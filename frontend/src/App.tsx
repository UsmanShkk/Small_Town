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

type NewsItem = {
  messageId: string;
  subject: string;
  from: string;
  date: string;
  newsText: any;
  imageUrl: string | null;
};

function App() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/news');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(data);

        const items: NewsItem[] = Array.isArray(data?.data)
          ? data.data.map((item: any) => ({
              messageId: item.messageId,
              subject: item.subject,
              from: item.from,
              date: item.date,
              newsText: item.newsText,
              imageUrl: item.imageUrl ? `http://localhost:3000${item.imageUrl}` : null
            }))
          : [];

          if (items.length > 0) {
            setNewsItems(prevItems => [...prevItems, ...items]);
          }
        // const articlesData: Article[] = Array.isArray(data.articles) ? data.articles : [];
        // setArticles(articlesData);
        // setFilteredArticles(articlesData);
        
        // if (articlesData.length > 0) {
        //   const categorySet = new Set(articlesData.map((article) => article.category));
        //   const uniqueCategories = ['all', ...Array.from(categorySet)];
        //   setCategories(uniqueCategories);
        // }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load news articles. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
      
  const interval = setInterval(fetchData, 60000); // Poll every 30 seconds
  
  return () => clearInterval(interval); // Cleanup
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
                {newsItems.length > 0 && (
                  <div className="mb-10">
                    <h2 className="text-2xl font-bold mb-4">Latest News</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {newsItems.map((item) => {
                        const isAccepted = typeof item.newsText === 'object' && item.newsText?.image === 'accepted';
                        const reportText = typeof item.newsText === 'object' ? item.newsText?.report_text : String(item.newsText ?? '');
                        const place = typeof item.newsText === 'object' ? item.newsText?.place : null;
                        const risk = typeof item.newsText === 'object' ? item.newsText?.risk_level : null;
                        return (
                         
                          <div key={item.messageId} className="bg-white rounded-xl shadow p-4 flex flex-col">
                            <div className="mb-3">

                              <h3 className="text-lg font-semibold">{item.subject}</h3>
                              <p className="text-sm text-slate-500">{item.from}</p>
                              <p className="text-xs text-slate-400">{new Date(item.date).toLocaleString()}</p>
                            </div>
                            {isAccepted && item.imageUrl && (
                              <img
                                src={item.imageUrl}
                                alt={item.subject}
                                className="w-full h-48 object-cover rounded-md mb-3"
                                loading="lazy"
                              />
                            )}
                            {reportText && (
                              <p className="text-sm text-slate-700 whitespace-pre-line mb-2">{reportText}</p>
                            )}
                            <div className="mt-auto flex items-center justify-between text-xs text-slate-500">
                              {place ? <span className="px-2 py-0.5 bg-slate-100 rounded">{place}</span> : <span />}
                              {risk ? (
                                <span className={`px-2 py-0.5 rounded ${
                                  risk === 'high' ? 'bg-red-100 text-red-700' : risk === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                                }`}>
                                  {risk}
                                </span>
                              ) : null}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
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