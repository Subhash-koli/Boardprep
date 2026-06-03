import { ReactNode, useState } from "react";
import { LayoutDashboard, FileText, Brain, Users, Bell, BarChart3, FolderTree, LogOut, Menu, X, ChevronRight } from "lucide-react";
import { useApp } from "../context/AppContext";
import type { View } from "../context/AppContext";

const LogoImage = new URL("../../../imports/logo.png", import.meta.url).href;

const navItems: { icon: any; label: string; view: View }[] = [
  { icon: LayoutDashboard, label: "Dashboard", view: "admin-dashboard" },
  { icon: FileText, label: "Papers", view: "admin-papers" },
  { icon: Brain, label: "Quizzes", view: "admin-quizzes" },
  { icon: FolderTree, label: "Subjects & Chapters", view: "admin-subjects" },
  { icon: Users, label: "Students", view: "admin-users" },
  { icon: Bell, label: "Announcements", view: "admin-announcements" },
  { icon: BarChart3, label: "Analytics", view: "admin-analytics" },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const { view, setView, setUser } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const logout = () => { setUser(null); setView("landing"); };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-slate-900 fixed h-full z-30">
        <div className="p-5 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <img src={LogoImage} alt="ParikshaCrack Logo" className="w-10 h-10 object-contain" />
            <div>
              <div className="text-white font-bold text-base" style={{ fontFamily: "Poppins, sans-serif" }}>ParikshaCrack</div>
              <div className="text-slate-400 text-xs">Admin Panel</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 py-4 px-2">
          {navItems.map(item => (
            <button
              key={item.view}
              onClick={() => setView(item.view)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-sm transition-all ${view === item.view ? "bg-[#F97316] text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}
            >
              <item.icon size={17} />
              <span style={{ fontFamily: "Poppins, sans-serif", fontWeight: view === item.view ? 600 : 400 }}>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-2 mb-3 px-1">
            <div className="w-7 h-7 bg-[#F97316] rounded-full flex items-center justify-center text-white text-xs font-bold">A</div>
            <div>
              <div className="text-white text-xs" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500 }}>Admin</div>
              <div className="text-slate-400 text-xs">admin@ParikshaCrack.in</div>
            </div>
          </div>
          <button onClick={logout} className="flex items-center gap-2 text-slate-400 hover:text-white text-xs px-2 py-1.5 rounded-lg hover:bg-slate-800 transition-colors">
            <LogOut size={13} /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-slate-900 flex flex-col">
            <div className="p-4 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src={LogoImage} alt="ParikshaCrack Logo" className="w-9 h-9 object-contain" />
                <span className="text-white font-bold text-base" style={{ fontFamily: "Poppins, sans-serif" }}>Admin Panel</span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="text-slate-300"><X size={18} /></button>
            </div>
            <nav className="flex-1 py-3 px-2">
              {navItems.map(item => (
                <button
                  key={item.view}
                  onClick={() => { setView(item.view); setMobileOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-sm transition-all ${view === item.view ? "bg-[#F97316] text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}
                >
                  <item.icon size={17} />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
            <div className="p-4 border-t border-slate-700">
              <button onClick={logout} className="flex items-center gap-2 text-slate-400 text-sm">
                <LogOut size={14} /> Logout
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">
        <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 sticky top-0 z-20 shadow-sm">
          <button className="lg:hidden text-gray-500" onClick={() => setMobileOpen(true)}>
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">Admin</span>
            <ChevronRight size={14} className="text-gray-300" />
            <span className="text-gray-700 text-sm" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500 }}>
              {navItems.find(n => n.view === view)?.label || "Panel"}
            </span>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 pb-20 lg:pb-6">
          {children}
        </main>
        
        {/* Mobile Bottom Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50"
          style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
          <nav className="flex items-stretch overflow-x-auto scrollbar-none px-1" style={{ minHeight: "60px" }}>
            {navItems.map(item => (
              <button
                key={item.view}
                onClick={() => setView(item.view)}
                className={`flex-shrink-0 flex flex-col items-center justify-center py-2 px-1 min-w-[56px] sm:flex-1 transition-all text-xs ${
                  view === item.view
                    ? "text-slate-700 border-t-2 border-[#F97316] bg-orange-50"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <item.icon size={20} />
                <span className="mt-0.5 font-medium text-[9px] sm:text-[10px] leading-tight">{item.label.split(" ")[0]}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
