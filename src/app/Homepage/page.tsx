"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Link from "next/link";
import { useAuth } from "@/session/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiShoppingBag, FiSettings, FiLogOut, FiZap, FiUsers, FiShield } from "react-icons/fi";

export default function LandingPage() {
  const { user, logout, isUserAdmin } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // If user has been resolved (i.e., not undefined) and there's no logged-in user, redirect.
    if (user === null) {
      router.push("/signup");
    }
  }, [user, router]);

  // Do not render until the auth state is resolved.
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const glowVariants = {
    animate: {
      boxShadow: [
        "0 0 20px #00ffff, 0 0 40px #00ffff, 0 0 60px #00ffff",
        "0 0 20px #ff00ff, 0 0 40px #ff00ff, 0 0 60px #ff00ff",
        "0 0 20px #00ff00, 0 0 40px #00ff00, 0 0 60px #00ff00",
        "0 0 20px #00ffff, 0 0 40px #00ffff, 0 0 60px #00ffff"
      ],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <>
      {user ? (
        <div className="relative min-h-screen overflow-hidden bg-black">
          {/* Animated Background Grid */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-purple-900/20 to-pink-900/20" />
            <motion.div 
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: '50px 50px'
              }}
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%']
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </div>

          {/* Floating Particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-cyan-400 rounded-full"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                }}
                animate={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                }}
                transition={{
                  duration: Math.random() * 10 + 10,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  boxShadow: '0 0 10px #00ffff'
                }}
              />
            ))}
          </div>

          {/* Header with neon styling */}
          <div className="relative z-10">
            <Header />
          </div>

          {/* Main Content */}
          <motion.div 
            className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Neon Title */}
            <motion.div
              variants={itemVariants}
              className="text-center mb-12"
            >
              <motion.h1 
                className="text-6xl md:text-8xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 tracking-widest relative"
                variants={glowVariants}
                animate="animate"
                style={{
                  textShadow: '0 0 20px #00ffff, 0 0 40px #00ffff'
                }}
              >
                OUTFITTERS
              </motion.h1>
              <motion.p
                className="text-xl md:text-2xl text-cyan-300 font-light tracking-wide"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
              >
                The Future of Fashion
              </motion.p>
            </motion.div>

            {/* Feature Cards */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl w-full"
            >
              <motion.div 
                className="bg-black/50 backdrop-blur-sm border border-cyan-400/30 rounded-lg p-6 text-center group hover:border-cyan-400 transition-all duration-300"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 30px rgba(0, 255, 255, 0.3)"
                }}
              >
                <FiZap className="w-8 h-8 text-cyan-400 mx-auto mb-4 group-hover:text-cyan-300" />
                <h3 className="text-lg font-semibold text-white mb-2">Lightning Fast</h3>
                <p className="text-gray-300 text-sm">Experience seamless shopping with cutting-edge technology</p>
              </motion.div>

              <motion.div 
                className="bg-black/50 backdrop-blur-sm border border-purple-400/30 rounded-lg p-6 text-center group hover:border-purple-400 transition-all duration-300"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 30px rgba(147, 51, 234, 0.3)"
                }}
              >
                <FiUsers className="w-8 h-8 text-purple-400 mx-auto mb-4 group-hover:text-purple-300" />
                <h3 className="text-lg font-semibold text-white mb-2">Community Driven</h3>
                <p className="text-gray-300 text-sm">Join millions of fashion enthusiasts worldwide</p>
              </motion.div>

              <motion.div 
                className="bg-black/50 backdrop-blur-sm border border-pink-400/30 rounded-lg p-6 text-center group hover:border-pink-400 transition-all duration-300"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 30px rgba(236, 72, 153, 0.3)"
                }}
              >
                <FiShield className="w-8 h-8 text-pink-400 mx-auto mb-4 group-hover:text-pink-300" />
                <h3 className="text-lg font-semibold text-white mb-2">Secure & Safe</h3>
                <p className="text-gray-300 text-sm">Advanced security protocols protect your data</p>
              </motion.div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-6 items-center"
            >
              <Link href="/Products">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0 px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 flex items-center gap-3"
                    style={{
                      boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)'
                    }}
                  >
                    <FiShoppingBag className="w-5 h-5" />
                    Shop Now
                  </Button>
                </motion.div>
              </Link>

              {isUserAdmin && (
                <Link href="/Dashboard">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-purple-500/25 transition-all duration-300 flex items-center gap-3"
                      style={{
                        boxShadow: '0 0 20px rgba(147, 51, 234, 0.4)'
                      }}
                    >
                      <FiSettings className="w-5 h-5" />
                      Dashboard
                    </Button>
                  </motion.div>
                </Link>
              )}

              {user && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleLogout}
                    className="bg-transparent border-2 border-red-500 text-red-400 hover:bg-red-500 hover:text-white px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 flex items-center gap-3"
                    style={{
                      boxShadow: '0 0 20px rgba(239, 68, 68, 0.3)'
                    }}
                  >
                    <FiLogOut className="w-5 h-5" />
                    Logout
                  </Button>
                </motion.div>
              )}
            </motion.div>

            {/* User Welcome Message */}
            {user && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.6 }}
                className="mt-12 text-center"
              >
                <p className="text-gray-300 text-lg">
                  Welcome back, <span className="text-cyan-400 font-semibold">{user.name || user.email}</span>
                </p>
                {isUserAdmin && (
                  <p className="text-purple-400 text-sm mt-2 font-medium">
                    Administrator Access Granted
                  </p>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* Bottom Glow Effect */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cyan-900/20 to-transparent" />
        </div>
      ) : null}
    </>
  );
}