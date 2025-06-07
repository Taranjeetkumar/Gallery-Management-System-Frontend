"use client";

import React, { useRef, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
// import { fetchUserProfile, updateUserProfile } from "@/store/slices/profileSlice";
import { uploadFile } from "@/store/slices/uploadSlice";
import { motion } from "framer-motion";
import { FileUpload } from "@/components/common/FileUpload";
import { Sparkles, UserCircle, UploadCloud, Pencil, BadgeCheck, Mail, Phone, MapPin } from "lucide-react";
import { UserRole, roleLabels } from "@/types/user";
import { getCurrentUser, updateUser } from "@/store/slices/authSlice";

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector((state:any) => state.profile);
  const [profile, setProfile] = useState(user || {});
  const [avatarPreview, setAvatarPreview] = useState(profile?.avatar || "");
  const [editMode, setEditMode] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    // Fetch profile on mount, or when user changes
    // TODO: INTEGRATE fetch user profile API here
   dispatch(getCurrentUser());
    
    // dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    setProfile(user || {});
    setAvatarPreview(user?.avatar || "");
  }, [user]);

  const handleAvatarChange = (file: File) => {
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    let avatar = profile.avatar;
    if (avatarFile) {
      // TODO: INTEGRATE avatar upload API here
      // const response = await dispatch(uploadFile({ file: avatarFile }));
      // avatar = response.payload?.url || avatar;
    }
    // TODO: INTEGRATE update user profile API here
    await dispatch(updateUser({ ...profile, avatar }));
    setEditMode(false);
  };

  if (!profile) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-gradient-to-br from-pink-200 via-purple-100 to-cyan-100"
    >
      <div className="rounded-3xl shadow-2xl p-10 bg-white/70 border-2 border-violet-300 max-w-xl w-full flex flex-col gap-6 animate-fadeIn">
        <div className="flex justify-center mb-2">
          <motion.div whileHover={{ scale: 1.1 }} className="relative">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="avatar"
                className="w-32 h-32 rounded-full shadow-lg object-cover border-4 border-violet-300"
              />
            ) : (
              <UserCircle size={128} className="text-violet-300" />
            )}
            {editMode && (
              <label className="absolute bottom-0 right-2 p-1 bg-white bg-opacity-80 hover:bg-opacity-100 cursor-pointer rounded-full shadow transition-all">
                <UploadCloud size={26} className="text-pink-500" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files && e.target.files[0] && handleAvatarChange(e.target.files[0])}
                />
              </label>
            )}
          </motion.div>
        </div>
        <form className="flex flex-col gap-4" onSubmit={handleSave}>
          <div className="flex gap-2 items-center">
            <span className="font-bold text-xl text-violet-700 flex items-center gap-1">
              <Sparkles className="text-pink-400 animate-pulse" size={20} />
              Profile
            </span>
            {!editMode && (
              <button type="button" onClick={() => setEditMode(true)} className="ml-2 text-pink-500/70 hover:text-pink-600 transition">
                <Pencil size={18} />
              </button>
            )}
            {profile.isEmailVerified && (
              <BadgeCheck size={22} className="ml-1 text-emerald-500" title="Email Verified" />
            )}
          </div>
          <label className="flex flex-col text-violet-900">
            Name:
            <input
              disabled={!editMode}
              className="border rounded-lg px-3 py-1 focus:outline-pink-400 bg-white/60 mt-1"
              value={profile.name || ""}
              onChange={e => setProfile({ ...profile, name: e.target.value })}
            />
          </label>
          <div className="flex flex-col text-violet-900">
            Email:
            <div className="flex items-center gap-2 border rounded-lg px-3 py-1 bg-white/60 mt-1 text-gray-600 select-all">
              <Mail size={16} />
              {profile.email || ""}
            </div>
          </div>
          <div className="flex flex-col text-violet-900">
            Role:
            <div className="flex items-center gap-2 border rounded-lg px-3 py-1 bg-white/60 mt-1 text-gray-700">
              {roleLabels[profile.role as UserRole] || profile.role}
            </div>
          </div>
          <label className="flex flex-col text-violet-900">
            Phone:
            <input
              disabled={!editMode}
              className="border rounded-lg px-3 py-1 focus:outline-pink-400 bg-white/60 mt-1"
              value={profile.phone || ""}
              onChange={e => setProfile({ ...profile, phone: e.target.value })}
            />
          </label>
          <label className="flex flex-col text-violet-900">
            Address:
            <input
              disabled={!editMode}
              className="border rounded-lg px-3 py-1 focus:outline-pink-400 bg-white/60 mt-1"
              value={profile.address || ""}
              onChange={e => setProfile({ ...profile, address: e.target.value })}
            />
          </label>
          <label className="flex flex-col text-violet-900">
            Bio:
            <textarea
              disabled={!editMode}
              className="border rounded-lg px-3 py-1 focus:outline-pink-400 bg-white/60 mt-1 resize-none"
              value={profile.bio || ""}
              onChange={e => setProfile({ ...profile, bio: e.target.value })}
            />
          </label>
          {/* You could add createdAt/updatedAt info cards here if you want */}

          {editMode && (
            <div className="flex gap-2 justify-end">
              <button
                type="submit"
                className="bg-gradient-to-r from-pink-400 to-violet-400 text-white px-5 py-2 rounded-xl font-semibold shadow hover:scale-105 hover:shadow-lg focus:outline-none transition duration-200"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setProfile(user || {});
                  setAvatarFile(null);
                  setAvatarPreview(user?.avatar || "");
                  setEditMode(false);
                }}
                className="text-violet-500 font-semibold hover:underline px-3"
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>
    </motion.div>
  );
}
