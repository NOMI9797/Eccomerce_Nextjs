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

  const currentOption = sortOptions.find(option => option.value === value) || sortOptions[0];

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
        className="appearance-none bg-black/60 backdrop-blur-sm border border-cyan-400/30 rounded-lg px-4 py-3 pr-10 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 transition-all duration-300 min-w-[200px] cursor-pointer"
        style={{
          background: 'linear-gradient(145deg, rgba(0,0,0,0.8), rgba(30,30,30,0.6))',
          boxShadow: '0 0 20px rgba(0, 255, 255, 0.1)'
        }}
        whileFocus={{
          boxShadow: '0 0 30px rgba(0, 255, 255, 0.3)',
          scale: 1.02
        }}
        transition={{ duration: 0.2 }}
      >
        {sortOptions.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
            className="bg-gray-900 text-white"
          >
            {option.icon} {option.label}
          </option>
        ))}
      </motion.select>

      {/* Custom dropdown arrow */}
      <motion.div 
        className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-cyan-400"
        whileHover={{ scale: 1.1 }}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </motion.div>

      {/* Label */}
      <motion.div 
        className="absolute -top-2 left-3 px-2 text-xs text-cyan-400 bg-black/80 rounded"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        Sort by
      </motion.div>

      {/* Glowing border effect */}
      <div className="absolute inset-0 rounded-lg border border-transparent bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm" />
    </motion.div>
  );
} 