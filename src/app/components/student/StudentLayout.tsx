import { ReactNode, useState, useRef, useEffect } from "react";
import {
  LayoutDashboard, FileText, Brain, Bookmark, User,
  LogOut, Bell, X, ChevronDown, Check, Plus
} from "lucide-react";
import { GoalIcon } from "../shared/GoalIcons";
import { useApp } from "../context/AppContext";
import type { View } from "../context/AppContext";
import { announcements } from "../data/mockData";

const LogoImage = new URL("../../../imports/logo.png", import.meta.url).href;

const navItems: { icon: any; label: string; view: View }[] = [
  { icon: LayoutDashboard, label: "Dashboard",       view: "dashboard" },
  { icon: FileText,        label: "Papers",           view: "papers" },
  { icon: Brain,           label: "Quizzes",          view: "quizzes" },
  { icon: Bookmark,        label: "Bookmarks",        view: "bookmarks" },
  { icon: User,            label: "Profile",          view: "profile" },
];

// ── Goal Switcher Dropdown ────────────────────────────────────────────────────

function GoalSwitcher() {
  const { user, currentGoal, setCurrentGoal, setView } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!user || !currentGoal) return null;

  // Days until exam
  const daysUntil = currentGoal.examDate
    ? Math.max(0, Math.ceil((new Date(currentGoal.examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-150 max-w-[200px] min-h-[36px]"
        aria-label="Switch exam goal"
        aria-expanded={open}
      >
        {/* Color dot */}
        <span
          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: currentGoal.color }}
        />
        <span className="truncate font-['Poppins'] text-[13px]">{currentGoal.shortLabel}</span>
        <ChevronDown
          size={14}
          className={`text-gray-400 flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 mt-1.5 bg-white border border-gray-100 rounded-2xl shadow-lg min-w-[230px] z-50 py-1 overflow-hidden">
          <div className="px-3 py-2 border-b border-gray-50">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Switch Exam Goal</p>
          </div>
          {user.goals.map(goal => {
            const isActive = goal.id === currentGoal.id;
            const goalDays = goal.examDate
              ? Math.max(0, Math.ceil((new Date(goal.examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
              : null;
            return (
              <button
                key={goal.id}
                onClick={() => { setCurrentGoal(goal); setOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-gray-50 transition-colors duration-100 text-left min-h-[44px] ${
                  isActive ? "bg-blue-50" : ""
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: goal.color }}
                />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-['Poppins'] truncate ${isActive ? "font-semibold text-[#1E3A8A]" : "font-medium text-gray-800"}`}>
                    {goal.shortLabel}
                  </p>
                  {goalDays !== null && (
                    <p className="text-[11px] text-gray-400 mt-0.5">{goalDays} days left</p>
                  )}
                </div>
                {isActive && <Check size={14} className="text-[#1E3A8A] flex-shrink-0" />}
              </button>
            );
          })}
          <div className="border-t border-gray-100 mt-1 pt-1">
            <button
              onClick={() => { setView("profile"); setOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-gray-50 text-[#1E3A8A] text-sm font-medium min-h-[44px] transition-colors"
            >
              <Plus size={14} />
              Add New Goal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Notification Bell ─────────────────────────────────────────────────────────

function NotifBell() {
  const { user, currentGoal } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Filter announcements for current goal
  const activeAnnouncements = announcements.filter(a => {
    if (!a.isActive) return false;
    if (a.targetGoals.includes("all")) return true;
    if (currentGoal && a.targetGoals.includes(currentGoal.category)) return true;
    return false;
  });

  const urgentCount = activeAnnouncements.filter(a => a.priority === "urgent").length;
  const badgeCount = activeAnnouncements.length;

  const priorityStyle = (priority: string) => {
    if (priority === "urgent")    return "border-l-4 border-l-red-400 bg-red-50";
    if (priority === "important") return "border-l-4 border-l-amber-400 bg-amber-50";
    return "border-l-4 border-l-gray-200 bg-white";
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="relative w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
        aria-label="View announcements"
      >
        <Bell size={18} />
        {badgeCount > 0 && (
          <span className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full ${urgentCount > 0 ? "bg-red-500" : "bg-[#F97316]"}`} />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-[calc(100vw-1rem)] max-w-[340px] bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
            <span className="font-semibold text-sm font-['Poppins'] text-gray-900">Announcements</span>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg">
              <X size={15} />
            </button>
          </div>
          {activeAnnouncements.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-400 text-sm">
              <Bell size={24} className="mx-auto mb-2 text-gray-200" />
              No announcements right now
            </div>
          ) : (
            <div className="max-h-[320px] overflow-y-auto">
              {activeAnnouncements.slice(0, 5).map(a => (
                <div key={a.id} className={`px-4 py-3 border-b border-gray-50 ${priorityStyle(a.priority)}`}>
                  <p className="text-sm font-semibold text-gray-800 font-['Poppins'] leading-tight">{a.title}</p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">{a.body}</p>
                  <p className="text-[10px] text-gray-400 mt-1.5">{new Date(a.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main StudentLayout ────────────────────────────────────────────────────────

export function StudentLayout({ children }: { children: ReactNode }) {
  const { view, setView, user, setUser, currentGoal } = useApp();

  const logout = () => { setUser(null); setView("landing"); };

  const sidebarUserLabel = currentGoal?.shortLabel ?? "Student";

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">

      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex flex-col w-60 bg-[#1E3A8A] fixed h-full z-30">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 py-5 border-b border-white/10">
          <img src={LogoImage} alt="ParikshaCrack Logo" className="w-8 h-8 object-contain" />
          <span className="text-white font-bold text-[17px] font-['Poppins']">ParikshaCrack</span>
        </div>

        {/* Goal pill in sidebar */}
        {currentGoal && (
          <div className="px-3 pt-3 pb-1">
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
            >
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <GoalIcon category={currentGoal.category} size={16} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-[11px] font-semibold font-['Poppins'] truncate">{currentGoal.shortLabel}</p>
                {currentGoal.examDate && (
                  <p className="text-blue-300 text-[10px]">
                    {Math.max(0, Math.ceil((new Date(currentGoal.examDate).getTime() - Date.now()) / 86400000))} days left
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Nav items */}
        <nav className="flex-1 py-2 px-2">
          {navItems.map(item => {
            const isActive = view === item.view;
            return (
              <button
                key={item.view}
                onClick={() => setView(item.view)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 transition-all duration-150 text-sm min-h-[44px] ${
                  isActive
                    ? "bg-white/15 text-white font-semibold"
                    : "text-blue-200 hover:bg-white/8 hover:text-white font-normal"
                }`}
              >
                <item.icon size={18} />
                <span className="font-['Poppins']">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User section */}
        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-2 mb-2.5 px-1">
            <div className="w-9 h-9 bg-[#F97316] rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {user?.name?.[0] ?? "S"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-[13px] font-semibold font-['Poppins'] truncate">{user?.name}</p>
              <p className="text-blue-300 text-[11px] truncate">{sidebarUserLabel}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 text-red-300 hover:text-red-200 text-sm px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
          >
            <LogOut size={15} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">

        {/* ── Top Header ── */}
        <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 sticky top-0 z-20 shadow-sm h-14">

          {/* Mobile: Logo */}
          <div className="lg:hidden flex items-center gap-2 mr-1">
            <img src={LogoImage} alt="ParikshaCrack" className="w-7 h-7 object-contain" />
          </div>

          {/* Desktop: Page title */}
          <div className="hidden lg:block flex-1">
            <h2 className="text-gray-800 font-semibold text-[15px] font-['Poppins']">
              {navItems.find(n => n.view === view)?.label ?? "ParikshaCrack"}
            </h2>
          </div>

          {/* Goal Switcher — center on mobile, after title on desktop */}
          <div className="flex-1 lg:flex-none flex justify-center lg:justify-start">
            <GoalSwitcher />
          </div>

          {/* Right: Notifications + Avatar */}
          <div className="flex items-center gap-1 ml-auto lg:ml-0">
            <NotifBell />
            <button
              onClick={() => setView("profile")}
              className="w-9 h-9 bg-[#1E3A8A] rounded-full flex items-center justify-center text-white text-sm font-bold font-['Poppins'] hover:bg-[#1D4ED8] transition-colors"
              aria-label="Profile"
            >
              {user?.name?.[0] ?? "S"}
            </button>
          </div>
        </header>

        {/* ── Page Content ── */}
        <main id="main-content" className="flex-1 p-4 sm:p-6 pb-24 lg:pb-8" role="main">
          {children}
        </main>

        {/* ── Mobile Bottom Navigation ── */}
        <nav
          className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 flex items-center justify-around px-1"
          style={{ height: "64px", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
          role="navigation"
          aria-label="Main navigation"
        >
          {navItems.map(item => {
            const isActive = view === item.view;
            return (
              <button
                key={item.view}
                onClick={() => setView(item.view)}
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
                className={`flex flex-col items-center justify-center flex-1 h-full gap-0.5 rounded-xl mx-0.5 transition-all duration-150 min-w-[44px] ${
                  isActive
                    ? "text-[#1E3A8A] bg-[#1E3A8A]/5 border-t-2 border-t-[#1E3A8A]"
                    : "text-gray-400 hover:text-gray-600"
                } -mt-px`}
              >
                <item.icon size={22} />
                <span className={`text-[10px] mt-0.5 font-medium font-['Poppins'] ${isActive ? "font-semibold" : ""}`}>
                  {item.label.split(" ")[0]}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
