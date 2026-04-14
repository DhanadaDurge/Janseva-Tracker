import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "What is JanSeva Tracker and how does it help me?",
    answer: "JanSeva Tracker is a digital platform that allows citizens to report civic issues like potholes, garbage, and street light outages directly to the municipal authorities. It helps you by providing a transparent way to track the resolution of your complaints in real-time."
  },
  {
    question: "How long does it usually take for a complaint to be resolved?",
    answer: "Resolution time depends on the priority level assigned to the complaint. Critical issues are typically addressed within 24-48 hours, while medium and low priority issues may take 4-7 days. You can see the specific deadline for each of your complaints on your dashboard."
  },
  {
    question: "What types of civic issues can I report?",
    answer: "You can report a wide range of issues including road damage (potholes), garbage accumulation, water leakage, drainage/sewage problems, and street light failures. If your issue doesn't fit these categories, you can use the 'General' category."
  },
  {
    question: "Can I attach photos or videos when filing a complaint?",
    answer: "Yes! In fact, we highly recommend attaching a photo as evidence. It helps the department understand the exact nature and scale of the problem. Our AI also uses these photos to help categorize and prioritize the issue."
  },
  {
    question: "Is my personal information safe?",
    answer: "Absolutely. We take data privacy seriously. Your personal details are only accessible to authorized municipal officials for the purpose of resolving your complaint and providing updates."
  }
];

export default function FAQ() {
  return (
    <div className="min-h-screen">
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/city-hall/1920/600" 
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
            Frequently Asked Questions
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white/80 max-w-2xl mx-auto"
          >
            Everything you need to know about reporting and tracking civic issues
          </motion.p>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <span className="text-emerald-600 font-bold uppercase tracking-widest text-xs">Got Questions?</span>
            <div className="flex items-center gap-4 mt-2">
              <h2 className="text-4xl font-bold text-neutral-800">We've got answers.</h2>
              <div className="w-8 h-8 bg-orange-600 rounded-lg shadow-lg shadow-orange-200" />
            </div>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-neutral-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-neutral-50 transition-colors"
      >
        <span className="font-bold text-neutral-800 pr-8">{question}</span>
        <div className={`p-1 rounded-full ${isOpen ? "bg-emerald-100 text-emerald-600" : "bg-neutral-100 text-neutral-400"}`}>
          {isOpen ? <Minus size={18} /> : <Plus size={18} />}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6 pt-0 text-neutral-500 text-sm leading-relaxed border-t border-neutral-50">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
