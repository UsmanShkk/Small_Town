// components/ArticleCard.tsx
import { motion } from 'framer-motion';
import type { ArticleCardProps } from '../types';

const ArticleCard = ({ article, index }: ArticleCardProps) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="bg-white rounded-2xl shadow-md overflow-hidden border border-slate-100 hover:shadow-xl transition-all duration-300"
    >
      <div className="h-48 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10"></div>
        <img 
          src={article.image} 
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute top-4 left-4 z-20">
          <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur-sm text-blue-700 text-xs font-semibold rounded-full shadow-sm">
            {article.category}
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-lg mb-2 text-slate-800 line-clamp-2">{article.title}</h3>
        <p className="text-slate-600 text-sm mb-4 line-clamp-2">{article.excerpt}</p>
        <div className="flex justify-between items-center mb-4">
          <span className="text-slate-500 text-xs">{article.date}</span>
          <span className="text-slate-500 text-xs">By {article.author}</span>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
        >
          Read More
        </motion.button>
      </div>
    </motion.article>
  );
};

export default ArticleCard;