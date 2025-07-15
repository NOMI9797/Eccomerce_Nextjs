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

export default function LandingPage() {
  const { user, logout, isUserAdmin } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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
        <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-black dark:via-gray-900 dark:to-black overflow-hidden">
          {/* Background Elements */}
          <FloatingParticles />
          <GeometricPattern />
          
          {/* Animated gradient overlay */}
          <div className="fixed inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10 animate-pulse" />
          
          {/* Mouse follower effect */}
          <motion.div
            className="fixed w-6 h-6 bg-blue-500/20 rounded-full pointer-events-none z-50 mix-blend-difference"
            style={{
              left: mousePosition.x - 12,
              top: mousePosition.y - 12,
            }}
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />

          {/* Header */}
          <Header />

          {/* Main Content */}
          <main className="relative z-10">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center px-4 pt-20">
              <div className="max-w-7xl mx-auto text-center">
                {/* Brand Logo/Name with futuristic styling */}
                <motion.div
                  className="mb-8"
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                >
                  <div className="relative inline-block">
                    <motion.h1 
                      className="text-6xl md:text-8xl lg:text-9xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2"
                      animate={{
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                      }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      style={{
                        backgroundSize: "200% auto",
                      }}
                    >
                      KharedLo
                    </motion.h1>
                    <motion.div
                      className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-lg blur opacity-30"
                      animate={{
                        opacity: [0.3, 0.6, 0.3],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                      }}
                    />
                  </div>
                  <motion.p 
                    className="text-lg md:text-xl text-blue-200 font-medium tracking-wider"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                  >
                    The Future of Shopping
                  </motion.p>
                </motion.div>

                {/* Tagline */}
                <motion.div
                  className="mb-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                >
                  <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                    Experience Shopping
                    <br />
                    <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                      Like Never Before
                    </span>
                  </h2>
                  <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                    Discover premium products with cutting-edge technology, seamless experience, 
                    and futuristic design. Welcome to the next generation of e-commerce.
                  </p>
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                  className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.8 }}
                >
                  <Link href="/Products">
                    <motion.button
                      className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="relative z-10 flex items-center">
                        <FiShoppingBag className="mr-2 group-hover:rotate-12 transition-transform" />
                        Explore Products
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </motion.button>
                  </Link>
                  
                  <motion.button
                    className="group relative px-8 py-4 bg-transparent border-2 border-cyan-400 rounded-full text-cyan-400 font-semibold text-lg hover:bg-cyan-400 hover:text-black transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="flex items-center">
                      <FiPlay className="mr-2 group-hover:translate-x-1 transition-transform" />
                      Watch Demo
                    </span>
                  </motion.button>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                  className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                >
                  {[
                    { number: "10K+", label: "Happy Customers", icon: FiUsers },
                    { number: "99.9%", label: "Uptime", icon: FiWifi },
                    { number: "24/7", label: "Support", icon: FiClock },
                    { number: "50+", label: "Countries", icon: FiGlobe }
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      className="relative group"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.4 + index * 0.1, duration: 0.8 }}
                    >
                      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all duration-300">
                        <stat.icon className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                        <div className="text-2xl font-bold text-white mb-1">{stat.number}</div>
                        <div className="text-gray-300 text-sm">{stat.label}</div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </section>

            {/* Features Section */}
            <section className="relative py-20 px-4">
              <div className="max-w-7xl mx-auto">
                <motion.div 
                  className="text-center mb-16"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    Futuristic Features
                  </h2>
                  <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                    Experience the next generation of online shopping with our cutting-edge technology
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[
                    { 
                      icon: FiCpu, 
                      title: "AI-Powered Recommendations", 
                      description: "Smart algorithms that learn your preferences and suggest perfect products",
                      color: "from-blue-400 to-cyan-400"
                    },
                    { 
                      icon: FiShield, 
                      title: "Quantum Security", 
                      description: "Advanced encryption and security protocols to protect your data",
                      color: "from-purple-400 to-pink-400"
                    },
                    { 
                      icon: FiZap, 
                      title: "Lightning Fast", 
                      description: "Optimized for speed with instant loading and seamless navigation",
                      color: "from-yellow-400 to-orange-400"
                    },
                    { 
                      icon: FiSmartphone, 
                      title: "Mobile First", 
                      description: "Responsive design that works perfectly on all devices",
                      color: "from-green-400 to-teal-400"
                    },
                    { 
                      icon: FiLayers, 
                      title: "Multi-dimensional UI", 
                      description: "Immersive user interface with depth and interactive elements",
                      color: "from-indigo-400 to-purple-400"
                    },
                    { 
                      icon: FiTrendingUp, 
                      title: "Real-time Analytics", 
                      description: "Live data and insights to enhance your shopping experience",
                      color: "from-pink-400 to-rose-400"
                    }
                  ].map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      className="group relative"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.8 }}
                      viewport={{ once: true }}
                      whileHover={{ y: -10 }}
                    >
                      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 h-full hover:bg-white/10 transition-all duration-300">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                          <feature.icon className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                        <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Newsletter Section */}
            <section className="relative py-20 px-4">
              <div className="max-w-4xl mx-auto">
                <motion.div 
                  className="relative bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-12 text-center overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <div className="relative z-10">
                    <motion.div
                      className="w-20 h-20 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-6"
                      animate={{
                        rotateY: [0, 360],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <FiMail className="w-10 h-10 text-white" />
                    </motion.div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                      Join the Future
                    </h2>
                    <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                      Subscribe to get early access to new features, exclusive deals, and updates from the KharedLo universe
                    </p>
                    
                    <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-1 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400"
                        required
                      />
                      <motion.button 
                        type="submit"
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Subscribe
                      </motion.button>
                    </form>
                  </div>
                </motion.div>
              </div>
            </section>
          </main>
        </div>
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
          <div className="text-center">
            <motion.div
              className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mx-auto mb-4"
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            <h2 className="text-2xl font-semibold text-white mb-4">Loading KharedLo...</h2>
            <p className="text-gray-300">Preparing your futuristic shopping experience</p>
          </div>
        </div>
      )}
    </>
  );
}