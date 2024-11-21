import { AnimatePresence, motion } from "framer-motion";

interface LoadingScreenProps {
  isLoading: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading }) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center bg-white z-50"
        >
          <motion.img
            src={'https://cdn.shopify.com/s/files/1/0641/9742/7365/files/astro-logo.png?v=1708205146'}
            alt="Loading"
            initial={{ scale: 0.9 }}
            animate={{ scale: [0.9, 1.1, 0.9] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="size-20"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
