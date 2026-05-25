import { BookOpen, Brain, BarChart3, Users, ChevronRight, Star, Target, CheckCircle } from "lucide-react";
import { useApp } from "./context/AppContext";
import { useState, useEffect, useRef } from "react";

const BGImage = new URL("../../imports/BG.jpg", import.meta.url).href;
const DIGIImage = new URL("../../imports/DIGI.jpg", import.meta.url).href;
const STDImage = new URL("../../imports/STD.jpg", import.meta.url).href;
const STUPREPImage = new URL("../../imports/STUDY_PREP.jpg", import.meta.url).href;
const STUDYImage = new URL("../../imports/STUDY.jpg", import.meta.url).href;
const LogoImage = new URL("../../imports/logo.png", import.meta.url).href;

const features = [
  { icon: BookOpen, title: "Past Question Papers", desc: "Access hundreds of official Maharashtra Board past papers organized by subject, chapter, and year.", color: "bg-blue-100 text-blue-700" },
  { icon: Brain, title: "MCQ Quiz Engine", desc: "Practice with chapter-wise MCQ quizzes in Practice Mode or simulate real exams with Exam Mode.", color: "bg-purple-100 text-purple-700" },
  { icon: BarChart3, title: "Progress Analytics", desc: "Track your performance across subjects, identify weak areas, and monitor your daily streak.", color: "bg-green-100 text-green-700" },
  { icon: Users, title: "10th & 12th Standards", desc: "Comprehensive content for both SSC and HSC students across all streams and mediums.", color: "bg-orange-100 text-orange-700" },
];

const stats = [
  { value: "1,200+", label: "Students" },
  { value: "400+", label: "Papers" },
  { value: "500+", label: "Quizzes" },
  { value: "95%", label: "Uptime" },
];

const subjects10 = ["Mathematics", "Science & Technology", "English", "Marathi", "History & Geography"];
const subjects12 = ["Physics", "Chemistry", "Biology", "Mathematics", "Economics", "English"];

