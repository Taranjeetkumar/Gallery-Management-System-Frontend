"use client";
import type React from "react";
import { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  fetchArtists, addArtist, updateArtist, deleteArtist, selectArtist,
} from "@/store/slices/artistsSlice";
import { uploadFile } from "@/store/slices/uploadSlice";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit, Trash2, Palette, Sparkles, ArrowLeftCircle, Camera, Loader2 } from "lucide-react";

const defaultArtist = { name: "", birthplace: "", age: 18, style: "", bio: "", avatar: "" };

export default function ArtistsPage() {
  const dispatch = useAppDispatch();
  const { artists, isLoading, error } = useAppSelector((s:any) => s.artists);
  const [openForm, setOpenForm] = useState(false);
  const [formMode, setFormMode] = useState<"add"|"edit">("add");
  const [artistForm, setArtistForm] = useState(defaultArtist);
  const [avatarFile, setAvatarFile] = useState<File|null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState("");
  const [formErrors, setFormErrors] = useState<any>({});
  const [deleteId, setDeleteId] = useState<string|null>(null); // To handle delete confirm
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { dispatch(fetchArtists()); }, [dispatch]);

  useEffect(() => {
    // Show preview on avatarFile selection
    if (avatarFile) setAvatarPreview(URL.createObjectURL(avatarFile));
    else setAvatarPreview(artistForm.avatar || "");
  }, [avatarFile, artistForm.avatar]);

  const openAddForm = () => {
    setFormMode("add"); setArtistForm(defaultArtist); setAvatarFile(null); setFormErrors({}); setOpenForm(true);
  };
  const openEditForm = (artist: any) => {
    setFormMode("edit"); setArtistForm(artist); setAvatarFile(null); setFormErrors({}); setOpenForm(true);
  };
  const closeForm = () => { setOpenForm(false); setArtistForm(defaultArtist); setAvatarFile(null); setAvatarPreview(""); setFormErrors({}); };

  // Simple validation
  function validateForm() {
    const errors: any = {};
    if (!artistForm.name) errors.name = "Name is required";
    if (!artistForm.birthplace) errors.birthplace = "Birthplace is required";
    if (!artistForm.style) errors.style = "Artistic style required";
    if (!artistForm.age || isNaN(Number(artistForm.age)) || Number(artistForm.age) < 0) errors.age = "Valid age required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;
    const avatar = artistForm.avatar;
    if (avatarFile) {
      // TODO: INTEGRATE ARTIST AVATAR UPLOAD (call uploadFile here).
      // const result = await dispatch(uploadFile({ file: avatarFile }));
      // avatar = result.payload?.url || avatar;
    }
    const payload:any = { ...artistForm, avatar };
    if (formMode === "add") {
      await dispatch(addArtist(payload));
      setSuccessMsg("Artist added!");
    } else {
      await dispatch(updateArtist(payload));
      setSuccessMsg("Artist updated!");
    }
    closeForm();
    setTimeout(() => setSuccessMsg(""), 2500);
  }

  const startDeleteArtist = (id:string) => setDeleteId(id);
  const cancelDelete = () => setDeleteId(null);
  const confirmDelete = async () => {
    if (deleteId) {
      await dispatch(deleteArtist(deleteId));
      setSuccessMsg("Artist deleted!");
      setDeleteId(null);
      setTimeout(() => setSuccessMsg(""), 2000);
    }
  };

  return (
    <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.5}} className="min-h-[80vh] p-6 bg-gradient-to-br from-pink-200 via-purple-100 to-cyan-100">
      <div className="max-w-5xl mx-auto">
        {/* Feedback banners */}
        <AnimatePresence>{successMsg && (
          <motion.div className="mb-4 p-3 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-center shadow" initial={{opacity:0, y:-18}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}} transition={{duration:0.35}}>{successMsg}</motion.div>
        )}</AnimatePresence>
        <AnimatePresence>{error && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="mb-2 p-3 rounded-xl bg-red-50 text-red-700 border border-red-200 text-center shadow">
            {error}
          </motion.div>)}</AnimatePresence>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-violet-800 flex items-center gap-3"><Palette/> Artists Management</h2>
          <button onClick={openAddForm} className="flex gap-2 items-center bg-gradient-to-r from-pink-400 to-violet-400 rounded-xl px-5 py-2 font-bold shadow text-white hover:scale-105 transition"><Plus/> Add Artist</button>
        </div>
        {/* Artists Table */}
        <div className="overflow-x-auto rounded-2xl shadow-xl bg-white/80 border p-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-purple-100/80">
                <th className="p-2">Avatar</th>
                <th>Name</th>
                <th>Birthplace</th>
                <th>Age</th>
                <th>Style</th>
                <th>Biography</th>
                <th>Actions</th>
                <th>Artworks</th>
              </tr>
            </thead>
            <tbody>
              {artists?.map((artist:any) => (
                <tr key={artist.id} className="even:bg-purple-50 hover:bg-pink-50 transition">
                  <td className="p-2">
                    {artist.avatar ? (
                      <img src={artist.avatar} alt={artist.name} className="rounded-full w-10 h-10 object-cover" />
                    ) : <Camera className="w-7 h-7 text-violet-400"/>}
                  </td>
                  <td className="font-bold">{artist.name}</td>
                  <td>{artist.birthplace}</td>
                  <td>{artist.age}</td>
                  <td>{artist.style}</td>
                  <td className="max-w-[200px] truncate text-xs text-gray-600">{artist.bio}</td>
                  <td>
                    <button className="text-violet-500 hover:text-violet-700 mr-1" onClick={()=>openEditForm(artist)} title="Edit" disabled={isLoading}><Edit size={18}/></button>
                    <button className="text-pink-500 hover:text-pink-700" onClick={()=>startDeleteArtist(artist.id)} title="Delete" disabled={isLoading}><Trash2 size={18}/></button>
                  </td>
                  <td>
                    <button className="text-blue-500 hover:text-blue-700 underline" title="View Artworks" disabled={isLoading} onClick={()=>{/* navigate to /artworks?artist=id */}}>
                      View Artworks
                    </button>
                  </td>
                </tr>
              ))}
              {artists.length===0 && !isLoading && <tr><td colSpan={8} className="text-gray-400 p-6 text-center">No artists yet.</td></tr>}
              {isLoading && <tr><td colSpan={8} className="text-center py-8"><Loader2 className="animate-spin mx-auto text-violet-400" size={32}/></td></tr>}
            </tbody>
          </table>
        </div>

        {/* Animated Form Modal */}
        <AnimatePresence>
          {openForm && (
            <motion.div key="modal" initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.9}} className="fixed inset-0 bg-black/20 flex justify-center items-center z-40">
              <motion.div initial={{y:60,opacity:0}} animate={{y:0,opacity:1}} exit={{y:60,opacity:0}} transition={{type:'spring',stiffness:400}} className="bg-white p-7 rounded-2xl shadow-2xl w-full max-w-md relative border">
                <button onClick={closeForm} className="absolute right-6 top-6 text-violet-400 hover:text-pink-400"><ArrowLeftCircle size={24}/></button>
                <h3 className="font-bold text-2xl text-violet-700 mb-3 flex items-center gap-2"><Sparkles className="text-pink-400"/> {formMode==="add"?"Add Artist":"Edit Artist"}</h3>
                <form className="flex flex-col gap-4" onSubmit={handleFormSubmit}>
                  <label className="flex flex-col text-violet-900">
                    Name
                    <input className={`border rounded-lg px-3 py-2 bg-white/70 mt-1 ${(formErrors.name?'border-red-400':'')}`} required value={artistForm.name} onChange={e=>setArtistForm(a=>({...a,name:e.target.value}))}/>
                    {formErrors.name && <span className="text-xs text-pink-500 animate-pulse">{formErrors.name}</span>}
                  </label>
                  <label className="flex flex-col text-violet-900">
                    Birthplace
                    <input className={`border rounded-lg px-3 py-2 bg-white/70 mt-1 ${(formErrors.birthplace?'border-red-400':'')}`} required value={artistForm.birthplace} onChange={e=>setArtistForm(a=>({...a,birthplace:e.target.value}))}/>
                    {formErrors.birthplace && <span className="text-xs text-pink-500 animate-pulse">{formErrors.birthplace}</span>}
                  </label>
                  <label className="flex flex-col text-violet-900">
                    Age
                    <input className={`border rounded-lg px-3 py-2 bg-white/70 mt-1 ${(formErrors.age?'border-red-400':'')}`} required type="number" min={0} value={artistForm.age} onChange={e=>setArtistForm(a=>({...a,age:Number(e.target.value)}))}/>
                    {formErrors.age && <span className="text-xs text-pink-500 animate-pulse">{formErrors.age}</span>}
                  </label>
                  <label className="flex flex-col text-violet-900">
                    Artistic Style
                    <input className={`border rounded-lg px-3 py-2 bg-white/70 mt-1 ${(formErrors.style?'border-red-400':'')}`} required value={artistForm.style} onChange={e=>setArtistForm(a=>({...a,style:e.target.value}))}/>
                    {formErrors.style && <span className="text-xs text-pink-500 animate-pulse">{formErrors.style}</span>}
                  </label>
                  <label className="flex flex-col text-violet-900">
                    Bio (optional)
                    <textarea className="border rounded-lg px-3 py-2 bg-white/70 mt-1 resize-none" value={artistForm.bio} onChange={e=>setArtistForm(a=>({...a,bio:e.target.value}))} />
                  </label>
                  <label className="flex flex-col text-violet-900 font-semibold gap-2">
                    Avatar
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={e=>{
                      const file = e.target.files?e.target.files[0]:null; setAvatarFile(file);
                    }} />
                    {avatarPreview && <img src={avatarPreview} className="rounded-full w-16 h-16 object-cover mt-2 border" alt="Avatar preview"/>}
                  </label>
                  <button disabled={isLoading} className="bg-gradient-to-r from-pink-400 to-violet-400 text-white px-5 py-2 rounded-xl font-semibold shadow hover:scale-105 hover:shadow-lg focus:outline-none transition duration-200 mt-2 disabled:opacity-60">
                    {isLoading ? 'Saving...' : (formMode==="add"?"Add Artist":"Update Artist")}
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {deleteId && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
              <motion.div initial={{y:40}} animate={{y:0}} exit={{y:40}} className="bg-white max-w-xs w-full rounded-3xl shadow-2xl p-8 border flex flex-col items-center">
                <Trash2 size={32} className="text-pink-400 mb-3"/>
                <p className="mb-6 text-xl text-violet-700 text-center">Delete this artist?</p>
                <div className="flex gap-5">
                  <button onClick={confirmDelete} className="bg-gradient-to-r from-pink-400 to-violet-400 text-white px-5 py-2 rounded-xl font-semibold shadow focus:outline-none transition duration-200">Yes, Delete</button>
                  <button onClick={cancelDelete} className="px-5 py-2 rounded-xl font-semibold text-violet-500 hover:underline">Cancel</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
