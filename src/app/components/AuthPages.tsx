import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, CheckCircle } from "lucide-react";
import { useApp } from "./context/AppContext";

const LogoImage = new URL("../../imports/logo.png", import.meta.url).href;

function AuthLayout({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle: string }) {
  const { setView } = useApp();
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <nav className="bg-[#1E3A8A] px-4 py-4 flex items-center gap-3">
        <button onClick={() => setView("landing")} className="text-white/70 hover:text-white">
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-2">
          <img src={LogoImage} alt="MahaBoard Prep Logo" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
          <span className="text-white font-semibold text-lg sm:text-xl" style={{ fontFamily: "Poppins, sans-serif" }}>MahaBoard Prep</span>
        </div>
      </nav>
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-md">
          <h1 className="text-2xl mb-1" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, color: "#1E3A8A" }}>{title}</h1>
          <p className="text-gray-500 text-sm mb-6">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}

function InputField({ label, type = "text", value, onChange, placeholder, icon: Icon, rightIcon, onRightIconClick }: any) {
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
          className="w-full border border-gray-200 rounded-lg py-2.5 pr-4 text-sm focus:outline-none focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A] transition-colors bg-gray-50"
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

export function LoginPage() {
  const { setView, setUser, setAuthEmail } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setUser({ id: "u_demo", name: "Priya Sharma", email, standard: "12", medium: "semi-english", subjects: ["Physics", "Chemistry", "Mathematics & Statistics"], streak: 15, isAdmin: false });
      setView("dashboard");
    }, 1000);
  };

  return (
    <AuthLayout title="Welcome back!" subtitle="Login to continue your exam preparation">
      <form onSubmit={handleLogin}>
        <InputField label="Email address" type="email" value={email} onChange={setEmail} placeholder="you@email.com" icon={Mail} />
        <InputField label="Password" type={showPwd ? "text" : "password"} value={password} onChange={setPassword} placeholder="Your password" icon={Lock} rightIcon={showPwd ? <EyeOff size={16} /> : <Eye size={16} />} onRightIconClick={() => setShowPwd(!showPwd)} />
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <div className="flex justify-end mb-4">
          <button type="button" onClick={() => setView("forgot-password")} className="text-[#1E3A8A] text-sm hover:underline">Forgot password?</button>
        </div>
        <button type="submit" disabled={loading} className="w-full bg-[#1E3A8A] hover:bg-blue-900 text-white py-3 rounded-xl transition-colors disabled:opacity-60 font-semibold">
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p className="text-center text-sm text-gray-500 mt-6">
        Don't have an account?{" "}
        <button onClick={() => setView("register")} className="text-[#1E3A8A] font-semibold hover:underline">Register free</button>
      </p>
    </AuthLayout>
  );
}

export function RegisterPage() {
  const { setView, setAuthEmail } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) { setError("Please fill in all fields."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setAuthEmail(email);
      setView("verify-otp");
    }, 800);
  };

  return (
    <AuthLayout title="Create your account" subtitle="Join thousands of Maharashtra Board students">
      <form onSubmit={handleRegister}>
        <InputField label="Full name" value={name} onChange={setName} placeholder="Priya Sharma" icon={User} />
        <InputField label="Email address" type="email" value={email} onChange={setEmail} placeholder="you@email.com" icon={Mail} />
        <InputField label="Password" type={showPwd ? "text" : "password"} value={password} onChange={setPassword} placeholder="Min. 8 characters" icon={Lock} rightIcon={showPwd ? <EyeOff size={16} /> : <Eye size={16} />} onRightIconClick={() => setShowPwd(!showPwd)} />
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <button type="submit" disabled={loading} className="w-full bg-[#1E3A8A] hover:bg-blue-900 text-white py-3 rounded-xl transition-colors disabled:opacity-60 font-semibold">
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>
      <p className="text-center text-xs text-gray-400 mt-4">
        By registering, you agree to our Terms of Service and Privacy Policy.
      </p>
      <p className="text-center text-sm text-gray-500 mt-4">
        Already have an account?{" "}
        <button onClick={() => setView("login")} className="text-[#1E3A8A] font-semibold hover:underline">Login</button>
      </p>
    </AuthLayout>
  );
}

