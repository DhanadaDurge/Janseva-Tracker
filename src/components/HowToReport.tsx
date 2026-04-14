import { motion } from "motion/react";
import { MapPin, Camera, FileText, Clock, CheckCircle2 } from "lucide-react";

export default function HowToReport() {
  return (
    <div className="min-h-screen">
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/city-street/1920/600" 
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

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ReportStep 
              icon={<Camera size={32} />} 
              title="1. Capture" 
              desc="Take a clear photo of the issue you want to report."
              color="bg-emerald-600"
            />
            <ReportStep 
              icon={<FileText size={32} />} 
              title="2. Describe" 
              desc="Provide a brief description of the problem and its severity."
              color="bg-orange-600"
            />
            <ReportStep 
              icon={<MapPin size={32} />} 
              title="3. Locate" 
              desc="The app will automatically detect your current GPS location."
              color="bg-blue-600"
            />
            <ReportStep 
              icon={<Clock size={32} />} 
              title="4. Track" 
              desc="Monitor the progress of your complaint until it's resolved."
              color="bg-purple-600"
            />
          </div>

          <div className="mt-24 bg-neutral-50 p-12 rounded-[40px] border border-neutral-100">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-neutral-800 mb-6">Why Report?</h2>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-neutral-600">
                    <CheckCircle2 className="text-emerald-600" size={20} />
                    <span>Faster resolution of community problems</span>
                  </li>
                  <li className="flex items-center gap-3 text-neutral-600">
                    <CheckCircle2 className="text-emerald-600" size={20} />
                    <span>Direct communication with municipal departments</span>
                  </li>
                  <li className="flex items-center gap-3 text-neutral-600">
                    <CheckCircle2 className="text-emerald-600" size={20} />
                    <span>Contribute to a cleaner and safer city</span>
                  </li>
                  <li className="flex items-center gap-3 text-neutral-600">
                    <CheckCircle2 className="text-emerald-600" size={20} />
                    <span>Hold authorities accountable through transparency</span>
                  </li>
                </ul>
              </div>
              <div className="flex-1">
                <div className="aspect-video bg-neutral-200 rounded-3xl overflow-hidden shadow-2xl">
                  <img src="https://picsum.photos/seed/report-help/800/450" alt="Help" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ReportStep({ icon, title, desc, color }: { icon: React.ReactNode, title: string, desc: string, color: string }) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="bg-neutral-50 p-8 rounded-[32px] border border-neutral-100 text-center group transition-all hover:bg-white hover:shadow-2xl hover:border-emerald-100"
    >
      <div className={`w-16 h-16 ${color} text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-neutral-800 mb-4">{title}</h3>
      <p className="text-neutral-500 text-sm leading-relaxed">{desc}</p>
    </motion.div>
  );
}
