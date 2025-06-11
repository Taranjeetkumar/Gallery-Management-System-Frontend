"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { logoutUser } from "@/store/slices/authSlice";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import {
  ArrowRight,
  Camera,
  LogOut,
  Menu,
  Palette,
  Sparkles,
  User,
  Users,
  X,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { type UserRole, roleLabels } from "@/types/user";

const navigationItems = [
  { label: "Home", href: "/", icon: Sparkles },
  // { label: "Artists", href: "/artists", icon: Users },
  // Gallery nav hidden for artists; replaced below
  // { label: "Gallery", href: "/gallery", icon: Camera },
  { label: "About", href: "/about", icon: User },
  { label: "Contact", href: "/contact", icon: ArrowRight },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, role, isLoading } = useAppSelector((state) => state.auth);

  // console.log("hjfggyufgu ", user);

  // const [role, setRole] = useState(user.roles[0])

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { scrollY } = useScroll();

  // Dynamic navigation items based on user role
  const getNavigationItems = () => {
    const items = [...navigationItems];

    // Add Gallery link for non-artists, My Artworks for artists
    if (
      isAuthenticated &&
      user.roles.length > 0 &&
      user.roles[0] === 'ROLE_ARTIST'
    ) {
      items.splice(2, 0, {
        label: "My Artworks",
        href: "/account/artworks/list",
        icon: Camera,
      });
    } 

    return items;
  };

  useEffect(() => {

    console.log("usehcgh : ", role, user);
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDrawerToggle = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  const handleNavigation = (href: string) => {
    router.push(href);
    setMobileDrawerOpen(false);
    setUserMenuOpen(false);
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.push("/auth");
    setUserMenuOpen(false);
  };

  const navbarClasses = `
    fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out
    ${
      scrolled
        ? "bg-white/95 backdrop-blur-xl border-b border-purple-200/50 shadow-xl shadow-purple-500/10"
        : "bg-gradient-to-r from-purple-900/20 via-pink-900/20 to-purple-900/20 backdrop-blur-md"
    }
  `;

  const textColorClass = scrolled ? "text-gray-800" : "text-white";
  const logoGradient =
    "bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600";

  return (
    <>
      <motion.nav
        className={navbarClasses}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo/Brand */}
            <motion.div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => handleNavigation("/")}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 via-pink-500 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-500/25"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8 }}
              >
                <Palette className="w-7 h-7 text-white" />
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400 opacity-0"
                  whileHover={{ opacity: 0.3 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
              <div className="flex flex-col">
                <motion.span
                  className={`text-2xl font-bold bg-clip-text text-transparent ${logoGradient} transition-all duration-300`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  ArtCloud
                </motion.span>
                <motion.span
                  className={`text-xs ${textColorClass} opacity-75 font-medium`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Gallery Management
                </motion.span>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {getNavigationItems().map((item, index) => {
                const IconComponent = item.icon;
                const isActive = pathname === item.href;
                return (
                  <motion.button
                    key={item.label}
                    onClick={() => handleNavigation(item.href)}
                    className={`

                      relative flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300
                      ${
                        isActive
                          ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-500/25"
                          : `${textColorClass} hover:bg-white/10 hover:scale-105`
                      }
                    `}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{item.label}</span>
                    {isActive && (
                      <motion.div
                        className="absolute -bottom-1 left-1/2 w-1 h-1 bg-white rounded-full"
                        layoutId="activeIndicator"
                        style={{ x: "-50%" }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Auth Section - Desktop */}
            <motion.div
              className="hidden md:flex items-center space-x-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {isAuthenticated ? (
                <div className="relative">
                  <motion.button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-3 p-2 rounded-xl hover:bg-white/10 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="flex items-center space-x-2">
                      <motion.div
                        className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white text-sm font-bold shadow-lg"
                        whileHover={{ rotate: 5 }}
                      >
                        {user?.fullname?.[0] || user?.email?.[0] || "U"}
                      </motion.div>
                      <div className="text-left">
                        <p className={`text-sm font-medium ${textColorClass}`}>
                          {user?.fullname || "User"}
                        </p>
                        <p className={`text-xs opacity-60 ${textColorClass}`}>
                          {user.roles.length > 0 &&
                            user.roles[0]?.replace("_", " ").toLowerCase()}
                        </p>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: userMenuOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <svg
                        className={`w-4 h-4 ${textColorClass}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </motion.div>
                  </motion.button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 overflow-hidden"
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">
                            {user?.fullname}
                          </p>
                          <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>
                        <motion.button
                          onClick={() => handleNavigation("/dashboard")}
                          className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                          whileHover={{ x: 4 }}
                        >
                          <User className="w-4 h-4 mr-3" />
                          Dashboard
                        </motion.button>
                        <motion.button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                          whileHover={{ x: 4 }}
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          Sign Out
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex space-x-3">
                  <motion.button
                    onClick={() => handleNavigation("/auth")}
                    className={`

                      px-5 py-2 border-2 border-white/30 rounded-xl font-medium transition-all duration-300
                      ${textColorClass} hover:bg-white/10 hover:scale-105 hover:border-white/50
                    `}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Sign In
                  </motion.button>
                  <motion.button
                    onClick={() => handleNavigation("/auth")}
                    className="px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105 transition-all duration-300"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Get Started
                  </motion.button>
                </div>
              )}
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={handleDrawerToggle}
              className={`md:hidden p-2 rounded-xl hover:bg-white/10 transition-all duration-300 ${textColorClass}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <motion.div
                animate={{ rotate: mobileDrawerOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {mobileDrawerOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </motion.div>
            </motion.button>
          </div>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {mobileDrawerOpen && (
            <motion.div
              className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-purple-200/50 shadow-xl"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-4 py-6 space-y-3">
                {getNavigationItems().map((item, index) => {
                  const IconComponent = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <motion.button
                      key={item.label}
                      onClick={() => handleNavigation(item.href)}
                      className={`

                        flex items-center space-x-3 w-full px-4 py-3 rounded-xl font-medium transition-all duration-300
                        ${
                          isActive
                            ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg"
                            : "text-gray-700 hover:bg-purple-50"
                        }
                      `}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ x: 5 }}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span>{item.label}</span>
                    </motion.button>
                  );
                })}

                <div className="pt-4 border-t border-gray-200">
                  {isAuthenticated ? (
                    <div className="space-y-2">
                      <motion.button
                        onClick={() => handleNavigation("/dashboard")}
                        className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-purple-50 rounded-xl transition-colors"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.4 }}
                      >
                        <User className="w-5 h-5 mr-3" />
                        Dashboard
                      </motion.button>
                      <motion.button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.5 }}
                      >
                        <LogOut className="w-5 h-5 mr-3" />
                        Sign Out
                      </motion.button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <motion.button
                        onClick={() => handleNavigation("/auth")}
                        className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl font-medium text-purple-600 hover:bg-purple-50 transition-all duration-300"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.4 }}
                      >
                        Sign In
                      </motion.button>
                      <motion.button
                        onClick={() => handleNavigation("/auth")}
                        className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.5 }}
                      >
                        Get Started
                      </motion.button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div className="h-16 md:h-20" />
    </>
  );
}
