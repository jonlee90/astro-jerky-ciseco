import { AnimatePresence, motion } from "framer-motion";
import astroLogo from '@/assets/images/astro-logo.png';

interface LoadingScreenProps {
  isLoading: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading }) => {
  
  return isLoading ? (
        <AnimatePresence>
          <motion.div
            key={isLoading ? "loading" : "not-loading"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-white z-50"
            role="alert"
            aria-live="assertive"
          >
            <motion.img
              src={astroLogo}
              alt="Loading"
              className="w-20 h-20"
              initial={{ scale: 0.9 }}
              animate={{ scale: [0.9, 1.1, 0.9] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <span className="sr-only">Loading, please wait...</span>
          </motion.div>
        </AnimatePresence>
      ): null;
};

export default LoadingScreen;
