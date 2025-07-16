"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Link from "next/link";
import { useAuth } from "@/session/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiShoppingBag, FiSettings, FiLogOut, FiZap, 
  FiUsers, FiShield, FiTruck, FiHeart, 
  FiCreditCard, FiArrowRight, FiMail, FiStar,
  FiGlobe, FiClock, FiCheckCircle, FiTrendingUp,
  FiLayers, FiCpu, FiWifi, FiSmartphone, FiPlay
} from "react-icons/fi";
import db from '@/appwrite/db';
import { Product } from '@/app/Dashboard/ListProduct/types/product';
import { Models } from 'appwrite';
import { getImageUrl } from '@/lib/utils';

interface Category extends Models.Document {
  CategoryName: string;
}

// Floating particles component
const FloatingParticles = () => {
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, size: number, duration: number}>>([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 4 + 1,
          duration: Math.random() * 20 + 10
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
    window.addEventListener('resize', generateParticles);
    return () => window.removeEventListener('resize', generateParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-blue-400/20 rounded-full"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [particle.y, particle.y - 100, particle.y],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Geometric background pattern
const GeometricPattern = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    <div className="absolute inset-0 opacity-5">
      <svg width="100%" height="100%">
        <defs>
          <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="currentColor" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  </div>
);

const HomePage = () => {
  const { user, logout, isUserAdmin } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setMounted(true);
    if (user === null) {
      router.push("/signup");
    }
  }, [user, router]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Fetch categories and featured products
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesResponse, productsResponse] = await Promise.all([
          db.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
            process.env.NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID!
          ),
          db.listDocuments(
            process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
            process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID!,
            []
          )
        ]);
        
        setCategories(categoriesResponse.documents as Category[]);
        setProducts(productsResponse.documents as Product[]);
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

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thanks for subscribing!");
    setEmail("");
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-pink-900/90 z-10"></div>
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/images/fashion-bg.jpg')] bg-cover bg-center"></div>
        </div>
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6"
          >
            Welcome to <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Styleora</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-200 mb-8"
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
              <button className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-semibold transition-all transform hover:scale-105">
                Shop Now
              </button>
            </Link>
            <Link href="/signup">
              <button className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-full font-semibold hover:bg-white/10 transition-all transform hover:scale-105">
                Join Us
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Trending Categories
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <motion.div
                key={category.$id}
                whileHover={{ y: -5 }}
                className="relative group"
              >
                <Link href={`/Products?category=${category.$id}`}>
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all group-hover:shadow-xl p-8 border border-purple-100">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-pink-600/5 group-hover:from-purple-600/10 group-hover:to-pink-600/10 transition-all rounded-2xl"></div>
                    <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {category.CategoryName}
                    </h3>
                    <p className="text-gray-700 font-medium">Explore the latest trends</p>
                    <div className="mt-4 flex items-center text-purple-600 font-medium">
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
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Why Choose Styleora
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              whileHover={{ y: -5 }}
              className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiTruck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Free Shipping</h3>
              <p className="text-gray-600">On orders over $100</p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiShield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Secure Payment</h3>
              <p className="text-gray-600">100% secure checkout</p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiClock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">24/7 Support</h3>
              <p className="text-gray-600">Dedicated support</p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Easy Returns</h3>
              <p className="text-gray-600">30-day return policy</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-r from-purple-900 to-pink-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Stay in Style</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Subscribe to get early access to new features, exclusive deals, and updates from the Styleora universe
          </p>
          <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
            <div className="flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                type="submit"
                className="px-8 py-3 bg-white text-purple-900 rounded-full font-semibold hover:bg-purple-100 transition-all transform hover:scale-105"
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
            <div className="animate-spin w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mb-4 mx-auto"></div>
            <h2 className="text-2xl font-semibold text-center">Loading Styleora...</h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;