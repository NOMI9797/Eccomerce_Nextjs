import { motion } from 'framer-motion';

interface CategoryFilterProps {
  categories: any[];
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
      className="bg-black/60 backdrop-blur-sm border border-cyan-400/30 rounded-xl p-6 sticky top-6"
      style={{
        background: 'linear-gradient(145deg, rgba(0,0,0,0.8), rgba(30,30,30,0.6))',
        boxShadow: '0 0 30px rgba(0, 255, 255, 0.1)'
      }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header with neon effect */}
      <motion.div 
        className="mb-6 pb-4 border-b border-cyan-400/20"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-2">
          Categories
        </h3>
        <p className="text-sm text-gray-400">Filter by category</p>
      </motion.div>

      {/* Category List */}
      <motion.div 
        className="space-y-2"
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
          className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 relative overflow-hidden group ${
            selectedCategory === "all" 
              ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg" 
              : "text-gray-300 hover:text-white border border-gray-600/50 hover:border-cyan-400/50"
          }`}
          onClick={() => onCategoryChange("all")}
          style={selectedCategory === "all" ? {
            boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)'
          } : {}}
        >
          <span className="relative z-10 font-medium flex items-center">
            <span className="mr-3 text-cyan-400">🏠</span>
            All Products
            {selectedCategory === "all" && (
              <motion.span
                className="ml-auto text-xs bg-white/20 px-2 py-1 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                Active
              </motion.span>
            )}
          </span>
          {selectedCategory !== "all" && (
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          )}
        </motion.button>

        {/* Category Items */}
        {categories.map((category, index) => (
          <motion.button
            key={category.$id}
            variants={itemVariants}
            whileHover={{ 
              scale: 1.02,
              x: 5
            }}
            whileTap={{ scale: 0.98 }}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 relative overflow-hidden group ${
              selectedCategory === category.$id 
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg" 
                : "text-gray-300 hover:text-white border border-gray-600/50 hover:border-purple-400/50"
            }`}
            onClick={() => onCategoryChange(category.$id)}
            style={selectedCategory === category.$id ? {
              boxShadow: '0 0 20px rgba(147, 51, 234, 0.4)'
            } : {}}
          >
            <span className="relative z-10 font-medium flex items-center">
              <span className="mr-3">
                {getCategoryIcon(category.CategoryName)}
              </span>
              {category.CategoryName}
              {selectedCategory === category.$id && (
                <motion.span
                  className="ml-auto text-xs bg-white/20 px-2 py-1 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Active
                </motion.span>
              )}
            </span>
            {selectedCategory !== category.$id && (
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            )}
          </motion.button>
        ))}
      </motion.div>

      {/* Stats Section */}
      <motion.div 
        className="mt-6 pt-4 border-t border-cyan-400/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <div className="text-center">
          <p className="text-xs text-gray-400 mb-2">Available Categories</p>
          <motion.span 
            className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400"
            whileHover={{
              textShadow: '0 0 10px rgba(0, 255, 255, 0.6)'
            }}
          >
            {categories.length + 1}
          </motion.span>
        </div>
      </motion.div>

      {/* Decorative glow */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-xl blur opacity-20 -z-10" />
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