export function LandingPage() {
  const { setView } = useApp();
  const images = [BGImage, DIGIImage, STDImage, STUPREPImage, STUDYImage];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const hasAnimatedRef = useRef(false);

  // Scramble text animation (Pure JS - no external library needed)
  useEffect(() => {
    if (hasAnimatedRef.current || !titleRef.current) return;
    hasAnimatedRef.current = true;

    const characters = "!@#$%^&*()_+-=[]{}|;:,.<>?/ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const text = titleRef.current?.innerText || "";
    const duration = 2000;
    const startTime = Date.now();

    const animate = () => {
      if (!titleRef.current) return;
      
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      let displayText = "";

      for (let i = 0; i < text.length; i++) {
        const charProgress = (progress * text.length - i) / text.length;
        if (charProgress >= 1) {
          displayText += text[i];
        } else if (charProgress > 0) {
          displayText += characters[Math.floor(Math.random() * characters.length)];
        } else {
          displayText += " ";
        }
      }
      titleRef.current.innerText = displayText;
      titleRef.current.style.opacity = (0.5 + progress * 0.5).toString();

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // After scramble, color "Board Exams" in orange
        titleRef.current.innerHTML = text.replace(
          /Board Exams/g,
          '<span style="color: #F97316;">Board Exams</span>'
        );
        titleRef.current.style.opacity = "1";
      }
    };

    setTimeout(() => {
      if (titleRef.current) {
        titleRef.current.style.opacity = "0.5";
        requestAnimationFrame(animate);
      }
    }, 300);
  }, []);

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
      <nav className="bg-white text-gray-800 px-3 sm:px-8 py-2 sm:py-3 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-2 sm:gap-3">
          <img src={LogoImage} alt="MahaBoard Prep Logo" className="w-14 h-14 sm:w-16 sm:h-16 object-contain" />
          <span className="font-bold text-base sm:text-xl" style={{ fontFamily: "Poppins, sans-serif", color: "#1C3A5C" }}>MahaBoard Prep</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setView("login")}
            className="px-3 sm:px-4 py-1.5 text-xs sm:text-sm text-[#1C3A5C] border border-[#1C3A5C] rounded-lg hover:bg-[#1C3A5C] hover:text-white transition-colors font-medium"
          >
            Login
          </button>
          <button
            onClick={() => setView("register")}
            className="px-3 sm:px-4 py-1.5 text-xs sm:text-sm bg-[#F97316] text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold"
          >
            Register Free
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
        {/* Dark overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#05143F]/85 via-blue-800/85 to-blue-900/85"></div>
        
        {/* Carousel indicators */}
        <div className="absolute top-4 sm:top-6 right-4 sm:right-6 flex gap-1.5 sm:gap-2 z-20">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentImageIndex(idx)}
              className={`w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full transition-all ${
                idx === currentImageIndex ? 'bg-[#F97316] w-6 sm:w-8' : 'bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10 w-full px-2">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 sm:px-4 py-1.5 text-xs sm:text-sm mb-4 sm:mb-6">
            <Star size={14} className="text-[#F97316]" />
            <span className="text-xs sm:text-base">Maharashtra Board's #1 Exam Prep Platform</span>
          </div>
          
          <h1 
            ref={titleRef}
            className="text-2xl sm:text-4xl md:text-5xl mb-4 sm:mb-6 leading-tight opacity-0" 
            style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, minHeight: "auto" }}
          >
            Crack Your Board Exams with Smart Preparation
          </h1>
          <p className="text-blue-100 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-2">
            Access past papers, chapter-wise MCQ quizzes, and detailed analytics — all designed exclusively for Maharashtra Board (SSC & HSC) students.
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mt-8 sm:mt-12 md:mt-14 max-w-3xl mx-auto">
            {stats.map((s, idx) => (
              <div 
                key={s.label} 
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 text-center hover:bg-white/15 transition-all transform hover:scale-105"
                style={{
                  animation: `slideUp 0.6s ease-out ${idx * 0.1}s both`
                }}
              >
                <div className="text-lg sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>{s.value}</div>
                <div className="text-blue-200 text-xs sm:text-sm">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Decorative elements */}
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
          <p className="text-center text-gray-500 text-sm sm:text-base mb-8 sm:mb-10">One platform, all the tools for Maharashtra Board exam success</p>
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

      {/* Subjects */}
      <section className="py-10 sm:py-14 px-3 sm:px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center text-xl sm:text-2xl md:text-3xl mb-8 sm:mb-10" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, color: "#1E3A8A" }}>
            Complete Syllabus Coverage
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            <div className="bg-blue-50 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <div className="bg-[#1E3A8A] text-white text-xs px-2 py-1 rounded-lg">10th SSC</div>
                <span className="text-xs sm:text-sm text-gray-500">Standard</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {subjects10.map(s => (
                  <span key={s} className="bg-white text-[#1E3A8A] border border-blue-200 text-xs px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full">
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-orange-50 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <div className="bg-[#F97316] text-white text-xs px-2 py-1 rounded-lg">12th HSC</div>
                <span className="text-xs sm:text-sm text-gray-500">Standard</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {subjects12.map(s => (
                  <span key={s} className="bg-white text-orange-700 border border-orange-200 text-xs px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full">
                    {s}
                  </span>
                ))}
              </div>
            </div>
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
              { icon: Users, step: "1", title: "Register & Setup", desc: "Create free account, select your standard (10th/12th) and subjects" },
              { icon: Brain, step: "2", title: "Practice Daily", desc: "Attempt MCQ quizzes in practice or exam mode, and browse past papers" },
              { icon: Target, step: "3", title: "Track Progress", desc: "See your subject-wise progress, weak areas, and daily streak" },
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
              { name: "Priya S.", std: "12th HSC", score: "89%", quote: "The chapter-wise quizzes in exam mode helped me identify my weak topics before boards. Scored 89% in Physics!" },
              { name: "Rohan P.", std: "10th SSC", quote: "Finally a platform in Marathi medium! The past papers are very helpful.", score: "81%" },
              { name: "Sneha K.", std: "12th HSC", quote: "Practice mode with instant explanations is the best feature. Improved my Chemistry score by 15 marks.", score: "92%" },
            ].map(t => (
              <div key={t.name} className="bg-[#F8FAFC] rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-gray-100">
                <div className="flex gap-0.5 mb-3">
                  {[1,2,3,4,5].map(i => <Star key={i} size={12} className="text-[#F97316] fill-[#F97316] sm:w-[14px] sm:h-[14px]" />)}
                </div>
                <p className="text-gray-600 text-xs sm:text-sm italic mb-4">"{t.quote}"</p>
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-semibold text-gray-800 text-xs sm:text-sm truncate" style={{ fontFamily: "Poppins, sans-serif" }}>{t.name}</div>
                    <div className="text-gray-400 text-xs">{t.std}</div>
                  </div>
                  <div className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-semibold whitespace-nowrap">{t.score}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 sm:py-16 px-3 sm:px-4 bg-gradient-to-r from-[#1E3A8A] to-blue-700">
        <div className="max-w-2xl mx-auto text-center text-white">
          <h2 className="text-xl sm:text-2xl md:text-3xl mb-3 sm:mb-4 px-2" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700 }}>
            Start Preparing Today — It's Free!
          </h2>
          <p className="text-blue-200 mb-6 sm:mb-8 text-sm sm:text-base px-2">Join 1,200+ Maharashtra Board students already preparing smarter.</p>
          <button
            onClick={() => setView("register")}
            className="bg-[#F97316] hover:bg-orange-600 text-white px-8 sm:px-10 py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-colors font-semibold text-sm sm:text-base"
          >
            Create Free Account
          </button>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-6 text-blue-200 text-xs sm:text-sm">
            {["No credit card needed", "Free forever", "SSC & HSC content"].map(i => (
              <div key={i} className="flex items-center justify-center gap-1.5"><CheckCircle size={14} className="sm:w-[16px] sm:h-[16px]" /> {i}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1E3A8A] text-blue-200 py-6 sm:py-8 px-3 sm:px-4 text-center text-xs sm:text-sm">
        <div className="flex items-center justify-center gap-2 mb-2 sm:mb-3">
          <img src={LogoImage} alt="MahaBoard Prep Logo" className="w-6 h-6 object-contain flex-shrink-0" />
          <span className="text-white font-semibold text-sm sm:text-base" style={{ fontFamily: "Poppins, sans-serif" }}>MahaBoard Prep</span>
        </div>
        <p className="px-2">Dedicated platform for Maharashtra State Board students | 10th SSC & 12th HSC</p>
        <p className="mt-2 text-blue-400">© 2026 MahaBoard Prep. All rights reserved.</p>
        <button onClick={() => setView("admin-login")} className="mt-3 text-xs text-blue-500 hover:text-blue-300">Admin Panel</button>
      </footer>
    </div>
  );
}