export function VerifyOTPPage() {
  const { setView, authEmail, setUser } = useApp();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);

  const handleChange = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[i] = val.slice(-1);
    setOtp(next);
    if (val && i < 5) {
      document.getElementById(`otp-${i + 1}`)?.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) { setError("Enter the 6-digit OTP."); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setUser({ id: "u_new", name: "New Student", email: authEmail, standard: "10", medium: "english", subjects: [], streak: 0, isAdmin: false });
      setView("onboarding");
    }, 800);
  };

  const handleResend = () => {
    setResent(true);
    setTimeout(() => setResent(false), 5000);
  };

  return (
    <AuthLayout title="Verify your email" subtitle={`Enter the 6-digit OTP sent to ${authEmail || "your email"}`}>
      <form onSubmit={handleVerify}>
        <div className="flex gap-2 justify-center mb-6">
          {otp.map((v, i) => (
            <input
              key={i}
              id={`otp-${i}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={v}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => { if (e.key === "Backspace" && !v && i > 0) document.getElementById(`otp-${i - 1}`)?.focus(); }}
              className="w-11 h-12 border-2 border-gray-200 rounded-lg text-center text-lg focus:outline-none focus:border-[#1E3A8A] transition-colors bg-gray-50"
              style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}
            />
          ))}
        </div>
        {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}
        <button type="submit" disabled={loading} className="w-full bg-[#1E3A8A] hover:bg-blue-900 text-white py-3 rounded-xl transition-colors disabled:opacity-60 font-semibold">
          {loading ? "Verifying..." : "Verify Email"}
        </button>
      </form>
      <div className="text-center mt-4">
        <button onClick={handleResend} className="text-[#1E3A8A] text-sm hover:underline">
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

export function ForgotPasswordPage() {
  const { setView, setAuthEmail } = useApp();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setAuthEmail(email);
      setSent(true);
    }, 800);
  };

  if (sent) {
    return (
      <AuthLayout title="Check your email" subtitle="">
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail size={28} className="text-green-600" />
          </div>
          <p className="text-gray-600 mb-2">OTP sent to <strong>{email}</strong></p>
          <p className="text-gray-500 text-sm mb-6">Enter the 6-digit code to reset your password.</p>
          <button onClick={() => setView("reset-password")} className="w-full bg-[#1E3A8A] hover:bg-blue-900 text-white py-3 rounded-xl transition-colors font-semibold">
            Enter OTP
          </button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Forgot password?" subtitle="We'll send a 6-digit OTP to your email">
      <form onSubmit={handleSubmit}>
        <InputField label="Email address" type="email" value={email} onChange={setEmail} placeholder="you@email.com" icon={Mail} />
        <button type="submit" disabled={loading || !email} className="w-full bg-[#1E3A8A] hover:bg-blue-900 text-white py-3 rounded-xl transition-colors disabled:opacity-60 font-semibold">
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>
      </form>
      <p className="text-center mt-4">
        <button onClick={() => setView("login")} className="text-gray-400 hover:text-gray-600 text-sm flex items-center gap-1 justify-center mx-auto">
          <ArrowLeft size={14} /> Back to login
        </button>
      </p>
    </AuthLayout>
  );
}

export function ResetPasswordPage() {
  const { setView, authEmail } = useApp();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[i] = val.slice(-1);
    setOtp(next);
    if (val && i < 5) document.getElementById(`rotp-${i + 1}`)?.focus();
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.join("").length < 6) { setError("Enter 6-digit OTP."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setView("login"); }, 800);
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
        <InputField label="New Password" type={showPwd ? "text" : "password"} value={password} onChange={setPassword} placeholder="Min. 8 characters" icon={Lock} rightIcon={showPwd ? <EyeOff size={16} /> : <Eye size={16} />} onRightIconClick={() => setShowPwd(!showPwd)} />
        <InputField label="Confirm Password" type="password" value={confirm} onChange={setConfirm} placeholder="Repeat password" icon={Lock} />
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <button type="submit" disabled={loading} className="w-full bg-[#1E3A8A] hover:bg-blue-900 text-white py-3 rounded-xl transition-colors disabled:opacity-60 font-semibold">
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </AuthLayout>
  );
}
