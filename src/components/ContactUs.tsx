import { useState } from "react";
import { motion } from "motion/react";
import { Send, Phone, Mail, Clock, MapPin } from "lucide-react";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you for your message! We will get back to you soon.");
    setFormData({ name: "", phone: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="py-24 bg-neutral-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-12 rounded-[40px] shadow-2xl border border-neutral-100"
        >
          <h2 className="text-4xl font-bold text-neutral-800 mb-10">Send us a message</h2>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-6 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  placeholder="Rahul Sharma"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-6 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">Email Address *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-6 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">Subject *</label>
              <select
                required
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                className="w-full px-6 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all appearance-none"
              >
                <option value="">Select a topic...</option>
                <option value="general">General Inquiry</option>
                <option value="technical">Technical Support</option>
                <option value="complaint">Complaint Feedback</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-2">Message *</label>
              <textarea
                required
                rows={6}
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full px-6 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none"
                placeholder="Describe your query or issue in detail..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-5 rounded-2xl transition-all shadow-xl shadow-emerald-200 flex items-center justify-center gap-2 text-lg"
            >
              Send Message →
            </button>
          </form>

          <div className="mt-16 pt-10 border-t border-neutral-100 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <ContactInfo icon={<Phone size={20} />} label="1800-XXX-SEVA (Toll Free)" />
            <ContactInfo icon={<Mail size={20} />} label="help@janseva.in" />
            <ContactInfo icon={<Clock size={20} />} label="Mon–Sat, 9 AM – 6 PM" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function ContactInfo({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <div className="flex items-center justify-center gap-3 text-neutral-500 text-sm font-medium">
      <div className="text-emerald-600">{icon}</div>
      <span>{label}</span>
    </div>
  );
}
