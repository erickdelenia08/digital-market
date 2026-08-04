import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  HeartHandshake,
  Users,
  CheckCircle2,
  Smile,
  Code2,
  Globe,
  Award
} from 'lucide-react';
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: "About Us", // Hasilnya: "About Us | Codegraph" (jika menggunakan title template di layout)
  description: "Learn about CodeGraph's mission, values, and the creator behind high-quality digital assets, Canva templates, and productivity tools.",
  keywords: [
    "About CodeGraph",
    "Digital assets creator",
    "Canva templates developer",
    "Excel tools creator",
    "Codegraph mission"
  ],
  openGraph: {
    title: "About Us | CodeGraph",
    description: "Empowering creators with handcrafted digital assets, templates, and productivity tools.",
    url: "/about",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | CodeGraph",
    description: "Empowering creators with handcrafted digital assets, templates, and productivity tools.",
  },
};

// Data Profil Single Contributor (Kamu)
const founder = {
  name: "Your Name", // Ganti dengan nama kamu
  role: "Founder & Lead Creator",
  handle: "@yourhandle",
  bio: "Developer & creator mandiri yang berfokus membangun aset digital, template, dan tools praktis berstandar tinggi untuk membantu alur kerja para kreator.",
  initials: "YN",
  socials: {
    github: "#",
    linkedin: "#",
    twitter: "#",
  }
};

