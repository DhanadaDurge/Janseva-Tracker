import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Map as MapIcon, Filter, Layers, Info } from "lucide-react";

export default function HeatmapView() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("All");

  useEffect(() => {
    fetchHeatmapData();
  }, []);

  const fetchHeatmapData = async () => {
    try {
      const res = await fetch("/api/complaints/heatmap");
      const data = await res.json();
      setData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = categoryFilter === "All" ? data : data.filter(d => d.category === categoryFilter);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-neutral-800">City Heatmap</h1>
          <p className="text-neutral-500">Visualizing complaint density across the city</p>
        </div>
        <div className="flex gap-2">
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-white border border-neutral-200 px-4 py-2 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
          >
            <option value="All">All Categories</option>
            <option value="Road">Road</option>
            <option value="Garbage">Garbage</option>
            <option value="Water">Water</option>
            <option value="Drainage">Drainage</option>
            <option value="Electrical">Electrical</option>
          </select>
        </div>
      </div>

      <div className="bg-white p-4 rounded-3xl border border-neutral-200 shadow-sm overflow-hidden relative">
        <div className="aspect-video w-full bg-neutral-100 rounded-2xl relative overflow-hidden">
          {/* Simulated Map Background */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="grid grid-cols-12 grid-rows-12 h-full w-full border border-neutral-300">
              {Array.from({ length: 144 }).map((_, i) => (
                <div key={i} className="border border-neutral-200" />
              ))}
            </div>
          </div>

          {/* Simulated Heatmap Points */}
          {filteredData.map((point, i) => {
            // Map lat/lng to percentage (mocking a city boundary)
            // Assuming city is roughly around a specific lat/lng
            const x = ((point.lng + 122.5) * 1000) % 100;
            const y = ((point.lat - 37.7) * 1000) % 100;
            
            return (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.6 }}
                className="absolute w-12 h-12 -ml-6 -mt-6 rounded-full blur-xl"
                style={{ 
                  left: `${Math.abs(x)}%`, 
                  top: `${Math.abs(y)}%`,
                  backgroundColor: 
                    point.category === "Road" ? "#ef4444" :
                    point.category === "Garbage" ? "#10b981" :
                    point.category === "Water" ? "#3b82f6" :
                    point.category === "Drainage" ? "#f59e0b" :
                    "#8b5cf6"
                }}
              />
            );
          })}

          <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur p-4 rounded-2xl shadow-xl border border-white/20">
            <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-3">Legend</h4>
            <div className="space-y-2">
              <LegendItem color="bg-red-500" label="Road Issues" />
              <LegendItem color="bg-emerald-500" label="Garbage" />
              <LegendItem color="bg-blue-500" label="Water Leakage" />
              <LegendItem color="bg-amber-500" label="Drainage" />
              <LegendItem color="bg-purple-500" label="Electrical" />
            </div>
          </div>

          <div className="absolute top-6 left-6 flex gap-2">
            <div className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg shadow-sm border border-white/20 flex items-center gap-2 text-xs font-bold">
              <Layers size={14} />
              Heatmap Layer
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-3">
          <Info className="text-blue-500 mt-0.5" size={18} />
          <div className="text-sm text-blue-800">
            <p className="font-bold">Real-time Density Analysis</p>
            <p className="opacity-80">The heatmap shows areas with high concentration of reported issues. Red zones indicate critical clusters requiring immediate attention.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string, label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${color}`} />
      <span className="text-[10px] font-bold text-neutral-700">{label}</span>
    </div>
  );
}
