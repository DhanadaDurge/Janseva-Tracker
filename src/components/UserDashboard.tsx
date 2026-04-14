import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Clock, CheckCircle2, AlertTriangle, MapPin, Calendar, Tag, Info, Video } from "lucide-react";
import VeoAnimate from "./VeoAnimate";

export default function UserDashboard() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [animatingImage, setAnimatingImage] = useState<string | null>(null);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await fetch("/api/complaints", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setComplaints(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center py-12">Loading your complaints...</div>;

  return (
    <div className="space-y-6">
      {animatingImage && (
        <VeoAnimate imageUrl={animatingImage} onClose={() => setAnimatingImage(null)} />
      )}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-neutral-800">My Dashboard</h1>
          <p className="text-neutral-500">Track the status of your reported issues</p>
        </div>
        <div className="flex gap-4">
          <StatCard label="Total" value={complaints.length} color="bg-neutral-100 text-neutral-600" />
          <StatCard label="Resolved" value={complaints.filter(c => c.status === "Resolved").length} color="bg-emerald-100 text-emerald-600" />
          <StatCard label="Pending" value={complaints.filter(c => c.status === "Pending").length} color="bg-amber-100 text-amber-600" />
        </div>
      </div>

      {complaints.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-neutral-200 rounded-3xl p-12 text-center">
          <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Info className="text-neutral-400" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-neutral-700">No complaints yet</h3>
          <p className="text-neutral-500 mb-6">If you see a civic issue, report it to help improve your city.</p>
          <a href="/report" className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-emerald-700 transition-colors">
            Report First Issue
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {complaints.map((complaint) => (
            <ComplaintCard key={complaint.id} complaint={complaint} onAnimate={() => setAnimatingImage(complaint.image)} />
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div className={`${color} px-4 py-2 rounded-2xl flex flex-col items-center min-w-[80px]`}>
      <span className="text-xs font-bold uppercase tracking-wider opacity-70">{label}</span>
      <span className="text-xl font-bold">{value}</span>
    </div>
  );
}

function ComplaintCard({ complaint, onAnimate }: { complaint: any, onAnimate: () => void }) {
  const statusColors: any = {
    "Pending": "bg-amber-100 text-amber-700 border-amber-200",
    "In Progress": "bg-blue-100 text-blue-700 border-blue-200",
    "Resolved": "bg-emerald-100 text-emerald-700 border-emerald-200"
  };

  const priorityColors: any = {
    "Critical": "bg-red-100 text-red-700",
    "High": "bg-orange-100 text-orange-700",
    "Medium": "bg-amber-100 text-amber-700",
    "Low": "bg-emerald-100 text-emerald-700"
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
    >
      {complaint.image && (
        <div className="h-48 w-full relative">
          <img src={complaint.image} alt={complaint.title} className="w-full h-full object-cover" />
          <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${statusColors[complaint.status]}`}>
            {complaint.status}
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); onAnimate(); }}
            className="absolute bottom-3 right-3 p-2 bg-white/90 backdrop-blur text-emerald-600 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider"
          >
            <Video size={14} />
            Animate
          </button>
        </div>
      )}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-neutral-800 line-clamp-1">{complaint.title}</h3>
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${priorityColors[complaint.priorityLevel]}`}>
            {complaint.priorityLevel}
          </span>
        </div>
        <p className="text-neutral-500 text-sm line-clamp-2 mb-4">{complaint.description}</p>
        
        <div className="space-y-2 border-t border-neutral-100 pt-4">
          <div className="flex items-center gap-2 text-xs text-neutral-600">
            <Tag size={14} className="text-neutral-400" />
            <span className="font-medium">{complaint.category}</span>
            <span className="text-neutral-300">•</span>
            <span className="text-neutral-400">{complaint.department}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-neutral-600">
            <Calendar size={14} className="text-neutral-400" />
            <span>Deadline: {new Date(complaint.deadline).toLocaleDateString()}</span>
          </div>
          {complaint.isDuplicate === 1 && (
            <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-2 rounded-lg">
              <AlertTriangle size={14} />
              <span>Marked as duplicate</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
