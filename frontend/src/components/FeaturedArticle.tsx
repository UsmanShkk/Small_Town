// components/FeaturedArticle.tsx
import { motion } from 'framer-motion';
import type { FeaturedArticleProps } from '../types';

const FeaturedArticle = ({ article }: FeaturedArticleProps) => {
  if (!article) return null;

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="mb-12"
    >
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-lg overflow-hidden border border-slate-100">
        <div className="md:flex">
          <div className="md:flex-shrink-0 md:w-1/2">
            <div className="h-80 md:h-full relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/10 z-10"></div>
              <img 
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" 
                src={article.image} 
                alt={article.title} 
              />
            </div>
          </div>
          <div className="p-8 flex flex-col justify-center">
            <div className="flex items-center space-x-2 mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                {article.category}
              </span>
              <span className="text-blue-500 text-sm">• Featured Story</span>
            </div>
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl font-bold text-slate-800 mb-4 leading-tight"
            >
              {article.title}
            </motion.h1>
            <p className="text-slate-600 mb-6 text-lg">{article.excerpt}</p>
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-slate-200 rounded-full mr-3"></div>
              <div>
                <p className="text-sm font-medium text-slate-900">{article.author}</p>
                <p className="text-sm text-slate-500">{article.date}</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="self-start px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
            >
              Read Full Story
            </motion.button>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default FeaturedArticle;