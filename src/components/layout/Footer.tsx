"use client";

import { motion } from "framer-motion";
import {
  Facebook,
  Heart,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Palette,
  Phone,
  Send,
  Twitter,
  Youtube,
} from "lucide-react";
import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ];

  const quickLinks = [
    { label: "About Us", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Gallery", href: "/gallery" },
    { label: "Contact", href: "/contact" },
    { label: "Blog", href: "/blog" },
  ];

  const legalLinks = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "GDPR", href: "/gdpr" },
  ];

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-gray-900 to-pink-900/20" />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <motion.div
          className="absolute top-10 left-10 w-32 h-32 bg-purple-500 rounded-full"
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-24 h-24 bg-pink-500 rounded-full"
          animate={{
            y: [0, 20, 0],
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

      <div className="relative z-10">
        {/* Main Footer Content */}
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center">
                  <Palette className="w-7 h-7 text-white" />
                </div>
                <span className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  GalleryPro
                </span>
              </div>

              <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
                Professional gallery management system for artists, collectors,
                and galleries. Showcase your artwork with style and manage your
                collections effortlessly.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <motion.div
                  className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors cursor-pointer"
                  whileHover={{ x: 5 }}
                >
                  <Mail className="w-5 h-5 text-purple-400" />
                  <span>hello@gallerypro.com</span>
                </motion.div>
                <motion.div
                  className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors cursor-pointer"
                  whileHover={{ x: 5 }}
                >
                  <Phone className="w-5 h-5 text-purple-400" />
                  <span>+1 (555) 123-4567</span>
                </motion.div>
                <motion.div
                  className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors cursor-pointer"
                  whileHover={{ x: 5 }}
                >
                  <MapPin className="w-5 h-5 text-purple-400" />
                  <span>123 Art Street, Creative City, CC 12345</span>
                </motion.div>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div variants={itemVariants}>
              <h3 className="text-xl font-bold mb-6 text-white">Quick Links</h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <motion.li key={index}>
                    <motion.a
                      href={link.href}
                      className="text-gray-300 hover:text-purple-400 transition-colors block"
                      whileHover={{ x: 5 }}
                    >
                      {link.label}
                    </motion.a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Newsletter Signup */}
            <motion.div variants={itemVariants}>
              <h3 className="text-xl font-bold mb-6 text-white">
                Stay Updated
              </h3>
              <p className="text-gray-300 mb-4">
                Subscribe to our newsletter for the latest updates and features.
              </p>

              <div className="space-y-4">
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:border-purple-500 text-white placeholder-gray-400"
                  />
                  <motion.button
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 rounded-r-lg transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Send className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* Social Media Links */}
                <div className="flex space-x-4 pt-4">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.href}
                      aria-label={social.label}
                      className="w-10 h-10 bg-gray-800 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-500 rounded-full flex items-center justify-center transition-all duration-300"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <social.icon className="w-5 h-5" />
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Legal Links */}
          <motion.div
            variants={itemVariants}
            className="border-t border-gray-800 mt-12 pt-8"
          >
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex flex-wrap gap-6">
                {legalLinks.map((link, index) => (
                  <motion.a
                    key={index}
                    href={link.href}
                    className="text-gray-400 hover:text-purple-400 transition-colors text-sm"
                    whileHover={{ y: -1 }}
                  >
                    {link.label}
                  </motion.a>
                ))}
              </div>

              <motion.div
                className="flex items-center space-x-2 text-gray-400 text-sm"
                whileHover={{ scale: 1.05 }}
              >
                <span>© {currentYear} GalleryPro. Made with</span>
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  <Heart className="w-4 h-4 text-red-500 fill-current" />
                </motion.div>
                <span>for artists worldwide.</span>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Gradient Line */}
        <div className="h-1 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600" />
      </div>
    </footer>
  );
};

export default Footer;
