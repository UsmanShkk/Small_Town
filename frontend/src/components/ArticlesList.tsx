import { motion } from 'framer-motion';
import ArticleCard from './ArticleCard';
import type { ArticleListProps } from '../types';

const ArticleList = ({ articles }: ArticleListProps) => {
  if (articles.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <h3 className="text-xl text-gray-600">No articles found in this category.</h3>
      </motion.div>
    );
  }

  return (
    <section className="py-8">
      <motion.h2 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-2xl font-bold mb-6 text-gray-800"
      >
        Latest News
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, index) => (
          <ArticleCard 
            key={article.id} 
            article={article} 
            index={index}
          />
        ))}
      </div>
    </section>
  );
};

export default ArticleList;