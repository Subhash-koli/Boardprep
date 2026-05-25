import { ReactNode, useState } from "react";
import {
  BookOpen, LayoutDashboard, FileText, Brain, Bookmark, User, LogOut, Bell, Menu, X, ChevronRight
} from "lucide-react";
import { useApp } from "../context/AppContext";
import type { View } from "../context/AppContext";
import { announcements } from "../data/mockData";

const navItems: { icon: any; label: string; view: View }[] = [
  { icon: LayoutDashboard, label: "Dashboard", view: "dashboard" },
  { icon: FileText, label: "Question Papers", view: "papers" },
  { icon: Brain, label: "MCQ Quizzes", view: "quizzes" },
  { icon: Bookmark, label: "Bookmarks", view: "bookmarks" },
  { icon: User, label: "Profile", view: "profile" },
];

export function StudentLayout({ children }: { children: ReactNode }) {
  const { view, setView, user, setUser } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const activeAnnouncements = announcements.filter(a => a.isActive && (a.targetAudience === "all" || a.targetAudience === user?.standard));

  const logout = () => { setUser(null); setView("landing"); };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-60 bg-[#1E3A8A] fixed h-full z-30">
        <div className="p-5 border-b border-blue-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#F97316] rounded-lg flex items-center justify-center">
              <BookOpen size={17} className="text-white" />
            </div>
            <span className="text-white font-bold" style={{ fontFamily: "Poppins, sans-serif" }}>MahaBoard</span>
          </div>
        </div>

        <nav className="flex-1 py-4 px-2">
          {navItems.map(item => (
            <button
              key={item.view}
              onClick={() => setView(item.view)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-all text-sm ${view === item.view ? "bg-white/15 text-white" : "text-blue-200 hover:bg-white/10 hover:text-white"}`}
            >
              <item.icon size={18} />
              <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: view === item.view ? 600 : 400 }}>{item.label}</span>
              {view === item.view && <ChevronRight size={14} className="ml-auto" />}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-blue-700">
          <div className="flex items-center gap-2 mb-3 px-1">
            <div className="w-8 h-8 bg-[#F97316] rounded-full flex items-center justify-center text-white text-sm font-bold">
              {user?.name?.[0] || "S"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm truncate" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500 }}>{user?.name}</div>
              <div className="text-blue-300 text-xs">{user?.standard}th Standard</div>
            </div>
          </div>
          <button onClick={logout} className="w-full flex items-center gap-2 text-blue-300 hover:text-white text-sm px-2 py-1.5 rounded-lg hover:bg-white/10 transition-colors">
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-[#1E3A8A] flex flex-col">
            <div className="p-4 border-b border-blue-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-[#F97316] rounded-lg flex items-center justify-center">
                  <BookOpen size={14} className="text-white" />
                </div>
                <span className="text-white font-bold text-sm" style={{ fontFamily: "Poppins, sans-serif" }}>MahaBoard</span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="text-blue-200"><X size={20} /></button>
            </div>
            <nav className="flex-1 py-3 px-2">
              {navItems.map(item => (
                <button
                  key={item.view}
                  onClick={() => { setView(item.view); setMobileOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-sm transition-all ${view === item.view ? "bg-white/15 text-white" : "text-blue-200 hover:bg-white/10 hover:text-white"}`}
                >
                  <item.icon size={17} />
                  <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: view === item.view ? 600 : 400 }}>{item.label}</span>
                </button>
              ))}
            </nav>
            <div className="p-4 border-t border-blue-700">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-[#F97316] rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {user?.name?.[0]}
                </div>
                <div>
                  <div className="text-white text-sm" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500 }}>{user?.name}</div>
                  <div className="text-blue-300 text-xs">{user?.standard}th Std</div>
                </div>
              </div>
              <button onClick={logout} className="flex items-center gap-2 text-blue-300 text-sm">
                <LogOut size={15} /> Logout
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <button className="lg:hidden text-gray-500" onClick={() => setMobileOpen(true)}>
            <Menu size={22} />
          </button>
          <div className="hidden lg:block">
            <h2 className="text-gray-800" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
              {navItems.find(n => n.view === view)?.label || "MahaBoard Prep"}
            </h2>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative w-9 h-9 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-full"
              >
                <Bell size={18} />
                {activeAnnouncements.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[#F97316] rounded-full" />
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                    <span className="font-semibold text-sm" style={{ fontFamily: "Poppins, sans-serif", color: "#1E3A8A" }}>Announcements</span>
                    <button onClick={() => setNotifOpen(false)} className="text-gray-400"><X size={16} /></button>
                  </div>
                  {activeAnnouncements.slice(0, 3).map(a => (
                    <div key={a.id} className="px-4 py-3 border-b border-gray-50 hover:bg-gray-50">
                      <p className="text-sm font-medium text-gray-800" style={{ fontFamily: "Poppins, sans-serif" }}>{a.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{a.body.slice(0, 80)}...</p>
                    </div>
                  ))}
                  {activeAnnouncements.length === 0 && (
                    <div className="px-4 py-6 text-center text-gray-400 text-sm">No announcements</div>
                  )}
                </div>
              )}
            </div>
            <div className="w-8 h-8 bg-[#1E3A8A] rounded-full flex items-center justify-center text-white text-sm font-bold">
              {user?.name?.[0] || "S"}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
