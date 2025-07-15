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

          {/* Global Background Image */}
          <div className="fixed inset-0 -z-10">
            <Image
              src="/images/modern-fashionable-brand-interior-clothing-600nw-1498332482.jpg"
              alt="Modern Store Interior"
              fill
              className="object-cover object-center opacity-15 dark:opacity-10"
              priority
              quality={90}
            />
          </div>

          {/* Main Content */}
          <main className="relative">
            {/* Hero Section */}
            <section className="relative overflow-hidden min-h-screen">
              {/* Hero Background Overlay */}
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-white/70 dark:bg-gray-900/80 backdrop-blur-sm"></div>
              </div>
              
              <div className="relative z-10 px-4 pt-24 pb-32 min-h-screen flex items-center">
                <motion.div 
                  className="max-w-7xl mx-auto text-center w-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <motion.div
                    className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-full px-6 py-3 text-gray-700 dark:text-gray-300 shadow-lg mb-8"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                  >
                    <motion.div 
                      className="w-2 h-2 bg-green-500 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className="text-sm font-medium">New arrivals every week</span>
                  </motion.div>

                  <motion.h1 
                    className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                  >
                    Shop the Future
                    <br />
                    <span className="bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
                      Today
                    </span>
                  </motion.h1>

                  <motion.p 
                    className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
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
                        className="group bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 px-8 py-4 text-lg font-semibold rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                      >
                        <FiShoppingBag className="mr-2 group-hover:scale-110 transition-transform" />
                        Start Shopping
                      </Button>
                    </Link>
                    <Button 
                      size="lg"
                      variant="outline" 
                      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 hover:bg-white dark:hover:bg-gray-800 px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      <FiZap className="mr-2" />
                      Explore Categories
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </section>

            {/* Features Section */}
            <section className="px-4 py-20 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm">
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
                    { icon: FiTruck, title: "Fast Delivery", description: "Get your orders delivered within 24 hours", color: "gray" },
                    { icon: FiShield, title: "Secure Shopping", description: "Your data and payments are always protected", color: "gray" },
                    { icon: FiHeart, title: "Quality Products", description: "Handpicked items from trusted brands", color: "gray" },
                    { icon: FiCreditCard, title: "Easy Returns", description: "30-day hassle-free return policy", color: "gray" }
                  ].map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      className="bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-600 group"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.8 }}
                      viewport={{ once: true }}
                      whileHover={{ y: -5 }}
                    >
                      <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 group-hover:scale-110 transition-transform duration-300">
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
            <section className="px-4 py-20 bg-gray-50/60 dark:bg-gray-900/60 backdrop-blur-sm">
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
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <stat.icon className="w-8 h-8 text-gray-700 dark:text-gray-300" />
                      </div>
                      <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">{stat.number}</div>
                      <div className="text-gray-600 dark:text-gray-300 font-medium">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Newsletter Section */}
            <section className="px-4 py-20 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm">
              <div className="max-w-4xl mx-auto">
                <motion.div 
                  className="bg-gray-900/90 dark:bg-gray-100/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 text-center relative overflow-hidden shadow-2xl"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FiMail className="w-8 h-8 text-gray-900 dark:text-gray-100" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white dark:text-gray-900 mb-4">
                      Stay Updated
                    </h2>
                    <p className="text-xl text-gray-200 dark:text-gray-700 mb-8 max-w-2xl mx-auto">
                      Subscribe to our newsletter and be the first to know about new arrivals, exclusive deals, and special offers.
                    </p>
                    
                    <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-1 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm border-gray-300 dark:border-gray-600 text-white dark:text-gray-900 placeholder:text-gray-300 dark:placeholder:text-gray-600 rounded-lg px-4 py-3"
                        required
                      />
                      <Button 
                        type="submit"
                        className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 px-8 py-3 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        Subscribe
                      </Button>
                    </form>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Trust Indicators */}
            <section className="px-4 py-16 bg-gray-50/60 dark:bg-gray-900/60 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700">
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
                      <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-3">
                        <trust.icon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
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