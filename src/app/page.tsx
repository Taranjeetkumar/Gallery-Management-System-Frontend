"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  CloudUpload,
  Eye,
  Palette,
  Play,
  Shield,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import Footer from "@/components/layout/Footer";
// Import new components
import Navbar from "@/components/layout/Navbar";
import GalleryPreview from "@/components/sections/GalleryPreview";
import Testimonials from "@/components/sections/Testimonials";

export default function Home() {
  const router = useRouter();
  const [animate, setAnimate] = useState(false);
  const { scrollY } = useScroll();

  // Mock auth state - replace with actual Redux state
  const isAuthenticated = false;
  const isLoading = false;

  // Parallax effects
  const heroY = useTransform(scrollY, [0, 800], [0, 200]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  useEffect(() => {
    setAnimate(true);
  }, []);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      router.push("/auth");
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const features = [
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Curate Collections",
      description:
        "Organize and showcase your artwork in beautiful, customizable galleries with professional presentation tools.",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: <CloudUpload className="w-8 h-8" />,
      title: "Easy Upload",
      description:
        "Upload high-resolution images with metadata, automatic optimization, and batch processing capabilities.",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: "Share & Display",
      description:
        "Share your galleries with the world or keep them private for clients with advanced access controls.",
      color: "from-green-500 to-green-600",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure & Professional",
      description:
        "Role-based access control ensures your artwork is protected with enterprise-grade security.",
      color: "from-red-500 to-red-600",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900">
          <motion.div
            className="absolute inset-0 opacity-30"
            style={{ y: heroY }}
          >
            {/* Floating Elements */}
            <motion.div
              className="absolute top-20 left-20 w-32 h-32 bg-purple-500 rounded-full opacity-20"
              animate={{
                y: [0, -30, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 6,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute top-40 right-32 w-24 h-24 bg-pink-500 rounded-full opacity-25"
              animate={{
                y: [0, 20, 0],
                scale: [1, 0.9, 1],
              }}
              transition={{
                duration: 8,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: 1,
              }}
            />
            <motion.div
              className="absolute bottom-32 left-32 w-20 h-20 bg-blue-500 rounded-full opacity-20"
              animate={{
                y: [0, -15, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 10,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: 2,
              }}
            />
            <motion.div
              className="absolute bottom-20 right-20 w-28 h-28 bg-green-500 rounded-full opacity-15"
              animate={{
                y: [0, 25, 0],
                x: [0, 10, 0],
              }}
              transition={{
                duration: 7,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: 0.5,
              }}
            />
          </motion.div>
        </div>

        {/* Hero Content */}
        <motion.div
          className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto"
          style={{ opacity: heroOpacity }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-8"
          >
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span className="text-white/90 font-medium">
                New: AI-Powered Gallery Curation
              </span>
              <Sparkles className="w-5 h-5 text-yellow-400" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              ArtCloud
            </span>
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-xl md:text-3xl lg:text-4xl text-white/90 mb-8 font-light leading-relaxed"
          >
            Professional Gallery Management
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-medium">
              Reimagined for the Digital Age
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-lg md:text-xl text-white/80 mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            Showcase your artwork with stunning galleries, manage collections
            effortlessly, and connect with a global community of artists and
            collectors.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              onClick={handleGetStarted}
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full overflow-hidden hover:shadow-2xl transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center space-x-2">
                <span>
                  {isAuthenticated ? "Go to Dashboard" : "Get Started Free"}
                </span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700"
                initial={{ x: "100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>

            <motion.button
              onClick={() => scrollToSection("demo")}
              className="group flex items-center space-x-3 px-8 py-4 border-2 border-white/30 text-white rounded-full hover:bg-white/10 hover:border-white/50 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Watch Demo</span>
            </motion.button>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          >
            <motion.button
              onClick={() => scrollToSection("features")}
              className="flex flex-col items-center space-y-2 text-white/70 hover:text-white transition-colors"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              <span className="text-sm font-medium">Discover More</span>
              <ChevronDown className="w-6 h-6" />
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Gradient Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Why Choose ArtCloud?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Powerful tools designed specifically for artists, galleries, and
              collectors to showcase and manage artwork professionally.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 h-full">
                  <motion.div
                    className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}
                    whileHover={{ rotate: 5 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Preview Section */}
      <GalleryPreview />

      {/* Testimonials Section */}
      <Testimonials />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <motion.div
            className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 6,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-10 right-10 w-32 h-32 bg-white rounded-full"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 2,
            }}
          />
        </div>

        <motion.div
          className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Ready to Showcase Your Art?
          </h2>
          <p className="text-xl text-white/90 mb-10 leading-relaxed">
            Join thousands of artists and galleries already using ArtCloud to
            elevate their digital presence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              onClick={handleGetStarted}
              className="px-8 py-4 bg-white text-purple-900 font-semibold rounded-full hover:bg-gray-100 hover:shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Your Journey
            </motion.button>
            <motion.button
              className="px-8 py-4 border-2 border-white text-white rounded-full hover:bg-white/10 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
