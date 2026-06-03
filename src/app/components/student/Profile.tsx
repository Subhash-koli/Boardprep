import { useState } from "react";
import {
  User, Mail, Globe, Camera, Save, LogOut, Flame, Brain,
  FileText, CheckCircle, Plus, Trash2, ChevronRight, Target, Calendar
} from "lucide-react";
import { useApp } from "../context/AppContext";
import type { Medium } from "../data/mockData";
import { GOAL_METADATA } from "../data/mockData";
import { GoalIcon } from "../shared/GoalIcons";

export function Profile() {
  const { user, setUser, setView, currentGoal, setCurrentGoal, addGoal, removeGoal, completedAttempts } = useApp();
  const [name, setName]   = useState(user?.name  ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [saved, setSaved] = useState(false);
  const [showGoalManager, setShowGoalManager] = useState(false);

  // Stats per current goal
  const cat = currentGoal?.category;
  const goalAttempts = completedAttempts.filter(a => a.goalCategory === cat);
  const allAttempts  = completedAttempts;
  const avgScore = goalAttempts.length > 0
    ? Math.round(goalAttempts.reduce((s, a) => s + a.percentage, 0) / goalAttempts.length)
    : 0;
  const bestScore = goalAttempts.length > 0
    ? Math.round(Math.max(...goalAttempts.map(a => a.percentage)))
    : 0;
  const totalNegMarks = goalAttempts.reduce((s, a) => s + a.negativeMarks, 0);

  const handleSave = () => {
    if (user) setUser({ ...user, name, phone });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const logout = () => { setUser(null); setView("landing"); };

  const daysLeft = currentGoal?.examDate
    ? Math.max(0, Math.ceil((new Date(currentGoal.examDate).getTime() - Date.now()) / 86400000))
    : null;

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <h2 className="text-xl font-bold text-[#1E3A8A] font-['Poppins']">Profile & Settings</h2>

      {/* ── Profile Card ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        {/* Avatar + name */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="w-16 h-16 bg-[#1E3A8A] rounded-2xl flex items-center justify-center text-white text-2xl font-bold font-['Poppins']">
              {name?.[0] ?? "S"}
            </div>
            <button
              className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#F97316] rounded-full flex items-center justify-center text-white shadow-sm"
              aria-label="Change avatar"
            >
              <Camera size={13} />
            </button>
          </div>
          <div>
            <p className="font-semibold text-gray-900 font-['Poppins']">{name || "Student"}</p>
            <p className="text-gray-500 text-sm">{user?.email}</p>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <Flame size={12} className="text-orange-500" /> {user?.streak ?? 0} day streak
              </span>
              {currentGoal && (
                <span
                  className="text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5"
                  style={{ backgroundColor: currentGoal.bgColor, color: currentGoal.textColor }}
                >
                  <GoalIcon category={currentGoal.category} size={12} />
                  {currentGoal.shortLabel}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Form fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5 flex items-center gap-1.5">
              <User size={13} /> Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#1E3A8A] bg-gray-50"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5 flex items-center gap-1.5">
              <Mail size={13} /> Email Address
            </label>
            <input
              type="email"
              value={user?.email ?? ""}
              readOnly
              className="w-full border border-gray-100 rounded-xl py-2.5 px-4 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5 flex items-center gap-1.5">
              <Globe size={13} /> Phone (optional)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#1E3A8A] bg-gray-50"
              placeholder="+91 XXXXX XXXXX"
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-[#1E3A8A] hover:bg-[#1D4ED8] text-white py-3 rounded-xl transition-colors flex items-center justify-center gap-2 font-semibold font-['Poppins'] min-h-[48px]"
          >
            {saved ? (
              <><CheckCircle size={16} /> Saved!</>
            ) : (
              <><Save size={16} /> Save Changes</>
            )}
          </button>
        </div>
      </div>

      {/* ── Goal Manager ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[#1E3A8A] font-['Poppins']">My Exam Goals</h3>
          <button
            onClick={() => setShowGoalManager(g => !g)}
            className="text-xs text-[#1E3A8A] font-medium hover:underline"
          >
            {showGoalManager ? "Done" : "Manage"}
          </button>
        </div>

        <div className="space-y-2">
          {(user?.goals ?? []).map(goal => {
            const isActive = goal.id === currentGoal?.id;
            const gDays = goal.examDate
              ? Math.max(0, Math.ceil((new Date(goal.examDate).getTime() - Date.now()) / 86400000))
              : null;
            return (
              <div
                key={goal.id}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${isActive ? "border-[#1E3A8A] bg-blue-50" : "border-gray-100 bg-gray-50"}`}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: goal.bgColor }}
                >
                  <GoalIcon category={goal.category} size={18} style={{ color: goal.textColor }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold font-['Poppins'] truncate ${isActive ? "text-[#1E3A8A]" : "text-gray-800"}`}>
                    {goal.label}
                  </p>
                  {gDays !== null && (
                    <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                      <Calendar size={10} /> {gDays} days left
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {!isActive && (
                    <button
                      onClick={() => setCurrentGoal(goal)}
                      className="text-xs text-[#1E3A8A] hover:underline font-medium"
                    >
                      Switch
                    </button>
                  )}
                  {isActive && (
                    <span className="text-[10px] bg-[#1E3A8A] text-white px-2 py-0.5 rounded-full font-semibold">Active</span>
                  )}
                  {showGoalManager && (user?.goals?.length ?? 0) > 1 && (
                    <button
                      onClick={() => removeGoal(goal.id)}
                      className="p-1 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      aria-label="Remove goal"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add new goal → go to onboarding */}
        <button
          onClick={() => setView("onboarding")}
          className="mt-3 w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 hover:border-[#1E3A8A] text-gray-500 hover:text-[#1E3A8A] py-3 rounded-xl text-sm font-medium transition-all"
        >
          <Plus size={15} /> Add New Exam Goal
        </button>
      </div>

      {/* ── Stats for current goal ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-semibold text-[#1E3A8A] font-['Poppins'] mb-4 flex items-center gap-2">
          <Target size={16} /> Performance — {currentGoal?.shortLabel ?? "All Goals"}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: Brain,    label: "Quizzes Taken", value: goalAttempts.length,  bg: "bg-violet-50", text: "text-violet-600" },
            { icon: CheckCircle, label: "Avg. Score", value: avgScore > 0 ? `${avgScore}%` : "—", bg: "bg-blue-50", text: "text-blue-600" },
            { icon: FileText, label: "Best Score",    value: bestScore > 0 ? `${bestScore}%` : "—", bg: "bg-green-50", text: "text-green-600" },
            { icon: Flame,    label: "Day Streak",    value: user?.streak ?? 0,     bg: "bg-orange-50", text: "text-orange-600" },
          ].map(s => (
            <div key={s.label} className="text-center bg-gray-50 rounded-xl p-4">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mx-auto mb-2`}>
                <s.icon size={18} className={s.text} />
              </div>
              <div className="text-xl font-bold text-[#1E3A8A] font-['Poppins']">{s.value}</div>
              <div className="text-[11px] text-gray-400 mt-0.5 leading-tight">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Negative marks summary */}
        {totalNegMarks < 0 && (
          <div className="mt-4 bg-red-50 border border-red-100 rounded-xl p-3 text-xs text-red-700 flex items-center gap-2">
            <Target size={13} className="flex-shrink-0 text-red-500" />
            Total negative marks deducted (lifetime): <strong>{totalNegMarks}</strong>. Work on accuracy!
          </div>
        )}
      </div>

      {/* ── Recent Attempts ── */}
      {goalAttempts.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#1E3A8A] font-['Poppins']">Recent Attempts</h3>
            <span className="text-xs text-gray-400">{currentGoal?.shortLabel}</span>
          </div>
          <div className="space-y-3">
            {goalAttempts.slice(0, 6).map(attempt => {
              const pct = attempt.percentage;
              const color = pct >= 75 ? "text-green-700 bg-green-100" : pct >= 50 ? "text-amber-700 bg-amber-100" : "text-red-600 bg-red-100";
              return (
                <div key={attempt.id} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 font-['Poppins'] truncate">{attempt.quizTitle}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-400 capitalize">{attempt.mode} mode</span>
                      {attempt.negativeMarks < 0 && (
                        <span className="text-[10px] text-red-500">{attempt.negativeMarks} neg</span>
                      )}
                      <span className="text-[10px] text-gray-300">·</span>
                      <span className="text-[10px] text-gray-400">
                        {new Date(attempt.submittedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </span>
                    </div>
                  </div>
                  <span className={`text-sm font-bold px-3 py-1 rounded-full flex-shrink-0 ${color}`}>
                    {pct}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Account ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-semibold text-red-600 font-['Poppins'] mb-4">Account</h3>
        <button
          onClick={logout}
          className="flex items-center gap-2 text-red-500 hover:text-red-700 border border-red-200 hover:bg-red-50 px-4 py-2.5 rounded-xl transition-colors text-sm font-medium min-h-[44px]"
        >
          <LogOut size={15} /> Logout
        </button>
      </div>
    </div>
  );
}
