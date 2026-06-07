import { BookOpen, Brain, BarChart3, Users, ChevronRight, Star, Target, CheckCircle, Zap, Trophy, FlaskConical, Stethoscope, Atom, GraduationCap, School, BookMarked, Calculator, Microscope, Crown, Lock, type LucideIcon } from "lucide-react";
import { useApp } from "./context/AppContext";
import { useState, useEffect } from "react";

const BGImage      = new URL("../../imports/BG.jpg",         import.meta.url).href;
const DIGIImage    = new URL("../../imports/DIGI.jpg",       import.meta.url).href;
const STDImage     = new URL("../../imports/STD.jpg",        import.meta.url).href;
const STUPREPImage = new URL("../../imports/STUDY_PREP.jpg", import.meta.url).href;
const STUDYImage   = new URL("../../imports/STUDY.jpg",      import.meta.url).href;
const LogoImage    = new URL("../../imports/logo.png",       import.meta.url).href;

const features = [
  { icon: BookOpen,      title: "PYQ Papers", desc: "NEET, JEE, HSC & SSC past papers organised by year, subject, and paper type — downloadable & viewable online.", color: "bg-blue-100 text-blue-700" },
  { icon: Brain,         title: "Smart Quiz Engine", desc: "Real exam-pattern MCQs with live negative marking (+4/−1 for NEET/JEE, +1/0 for boards). Practice or Exam mode.", color: "bg-purple-100 text-purple-700" },
  { icon: BarChart3,     title: "Analytics & Percentile", desc: "Track score trends, subject weak-spots, negative-mark patterns, and your percentile vs peers.", color: "bg-green-100 text-green-700" },
  { icon: Zap,           title: "Goal-Based Learning", desc: "Switch between exam goals (NEET, JEE, Board) — each goal has its own content, timeline, and analytics.", color: "bg-orange-100 text-orange-700" },
];

const stats = [
  { value: "5,200+", label: "Students" },
  { value: "412+",   label: "Papers" },
  { value: "286+",   label: "Quizzes" },
  { value: "84K+",   label: "Attempts" },
];

