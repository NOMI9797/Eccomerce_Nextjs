"use client";
import Link from "next/link";
import { useAuth } from "@/session/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  FiShield, FiTruck, FiArrowRight, FiClock, FiCheckCircle
} from "react-icons/fi";
import db from '@/appwrite/db';
import { Models } from 'appwrite';

interface Category extends Models.Document {
  CategoryName: string;
}



const HomePage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    setMounted(true);
    if (user === null) {
      router.push("/signup");
    }
  }, [user, router]);



  // Fetch categories and featured products
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const categoriesResponse = await db.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
          process.env.NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID!
        );
        
        setCategories(categoriesResponse.documents as Category[]);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (!mounted || user === undefined) return null;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thanks for subscribing!");
    setEmail("");
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/images/modern-fashionable-brand-interior-clothing-600nw-1498332482.jpg')] bg-cover bg-center"></div>
          {/* Subtle overlay for better text readability */}
          <div className="absolute inset-0 bg-black/25"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6"
          >
            Welcome to Styleora
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-white/90 mb-8"
          >
            Where Style Meets Aura - Discover Your Perfect Fashion Statement
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/Products">
              <button className="px-8 py-3 bg-white text-gray-900 rounded-full font-semibold transition-all hover:bg-gray-100">
                Shop Now
              </button>
            </Link>
            <Link href="/signup">
              <button className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-full font-semibold hover:bg-white/10 transition-all">
                Join Us
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            Trending Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <motion.div
                key={category.$id}
                whileHover={{ y: -5 }}
                className="relative group"
              >
                <Link href={`/Products?category=${category.$id}`}>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden transition-all group-hover:shadow-xl p-6 border border-white/20">
                    <h3 className="text-xl font-bold mb-3 text-white">
                      {category.CategoryName}
                    </h3>
                    <p className="text-gray-300 mb-4">Explore the latest trends</p>
                    <div className="flex items-center text-amber-400 font-medium">
                      <span>Shop Now</span>
                      <FiArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Building Section */}
      <section className="py-20 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            Why Choose Styleora
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              whileHover={{ y: -5 }}
              className="p-6 bg-white/10 backdrop-blur-sm rounded-lg shadow-lg text-center border border-white/20"
            >
              <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiTruck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Free Shipping</h3>
              <p className="text-gray-300">On orders over $100</p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="p-6 bg-white/10 backdrop-blur-sm rounded-lg shadow-lg text-center border border-white/20"
            >
              <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiShield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Secure Payment</h3>
              <p className="text-gray-300">100% secure checkout</p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="p-6 bg-white/10 backdrop-blur-sm rounded-lg shadow-lg text-center border border-white/20"
            >
              <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiClock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">24/7 Support</h3>
              <p className="text-gray-300">Dedicated support</p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="p-6 bg-white/10 backdrop-blur-sm rounded-lg shadow-lg text-center border border-white/20"
            >
              <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Easy Returns</h3>
              <p className="text-gray-300">30-day return policy</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Stay in Style</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-gray-300">
            Subscribe to get early access to new features, exclusive deals, and updates from the Styleora universe
          </p>
          <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
            <div className="flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-amber-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                type="submit"
                className="px-8 py-3 bg-amber-500 text-white rounded-full font-semibold hover:bg-amber-600 transition-all"
              >
                Subscribe
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Loading State */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl">
            <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mb-4 mx-auto"></div>
            <h2 className="text-2xl font-semibold text-center">Loading Styleora...</h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;