import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, PlusCircle, Map as MapIcon, BarChart3, LogOut, User, Building2, ShieldCheck, Menu, X } from "lucide-react";
import Login from "./components/Login";
import Register from "./components/Register";
import UserDashboard from "./components/UserDashboard";
import ComplaintForm from "./components/ComplaintForm";
import DepartmentDashboard from "./components/DepartmentDashboard";
import AdminDashboard from "./components/AdminDashboard";
import HeatmapView from "./components/HeatmapView";
import Home from "./components/Home";
import HowToReport from "./components/HowToReport";
import ContactUs from "./components/ContactUs";
import FAQ from "./components/FAQ";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  return (
    <Router>
      <div className="min-h-screen bg-white text-neutral-900 font-sans">
        <Navbar user={user} onLogout={handleLogout} />

        <main className="flex-grow min-h-[calc(100vh-80px-400px)]">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/how-to-report" element={<HowToReport />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/login" element={!user ? <Login onLogin={setUser} /> : <Navigate to="/dashboard" />} />
              <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
              
              <Route path="/dashboard" element={
                user ? (
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {user.role === "admin" ? <AdminDashboard /> : 
                     user.role === "department" ? <DepartmentDashboard /> : 
                     <UserDashboard />}
                  </div>
                ) : <Navigate to="/login" />
              } />
              
              <Route path="/complaints" element={
                user ? (
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <UserDashboard />
                  </div>
                ) : <Navigate to="/login" />
              } />
              
              <Route path="/report" element={user?.role === "user" ? <ComplaintForm /> : <Navigate to="/login" />} />
              
              <Route path="/heatmap" element={
                user ? (
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <HeatmapView />
                  </div>
                ) : <Navigate to="/login" />
              } />
              
              <Route path="/analytics" element={
                user?.role === "admin" ? (
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <AdminDashboard />
                  </div>
                ) : <Navigate to="/dashboard" />
              } />
            </Routes>
          </AnimatePresence>
        </main>

        <footer className="bg-neutral-900 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-neutral-900 font-bold text-xl">J</div>
                  <span className="text-2xl font-bold tracking-tight">JanSeva Tracker</span>
                </div>
                <p className="text-neutral-400 max-w-md leading-relaxed">
                  Empowering citizens to build better cities through technology. Report issues, track progress, and contribute to your community's growth.
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-6 text-emerald-500 uppercase tracking-widest text-xs">Quick Links</h4>
                <ul className="space-y-4 text-neutral-400">
                  <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                  <li><Link to="/how-to-report" className="hover:text-white transition-colors">How to Report</Link></li>
                  <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                  <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-6 text-orange-500 uppercase tracking-widest text-xs">Support</h4>
                <ul className="space-y-4 text-neutral-400">
                  <li className="flex items-center gap-2">
                    <span className="text-xs font-bold bg-neutral-800 px-2 py-1 rounded">Toll Free</span>
                    <span>1800-XXX-SEVA</span>
                  </li>
                  <li>help@janseva.in</li>
                  <li>Privacy Policy</li>
                  <li>Terms of Service</li>
                </ul>
              </div>
            </div>
            <div className="pt-8 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-4 text-neutral-500 text-sm">
              <p>© 2026 JanSeva Tracker. Built for a smarter tomorrow.</p>
              <div className="flex gap-6">
                <span className="hover:text-white cursor-pointer transition-colors">Twitter</span>
                <span className="hover:text-white cursor-pointer transition-colors">Instagram</span>
                <span className="hover:text-white cursor-pointer transition-colors">LinkedIn</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

function Navbar({ user, onLogout }: { user: any, onLogout: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-neutral-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white border border-neutral-200 rounded-lg flex items-center justify-center shadow-sm overflow-hidden">
              <img src="https://ais-dev-c3exs44ic6cvchsrngweiy-453631784651.asia-southeast1.run.app/favicon.ico" alt="Logo" className="w-8 h-8 object-contain" onError={(e) => {
                (e.target as HTMLImageElement).src = "https://picsum.photos/seed/janseva/64/64";
              }} />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-neutral-800 leading-none">Janseva</span>
              <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">Tracker</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/" label="Home" active={isActive("/")} />
            <NavLink to="/complaints" label="Complaints" active={isActive("/complaints")} />
            <NavLink to="/dashboard" label="Dashboard" active={isActive("/dashboard")} />
            <NavLink to="/how-to-report" label="How to Report" active={isActive("/how-to-report")} />
            <NavLink to="/contact" label="Contact Us" active={isActive("/contact")} />
            <NavLink to="/faq" label="FAQ" active={isActive("/faq")} />
            
            <div className="h-6 w-px bg-neutral-200 mx-2" />
            
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-bold text-neutral-800">{user.name}</span>
                  <span className="text-[10px] uppercase font-bold text-orange-600">{user.role}</span>
                </div>
                <button 
                  onClick={onLogout}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-full text-sm font-bold transition-all shadow-lg shadow-orange-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg shadow-orange-200"
              >
                Login
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-neutral-600">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-neutral-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              <MobileNavLink to="/" label="Home" onClick={() => setIsOpen(false)} />
              <MobileNavLink to="/complaints" label="Complaints" onClick={() => setIsOpen(false)} />
              <MobileNavLink to="/dashboard" label="Dashboard" onClick={() => setIsOpen(false)} />
              <MobileNavLink to="/how-to-report" label="How to Report" onClick={() => setIsOpen(false)} />
              <MobileNavLink to="/contact" label="Contact Us" onClick={() => setIsOpen(false)} />
              <MobileNavLink to="/faq" label="FAQ" onClick={() => setIsOpen(false)} />
              {!user && (
                <Link 
                  to="/login" 
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center bg-orange-600 text-white py-3 rounded-xl font-bold mt-4"
                >
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function NavLink({ to, label, active }: { to: string, label: string, active: boolean }) {
  return (
    <Link 
      to={to} 
      className={`text-sm font-bold transition-all relative py-2 ${
        active ? "text-emerald-700" : "text-neutral-600 hover:text-orange-600"
      }`}
    >
      {label}
      {active && (
        <motion.div 
          layoutId="nav-underline"
          className="absolute -bottom-1 left-0 right-0 h-1 bg-emerald-600/20 rounded-full"
        />
      )}
    </Link>
  );
}

function MobileNavLink({ to, label, onClick }: { to: string, label: string, onClick: () => void }) {
  return (
    <Link 
      to={to} 
      onClick={onClick}
      className="block px-4 py-3 text-base font-bold text-neutral-700 hover:bg-neutral-50 rounded-xl"
    >
      {label}
    </Link>
  );
}