// Data Core Values (Flat Solid Tiles)
const values = [
  {
    icon: ShieldCheck,
    title: "Quality First",
    description: "Each asset is developed with strict standards to ensure functionality and clean code.",
    iconBg: "bg-indigo-600",
    iconColor: "text-white"
  },
  {
    icon: Users,
    title: "Creator Focused",
    description: "Features and templates are designed specifically based on the real needs of modern creator workflows.",
    iconBg: "bg-cyan-500",
    iconColor: "text-slate-950"
  },
  {
    icon: HeartHandshake,
    title: "Integrity",
    description: "Fair prices, no hidden fees, and transparent licensing terms.",
    iconBg: "bg-indigo-600",
    iconColor: "text-white"
  },
  {
    icon: Zap,
    title: "Maximum Speed",
    description: "Ready-to-use solutions that cut project completion time many times over.",
    iconBg: "bg-amber-500",
    iconColor: "text-slate-950"
  }
];

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      <main className="flex-1">

        {/* --- 1. HERO SECTION (Solid Light Canvas) --- */}
        <section className="relative py-20 md:py-28 bg-white border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-6">

              {/* Recessed Badge (Efek Cekung Solid) */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 shadow-inner border border-slate-200 text-indigo-600 text-xs font-bold uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>About CodeGraph</span>
              </div>

              {/* Headline Solid & Bold */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
                Crafting Assets That <br />
                <span className="text-indigo-600">Elevate Workflows</span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
                A self-platform that provides high-quality digital assets to accelerate your creative process.
              </p>
            </div>

            {/* Micro-Elevated Stats Bar */}
            <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                { label: "Active Users", val: "50K+", icon: Smile, color: "text-indigo-600" },
                { label: "Digital Assets", val: "500+", icon: Code2, color: "text-cyan-600" },
                { label: "Global Reach", val: "150+", icon: Globe, color: "text-amber-600" },
                { label: "Satisfaction", val: "99.8%", icon: Award, color: "text-emerald-600" },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 border border-slate-200/80 p-5 rounded-2xl text-center shadow-sm hover:bg-white hover:shadow-md transition-all duration-200"
                >
                  <stat.icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{stat.val}</div>
                  <div className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* --- 2. SINGLE CREATOR & MISSION SECTION --- */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">

              {/* Sisi Kiri: Profil Single Contributor (Embossed Tile) */}
              <div className="lg:col-span-5">
                <div className="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 relative">

                  {/* Subtle Solid Top Accent */}
                  <div className="absolute top-0 left-8 right-8 h-1 bg-indigo-600 rounded-b-md" />

                  <div className="flex items-center gap-5 pt-1">
                    {/* Avatar Block Solid */}
                    <div className="w-16 h-16 rounded-xl bg-slate-900 flex items-center justify-center text-xl font-black text-white shrink-0 shadow-sm">
                      {founder.initials}
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-slate-900 tracking-tight">{founder.name}</h3>
                      <p className="text-indigo-600 text-xs font-bold uppercase tracking-widest mt-0.5">{founder.role}</p>
                      <p className="text-slate-400 text-xs mt-0.5">{founder.handle}</p>
                    </div>
                  </div>

                  <p className="text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-5 mt-6">
                    &ldquo;{founder.bio}&rdquo;
                  </p>

                  {/* Fixed Social Buttons Icons */}
                  <div className="flex items-center gap-3 pt-5">
                    <a
                      href={founder.socials.github}
                      aria-label="GitHub Profile"
                      className="p-2.5 bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-600 rounded-xl transition-colors duration-200"
                    >
                      <Code2 className="w-4 h-4" />
                    </a>
                    <a
                      href={founder.socials.linkedin}
                      aria-label="LinkedIn Profile"
                      className="p-2.5 bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-600 rounded-xl transition-colors duration-200"
                    >
                      <Code2 className="w-4 h-4" />
                    </a>
                    <a
                      href={founder.socials.twitter}
                      aria-label="Twitter Profile"
                      className="p-2.5 bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-600 rounded-xl transition-colors duration-200"
                    >
                      <Code2 className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Sisi Kanan: Misi Platform */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest px-3 py-1 bg-indigo-50 rounded-md border border-indigo-100 shadow-inner">
                    Our Mission
                  </span>
                  <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                    Focus on Quality & Work Efficiency
                  </h2>
                </div>

                <p className="text-slate-600 leading-relaxed text-base sm:text-lg">
                  CodeGraph is built to streamline the technical complexities often faced by creators. Without complicated workflows, each asset is designed to be directly implemented in your project.
                </p>

                <div className="grid sm:grid-cols-2 gap-3 pt-2">
                  {[
                    "Handcrafted Quality",
                    "Direct Support",
                    "Continuous Updates",
                    "Clear Licensing"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-slate-700 text-sm font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                {/* Recessed Vision Quote Box */}
                <div className="p-5 bg-slate-100/80 rounded-xl border border-slate-200 shadow-inner">
                  <h3 className="font-bold text-slate-900 text-sm mb-1">Our Vision</h3>
                  <p className="text-slate-600 italic text-sm">
                    &ldquo; To be a trusted independent digital asset ecosystem that makes it easier for anyone to create.&rdquo;
                  </p>
                </div>

                <div className="pt-2">
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 px-6 py-3.5 bg-slate-900 hover:bg-indigo-600 text-white font-bold rounded-xl transition-all duration-200 shadow-md hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <span>Explore Products</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>


        {/* --- 3. CORE VALUES SECTION (Flat Embossed Tiles) --- */}
        <section className="py-16 md:py-24 bg-slate-100/70 border-y border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest px-3 py-1 bg-indigo-50 rounded-md border border-indigo-100 shadow-inner">
                Principles
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Our Core Values
              </h2>
            </div>

            {/* Embossed Card Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-7 border border-slate-200/80 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Solid Color Icon Tile */}
                    <div className={`w-12 h-12 rounded-xl ${item.iconBg} ${item.iconColor} flex items-center justify-center mb-6 shadow-sm`}>
                      <item.icon className="w-6 h-6" />
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>


        {/* --- 4. CTA BANNER (Full Light Tactile Card) --- */}
        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="rounded-3xl bg-white border border-slate-200/90 py-16 px-6 sm:px-12 text-center shadow-md">
            <div className="max-w-2xl mx-auto space-y-6">

              <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest px-3 py-1 bg-indigo-50 rounded-md border border-indigo-100 shadow-inner">
                Get Started
              </span>

              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Ready to Upgrade Your Workflows?
              </h2>
              <p className="text-slate-600 text-base sm:text-lg">
                Discover a variety of high-quality digital assets designed to support your project needs.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/products"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all duration-200 shadow-md hover:-translate-y-0.5"
                >
                  <span>Browse Products</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/blog"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-100 hover:bg-slate-200/80 text-slate-800 font-bold rounded-xl border border-slate-200 transition-all duration-200 hover:-translate-y-0.5"
                >
                  <span>Read Blog</span>
                </Link>
              </div>

            </div>
          </div>
        </section>

      </main>

    </div>
  );
};

export default AboutPage;