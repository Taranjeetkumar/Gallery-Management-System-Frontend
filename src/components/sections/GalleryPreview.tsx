"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Heart,
  Share2,
  ZoomIn,
} from "lucide-react";
import React, { useState } from "react";

// Mock gallery data - replace with actual data from your API
const mockGalleryItems = [
  {
    id: 1,
    title: "Abstract Dreams",
    artist: "Sarah Johnson",
    image:
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop",
    likes: 124,
    views: 890,
    category: "Abstract",
  },
  {
    id: 2,
    title: "Urban Landscape",
    artist: "Michael Chen",
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
    likes: 89,
    views: 456,
    category: "Photography",
  },
  {
    id: 3,
    title: "Nature's Symphony",
    artist: "Emma Williams",
    image:
      "https://images.unsplash.com/photo-1578662015662-4b5fe45c41b3?w=800&h=600&fit=crop",
    likes: 156,
    views: 1234,
    category: "Nature",
  },
  {
    id: 4,
    title: "Digital Fusion",
    artist: "Alex Rivera",
    image:
      "https://images.unsplash.com/photo-1549490349-8643362aca4e?w=800&h=600&fit=crop",
    likes: 203,
    views: 1567,
    category: "Digital Art",
  },
  {
    id: 5,
    title: "Vintage Colors",
    artist: "Lisa Thompson",
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
    likes: 78,
    views: 345,
    category: "Vintage",
  },
  {
    id: 6,
    title: "Modern Sculpture",
    artist: "David Park",
    image:
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop",
    likes: 167,
    views: 892,
    category: "Sculpture",
  },
];

const categories = [
  "All",
  "Abstract",
  "Photography",
  "Nature",
  "Digital Art",
  "Vintage",
  "Sculpture",
];

const GalleryPreview = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isCarouselView, setIsCarouselView] = useState(false);

  const filteredItems =
    selectedCategory === "All"
      ? mockGalleryItems
      : mockGalleryItems.filter((item) => item.category === selectedCategory);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % filteredItems.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + filteredItems.length) % filteredItems.length,
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
      },
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
          >
            Featured Galleries
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Discover amazing artwork from talented artists around the world.
            Each piece tells a unique story and showcases incredible creativity.
          </motion.p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {categories.map((category, index) => (
            <motion.button
              key={category}
              variants={itemVariants}
              onClick={() => setSelectedCategory(category)}
              className={`
                px-6 py-3 rounded-full font-medium transition-all duration-300 border
                ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-transparent shadow-lg"
                    : "bg-white text-gray-700 border-gray-300 hover:border-purple-400 hover:text-purple-600"
                }
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Gallery Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          key={selectedCategory} // Re-animate when category changes
        >
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              variants={cardVariants}
              whileHover="hover"
              className="group cursor-pointer"
              onClick={() => {
                setCurrentImageIndex(index);
                setIsCarouselView(true);
              }}
            >
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <motion.img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  />

                  {/* Overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  >
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center justify-between text-white">
                        <div className="flex items-center space-x-3">
                          <motion.button
                            className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Heart className="w-5 h-5" />
                          </motion.button>
                          <motion.button
                            className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Share2 className="w-5 h-5" />
                          </motion.button>
                        </div>
                        <motion.button
                          className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <ZoomIn className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 mb-4">by {item.artist}</p>

                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm font-medium">
                      {item.category}
                    </span>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{item.views}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4" />
                        <span>{item.likes}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View More Button */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <motion.button
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            View All Galleries
          </motion.button>
        </motion.div>
      </div>

      {/* Carousel Modal */}
      <AnimatePresence>
        {isCarouselView && (
          <motion.div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCarouselView(false)}
          >
            <div
              className="relative max-w-4xl max-h-full p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.img
                src={filteredItems[currentImageIndex]?.image}
                alt={filteredItems[currentImageIndex]?.title}
                className="w-full h-full object-contain rounded-lg"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              />

              {/* Navigation Buttons */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>

              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>

              {/* Image Info */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="text-2xl font-bold mb-1">
                  {filteredItems[currentImageIndex]?.title}
                </h3>
                <p className="text-gray-300">
                  by {filteredItems[currentImageIndex]?.artist}
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsCarouselView(false)}
                className="absolute top-4 right-4 p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
              >
                <span className="text-white text-xl">✕</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default GalleryPreview;
