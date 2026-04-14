import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Clock, MapPin, CheckCircle2, Info } from "lucide-react";

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/city-night/1920/1080" 
            alt="City Background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight"
          >
            Make Your City Better..!
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-white/80 mb-10 font-medium"
          >
            Report issues and track their resolution in real time
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link 
              to="/report" 
              className="inline-flex items-center gap-3 bg-orange-600 hover:bg-orange-700 text-white px-10 py-4 rounded-full text-lg font-bold transition-all shadow-xl shadow-orange-900/40 group"
            >
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <ArrowRight size={18} />
              </div>
              Report Issue
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Get Started Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-16 items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-4xl font-bold text-neutral-800">Get Started with JanSeva</h2>
                <div className="w-8 h-8 bg-orange-600 rounded-lg shadow-lg shadow-orange-200" />
              </div>
              
              <div className="bg-neutral-50 p-10 rounded-[40px] border border-neutral-100 relative overflow-hidden">
                <div className="absolute top-8 left-8 w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                  <Info size={24} />
                </div>
                <div className="pl-16">
                  <h3 className="text-xl font-bold text-neutral-800 mb-4">About Us</h3>
                  <p className="text-neutral-500 leading-relaxed text-lg">
                    JanSeva Tracker is a smart civic engagement platform designed to bridge the gap between citizens and municipal authorities. It enables people to report everyday urban issues such as waste, road damage, water leakage, and streetlight failures while ensuring transparency and timely resolution.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="text-2xl font-bold text-neutral-800">How to Report Issue</h3>
              </div>

              <div className="space-y-6">
                <StepItem number="1" title="Capture the Problem" desc="Take a photo of the issue (garbage, road, light, water)." icon={<MapPin size={20} />} />
                <StepItem number="2" title="Add Details" desc="Write a short description or use voice input." icon={<ArrowRight size={20} />} />
                <StepItem number="3" title="Auto Location Detection" desc="Your location is automatically added." icon={<MapPin size={20} />} />
                <StepItem number="4" title="Track Status" desc="Get live updates: Assigned → In Progress → Resolved." icon={<Clock size={20} />} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function StepItem({ number, title, desc, icon }: { number: string, title: string, desc: string, icon: React.ReactNode }) {
  return (
    <div className="flex gap-6 items-start group">
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg shadow-orange-200 z-10">
          {number}
        </div>
        <div className="w-px h-full bg-neutral-200 -mt-2 group-last:hidden" />
      </div>
      <div className="bg-neutral-50 p-6 rounded-3xl border border-neutral-100 flex-grow group-hover:bg-white group-hover:shadow-xl group-hover:border-emerald-100 transition-all">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-white rounded-lg text-neutral-400 group-hover:text-emerald-600 transition-colors">
            {icon}
          </div>
          <h4 className="font-bold text-neutral-800">{title}</h4>
        </div>
        <p className="text-sm text-neutral-500">{desc}</p>
      </div>
    </div>
  );
}
