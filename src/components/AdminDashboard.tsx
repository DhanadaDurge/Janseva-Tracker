import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Users, FileText, CheckCircle2, AlertCircle, TrendingUp, Download } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/analytics", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) return <div className="flex justify-center py-12">Loading analytics...</div>;

  const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-neutral-800">Admin Analytics</h1>
          <p className="text-neutral-500">System-wide performance and complaint distribution</p>
        </div>
        <button className="flex items-center gap-2 bg-white border border-neutral-200 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-neutral-50 transition-colors shadow-sm">
          <Download size={18} />
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatBox icon={<FileText className="text-blue-600" />} label="Total Complaints" value={stats.deptStats.reduce((a: any, b: any) => a + b.count, 0)} trend="+12%" />
        <StatBox icon={<CheckCircle2 className="text-emerald-600" />} label="Resolved" value={stats.statusStats.find((s: any) => s.status === "Resolved")?.count || 0} trend="+8%" />
        <StatBox icon={<AlertCircle className="text-amber-600" />} label="Pending" value={stats.statusStats.find((s: any) => s.status === "Pending")?.count || 0} trend="-5%" />
        <StatBox icon={<TrendingUp className="text-purple-600" />} label="Avg. Resolution" value="2.4 Days" trend="-15%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm">
          <h3 className="text-lg font-bold text-neutral-800 mb-6">Complaints by Department</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.deptStats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="department" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#737373" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#737373" }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#fff", borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                  cursor={{ fill: "#f8fafc" }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm">
          <h3 className="text-lg font-bold text-neutral-800 mb-6">Category Distribution</h3>
          <div className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.catStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="category"
                >
                  {stats.catStats.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: "#fff", borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 ml-4">
              {stats.catStats.map((entry: any, index: number) => (
                <div key={entry.category} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-xs font-medium text-neutral-600">{entry.category} ({entry.count})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBox({ icon, label, value, trend }: { icon: React.ReactNode, label: string, value: any, trend: string }) {
  const isPositive = trend.startsWith("+");
  return (
    <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-neutral-50 rounded-xl">{icon}</div>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isPositive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
          {trend}
        </span>
      </div>
      <h4 className="text-neutral-500 text-sm font-medium">{label}</h4>
      <p className="text-2xl font-bold text-neutral-800 mt-1">{value}</p>
    </div>
  );
}
