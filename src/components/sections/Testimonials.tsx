"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import React, { useState, useEffect } from "react";

// ... existing code ... <import statements and component start>

// Mock testimonials data
const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Professional Artist",
    avatar: "https://ugc.same-assets.com/MnGHNg3SXI6Oj9jxE8QbV8O157thvcx_.jpeg",
    rating: 5,
    text: "ArtCloud has revolutionized how I showcase my artwork. The platform is intuitive, beautiful, and has helped me reach a global audience. My sales have increased by 300% since joining!",
    featured: true,
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Gallery Owner",
    avatar: "https://ugc.same-assets.com/0FsMQKUD2hsyYgcxLYq0wSh5e6OSxl_b.jpeg",
    rating: 5,
    text: "Managing multiple exhibitions has never been easier. The organizational tools and analytics provide incredible insights into visitor engagement and artwork performance.",
    featured: false,
  },
  {
    id: 3,
    name: "Emma Williams",
    role: "Art Collector",
    avatar: "https://ugc.same-assets.com/-lP0k1xtm_uim7fNd1lVdPo6_cOx5Dwa.jpeg",
    rating: 5,
    text: "I've discovered so many amazing artists through ArtCloud. The curation is excellent, and the platform makes it easy to connect with artists and purchase pieces.",
    featured: true,
  },
  {
    id: 4,
    name: "David Rodriguez",
    role: "Digital Artist",
    avatar: "https://ugc.same-assets.com/KZz0BSZb9W2rce6BN6UZE8k_zMMCwxTc.jpeg",
    rating: 5,
    text: "The digital gallery features are outstanding. I can present my work in immersive virtual spaces that truly capture the essence of my digital art.",
    featured: false,
  },
  {
    id: 5,
    name: "Lisa Thompson",
    role: "Art Curator",
    avatar: "https://ugc.same-assets.com/jMLbN20nD0icbxJAlczBkJ1SL7UZdlx6.jpeg",
    rating: 5,
    text: "ArtCloud's collaboration tools have transformed how I work with artists. The workflow is seamless, and the presentation quality is museum-grade.",
    featured: true,
  },
  {
    id: 6,
    name: "Alex Rivera",
    role: "Emerging Artist",
    avatar: "https://ugc.same-assets.com/8Ho_xyagmOTLn1iGp5kKRiQT49C-tcxv.jpeg",
    rating: 5,
    text: "Starting my art career was daunting, but ArtCloud provided the perfect platform to showcase my work professionally. The community is incredibly supportive.",
    featured: false,
  },
];

// ... existing code ... <rest of component>

// // Mock testimonials data
// const testimonials = [
//   {
//     id: 1,
//     name: "Sarah Johnson",
//     role: "Professional Artist",
//     avatar:
//       "https://images.unsplash.com/photo-1494790108755-2616b612b593?w=150&h=150&fit=crop&crop=face",
//     rating: 5,
//     text: "ArtCloud has revolutionized how I showcase my artwork. The platform is intuitive, beautiful, and has helped me reach a global audience. My sales have increased by 300% since joining!",
//     featured: true,
//   },
//   {
//     id: 2,
//     name: "Michael Chen",
//     role: "Gallery Owner",
//     avatar:
//       "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
//     rating: 5,
//     text: "Managing multiple exhibitions has never been easier. The organizational tools and analytics provide incredible insights into visitor engagement and artwork performance.",
//     featured: false,
//   },
//   {
//     id: 3,
//     name: "Emma Williams",
//     role: "Art Collector",
//     avatar:
//       "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
//     rating: 5,
//     text: "I've discovered so many amazing artists through ArtCloud. The curation is excellent, and the platform makes it easy to connect with artists and purchase pieces.",
//     featured: true,
//   },
//   {
//     id: 4,
//     name: "David Rodriguez",
//     role: "Digital Artist",
//     avatar:
//       "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
//     rating: 5,
//     text: "The digital gallery features are outstanding. I can present my work in immersive virtual spaces that truly capture the essence of my digital art.",
//     featured: false,
//   },
//   {
//     id: 5,
//     name: "Lisa Thompson",
//     role: "Art Curator",
//     avatar:
//       "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
//     rating: 5,
//     text: "ArtCloud's collaboration tools have transformed how I work with artists. The workflow is seamless, and the presentation quality is museum-grade.",
//     featured: true,
//   },
//   {
//     id: 6,
//     name: "Alex Rivera",
//     role: "Emerging Artist",
//     avatar:
//       "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
//     rating: 5,
//     text: "Starting my art career was daunting, but ArtCloud provided the perfect platform to showcase my work professionally. The community is incredibly supportive.",
//     featured: false,
//   },
// ];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // Ensure component is mounted before enabling auto-play
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isMounted || !isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, isMounted]);


  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
    setIsAutoPlaying(false);
  };

  const goToTestimonial = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="flex space-x-1">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
          >
            <Star
              className={`w-5 h-5 ${
                i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
              }`}
            />
          </motion.div>
        ))}
      </div>
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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

  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 via-white to-pink-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-purple-500 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-48 h-48 bg-pink-500 rounded-full"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
            What Our Community Says
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Join thousands of artists, collectors, and galleries who trust
            ArtCloud to showcase and manage their artistic endeavors.
          </motion.p>
        </motion.div>

        {/* Main Testimonial Carousel */}
        <div className="relative mb-16">
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 relative"
              >
                {/* Quote Icon */}
                <motion.div
                  className="absolute -top-6 -left-6 w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <Quote className="w-6 h-6 text-white" />
                </motion.div>

                <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                  {/* Avatar */}
                  <motion.div
                    className="flex-shrink-0"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <div className="relative">
                      <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-gradient-to-r from-purple-600 to-pink-600 p-1">
                        <img
                          src={testimonials[currentIndex].avatar}
                          alt={testimonials[currentIndex].name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                      {testimonials[currentIndex].featured && (
                        <motion.div
                          className="absolute -bottom-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.5, duration: 0.3 }}
                        >
                          <Star className="w-4 h-4 text-white fill-current" />
                        </motion.div>
                      )}
                    </div>
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1 text-center md:text-left">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                    >
                      <StarRating rating={testimonials[currentIndex].rating} />
                    </motion.div>

                    <motion.p
                      className="text-lg md:text-xl text-gray-700 leading-relaxed my-6 italic"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                    >
                      "{testimonials[currentIndex].text}"
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                    >
                      <h4 className="text-xl font-bold text-gray-900 mb-1">
                        {testimonials[currentIndex].name}
                      </h4>
                      <p className="text-purple-600 font-medium">
                        {testimonials[currentIndex].role}
                      </p>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8">
              <motion.button
                onClick={prevTestimonial}
                className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft className="w-6 h-6 text-gray-700" />
              </motion.button>

              {/* Dots Indicator */}
              <div className="flex space-x-3">
                {testimonials.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => goToTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 scale-125"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.8 }}
                  />
                ))}
              </div>

              <motion.button
                onClick={nextTestimonial}
                className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronRight className="w-6 h-6 text-gray-700" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Testimonial Grid - Smaller Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => goToTestimonial(index)}
            >
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              <StarRating rating={testimonial.rating} />
              <p className="text-gray-700 mt-4 text-sm leading-relaxed line-clamp-3">
                "{testimonial.text}"
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.button
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:shadow-lg transition-all duration-300"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Join Our Community
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
