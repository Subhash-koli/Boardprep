import { Users, FileText, Brain, BarChart3, TrendingUp, Activity, Eye } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { adminAnalyticsData, papers, quizzes, students } from "../data/mockData";
import { useApp } from "../context/AppContext";

function StatCard({ icon: Icon, label, value, change, color, bg }: any) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
          <Icon size={19} className={color} />
        </div>
        {change && <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{change}</span>}
      </div>
      <div className="text-2xl mb-0.5" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, color: "#1E3A8A" }}>{value}</div>
      <div className="text-gray-500 text-sm">{label}</div>
    </div>
  );
}

export function AdminDashboard() {
  const { setView } = useApp();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, color: "#1E3A8A" }}>Admin Dashboard</h2>
        <p className="text-gray-500 text-sm">Platform overview and live stats</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Students" value={adminAnalyticsData.totalStudents.toLocaleString()} change="+64 this week" color="text-blue-600" bg="bg-blue-100" />
        <StatCard icon={FileText} label="Question Papers" value={adminAnalyticsData.totalPapers} color="text-purple-600" bg="bg-purple-100" />
        <StatCard icon={Brain} label="MCQ Quizzes" value={adminAnalyticsData.totalQuizzes} color="text-orange-600" bg="bg-orange-100" />
        <StatCard icon={Activity} label="Total Attempts" value={adminAnalyticsData.totalAttempts.toLocaleString()} change="+842 today" color="text-green-600" bg="bg-green-100" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.9)", boxShadow: "0 2px 12px rgba(30,58,138,0.06)" }}>
          <h3 className="mb-4" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "#1E3A8A" }}>Student Growth</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={adminAnalyticsData.registrationTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94A3B8" }} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 12 }} />
              <Bar dataKey="count" fill="#1E3A8A" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.9)", boxShadow: "0 2px 12px rgba(30,58,138,0.06)" }}>
          <h3 className="mb-4" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "#1E3A8A" }}>Top 5 Quizzes</h3>
          <div className="space-y-3">
            {adminAnalyticsData.topQuizzes.map((q, i) => (
              <div key={q.title}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700 truncate">{q.title}</span>
                  <span className="text-gray-500 ml-2 flex-shrink-0">{q.attempts.toLocaleString()}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#F97316] rounded-full" style={{ width: `${(q.attempts / adminAnalyticsData.topQuizzes[0].attempts) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Papers */}
        <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.9)", boxShadow: "0 2px 12px rgba(30,58,138,0.06)" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "#1E3A8A" }}>Recent Papers</h3>
            <button onClick={() => setView("admin-papers")} className="text-xs text-[#1E3A8A] hover:underline">View all</button>
          </div>
          <div className="space-y-2">
            {papers.slice(0, 4).map(p => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 truncate">{p.title}</p>
                  <p className="text-xs text-gray-400">{p.subject} · {p.year}</p>
                </div>
                <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${p.status === "published" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Students */}
        <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.9)", boxShadow: "0 2px 12px rgba(30,58,138,0.06)" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "#1E3A8A" }}>Recent Students</h3>
            <button onClick={() => setView("admin-users")} className="text-xs text-[#1E3A8A] hover:underline">View all</button>
          </div>
          <div className="space-y-2">
            {students.slice(0, 4).map(s => (
              <div key={s.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                <div className="w-7 h-7 bg-[#1E3A8A] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {s.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 truncate">{s.name}</p>
                  <p className="text-xs text-gray-400">{s.goalLabels[0]} · {s.totalAttempts} attempts</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${s.isBlocked ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
                  {s.isBlocked ? "Blocked" : "Active"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Daily Active Users", value: adminAnalyticsData.dailyActiveUsers, icon: TrendingUp },
          { label: "NEET Students",     value: students.filter(s => s.goalCategories.includes("neet")).length, icon: Users },
          { label: "Board Students",    value: students.filter(s => s.goalCategories.some(g => g.startsWith("board"))).length, icon: Users },
          { label: "Blocked Accounts",  value: students.filter(s => s.isBlocked).length, icon: Users },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center">
            <div className="text-xl" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, color: "#1E3A8A" }}>{s.value}</div>
            <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
