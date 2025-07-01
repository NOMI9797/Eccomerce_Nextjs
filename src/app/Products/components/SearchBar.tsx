import { motion } from 'framer-motion';
import VoiceSearch from './VoiceSearch';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <motion.div 
      className="relative flex items-center w-full max-w-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="relative flex-1">
        <motion.input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search products..."
          className="w-full pl-12 pr-4 py-3 bg-black/60 backdrop-blur-sm border border-cyan-400/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 transition-all duration-300"
          style={{
            background: 'linear-gradient(145deg, rgba(0,0,0,0.8), rgba(30,30,30,0.6))',
            boxShadow: '0 0 20px rgba(0, 255, 255, 0.1)'
          }}
          whileFocus={{
            boxShadow: '0 0 30px rgba(0, 255, 255, 0.3), 0 0 60px rgba(0, 255, 255, 0.1)',
            scale: 1.02
          }}
          transition={{ duration: 0.2 }}
        />
        <motion.div 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-400"
          whileHover={{ scale: 1.1 }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        </motion.div>
        {/* Glowing border effect */}
        <div className="absolute inset-0 rounded-lg border border-transparent bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm" />
      </div>
      <div className="ml-3">
        <VoiceSearch onSearchResult={onChange} />
      </div>
    </motion.div>
  );
} 