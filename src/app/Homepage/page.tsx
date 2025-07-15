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
  FiGlobe, FiClock, FiCheckCircle, FiTrendingUp
} from "react-icons/fi";

export default function LandingPage() {
  const { user, logout, isUserAdmin } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    setMounted(true);
    if (user === null) {
      router.push("/signup");
    }
  }, [user, router]);

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

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thanks for subscribing!");
    setEmail("");
  };

  return (
    <>
      {user ? (
        <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900">
          {/* Header */}
          <Header />

          {/* Main Content */}
          <main className="relative">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 dark:from-blue-800 dark:via-purple-800 dark:to-indigo-900">
              {/* Background Pattern */}
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-black/10 dark:bg-black/20"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 dark:from-blue-800/30 dark:to-purple-800/30"></div>
              </div>
              
              <div className="relative px-4 pt-24 pb-32">
                <motion.div 
                  className="max-w-7xl mx-auto text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <motion.div
                    className="inline-flex items-center gap-2 bg-white/10 dark:bg-white/5 backdrop-blur-sm border border-white/20 dark:border-white/10 rounded-full px-6 py-3 text-white/90 dark:text-white/80 text-sm font-medium mb-8"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                  >
                    <motion.div 
                      className="w-2 h-2 bg-green-400 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span>New arrivals every week</span>
                  </motion.div>

                  <motion.h1 
                    className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                  >
                    Shop the Future
                    <br />
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                      Today
                    </span>
                  </motion.h1>

                  <motion.p 
                    className="text-xl md:text-2xl text-white/80 dark:text-white/70 mb-12 max-w-3xl mx-auto leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                  >
                    Discover premium quality products curated for the modern lifestyle. 
                    From cutting-edge tech to timeless fashion.
                  </motion.p>

                  <motion.div 
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                  >
                    <Link href="/Products">
                      <Button 
                        size="lg" 
                        className="group bg-white dark:bg-gray-100 text-blue-600 dark:text-blue-700 hover:bg-gray-100 dark:hover:bg-gray-200 px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <FiShoppingBag className="mr-2 group-hover:scale-110 transition-transform" />
                        Start Shopping
                      </Button>
                    </Link>
                    <Button 
                      size="lg"
                      variant="outline" 
                      className="bg-white/10 dark:bg-white/5 backdrop-blur-sm border-white/30 dark:border-white/20 text-white hover:bg-white/20 dark:hover:bg-white/10 px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300"
                    >
                      <FiZap className="mr-2" />
                      Explore Categories
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </section>

            {/* Features Section */}
            <section className="px-4 py-20 bg-white dark:bg-gray-800">
              <div className="max-w-7xl mx-auto">
                <motion.div 
                  className="text-center mb-16"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    Why Choose KharedLo?
                  </h2>
                  <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    Experience shopping like never before with our premium features and unmatched service.
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                    { icon: FiTruck, title: "Fast Delivery", description: "Get your orders delivered within 24 hours", color: "blue" },
                    { icon: FiShield, title: "Secure Shopping", description: "Your data and payments are always protected", color: "green" },
                    { icon: FiHeart, title: "Quality Products", description: "Handpicked items from trusted brands", color: "red" },
                    { icon: FiCreditCard, title: "Easy Returns", description: "30-day hassle-free return policy", color: "purple" }
                  ].map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      className="bg-white dark:bg-gray-700 rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-600 group"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.8 }}
                      viewport={{ once: true }}
                      whileHover={{ y: -5 }}
                    >
                      <div className={`w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center ${
                        feature.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' :
                        feature.color === 'green' ? 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400' :
                        feature.color === 'red' ? 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400' :
                        'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400'
                      } group-hover:scale-110 transition-transform duration-300`}>
                        <feature.icon className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Statistics Section */}
            <section className="px-4 py-20 bg-gray-50 dark:bg-gray-900">
              <div className="max-w-7xl mx-auto">
                <motion.div 
                  className="text-center mb-16"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    Trusted by Thousands
                  </h2>
                  <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    Join our growing community of satisfied customers worldwide.
                  </p>
                </motion.div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                    { number: "10K+", label: "Happy Customers", icon: FiUsers },
                    { number: "50K+", label: "Products Sold", icon: FiShoppingBag },
                    { number: "99%", label: "Satisfaction Rate", icon: FiStar },
                    { number: "24/7", label: "Support Available", icon: FiClock }
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      className="text-center"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1, duration: 0.8 }}
                      viewport={{ once: true }}
                    >
                      <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                        <stat.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">{stat.number}</div>
                      <div className="text-gray-600 dark:text-gray-300 font-medium">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Newsletter Section */}
            <section className="px-4 py-20 bg-white dark:bg-gray-800">
              <div className="max-w-4xl mx-auto">
                <motion.div 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <div className="absolute inset-0 bg-white/5 dark:bg-white/3"></div>
                  
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-white/20 dark:bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FiMail className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                      Stay Updated
                    </h2>
                    <p className="text-xl text-white/80 dark:text-white/70 mb-8 max-w-2xl mx-auto">
                      Subscribe to our newsletter and be the first to know about new arrivals, exclusive deals, and special offers.
                    </p>
                    
                    <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-1 bg-white/10 dark:bg-white/5 backdrop-blur-sm border-white/30 dark:border-white/20 text-white placeholder:text-white/70 dark:placeholder:text-white/60 rounded-lg px-4 py-3"
                        required
                      />
                      <Button 
                        type="submit"
                        className="bg-white dark:bg-gray-100 text-blue-600 dark:text-blue-700 hover:bg-gray-100 dark:hover:bg-gray-200 px-8 py-3 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        Subscribe
                      </Button>
                    </form>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Trust Indicators */}
            <section className="px-4 py-16 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
              <div className="max-w-7xl mx-auto">
                <motion.div 
                  className="text-center mb-12"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Shop with Confidence
                  </h2>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {[
                    { icon: FiShield, text: "SSL Secured" },
                    { icon: FiCheckCircle, text: "Privacy Protected" },
                    { icon: FiTruck, text: "Fast Shipping" },
                    { icon: FiClock, text: "24/7 Support" }
                  ].map((trust, index) => (
                    <motion.div
                      key={trust.text}
                      className="flex flex-col items-center text-center"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.8 }}
                      viewport={{ once: true }}
                    >
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mb-3">
                        <trust.icon className="w-6 h-6 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{trust.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          </main>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Loading...</h2>
            <p className="text-gray-600 dark:text-gray-400">Please wait while we load your content.</p>
          </div>
        </div>
      )}
    </>
  );
}