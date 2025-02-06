import { motion } from 'framer-motion';

interface CategoryFilterProps {
  categories: any[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryFilter({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Categories</h3>
      <div className="space-y-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full text-left px-3 py-2 rounded-md ${
            selectedCategory === "all" 
              ? "bg-blue-500 text-white" 
              : "hover:bg-gray-100"
          }`}
          onClick={() => onCategoryChange("all")}
        >
          All Products
        </motion.button>
        {categories.map((category) => (
          <motion.button
            key={category.$id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full text-left px-3 py-2 rounded-md ${
              selectedCategory === category.$id 
                ? "bg-blue-500 text-white" 
                : "hover:bg-gray-100"
            }`}
            onClick={() => onCategoryChange(category.$id)}
          >
            {category.CategoryName}
          </motion.button>
        ))}
      </div>
    </div>
  );
} 