const examGoals: { icon: LucideIcon; label: string; iconColor: string; bg: string; text: string; border: string; tags: string[]; comingSoon?: boolean }[] = [
  { icon: School,        label: "SSC Class 10", iconColor: "text-orange-600", bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", tags: ["Mathematics", "Science", "English", "Marathi", "History"] },
  { icon: GraduationCap, label: "HSC Class 12", iconColor: "text-blue-600",   bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-200",   tags: ["Physics", "Chemistry", "Maths", "Biology", "Economics"] },
  { icon: Atom,          label: "JEE Mains",    iconColor: "text-violet-600", bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200", tags: ["Physics", "Chemistry", "Mathematics"],                    comingSoon: true },
  { icon: Stethoscope,   label: "NEET UG",      iconColor: "text-green-600",  bg: "bg-green-50",  text: "text-green-700",  border: "border-green-200",  tags: ["Physics", "Chemistry", "Botany", "Zoology"],            comingSoon: true },
];

const plans = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    desc: "Perfect to explore the platform",
    color: "border-gray-200",
    badge: null as string | null,
    badgeBg: "",
    btnClass: "border-2 border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white",
    popular: false,
    features: [
      { label: "5 Past Year Papers / month",      included: true },
      { label: "3 MCQ Quizzes / month",           included: true },
      { label: "Test Series",                     included: false },
      { label: "Negative Marking Engine",          included: false },
      { label: "Basic Analytics",                 included: true },
      { label: "Bookmarks",                       included: false },
      { label: "SSC Class 10 Content only",       included: true },
      { label: "PDF Downloads",                   included: false },
      { label: "Email Support",                   included: false },
    ],
  },
  {
    name: "Scholar",
    price: "₹99",
    period: "/ month",
    desc: "Great for board exam students",
    color: "border-orange-300",
    badge: null as string | null,
    badgeBg: "",
    btnClass: "bg-[#F97316] hover:bg-orange-600 text-white shadow-[0_4px_14px_rgba(249,115,22,0.4)]",
    popular: false,
    features: [
      { label: "All Past Year Papers",            included: true },
      { label: "20 MCQ Quizzes / month",          included: true },
      { label: "Test Series",                     included: false },
      { label: "Negative Marking Engine",         included: true },
      { label: "Advanced Analytics",              included: true },
      { label: "Bookmarks",                       included: true },
      { label: "SSC + HSC Content",               included: true },
      { label: "PDF Downloads",                   included: true },
      { label: "Email Support",                   included: true },
    ],
  },
  {
    name: "Champion",
    price: "₹199",
    period: "/ month",
    desc: "For serious NEET & JEE aspirants",
    color: "border-transparent",
    badge: "Most Popular" as string | null,
    badgeBg: "bg-[#F97316]",
    btnClass: "bg-white text-[#1E3A8A] hover:bg-blue-50 font-bold shadow-[0_4px_14px_rgba(255,255,255,0.3)]",
    popular: true,
    features: [
      { label: "All Past Year Papers",               included: true },
      { label: "Unlimited MCQ Quizzes",              included: true },
      { label: "Full Test Series",                   included: true },
      { label: "Negative Marking Engine",            included: true },
      { label: "Full Analytics + Percentile",        included: true },
      { label: "Bookmarks",                          included: true },
      { label: "All Exams — NEET, JEE, SSC, HSC",   included: true },
      { label: "PDF Downloads",                      included: true },
      { label: "Priority Support",                   included: true },
    ],
  },
];

export function LandingPage() {
  const { setView } = useApp();
  const images = [BGImage, DIGIImage, STDImage, STUPREPImage, STUDYImage];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Carousel rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="min-h-screen bg-[#F0F2F8D7]">
      {/* Navbar */}
      <nav className="bg-white text-gray-800 px-2 sm:px-8 py-2 sm:py-3 flex items-center justify-between sticky top-0 z-50 shadow-md">
        {/* Brand */}
        <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
          <img src={LogoImage} alt="ParikshaCrack Logo" className="w-9 h-9 sm:w-14 sm:h-14 object-contain flex-shrink-0" />
          <span
            className="font-bold text-sm sm:text-xl truncate min-[360px]:block hidden"
            style={{ fontFamily: "Poppins, sans-serif", color: "#1C3A5C" }}
          >
            ParikshaCrack
          </span>
        </div>
        {/* Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
          <button
            onClick={() => setView("login")}
            className="px-2.5 sm:px-4 py-1.5 text-xs sm:text-sm text-[#1C3A5C] border border-[#1C3A5C] rounded-lg hover:bg-[#1C3A5C] hover:text-white transition-colors font-medium whitespace-nowrap"
          >
            Login
          </button>
          <button
            onClick={() => setView("register")}
            className="px-2.5 sm:px-4 py-1.5 text-xs sm:text-sm bg-[#F97316] text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold whitespace-nowrap"
          >
            <span className="hidden min-[400px]:inline">Register Free</span>
            <span className="inline min-[400px]:hidden">Register</span>
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section
        className="text-white py-12 sm:py-24 px-3 sm:px-4 bg-cover bg-center bg-no-repeat relative overflow-hidden min-h-[550px] sm:min-h-[700px] flex items-center"
        style={{
          backgroundImage: `url(${images[currentImageIndex]})`,
          backgroundAttachment: 'fixed',
          transition: 'background-image 1s ease-in-out'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#05143F]/85 via-blue-800/85 to-blue-900/85" />

        {/* Carousel indicators */}
        <div className="absolute top-4 sm:top-6 right-4 sm:right-6 flex gap-1.5 sm:gap-2 z-20">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentImageIndex(idx)}
              className={`w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full transition-all ${idx === currentImageIndex ? 'bg-[#F97316] w-6 sm:w-8' : 'bg-white/40 hover:bg-white/60'}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10 w-full px-2">
          {/* Exam goal pills */}
          <div className="flex flex-wrap gap-2 justify-center mb-5 sm:mb-6">
            {[
              { icon: School,       label: "SSC" },
              { icon: GraduationCap,label: "HSC" },
              { icon: Atom,        label: "JEE" },
              { icon: Stethoscope, label: "NEET" },
              { icon: FlaskConical,label: "MHT-CET" },
            ].map(({ icon: Icon, label }) => (
              <span key={label} className="bg-white/10 border border-white/20 rounded-full px-3 py-1 text-xs sm:text-sm font-medium text-white/90 flex items-center gap-1.5">
                <Icon size={13} />
                {label}
              </span>
            ))}
          </div>

          <h1
            className="text-2xl sm:text-4xl md:text-5xl mb-4 sm:mb-6 leading-tight"
            style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700 }}
          >
            <span style={{ color: "#F97316" }}>Crack Any Exam</span> with Smart Preparation
          </h1>
          <p className="text-blue-100 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-2">
            NEET · JEE Mains · JEE Advanced · MHT-CET · HSC · SSC — one platform for all. Real negative marking, PYQs, chapter quizzes, and exam-specific analytics.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center px-2">
            <button
              onClick={() => setView("register")}
              className="bg-[#F97316] hover:bg-orange-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-colors flex items-center justify-center gap-2 font-semibold text-sm sm:text-base"
            >
              Start Preparing Free <ChevronRight size={16} className="hidden sm:block" />
            </button>
            <button
              onClick={() => setView("login")}
              className="bg-white/10 hover:bg-white/20 border border-white/30 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-colors text-sm sm:text-base"
            >
              Login to Dashboard
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mt-8 sm:mt-12 md:mt-14 max-w-3xl mx-auto">
            {stats.map((s, idx) => (
              <div
                key={s.label}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 text-center hover:bg-white/15 transition-all transform hover:scale-105"
                style={{ animation: `slideUp 0.6s ease-out ${idx * 0.1}s both` }}
              >
                <div className="text-lg sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>{s.value}</div>
                <div className="text-blue-200 text-xs sm:text-sm">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Decorative */}
          <div className="absolute left-2 sm:left-12 top-1/4 z-0 opacity-10 sm:opacity-20">
            <BookOpen size={60} className="text-white sm:w-[80px] sm:h-[80px] animate-pulse" />
          </div>
          <div className="absolute right-2 sm:right-12 bottom-1/4 z-0 opacity-10 sm:opacity-20">
            <Brain size={60} className="text-white sm:w-[80px] sm:h-[80px] animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 sm:py-16 px-3 sm:px-4 bg-[#F8FAFC]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center text-xl sm:text-2xl md:text-3xl mb-2 sm:mb-3" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, color: "#1E3A8A" }}>
            Everything You Need to Score High
          </h2>
          <p className="text-center text-gray-500 text-sm sm:text-base mb-8 sm:mb-10">
            One platform. Every exam. Real exam patterns.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {features.map(f => (
              <div key={f.title} className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className={`w-10 sm:w-12 h-10 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center ${f.color} mb-3 sm:mb-4`}>
                  <f.icon size={20} className="sm:w-[22px] sm:h-[22px]" />
                </div>
                <h3 className="mb-2 text-sm sm:text-base" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "#1E3A8A" }}>{f.title}</h3>
                <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Exam Goals Section */}
      <section className="py-10 sm:py-14 px-3 sm:px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center text-xl sm:text-2xl md:text-3xl mb-3" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, color: "#1E3A8A" }}>
            Supported Exam Goals
          </h2>
          <p className="text-center text-gray-500 text-sm mb-8 sm:mb-10">Choose your goal during onboarding — switch anytime</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {examGoals.map(g => (
              <div key={g.label} className={`${g.bg} border ${g.border} rounded-xl sm:rounded-2xl p-4 sm:p-6 relative overflow-hidden`}>
                {g.comingSoon && (
                  <div className="absolute top-3 right-3 z-10">
                    <span className="inline-flex items-center gap-1 bg-amber-400 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-900/40 animate-pulse" />
                      Coming Soon
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <div className={`w-9 h-9 rounded-xl bg-white/60 border ${g.border} flex items-center justify-center flex-shrink-0`}>
                    <g.icon size={18} className={g.comingSoon ? "opacity-60 " + g.iconColor : g.iconColor} />
                  </div>
                  <div className="flex-1">
                    <div className={`${g.text} text-sm font-bold ${g.comingSoon ? "opacity-70" : ""}`} style={{ fontFamily: "Poppins, sans-serif" }}>{g.label}</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {g.tags.map(t => (
                    <span key={t} className={`bg-white ${g.text} border ${g.border} text-xs px-2.5 py-1 rounded-full ${g.comingSoon ? "opacity-60" : ""}`}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {/* Extra goal pills */}
          <div className="flex flex-wrap gap-2 justify-center mt-5">
            {[
              { icon: BookOpen,    label: "Class 9 & 8" },
              { icon: BookMarked,  label: "Class 11" },
              { icon: Microscope,  label: "MHT-CET PCB" },
              { icon: Calculator,  label: "MHT-CET PCM" },
              { icon: Trophy,      label: "JEE Advanced",  comingSoon: true },
            ].map(g => (
              <span key={g.label} className="bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-full border border-gray-200 flex items-center gap-1.5">
                <g.icon size={12} />
                {g.label}
                {g.comingSoon && <span className="bg-amber-400 text-amber-900 text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide leading-none">Soon</span>}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-12 sm:py-16 px-3 sm:px-4 bg-[#F8FAFC]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-center text-xl sm:text-2xl md:text-3xl mb-8 sm:mb-12" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, color: "#1E3A8A" }}>
            How It Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {[
              { icon: Users,   step: "1", title: "Choose Your Goal",    desc: "Register free, pick your exam (NEET/JEE/Board), class, stream, and subjects in under 2 minutes" },
              { icon: Brain,   step: "2", title: "Practice Daily",      desc: "Attempt quizzes with real marking schemes, browse PYQs, and track wrong answers" },
              { icon: Trophy,  step: "3", title: "See Your Percentile", desc: "Every quiz shows your score, negative marks, and estimated percentile vs all test-takers" },
            ].map(item => (
              <div key={item.step} className="text-center">
                <div className="w-12 sm:w-14 h-12 sm:h-14 bg-[#1E3A8A] rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <item.icon size={20} className="text-white sm:w-[24px] sm:h-[24px]" />
                </div>
                <div className="text-[#F97316] text-xs sm:text-sm mb-2" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>Step {item.step}</div>
                <h3 className="mb-2 text-sm sm:text-base" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "#1E3A8A" }}>{item.title}</h3>
                <p className="text-gray-500 text-xs sm:text-sm px-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-10 sm:py-14 px-3 sm:px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-center text-xl sm:text-2xl md:text-3xl mb-8 sm:mb-10" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, color: "#1E3A8A" }}>
            What Students Say
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {[
              { name: "Priya S.", goal: "NEET 2027",  score: "89%", quote: "The +4/−1 quiz engine is exactly like the real NEET. I finally understand where I lose marks — wrong guesses!" },
              { name: "Rohan P.", goal: "SSC Class 10", quote: "Marathi medium papers and quizzes are perfectly organised. My prelims score jumped 12 marks.", score: "81%" },
              { name: "Sneha K.", goal: "JEE Mains",  quote: "Switching between Board and JEE goals is seamless. Each goal has its own content — no mixing up.", score: "94%" },
            ].map(t => (
              <div key={t.name} className="bg-[#F8FAFC] rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-gray-100">
                <div className="flex gap-0.5 mb-3">
                  {[1,2,3,4,5].map(i => <Star key={i} size={12} className="text-[#F97316] fill-[#F97316] sm:w-[14px] sm:h-[14px]" />)}
                </div>
                <p className="text-gray-600 text-xs sm:text-sm italic mb-4">"{t.quote}"</p>
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-semibold text-gray-800 text-xs sm:text-sm truncate" style={{ fontFamily: "Poppins, sans-serif" }}>{t.name}</div>
                    <div className="text-gray-400 text-xs">{t.goal}</div>
                  </div>
                  <div className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-semibold whitespace-nowrap">{t.score}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="py-14 sm:py-20 px-3 sm:px-4 bg-[#F0F4FF]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
              <Crown size={13} /> Choose Your Plan
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl mb-3" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, color: "#1E3A8A" }}>
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto">
              Start free, upgrade when you're ready. No hidden fees. Cancel anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-stretch">
            {plans.map(plan => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border-2 flex flex-col transition-all duration-300 hover:-translate-y-1 ${
                  plan.popular
                    ? "bg-gradient-to-b from-[#1E3A8A] to-[#1e4da8] text-white border-[#3B82F6] shadow-[0_20px_60px_rgba(30,58,138,0.4)] ring-2 ring-[#3B82F6]/40"
                    : "bg-white text-gray-800 shadow-sm hover:shadow-lg " + plan.color
                }`}
              >
                {/* Popular badge */}
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className={`${plan.badgeBg} text-white text-[11px] font-bold px-4 py-1 rounded-full shadow-md tracking-wide`}>
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="p-6 sm:p-7 flex flex-col flex-1">
                  {/* Header */}
                  <div className="mb-5">
                    <div className={`text-xs font-semibold uppercase tracking-widest mb-1 ${plan.popular ? "text-blue-200" : "text-gray-400"}`}>
                      {plan.name}
                    </div>
                    <div className="flex items-end gap-1 mb-1">
                      <span className="text-3xl sm:text-4xl" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800 }}>
                        {plan.price}
                      </span>
                      <span className={`text-sm mb-1 ${plan.popular ? "text-blue-200" : "text-gray-400"}`}>{plan.period}</span>
                    </div>
                    <p className={`text-xs ${plan.popular ? "text-blue-200" : "text-gray-500"}`}>{plan.desc}</p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2.5 mb-7 flex-1">
                    {plan.features.map(f => (
                      <li key={f.label} className={`flex items-start gap-2.5 text-sm ${!f.included ? (plan.popular ? "opacity-40" : "opacity-40") : ""}`}>
                        {f.included
                          ? <CheckCircle size={16} className={`flex-shrink-0 mt-0.5 ${plan.popular ? "text-green-300" : "text-green-500"}`} />
                          : <Lock size={14} className={`flex-shrink-0 mt-0.5 ${plan.popular ? "text-blue-300" : "text-gray-300"}`} />
                        }
                        <span className={plan.popular ? "text-blue-50" : "text-gray-600"}>{f.label}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <button
                    onClick={() => setView("register")}
                    className={`w-full py-3 rounded-xl text-sm font-bold transition-all duration-200 hover:scale-105 active:scale-95 ${plan.btnClass}`}
                  >
                    {plan.price === "Free" ? "Get Started Free" : `Get ${plan.name}`}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom note */}
          <p className="text-center text-xs text-gray-400 mt-8">
            All plans include a <span className="font-semibold text-gray-600">7-day free trial</span> of Scholar features. No credit card required for Starter.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 sm:py-16 px-3 sm:px-4 bg-gradient-to-r from-[#1E3A8A] to-blue-700">
        <div className="max-w-2xl mx-auto text-center text-white">
          <h2 className="text-xl sm:text-2xl md:text-3xl mb-3 sm:mb-4 px-2" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700 }}>
            Start Preparing Today — Try Starter Free!
          </h2>
          <p className="text-blue-200 mb-6 sm:mb-8 text-sm sm:text-base px-2">
            Join 5,200+ students preparing smarter for NEET, JEE, Board exams and more.
          </p>
          <button
            onClick={() => setView("register")}
            className="bg-[#F97316] hover:bg-orange-600 text-white px-8 sm:px-10 py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-colors font-semibold text-sm sm:text-base"
          >
            Create Free Account
          </button>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-6 text-blue-200 text-xs sm:text-sm">
            {["No credit card needed", "Starter plan available", "All exams covered"].map(i => (
              <div key={i} className="flex items-center justify-center gap-1.5"><CheckCircle size={14} className="sm:w-[16px] sm:h-[16px]" /> {i}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1E3A8A] text-blue-200 py-6 sm:py-8 px-3 sm:px-4 text-center text-xs sm:text-sm">
        <div className="flex items-center justify-center gap-2 mb-2 sm:mb-3">
          <img src={LogoImage} alt="ParikshaCrack Logo" className="w-6 h-6 object-contain flex-shrink-0" />
          <span className="text-white font-semibold text-sm sm:text-base" style={{ fontFamily: "Poppins, sans-serif" }}>ParikshaCrack</span>
        </div>
        <p className="px-2">India's multi-exam prep platform · NEET · JEE · MHT-CET · HSC · SSC</p>
        <p className="mt-2 text-blue-400">© 2026 ParikshaCrack. All rights reserved.</p>
        <button onClick={() => setView("admin-login")} className="mt-3 text-xs text-blue-500 hover:text-blue-300">Admin Panel</button>
      </footer>
    </div>
  );
}
