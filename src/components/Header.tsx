// src/components/Header.tsx
import Link from "next/link";

const Header = () => {
  return (
    <nav className="p-4">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <ul className="flex justify-center space-x-12 items-center text-2xl font-semibold text-white">
          {["Products", "Categories", "Cart", "Contact Us", "About Us"].map((item) => (
            <li key={item}>
              <Link
                href={`/${item.toLowerCase().replace(" ", "-")}`}
                className="text-white hover:text-teal-500 transition-all duration-300 ease-in-out"
              >
                {item}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Header;
