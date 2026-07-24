import { ReactNode, useState, useRef, useEffect } from "react";
import {
  LayoutDashboard, FileText, Brain, Bookmark, User,
  LogOut, Bell, X, Moon, Sun,
} from "lucide-react";
import { useApp } from "../context/AppContext";

import type { View } from "../context/AppContext";
import { announcements } from "../data/mockData";

const LogoImage = new URL("../../../imports/logo.png", import.meta.url).href;

const navItems: { icon: any; label: string; view: View }[] = [
  { icon: LayoutDashboard, label: "Dashboard",  view: "dashboard" },
  { icon: FileText,        label: "Papers",      view: "papers"    },
  { icon: Brain,           label: "Quizzes",     view: "quizzes"   },
  { icon: Bookmark,        label: "Bookmarks",   view: "bookmarks" },
  { icon: User,            label: "Profile",     view: "profile"   },
];

// ── Notification Bell ─────────────────────────────────────────────────────────

function NotifBell() {
  const { user } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Show all active announcements — no goal filtering
  const activeAnnouncements = announcements.filter(a => a.isActive);

  const urgentCount = activeAnnouncements.filter(a => a.priority === "urgent").length;
  const badgeCount  = activeAnnouncements.length;

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
        <div className="absolute right-0 top-12 w-[calc(100vw-1rem)] max-w-[340px] rounded-2xl z-50 overflow-hidden" style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.9)", boxShadow: "0 2px 12px rgba(30,58,138,0.06)" }}>
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
  const { view, setView, user, setUser, darkMode, toggleDarkMode } = useApp();


  const logout = () => { setUser(null); setView("landing"); };

  return (
    <div className="min-h-screen texture-paper flex">

      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex flex-col w-60 fixed inset-y-0 left-0 h-screen z-30 overflow-hidden" style={{ background: "linear-gradient(180deg, #0A1F4E 0%, #1E3A8A 55%, #1E40AF 100%)" }}>

        {/* Film grain overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.045'/%3E%3C/svg%3E\")", backgroundSize: "300px 300px", mixBlendMode: "overlay", zIndex: 0 }} />
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 py-5 border-b border-white/10 relative z-10">
          <img src={LogoImage} alt="ParikshaCrack Logo" className="w-8 h-8 object-contain" />
          <span className="text-white font-bold text-[17px] font-['Poppins']">ParikshaCrack</span>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-3 px-2 relative z-10">
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
        <div className="p-3 border-t border-white/10 relative z-10">
          <div className="flex items-center gap-2 mb-2.5 px-1">
            <div className="w-9 h-9 bg-[#F97316] rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {user?.name?.[0] ?? "S"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-[13px] font-semibold font-['Poppins'] truncate">{user?.name}</p>
              <p className="text-blue-100 text-[11px] font-medium truncate">{user?.email}</p>

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
      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen min-w-0 overflow-x-hidden">

        {/* ── Top Header ── */}
        <header className="px-4 py-3 flex items-center gap-3 sticky top-0 z-20 h-14" style={{ backgroundColor: "rgba(255,255,255,0.88)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderBottom: "1px solid rgba(30,58,138,0.08)", boxShadow: "0 1px 16px rgba(30,58,138,0.07)" }}>

          {/* Mobile: Logo */}
          <div className="lg:hidden flex items-center gap-2">
            <img src={LogoImage} alt="ParikshaCrack" className="w-7 h-7 object-contain" />
            <span className="text-[#1E3A8A] font-bold text-[15px] font-['Poppins']">ParikshaCrack</span>
          </div>

          {/* Desktop: Page title */}
          <div className="hidden lg:block flex-1">
            <h2 className="text-gray-800 font-semibold text-[15px] font-['Poppins']">
              {navItems.find(n => n.view === view)?.label ?? "ParikshaCrack"}
            </h2>
          </div>

          {/* Spacer on mobile */}
          <div className="flex-1 lg:hidden" />

          {/* Right: Notifications + Dark Mode + Avatar */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleDarkMode}
              className="w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-800 rounded-xl transition-colors"
              title={darkMode ? "Switch to Light Mode" : "Switch to Midnight OLED Dark Mode"}
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
            </button>
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
        <main id="main-content" className="flex-1 p-4 sm:p-6 pb-24 lg:pb-8 animate-view-fade" role="main">
          {children}
        </main>


        {/* ── Mobile Bottom Navigation ── */}
        <nav
          className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-1"
          style={{ height: "64px", paddingBottom: "env(safe-area-inset-bottom, 0px)", backgroundColor: "rgba(255,255,255,0.92)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderTop: "1px solid rgba(30,58,138,0.08)", boxShadow: "0 -1px 16px rgba(30,58,138,0.07)" }}
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
