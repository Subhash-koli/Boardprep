import { useState, useEffect } from "react";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, CheckCircle, X, Shield } from "lucide-react";
import { useApp } from "./context/AppContext";
import { seedGoal1, seedGoal2 } from "./context/AppContext";

const LogoImage = new URL("../../imports/logo.png", import.meta.url).href;

// ── Shared Input Field ────────────────────────────────────────────────────────
function InputField({ label, type = "text", value, onChange, placeholder, icon: Icon, rightIcon, onRightIconClick, mono }: any) {
  return (
    <div className="mb-4">
      <label className="block text-sm text-gray-700 mb-1.5" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500 }}>{label}</label>
      <div className="relative">
        {Icon && <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />}
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full border border-gray-200 rounded-lg py-2.5 pr-4 text-sm focus:outline-none focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A] transition-colors bg-gray-50 ${mono ? "font-mono tracking-wider" : ""}`}
          style={{ paddingLeft: Icon ? "2.5rem" : "0.75rem" }}
        />
        {rightIcon && (
          <button type="button" onClick={onRightIconClick} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {rightIcon}
          </button>
        )}
      </div>
    </div>
  );
}

// ── AuthLayout (full-page wrapper for Register / OTP / Reset flows) ───────────
function AuthLayout({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle: string }) {
  const { setView } = useApp();
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <nav className="bg-[#1E3A8A] px-4 py-4 flex items-center gap-3">
        <button onClick={() => setView("landing")} className="text-white/70 hover:text-white">
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-2">
          <img src={LogoImage} alt="ParikshaCrack Logo" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
          <span className="text-white font-semibold text-lg sm:text-xl" style={{ fontFamily: "Poppins, sans-serif" }}>ParikshaCrack</span>
        </div>
      </nav>
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="rounded-2xl p-8 w-full max-w-md" style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.9)", boxShadow: "0 2px 12px rgba(30,58,138,0.06)" }}>
          <h1 className="text-2xl mb-1" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, color: "#1E3A8A" }}>{title}</h1>
          <p className="text-gray-500 text-sm mb-6">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}

// ── Unified Login Form (Role Auto-Detection) ──────────────────────────────────
function UnifiedLoginForm({ onSuccessStudent, onSuccessAdmin, onRegister }: { onSuccessStudent: () => void; onSuccessAdmin: () => void; onRegister: () => void }) {
  const { setUser, setAuthEmail } = useApp();
  const [subView, setSubView] = useState<"login" | "forgot">("login");

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd]   = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const [fEmail, setFEmail]     = useState("");
  const [fLoading, setFLoading] = useState(false);
  const [fSent, setFSent]       = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const lowerEmail = email.toLowerCase().trim();

      if (lowerEmail.includes("admin")) {
        setUser({ id: "admin_1", name: "System Admin", email: lowerEmail, goals: [], currentGoalId: "", medium: "english", streak: 0, isAdmin: true });
        onSuccessAdmin();
      } else {
        setUser({ id: "u_demo", name: "Priya Sharma", email: lowerEmail, goals: [seedGoal1, seedGoal2], currentGoalId: "", medium: "semi-english", streak: 15, isAdmin: false });
        onSuccessStudent();
      }
    }, 800);
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fEmail) return;
    setFLoading(true);
    setTimeout(() => { setFLoading(false); setAuthEmail(fEmail); setFSent(true); }, 800);
  };

  if (subView === "forgot") {
    if (fSent) return (
      <div className="text-center py-4">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail size={24} className="text-green-600" />
        </div>
        <p className="text-gray-600 mb-1 font-semibold">OTP sent!</p>
        <p className="text-gray-500 text-sm mb-6">Check <strong>{fEmail}</strong> and enter the code to reset your password.</p>
        <button onClick={() => { setFSent(false); setSubView("login"); }} className="w-full bg-[#1E3A8A] hover:bg-blue-900 text-white py-3 rounded-xl font-semibold text-sm transition-colors">Back to Login</button>
      </div>
    );
    return (
      <div>
        <button onClick={() => setSubView("login")} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 mb-5 transition-colors">
          <ArrowLeft size={14} /> Back to login
        </button>
        <h3 className="text-lg font-bold text-[#1E3A8A] mb-1" style={{ fontFamily: "Poppins, sans-serif" }}>Forgot password?</h3>
        <p className="text-gray-500 text-xs mb-5">We'll send a 6-digit OTP to reset your password.</p>
        <form onSubmit={handleForgot}>
          <InputField label="Email address" type="email" value={fEmail} onChange={setFEmail} placeholder="you@email.com" icon={Mail} />
          <button type="submit" disabled={fLoading || !fEmail} className="w-full bg-[#1E3A8A] hover:bg-blue-900 text-white py-3 rounded-xl transition-colors disabled:opacity-60 font-semibold text-sm">{fLoading ? "Sending OTP..." : "Send OTP"}</button>
        </form>
      </div>
    );
  }

  return (
    <form onSubmit={handleLogin}>
      <InputField label="Email address" type="email" value={email} onChange={setEmail} placeholder="you@email.com" icon={Mail} />
      <InputField
        label="Password" type={showPwd ? "text" : "password"} value={password} onChange={setPassword}
        placeholder="Your password" icon={Lock}
        rightIcon={showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
        onRightIconClick={() => setShowPwd(!showPwd)}
      />
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      <div className="flex justify-end mb-4">
        <button type="button" onClick={() => setSubView("forgot")} className="text-[#1E3A8A] text-sm hover:underline font-medium">Forgot password?</button>
      </div>
      <button type="submit" disabled={loading} className="w-full bg-[#1E3A8A] hover:bg-blue-900 text-white py-3 rounded-xl transition-colors disabled:opacity-60 font-semibold text-sm shadow-md">{loading ? "Logging in..." : "Login"}</button>
      <div className="mt-4 p-3 bg-blue-50/80 rounded-xl border border-blue-100 text-[11px] text-gray-600 space-y-1">
        <p className="font-semibold text-[#1E3A8A] flex items-center gap-1">
          <Shield size={12} className="text-[#1E3A8A]" /> Role Auto-Detection Active
        </p>
        <p className="text-gray-500">System automatically routes you to Student or Admin panel based on your account credentials.</p>
        <div className="pt-1 flex flex-col sm:flex-row gap-2 font-mono text-[10px] text-gray-500 border-t border-blue-100/80">
          <span>🎓 Student: <strong>student@email.com</strong></span>
          <span>🛡️ Admin: <strong>admin@pariksha.in</strong></span>
        </div>
      </div>
      <p className="text-center text-sm text-gray-500 mt-5">
        Don't have an account? <button type="button" onClick={onRegister} className="text-[#1E3A8A] font-semibold hover:underline">Register free</button>
      </p>
    </form>
  );
}

// ── Unified Login Modal ───────────────────────────────────────────────────────
export function LoginModal() {
  const { showLoginModal, setShowLoginModal, setView } = useApp();
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setShowLoginModal(false); };
    if (showLoginModal) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [showLoginModal, setShowLoginModal]);

  useEffect(() => {
    document.body.style.overflow = showLoginModal ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showLoginModal]);

  if (!showLoginModal) return null;

  const handleStudentSuccess = () => { setShowLoginModal(false); setView("papers"); };
  const handleAdminSuccess   = () => { setShowLoginModal(false); setView("admin-dashboard"); };
  const handleRegister       = () => { setShowLoginModal(false); setView("register"); };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Login">
      <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={() => setShowLoginModal(false)} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-modal-in">
        <div className="h-1.5 w-full bg-gradient-to-r from-[#1E3A8A] via-[#2563EB] to-indigo-600" />
        {/* Header */}
        <div className="px-6 pt-5 pb-4 flex items-start justify-between border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <img src={LogoImage} alt="ParikshaCrack" className="w-8 h-8 object-contain" />
            <div>
              <h2 className="text-lg font-bold text-[#1E3A8A] leading-tight" style={{ fontFamily: "Poppins, sans-serif" }}>Welcome back!</h2>
              <p className="text-gray-400 text-xs">Login to continue your exam preparation</p>
            </div>
          </div>
          <button
            onClick={() => setShowLoginModal(false)}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form area */}
        <div className="px-6 py-5">
          <UnifiedLoginForm
            onSuccessStudent={handleStudentSuccess}
            onSuccessAdmin={handleAdminSuccess}
            onRegister={handleRegister}
          />
        </div>
      </div>

      <style>{`
        @keyframes modal-in {
          from { opacity: 0; transform: scale(0.95) translateY(-8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-modal-in { animation: modal-in 0.22s cubic-bezier(0.34,1.56,0.64,1) both; }
      `}</style>
    </div>
  );
}

// ── LoginPage / AdminLogin shims (redirects to modal) ─────────────────────────
export function LoginPage() {
  const { setShowLoginModal, setView, setLoginModalTab } = useApp();
  useEffect(() => {
    setLoginModalTab("student");
    setView("landing");
    setShowLoginModal(true);
  }, []);
  return null;
}

// Keep exported so nothing breaks in App.tsx imports
export function AdminLoginShim() {
  const { setShowLoginModal, setView, setLoginModalTab } = useApp();
  useEffect(() => {
    setLoginModalTab("admin");
    setView("landing");
    setShowLoginModal(true);
  }, []);
  return null;
}

// ── Register Page ─────────────────────────────────────────────────────────────
export function RegisterPage() {
  const { setView, setAuthEmail, setShowLoginModal, setLoginModalTab } = useApp();
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd]   = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) { setError("Please fill in all fields."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setAuthEmail(email); setView("verify-otp"); }, 800);
  };

  const openLoginModal = () => {
    setLoginModalTab("student");
    setView("landing");
    setShowLoginModal(true);
  };

  return (
    <AuthLayout title="Create your account" subtitle="Join thousands of students preparing with ParikshaCrack">
      <form onSubmit={handleRegister}>
        <InputField label="Full name" value={name} onChange={setName} placeholder="Priya Sharma" icon={User} />
        <InputField label="Email address" type="email" value={email} onChange={setEmail} placeholder="you@email.com" icon={Mail} />
        <InputField
          label="Password" type={showPwd ? "text" : "password"} value={password} onChange={setPassword}
          placeholder="Min. 8 characters" icon={Lock}
          rightIcon={showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
          onRightIconClick={() => setShowPwd(!showPwd)}
        />
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <button type="submit" disabled={loading}
          className="w-full bg-[#1E3A8A] hover:bg-blue-900 text-white py-3 rounded-xl transition-colors disabled:opacity-60 font-semibold">
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>
      <p className="text-center text-xs text-gray-400 mt-4">
        By registering, you agree to our Terms of Service and Privacy Policy.
      </p>
      <p className="text-center text-sm text-gray-500 mt-4">
        Already have an account?{" "}
        <button onClick={openLoginModal} className="text-[#1E3A8A] font-semibold hover:underline">Login</button>
      </p>
    </AuthLayout>
  );
}

// ── Verify OTP Page ───────────────────────────────────────────────────────────
export function VerifyOTPPage() {
  const { setView, authEmail, setUser } = useApp();
  const [otp, setOtp]         = useState(["", "", "", "", "", ""]);
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [resent, setResent]   = useState(false);

  const handleChange = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp]; next[i] = val.slice(-1); setOtp(next);
    if (val && i < 5) document.getElementById(`otp-${i + 1}`)?.focus();
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.join("").length < 6) { setError("Enter the 6-digit OTP."); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setUser({ id: `u_${Date.now()}`, name: "New Student", email: authEmail, goals: [], currentGoalId: "", medium: "english", streak: 0, isAdmin: false });
      setView("onboarding");
    }, 800);
  };

  return (
    <AuthLayout title="Verify your email" subtitle={`Enter the 6-digit OTP sent to ${authEmail || "your email"}`}>
      <form onSubmit={handleVerify}>
        <div className="flex gap-2 justify-center mb-6">
          {otp.map((v, i) => (
            <input key={i} id={`otp-${i}`} type="text" inputMode="numeric" maxLength={1} value={v}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => { if (e.key === "Backspace" && !v && i > 0) document.getElementById(`otp-${i - 1}`)?.focus(); }}
              className="w-11 h-12 border-2 border-gray-200 rounded-lg text-center text-lg focus:outline-none focus:border-[#1E3A8A] transition-colors bg-gray-50"
              style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}
            />
          ))}
        </div>
        {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}
        <button type="submit" disabled={loading}
          className="w-full bg-[#1E3A8A] hover:bg-blue-900 text-white py-3 rounded-xl transition-colors disabled:opacity-60 font-semibold">
          {loading ? "Verifying..." : "Verify Email"}
        </button>
      </form>
      <div className="text-center mt-4">
        <button onClick={() => setResent(true)} className="text-[#1E3A8A] text-sm hover:underline">
          {resent ? <span className="text-green-600 flex items-center gap-1 justify-center"><CheckCircle size={14} /> OTP resent!</span> : "Resend OTP"}
        </button>
      </div>
      <p className="text-center text-xs text-gray-400 mt-2">OTP is valid for 10 minutes · Max 3 emails/hour</p>
      <p className="text-center text-sm text-gray-500 mt-4">
        <button onClick={() => setView("register")} className="text-gray-400 hover:text-gray-600 flex items-center gap-1 justify-center mx-auto">
          <ArrowLeft size={14} /> Back to register
        </button>
      </p>
    </AuthLayout>
  );
}

// ── Forgot Password Page (full-page) ──────────────────────────────────────────
export function ForgotPasswordPage() {
  const { setView, setAuthEmail, setShowLoginModal, setLoginModalTab } = useApp();
  const [email, setEmail]     = useState("");
  const [sent, setSent]       = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setAuthEmail(email); setSent(true); }, 800);
  };

  const openLogin = () => { setLoginModalTab("student"); setView("landing"); setShowLoginModal(true); };

  if (sent) return (
    <AuthLayout title="Check your email" subtitle="">
      <div className="text-center py-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail size={28} className="text-green-600" />
        </div>
        <p className="text-gray-600 mb-2">OTP sent to <strong>{email}</strong></p>
        <p className="text-gray-500 text-sm mb-6">Enter the 6-digit code to reset your password.</p>
        <button onClick={() => setView("reset-password")}
          className="w-full bg-[#1E3A8A] hover:bg-blue-900 text-white py-3 rounded-xl transition-colors font-semibold">
          Enter OTP
        </button>
      </div>
    </AuthLayout>
  );

  return (
    <AuthLayout title="Forgot password?" subtitle="We'll send a 6-digit OTP to your email">
      <form onSubmit={handleSubmit}>
        <InputField label="Email address" type="email" value={email} onChange={setEmail} placeholder="you@email.com" icon={Mail} />
        <button type="submit" disabled={loading || !email}
          className="w-full bg-[#1E3A8A] hover:bg-blue-900 text-white py-3 rounded-xl transition-colors disabled:opacity-60 font-semibold">
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>
      </form>
      <p className="text-center mt-4">
        <button onClick={openLogin} className="text-gray-400 hover:text-gray-600 text-sm flex items-center gap-1 justify-center mx-auto">
          <ArrowLeft size={14} /> Back to login
        </button>
      </p>
    </AuthLayout>
  );
}

// ── Reset Password Page ───────────────────────────────────────────────────────
export function ResetPasswordPage() {
  const { setView, authEmail, setShowLoginModal, setLoginModalTab } = useApp();
  const [otp, setOtp]         = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp]; next[i] = val.slice(-1); setOtp(next);
    if (val && i < 5) document.getElementById(`rotp-${i + 1}`)?.focus();
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.join("").length < 6) { setError("Enter 6-digit OTP."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setLoginModalTab("student");
      setView("landing");
      setShowLoginModal(true);
    }, 800);
  };

  return (
    <AuthLayout title="Reset your password" subtitle={`Enter OTP sent to ${authEmail || "your email"} and set new password`}>
      <form onSubmit={handleReset}>
        <div className="mb-4">
          <label className="block text-sm text-gray-700 mb-1.5" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500 }}>6-digit OTP</label>
          <div className="flex gap-2">
            {otp.map((v, i) => (
              <input key={i} id={`rotp-${i}`} type="text" inputMode="numeric" maxLength={1} value={v}
                onChange={e => handleChange(i, e.target.value)}
                onKeyDown={e => { if (e.key === "Backspace" && !v && i > 0) document.getElementById(`rotp-${i - 1}`)?.focus(); }}
                className="flex-1 h-11 border-2 border-gray-200 rounded-lg text-center focus:outline-none focus:border-[#1E3A8A] bg-gray-50"
                style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}
              />
            ))}
          </div>
        </div>
        <InputField label="New Password" type={showPwd ? "text" : "password"} value={password} onChange={setPassword}
          placeholder="Min. 8 characters" icon={Lock}
          rightIcon={showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
          onRightIconClick={() => setShowPwd(!showPwd)}
        />
        <InputField label="Confirm Password" type="password" value={confirm} onChange={setConfirm} placeholder="Repeat password" icon={Lock} />
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <button type="submit" disabled={loading}
          className="w-full bg-[#1E3A8A] hover:bg-blue-900 text-white py-3 rounded-xl transition-colors disabled:opacity-60 font-semibold">
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </AuthLayout>
  );
}
