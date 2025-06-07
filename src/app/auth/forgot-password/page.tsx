"use client";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { forgotPassword } from "@/store/slices/authSlice"; // To be created if not present
import { AnimatePresence, motion } from "framer-motion";
import { Mail, Sparkles, ArrowRight } from "lucide-react";

export default function ForgotPasswordPage() {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [complete, setComplete] = useState(false);
  const [error, setError] = useState("");

  // TODO: connect to redux/selector if tracking network status or error

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      // TODO: INTEGRATE API HERE (dispatch forgotPassword with email)
      // await dispatch(forgotPassword({ email }));
      setComplete(true);
    } catch (err: any) {
      setError("Something went wrong.");
    }
  };

  return (
    <div className="min-h-[75vh] flex flex-col justify-center items-center bg-gradient-to-br from-pink-200 via-purple-100 to-cyan-100 p-6">
      <motion.div
        className="bg-white/80 shadow-xl border p-8 rounded-2xl max-w-sm w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl mb-2 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="font-bold text-2xl text-violet-700">Forgot Password?</h2>
          <p className="text-gray-600 text-sm mt-1">We'll email you a reset link.</p>
        </div>
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mb-3 text-red-600 text-sm text-center"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
        {complete ? (
          <div className="text-center">
            <p className="text-emerald-600 mb-4">If this email is registered, you’ll receive a reset link soon.</p>
            <ArrowRight size={40} className="mx-auto animate-bounce text-pink-400" />
          </div>
        ) : (
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <label className="flex flex-col text-violet-900">
            Email Address
            <div className="flex items-center border mt-2 rounded-lg bg-white/70">
              <Mail className="ml-3 text-purple-400" size={18} />
              <input
                type="email"
                required
                value={email}
                autoComplete="email"
                className="flex-1 px-3 py-2 outline-none bg-transparent"
                onChange={e => setEmail(e.target.value)}
                placeholder="you@email.com"
              />
            </div>
          </label>
          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-pink-400 to-violet-400 font-bold text-white rounded-lg shadow hover:scale-105 transition text-lg"
          >
            Send Reset Link
          </button>
        </form>
        )}
      </motion.div>
    </div>
  );
}
