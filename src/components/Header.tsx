// src/components/Header.tsx
import Link from "next/link";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathname = usePathname();
  
  const navItems = [
    { name: "Products", path: "/Products" },
    { name: "Categories", path: "/Categories" },
    { name: "Cart", path: "/cart" },
    { name: "Contact Us", path: "/contact-us" },
    { name: "About Us", path: "/about-us" }
  ];

  return (
    <nav className="p-4">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <ul className="flex justify-center space-x-12 items-center text-2xl font-semibold text-white">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.path}
                className={`transition-all duration-300 ease-in-out ${
                  pathname === item.path 
                    ? "text-teal-400 hover:text-teal-300" 
                    : "text-white hover:text-teal-500"
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Header;
