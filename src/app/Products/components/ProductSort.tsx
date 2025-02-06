interface ProductSortProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ProductSort({ value, onChange }: ProductSortProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    >
      <option value="featured">Featured</option>
      <option value="price-low">Price: Low to High</option>
      <option value="price-high">Price: High to Low</option>
      <option value="name">Name</option>
    </select>
  );
} 