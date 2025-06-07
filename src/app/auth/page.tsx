"use client";

import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { clearLoginError, clearSignupError } from "@/store/slices/authSlice";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, Heart, Palette, Sparkles, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";

export default function AuthPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleTabChange = (newValue: "login" | "signup") => {
    // Clear errors when switching tabs
    if (newValue === "login") {
      dispatch(clearSignupError());
    } else {
      dispatch(clearLoginError());
    }
    setAuthMode(newValue);
  };

  if (isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Icons */}
        <motion.div
          className="absolute top-20 left-10 text-white/10"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 360, 0],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <Palette className="w-12 h-12" />
        </motion.div>

        <motion.div
          className="absolute top-32 right-20 text-white/10"
          animate={{
            y: [0, 20, 0],
            rotate: [0, -360, 0],
          }}
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          <Camera className="w-16 h-16" />
        </motion.div>

        <motion.div
          className="absolute bottom-20 left-20 text-white/10"
          animate={{
            y: [0, -15, 0],
            rotate: [0, 180, 0],
          }}
          transition={{
            duration: 7,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 2,
          }}
        >
          <Sparkles className="w-10 h-10" />
        </motion.div>

        <motion.div
          className="absolute bottom-32 right-16 text-white/10"
          animate={{
            y: [0, 25, 0],
            rotate: [0, 360, 0],
          }}
          transition={{
            duration: 9,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 0.5,
          }}
        >
          <Star className="w-14 h-14" />
        </motion.div>

        <motion.div
          className="absolute top-1/2 left-1/4 text-white/5"
          animate={{
            y: [0, -30, 0],
            rotate: [0, -180, 0],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 3,
          }}
        >
          <Heart className="w-20 h-20" />
        </motion.div>

        {/* Gradient Orbs */}
        <motion.div
          className="absolute top-1/4 right-1/3 w-72 h-72 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 0.8, 1],
            x: [0, -30, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Branding */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left space-y-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center space-x-4"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/25">
                <Palette className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-5xl lg:text-6xl font-bold text-white">
                  ArtCloud
                </h1>
                <p className="text-purple-200 text-lg font-medium">
                  Gallery Management System
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="space-y-6"
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
                Manage Your Art Collection Like Never Before
              </h2>

              <p className="text-xl text-purple-100 leading-relaxed">
                Experience the future of gallery management with our
                cutting-edge platform. Upload, organize, and showcase your
                artwork with powerful tools designed for artists, gallery
                managers, and art enthusiasts.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-purple-100">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="flex items-center space-x-3"
                >
                  <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                  <span>Manage galleries effortlessly</span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="flex items-center space-x-3"
                >
                  <div className="w-3 h-3 bg-pink-400 rounded-full"></div>
                  <span>Upload and organize artwork</span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="flex items-center space-x-3"
                >
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <span>Participate in auctions</span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                  className="flex items-center space-x-3"
                >
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span>Connect with art lovers</span>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Auth Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="w-full max-w-md">
              {/* Tab Switcher */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="mb-8"
              >
                <div className="flex bg-white/10 backdrop-blur-md rounded-2xl p-2">
                  <button
                    onClick={() => handleTabChange("login")}
                    className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-300 ${
                      authMode === "login"
                        ? "bg-white text-purple-600 shadow-lg"
                        : "text-white hover:bg-white/10"
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => handleTabChange("signup")}
                    className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-300 ${
                      authMode === "signup"
                        ? "bg-white text-purple-600 shadow-lg"
                        : "text-white hover:bg-white/10"
                    }`}
                  >
                    Sign Up
                  </button>
                </div>
              </motion.div>

              {/* Auth Form Container */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl shadow-black/10"
              >
                <AnimatePresence mode="wait">
                  {authMode === "login" ? (
                    <motion.div
                      key="login"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <LoginForm
                        onSwitchToSignup={() => handleTabChange("signup")}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="signup"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <SignupForm
                        onSwitchToLogin={() => handleTabChange("login")}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Features */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center"
      >
        <p className="text-white/60 text-sm">
          Join thousands of artists and gallery managers worldwide
        </p>
        <div className="flex items-center justify-center space-x-6 mt-4">
          <div className="text-white/40 text-xs">
            <span className="text-purple-300 font-semibold">10k+</span> Artworks
          </div>
          <div className="w-1 h-1 bg-white/40 rounded-full"></div>
          <div className="text-white/40 text-xs">
            <span className="text-pink-300 font-semibold">500+</span> Galleries
          </div>
          <div className="w-1 h-1 bg-white/40 rounded-full"></div>
          <div className="text-white/40 text-xs">
            <span className="text-blue-300 font-semibold">50+</span> Countries
          </div>
        </div>
      </motion.div>
    </div>
  );
}
