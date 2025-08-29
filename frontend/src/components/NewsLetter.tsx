// components/Newsletter.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting email:', email);
    setSubscribed(true);
    setEmail('');
    
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl my-12 text-white"
    >
      <div className="container mx-auto px-4 text-center max-w-3xl">
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-4"
        >
          Stay Updated with Our Community
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-blue-100 mb-8 text-lg"
        >
          Get the latest news and updates delivered directly to your inbox. 
          Join our newsletter to stay informed about what's happening in your community.
        </motion.p>
        
        {subscribed ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white text-green-700 py-4 px-6 rounded-xl inline-block shadow-lg"
          >
            <span className="font-semibold">Thank you for subscribing!</span> Check your email for confirmation.
          </motion.div>
        ) : (
          <motion.form 
            onSubmit={handleSubmit} 
            className="max-w-md mx-auto flex flex-col sm:flex-row gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-grow px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50"
              required
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors shadow-md"
            >
              Subscribe
            </motion.button>
          </motion.form>
        )}
      </div>
    </motion.section>
  );
};

export default Newsletter;