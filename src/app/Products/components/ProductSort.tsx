import { motion } from 'framer-motion';

interface ProductSortProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ProductSort({ value, onChange }: ProductSortProps) {
  const sortOptions = [
    { value: "featured", label: "Featured", icon: "⭐" },
    { value: "price-low", label: "Price: Low to High", icon: "📈" },
    { value: "price-high", label: "Price: High to Low", icon: "📉" },
    { value: "name", label: "Name A-Z", icon: "🔤" }
  ];



  return (
    <motion.div 
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 pr-10 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-all duration-300 min-w-[200px] cursor-pointer"
        whileFocus={{
          scale: 1.02
        }}
        transition={{ duration: 0.2 }}
      >
        {sortOptions.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {option.icon} {option.label}
          </option>
        ))}
      </motion.select>

      {/* Custom dropdown arrow */}
      <motion.div 
        className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400 dark:text-gray-500"
        whileHover={{ scale: 1.1 }}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </motion.div>

      {/* Label */}
      <motion.div 
        className="absolute -top-2 left-3 px-2 text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        Sort by
      </motion.div>
    </motion.div>
  );
} 