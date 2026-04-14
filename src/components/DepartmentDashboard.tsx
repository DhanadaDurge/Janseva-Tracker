import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Clock, CheckCircle2, AlertTriangle, MapPin, Calendar, Tag, Info, ChevronRight, Search, Filter } from "lucide-react";

export default function DepartmentDashboard() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

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

  const updateStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`/api/complaints/${id}/status`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}` 
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchComplaints();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredComplaints = filter === "All" ? complaints : complaints.filter(c => c.status === filter);

  if (loading) return <div className="flex justify-center py-12">Loading assigned complaints...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-800">Department Portal</h1>
          <p className="text-neutral-500">Manage and resolve assigned civic complaints</p>
        </div>
        <div className="flex gap-2 bg-white p-1 rounded-xl border border-neutral-200 shadow-sm">
          {["All", "Pending", "In Progress", "Resolved"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                filter === f ? "bg-emerald-600 text-white shadow-md" : "text-neutral-500 hover:bg-neutral-50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredComplaints.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-neutral-200 rounded-3xl p-12 text-center">
            <h3 className="text-lg font-semibold text-neutral-700">No complaints found</h3>
            <p className="text-neutral-500">Great job! All issues are currently handled.</p>
          </div>
        ) : (
          filteredComplaints.map((complaint) => (
            <motion.div 
              key={complaint.id}
              layout
              className="bg-white rounded-2xl border border-neutral-200 p-4 flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow"
            >
              <div className="w-full md:w-48 h-48 md:h-auto rounded-xl overflow-hidden flex-shrink-0">
                <img src={complaint.image || "https://picsum.photos/seed/city/400/400"} alt={complaint.title} className="w-full h-full object-cover" />
              </div>
              
              <div className="flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-neutral-800">{complaint.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-neutral-500 mt-1">
                      <span className="font-bold text-emerald-600 uppercase tracking-wider">{complaint.category}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><MapPin size={12} /> {complaint.lat.toFixed(4)}, {complaint.lng.toFixed(4)}</span>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                    complaint.status === "Pending" ? "bg-amber-100 text-amber-700 border-amber-200" :
                    complaint.status === "In Progress" ? "bg-blue-100 text-blue-700 border-blue-200" :
                    "bg-emerald-100 text-emerald-700 border-emerald-200"
                  }`}>
                    {complaint.status}
                  </div>
                </div>
                
                <p className="text-neutral-600 text-sm mb-4 flex-grow">{complaint.description}</p>
                
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-neutral-100">
                  <div className="flex gap-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-bold text-neutral-400">Priority</span>
                      <span className={`text-sm font-bold ${
                        complaint.priorityLevel === "Critical" ? "text-red-600" :
                        complaint.priorityLevel === "High" ? "text-orange-600" :
                        complaint.priorityLevel === "Medium" ? "text-amber-600" :
                        "text-emerald-600"
                      }`}>{complaint.priorityLevel}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase font-bold text-neutral-400">Deadline</span>
                      <span className="text-sm font-bold text-neutral-700">{new Date(complaint.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {complaint.status !== "In Progress" && complaint.status !== "Resolved" && (
                      <button 
                        onClick={() => updateStatus(complaint.id, "In Progress")}
                        className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Start Work
                      </button>
                    )}
                    {complaint.status !== "Resolved" && (
                      <button 
                        onClick={() => updateStatus(complaint.id, "Resolved")}
                        className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition-colors"
                      >
                        Mark Resolved
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
