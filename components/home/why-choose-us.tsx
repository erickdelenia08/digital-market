"use client";

import { CheckCircle2, Sparkles, Users, Clock, Award, ArrowRight } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

const features = [
  {
    icon: Sparkles,
    title: "Professional Quality",
    description: "Every asset is crafted by industry professionals with real-world design experience."
  },
  {
    icon: Users,
    title: "Community Trusted",
    description: "Join 50,000+ creators and teams who trust our platform for their digital assets."
  },
  {
    icon: Clock,
    title: "Save Time",
    description: "Skip the tedious setup. Get instant access to production-ready files and templates."
  },
  {
    icon: Award,
    title: "Regular Updates",
    description: "Free lifetime updates ensure your assets stay aligned with evolving design trends."
  }
];

const reasons = [
  "Designed by professionals, for professionals",
  "Instant download and immediate workspace access",
  "Comprehensive documentation and integration guides",
  "Responsive customer support team"
];

// 1. Main Stagger Container
const sectionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 }
  }
};

// 2. Fade Up Animation for Text & Elements
const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.215, 0.61, 0.355, 1] }
  }
};

// 3. Card Animation Variants
const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 24 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.215, 0.61, 0.355, 1] }
  }
};

const WhyChooseUs = () => {
  return (
    <section id="about" className="py-20 md:py-28 bg-slate-50/40 border-b border-slate-200/60 overflow-hidden">
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* --- LEFT COLUMN: CONTENT & TACTILE CHECKLIST (Col 6) --- */}
          <div className="lg:col-span-6 flex flex-col items-start space-y-6">

            {/* Embossed Section Badge */}
            <motion.div
              variants={fadeUpVariants}
              className="inline-flex items-center gap-2 bg-accent-indigo/5 border border-accent-indigo/10 px-3.5 py-1.5 rounded-full text-accent-indigo text-[11px] font-black uppercase tracking-widest shadow-inner"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Why Choose Us</span>
            </motion.div>

            {/* Typography Heading */}
            <motion.h2
              variants={fadeUpVariants}
              className="text-3xl sm:text-4xl lg:text-5xl font-black text-primary-900 tracking-tight leading-[1.15]"
            >
              The Premier Gateway for{" "}
              <span className="bg-gradient-to-r from-accent-indigo to-accent-cyan bg-clip-text text-transparent">
                Modern Digital Creators
              </span>
            </motion.h2>

            <motion.p
              variants={fadeUpVariants}
              className="text-sm sm:text-base font-medium text-slate-500 leading-relaxed max-w-xl"
            >
              We understand the demands faced by content creators, editors, and designers. That&apos;s why every asset in our ecosystem is meticulously engineered to elevate your output while saving hours of manual setup.
            </motion.p>

            {/* Tactile Micro Checklist */}
            <motion.ul
              variants={{
                visible: { transition: { staggerChildren: 0.08 } }
              }}
              className="space-y-2.5 w-full pt-2"
            >
              {reasons.map((reason, index) => (
                <motion.li
                  key={index}
                  variants={fadeUpVariants}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/60 border border-slate-200/60 shadow-xs hover:bg-white hover:border-slate-300 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200 group/item cursor-default"
                >
                  <div className="p-1 rounded-lg bg-accent-indigo/10 text-accent-indigo shrink-0 transition-transform duration-200 group-hover/item:scale-110">
                    <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-slate-700 transition-colors duration-200 group-hover/item:text-primary-900">
                    {reason}
                  </span>
                </motion.li>
              ))}
            </motion.ul>

            {/* Tactile Action Button */}
            <motion.div variants={fadeUpVariants} className="pt-3">
              <a
                href="#products"
                className="group relative inline-flex items-center gap-2.5 px-6 py-3.5 bg-primary-900 hover:bg-primary-950 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md shadow-primary-900/15 border border-primary-900 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
              >
                <span>Explore Our Products</span>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-white group-hover:translate-x-1 transition-all duration-200" />
              </a>
            </motion.div>
          </div>

          {/* --- RIGHT COLUMN: FEATURE CARDS GRID (Col 6) --- */}
          <motion.div
            variants={{
              visible: { transition: { staggerChildren: 0.1 } }
            }}
            className="lg:col-span-6 grid sm:grid-cols-2 gap-5"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover="hover"
                className="group bg-white rounded-2xl border border-slate-200/80 p-6 shadow-md shadow-slate-200/30 hover:shadow-xl hover:border-slate-300 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between cursor-pointer select-none"
              >
                <div>
                  {/* Embossed Tactile Icon Container */}
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-inner flex items-center justify-center mb-5 text-accent-indigo group-hover:bg-accent-indigo group-hover:text-white group-hover:border-accent-indigo group-hover:shadow-lg group-hover:shadow-accent-indigo/20 transition-all duration-300">
                    <feature.icon className="w-5 h-5 stroke-[2.2] transition-transform duration-300 group-hover:scale-110" />
                  </div>

                  {/* Card Title */}
                  <h3 className="text-base font-bold text-primary-900 mb-2 group-hover:text-accent-indigo transition-colors duration-200">
                    {feature.title}
                  </h3>

                  {/* Card Description */}
                  <p className="text-xs font-medium text-slate-500 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </motion.div>
    </section>
  );
};

export default WhyChooseUs;