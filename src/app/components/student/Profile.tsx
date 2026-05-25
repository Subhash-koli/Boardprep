import { useState } from "react";
import { User, Mail, BookOpen, Globe, Camera, Save, LogOut, Flame, Brain, FileText, CheckCircle } from "lucide-react";
import { useApp } from "../context/AppContext";
import { completedAttempts as mockAttempts } from "../data/mockData";
import { subjects } from "../data/mockData";
import type { Standard, Medium } from "../data/mockData";

export function Profile() {
  const { user, setUser, setView, completedAttempts } = useApp();
  const [name, setName] = useState(user?.name || "");
  const [standard, setStandard] = useState<Standard>(user?.standard || "12");
  const [medium, setMedium] = useState<Medium>(user?.medium || "english");
  const [saved, setSaved] = useState(false);

  const avgScore = completedAttempts.length > 0
    ? Math.round(completedAttempts.reduce((s, a) => s + a.percentage, 0) / completedAttempts.length)
    : 0;

  const handleSave = () => {
    if (user) setUser({ ...user, name, standard, medium });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const logout = () => { setUser(null); setView("landing"); };

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <h2 className="text-xl" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, color: "#1E3A8A" }}>Profile & Settings</h2>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="w-16 h-16 bg-[#1E3A8A] rounded-2xl flex items-center justify-center text-white text-2xl" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700 }}>
              {name?.[0] || "S"}
            </div>
            <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#F97316] rounded-full flex items-center justify-center text-white shadow-sm">
              <Camera size={12} />
            </button>
          </div>
          <div>
            <p className="font-semibold text-gray-800" style={{ fontFamily: "Poppins, sans-serif" }}>{name}</p>
            <p className="text-gray-500 text-sm">{user?.email}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <Flame size={13} className="text-[#F97316]" />
              <span className="text-xs text-gray-500">{user?.streak} day streak</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1.5" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500 }}>
              <User size={14} className="inline mr-1.5" />Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#1E3A8A] bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1.5" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500 }}>
              <Mail size={14} className="inline mr-1.5" />Email Address
            </label>
            <input
              type="email"
              value={user?.email || ""}
              readOnly
              className="w-full border border-gray-100 rounded-xl py-2.5 px-4 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1.5" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500 }}>
                <BookOpen size={14} className="inline mr-1.5" />Standard
              </label>
              <select
                value={standard}
                onChange={e => setStandard(e.target.value as Standard)}
                className="w-full border border-gray-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-[#1E3A8A] bg-gray-50"
              >
                <option value="10">10th Standard (SSC)</option>
                <option value="12">12th Standard (HSC)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1.5" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500 }}>
                <Globe size={14} className="inline mr-1.5" />Medium
              </label>
              <select
                value={medium}
                onChange={e => setMedium(e.target.value as Medium)}
                className="w-full border border-gray-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-[#1E3A8A] bg-gray-50"
              >
                <option value="english">English</option>
                <option value="semi-english">Semi-English</option>
                <option value="marathi">Marathi</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-[#1E3A8A] hover:bg-blue-900 text-white py-3 rounded-xl transition-colors flex items-center justify-center gap-2 font-semibold"
          >
            {saved ? <><CheckCircle size={16} /> Saved!</> : <><Save size={16} /> Save Changes</>}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="mb-4" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "#1E3A8A" }}>My Statistics</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: Brain, label: "Quizzes Taken", value: completedAttempts.length, color: "bg-purple-100 text-purple-600" },
            { icon: FileText, label: "Papers Viewed", value: 12, color: "bg-blue-100 text-blue-600" },
            { icon: Flame, label: "Avg. Score", value: `${avgScore}%`, color: "bg-orange-100 text-orange-600" },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className={`w-12 h-12 rounded-2xl ${s.color} flex items-center justify-center mx-auto mb-2`}>
                <s.icon size={20} />
              </div>
              <div className="text-xl" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, color: "#1E3A8A" }}>{s.value}</div>
              <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quiz History */}
      {completedAttempts.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="mb-4" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "#1E3A8A" }}>Recent Quiz History</h3>
          <div className="space-y-3">
            {completedAttempts.slice(0, 5).map(attempt => (
              <div key={attempt.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-700" style={{ fontFamily: "Poppins, sans-serif" }}>{attempt.quizTitle}</p>
                  <p className="text-xs text-gray-400">{attempt.subject} · {attempt.mode} mode</p>
                </div>
                <div className={`text-sm font-semibold px-3 py-1 rounded-full ${attempt.percentage >= 60 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`} style={{ fontFamily: "Poppins, sans-serif" }}>
                  {attempt.percentage}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Danger Zone */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="mb-4" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "#DC2626" }}>Account</h3>
        <button
          onClick={logout}
          className="flex items-center gap-2 text-red-500 hover:text-red-700 border border-red-200 hover:bg-red-50 px-4 py-2 rounded-xl transition-colors text-sm"
        >
          <LogOut size={15} /> Logout
        </button>
      </div>
    </div>
  );
}
