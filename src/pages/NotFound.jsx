import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

const ArrowLeftIcon = getIcon('ArrowLeft');
const FileQuestionIcon = getIcon('FileQuestion');

const NotFound = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center"
    >
      <div className="mb-6">
        <motion.div
          initial={{ scale: 0.8, rotate: -10 }}
          animate={{ 
            scale: 1, 
            rotate: [0, 10, 0, -10, 0],
            transition: { 
              duration: 0.5,
              rotate: {
                repeat: Infinity,
                repeatType: "mirror",
                duration: 5,
                ease: "easeInOut"
              }
            }
          }}
          className="inline-block text-primary dark:text-primary-light"
        >
          <FileQuestionIcon className="w-24 h-24 md:w-32 md:h-32" />
        </motion.div>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-surface-900 dark:text-white">
        Page Not Found
      </h1>

      <p className="mb-8 text-lg text-surface-600 dark:text-surface-400 max-w-md">
        We couldn't find the page you're looking for. It might have been moved or doesn't exist.
      </p>

      <Link
        to="/"
        className="flex items-center justify-center space-x-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-all duration-200"
      >
        <ArrowLeftIcon className="w-5 h-5" />
        <span>Go back home</span>
      </Link>
    </motion.div>
  );
};

export default NotFound;