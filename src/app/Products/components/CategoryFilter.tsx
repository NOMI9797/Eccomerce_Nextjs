import { motion } from 'framer-motion';

interface Category {
  $id: string;
  CategoryName: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryFilter({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) {
  const containerVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div 
        className="mb-4 pb-3 border-b border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
          Categories
        </h3>
        <p className="text-xs text-gray-600 dark:text-gray-400">Filter by category</p>
      </motion.div>

      {/* Category List */}
      <motion.div 
        className="space-y-1.5"
        variants={containerVariants}
      >
        {/* All Products Button */}
        <motion.button
          variants={itemVariants}
          whileHover={{ 
            scale: 1.02,
            x: 5
          }}
          whileTap={{ scale: 0.98 }}
          className={`w-full text-left px-3 py-2.5 rounded-lg transition-all duration-300 relative overflow-hidden group ${
            selectedCategory === "all" 
              ? "bg-blue-600 text-white shadow-md" 
              : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
          }`}
          onClick={() => onCategoryChange("all")}
        >
          <span className="relative z-10 font-medium flex items-center text-sm">
            <span className="mr-2 text-blue-600">🏠</span>
            All Products
            {selectedCategory === "all" && (
              <motion.span
                className="ml-auto text-xs bg-white/20 px-1.5 py-0.5 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                Active
              </motion.span>
            )}
          </span>
        </motion.button>

        {/* Category Items */}
        {categories.map((category) => (
          <motion.button
            key={category.$id}
            variants={itemVariants}
            whileHover={{ 
              scale: 1.02,
              x: 5
            }}
            whileTap={{ scale: 0.98 }}
            className={`w-full text-left px-3 py-2.5 rounded-lg transition-all duration-300 relative overflow-hidden group ${
              selectedCategory === category.$id 
                ? "bg-purple-600 text-white shadow-md" 
                : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
            }`}
            onClick={() => onCategoryChange(category.$id)}
          >
            <span className="relative z-10 font-medium flex items-center text-sm">
              <span className="mr-2">
                {getCategoryIcon(category.CategoryName)}
              </span>
              {category.CategoryName}
              {selectedCategory === category.$id && (
                <motion.span
                  className="ml-auto text-xs bg-white/20 px-1.5 py-0.5 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Active
                </motion.span>
              )}
            </span>
          </motion.button>
        ))}
      </motion.div>

      {/* Stats Section */}
      <motion.div 
        className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Available Categories</p>
          <motion.span 
            className="text-xl font-bold text-gray-900 dark:text-white"
          >
            {categories.length + 1}
          </motion.span>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Helper function to get category icons
function getCategoryIcon(categoryName: string): string {
  const name = categoryName.toLowerCase();
  if (name.includes('men') || name.includes('man')) return '👔';
  if (name.includes('women') || name.includes('woman')) return '👗';
  if (name.includes('child') || name.includes('kid')) return '🧸';
  if (name.includes('shoe') || name.includes('foot')) return '👟';
  if (name.includes('bag') || name.includes('purse')) return '👜';
  if (name.includes('watch') || name.includes('time')) return '⌚';
  if (name.includes('electronic') || name.includes('tech')) return '📱';
  if (name.includes('home') || name.includes('house')) return '🏠';
  if (name.includes('sport') || name.includes('fitness')) return '⚽';
  if (name.includes('beauty') || name.includes('cosmetic')) return '💄';
  return '📦'; // Default icon
} 