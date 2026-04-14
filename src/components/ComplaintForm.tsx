import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Camera, MapPin, Send, AlertCircle, Loader2, Droplets, Trash2, Lightbulb, Construction, Waves, Mic, FileText } from "lucide-react";

const issueTypes = [
  { id: "Water Leakage", label: "Water Leakage", icon: <Droplets className="text-blue-500" size={32} />, color: "bg-blue-50" },
  { id: "Garbage Dump", label: "Garbage Dump", icon: <Trash2 className="text-emerald-500" size={32} />, color: "bg-emerald-50" },
  { id: "Street Light Outage", label: "Street Light Outage", icon: <Lightbulb className="text-amber-500" size={32} />, color: "bg-amber-50" },
  { id: "Pothole", label: "Pothole", icon: <Construction className="text-purple-500" size={32} />, color: "bg-purple-50" },
  { id: "Drainage / Sewage", label: "Drainage / Sewage", icon: <Waves className="text-indigo-500" size={32} />, color: "bg-indigo-50" },
];

export default function ComplaintForm() {
  const [selectedType, setSelectedType] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const getGeolocation = () => {
    setLocating(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      (err) => {
        setError("Could not get your location. Please enable GPS.");
        setLocating(false);
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location) {
      setError("Please provide your location.");
      return;
    }
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("title", title || selectedType);
    formData.append("description", description);
    formData.append("lat", location.lat.toString());
    formData.append("lng", location.lng.toString());
    if (image) formData.append("image", image);

    try {
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData,
      });
      if (res.ok) {
        navigate("/complaints");
      } else {
        const data = await res.json();
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to submit complaint.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/city-report/1920/600" 
            alt="City Background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative z-10 text-center px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold text-white mb-4"
          >
            Report an Issue
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white/80 max-w-2xl mx-auto"
          >
            Help your city improve — report problems, attach evidence, and track resolution in real time.
          </motion.p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit} className="space-y-12">
            {error && (
              <div className="p-4 bg-red-50 text-red-600 text-sm rounded-2xl flex items-center gap-2 border border-red-100">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            {/* Issue Type Selection */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-700 mb-6">Select Issue Type</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {issueTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setSelectedType(type.id)}
                    className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-4 text-center group ${
                      selectedType === type.id 
                        ? "border-emerald-600 bg-emerald-50 shadow-lg shadow-emerald-100" 
                        : "border-neutral-100 bg-white hover:border-emerald-200 hover:bg-neutral-50"
                    }`}
                  >
                    <div className={`p-4 rounded-2xl transition-transform group-hover:scale-110 ${type.color}`}>
                      {type.icon}
                    </div>
                    <span className={`text-xs font-bold ${selectedType === type.id ? "text-emerald-700" : "text-neutral-500"}`}>
                      {type.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Upload Photo */}
              <div className="bg-neutral-50 p-8 rounded-[40px] border border-neutral-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-neutral-400 shadow-sm">
                    <Camera size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-800">Upload Live Photo</h4>
                    <p className="text-[10px] text-neutral-500 font-medium">Attach a photo of the issue</p>
                  </div>
                </div>

                <div 
                  onClick={() => document.getElementById("image-input")?.click()}
                  className="aspect-square w-full bg-white border-2 border-dashed border-neutral-200 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-emerald-400 transition-all overflow-hidden relative group"
                >
                  {preview ? (
                    <>
                      <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Camera className="text-white" size={32} />
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-6">
                      <div className="w-16 h-16 bg-neutral-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-orange-400">
                        <Camera size={32} />
                      </div>
                      <p className="text-xs font-bold text-neutral-400">Drag & drop or click to upload</p>
                    </div>
                  )}
                  <input
                    id="image-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>
              </div>

              {/* GPS Location */}
              <div className="bg-neutral-50 p-8 rounded-[40px] border border-neutral-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-neutral-400 shadow-sm">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-800">Live GPS Location</h4>
                    <p className="text-[10px] text-neutral-500 font-medium">Auto-detected from your device</p>
                  </div>
                </div>

                <div className="aspect-square w-full bg-white border border-neutral-200 rounded-3xl relative overflow-hidden flex items-center justify-center">
                  {location ? (
                    <div className="text-center p-6">
                      <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <MapPin size={32} />
                      </div>
                      <p className="text-xs font-bold text-neutral-800">Location Locked</p>
                      <p className="text-[10px] text-neutral-500 mt-1">{location.lat.toFixed(4)}, {location.lng.toFixed(4)}</p>
                    </div>
                  ) : (
                    <div className="text-center p-6">
                      <button 
                        type="button"
                        onClick={getGeolocation}
                        disabled={locating}
                        className="w-16 h-16 bg-neutral-50 text-neutral-300 rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-emerald-50 hover:text-emerald-600 transition-all"
                      >
                        {locating ? <Loader2 className="animate-spin" size={32} /> : <MapPin size={32} />}
                      </button>
                      <p className="text-xs font-bold text-neutral-400">Click to detect location</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="bg-neutral-50 p-8 rounded-[40px] border border-neutral-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-neutral-400 shadow-sm">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-800">Describe the Issue</h4>
                    <p className="text-[10px] text-neutral-500 font-medium">Type or speak your complaint</p>
                  </div>
                </div>

                <div className="flex flex-col h-[calc(100%-4rem)]">
                  <div className="relative flex-grow">
                    <textarea
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full h-full p-6 bg-white border border-neutral-200 rounded-3xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none text-sm leading-relaxed"
                      placeholder="Describe the issue in detail — what happened, when, and how severe..."
                    />
                    <button 
                      type="button"
                      className="absolute bottom-4 right-4 p-3 bg-neutral-50 text-neutral-400 hover:text-emerald-600 rounded-xl transition-colors"
                    >
                      <Mic size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-8">
              <button
                type="submit"
                disabled={loading || !selectedType}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-16 py-5 rounded-2xl transition-all shadow-2xl shadow-emerald-200 flex items-center gap-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="animate-spin" size={24} /> : <Send size={24} />}
                Submit Complaint
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
