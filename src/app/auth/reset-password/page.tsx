"use client";
import React, { useState } from "react";
import { useAppDispatch } from "@/hooks/redux";
import { resetPassword } from "@/store/slices/authSlice"; // To be created if not present
import { AnimatePresence, motion } from "framer-motion";
import { Lock, Sparkles, CheckCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [resetComplete, setResetComplete] = useState(false);
  const token = searchParams.get("token") || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!password || !confirm) {
      setError('Please enter and confirm your password.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    try {
      // TODO: INTEGRATE API HERE (dispatch resetPassword)
      // await dispatch(resetPassword({ token, password }));
      setResetComplete(true);
    } catch (err: any) {
      setError('Reset failed. Try again or request new link.');
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
          <h2 className="font-bold text-2xl text-violet-700">Reset Password</h2>
          <p className="text-gray-600 text-sm mt-1">Enter your reset token and new password.</p>
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
        {resetComplete ? (
          <div className="text-center">
            <p className="text-emerald-600 mb-4">Your password has been reset successfully!</p>
            <CheckCircle size={40} className="mx-auto animate-pulse text-emerald-400" />
          </div>
        ) : (
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          {/* If using token via query param, you may hide this field. */}
          <input type="hidden" value={token} />
          <label className="flex flex-col text-violet-900">
            New Password
            <div className="flex items-center border mt-2 rounded-lg bg-white/70">
              <Lock className="ml-3 text-purple-400" size={18} />
              <input
                type="password"
                required
                value={password}
                autoComplete="new-password"
                className="flex-1 px-3 py-2 outline-none bg-transparent"
                onChange={e => setPassword(e.target.value)}
                placeholder="New password"
              />
            </div>
          </label>
          <label className="flex flex-col text-violet-900">
            Confirm Password
            <div className="flex items-center border mt-2 rounded-lg bg-white/70">
              <Lock className="ml-3 text-purple-400" size={18} />
              <input
                type="password"
                required
                value={confirm}
                autoComplete="new-password"
                className="flex-1 px-3 py-2 outline-none bg-transparent"
                onChange={e => setConfirm(e.target.value)}
                placeholder="Confirm new password"
              />
            </div>
          </label>
          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-pink-400 to-violet-400 font-bold text-white rounded-lg shadow hover:scale-105 transition text-lg"
          >
            Reset Password
          </button>
        </form>
        )}
      </motion.div>
    </div>
  );
}
