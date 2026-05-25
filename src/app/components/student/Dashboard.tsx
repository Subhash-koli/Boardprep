import { Flame, BookOpen, Brain, Star, TrendingUp, ChevronRight, Bell, Zap } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useApp } from "../context/AppContext";
import { announcements, quizzes, papers, subjectProgress, scoreTrendData } from "../data/mockData";

function StatCard({ icon: Icon, label, value, color, bg }: any) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
        <Icon size={20} className={color} />
      </div>
      <div className="text-2xl mb-0.5" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, color: "#1E3A8A" }}>{value}</div>
      <div className="text-gray-500 text-sm">{label}</div>
    </div>
  );
}

export function Dashboard() {
  const { user, setView, setSelectedQuizId, setSelectedPaperId, completedAttempts } = useApp();
  const activeAnnouncements = announcements.filter(a => a.isActive && (a.targetAudience === "all" || a.targetAudience === user?.standard));
  const recentQuizzes = quizzes.filter(q => q.standard === user?.standard && q.status === "published").slice(0, 3);
  const recentPapers = papers.filter(p => p.standard === user?.standard && p.status === "published").slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-[#1E3A8A] to-blue-700 rounded-2xl p-5 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
              Welcome back, {user?.name?.split(" ")[0]}! 👋
            </h2>
            <p className="text-blue-200 text-sm mt-1">{user?.standard}th Standard · {user?.medium} medium</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1.5 bg-white/10 rounded-xl px-3 py-2">
              <Flame size={18} className="text-[#F97316]" />
              <span className="font-bold">{user?.streak || 15}</span>
              <span className="text-blue-200 text-xs">day streak</span>
            </div>
          </div>
        </div>
        <div className="mt-4 flex gap-3">
          <button onClick={() => setView("quizzes")} className="bg-[#F97316] hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm transition-colors flex items-center gap-2">
            <Brain size={16} /> Take a Quiz
          </button>
          <button onClick={() => setView("papers")} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-sm transition-colors flex items-center gap-2">
            <BookOpen size={16} /> Browse Papers
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon={BookOpen} label="Papers Browsed" value="12" color="text-blue-600" bg="bg-blue-100" />
        <StatCard icon={Brain} label="Quizzes Taken" value={completedAttempts.length} color="text-purple-600" bg="bg-purple-100" />
        <StatCard icon={Star} label="Avg. Score" value="76%" color="text-orange-600" bg="bg-orange-100" />
        <StatCard icon={Flame} label="Day Streak" value={user?.streak || 15} color="text-red-500" bg="bg-red-100" />
      </div>

      {/* Progress + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Progress */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="mb-4 flex items-center gap-2" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "#1E3A8A" }}>
            <TrendingUp size={18} /> Subject Progress
          </h3>
          <div className="space-y-3">
            {subjectProgress.map(sp => (
              <div key={sp.subject}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{sp.subject}</span>
                  <span className="text-gray-500">{sp.quizzesAttempted}/{sp.totalQuizzes} quizzes</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${sp.progress}%`, background: sp.progress >= 70 ? "#16A34A" : sp.progress >= 40 ? "#1E3A8A" : "#F97316" }}
                  />
                </div>
                <div className="text-xs text-gray-400 mt-0.5">{sp.progress}% completed</div>
              </div>
            ))}
          </div>
        </div>

        {/* Score Trend */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="mb-4" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "#1E3A8A" }}>Score Trend (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={scoreTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94A3B8" }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#94A3B8" }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 12 }} />
              <Line type="monotone" dataKey="score" stroke="#1E3A8A" strokeWidth={2} dot={{ fill: "#1E3A8A", r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Announcements */}
      {activeAnnouncements.length > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="mb-4 flex items-center gap-2" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "#1E3A8A" }}>
            <Bell size={18} /> Announcements
          </h3>
          <div className="space-y-3">
            {activeAnnouncements.map(a => (
              <div key={a.id} className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#1E3A8A]" style={{ fontFamily: "Poppins, sans-serif" }}>{a.title}</p>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{a.body.slice(0, 120)}...</p>
                  </div>
                  <span className={`ml-3 text-xs px-2 py-0.5 rounded-full ${a.targetAudience === "all" ? "bg-gray-100 text-gray-600" : "bg-[#F97316]/10 text-[#F97316]"}`}>
                    {a.targetAudience === "all" ? "All" : `${a.targetAudience}th`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Access */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Quizzes */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "#1E3A8A" }}>Recent Quizzes</h3>
            <button onClick={() => setView("quizzes")} className="text-[#1E3A8A] text-xs flex items-center gap-1 hover:underline">
              View all <ChevronRight size={12} />
            </button>
          </div>
          <div className="space-y-2">
            {recentQuizzes.map(q => (
              <button
                key={q.id}
                onClick={() => { setSelectedQuizId(q.id); setView("quiz-detail"); }}
                className="w-full text-left bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-200 rounded-xl p-3 transition-all flex items-center gap-3"
              >
                <div className="w-9 h-9 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Brain size={16} className="text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate" style={{ fontFamily: "Poppins, sans-serif" }}>{q.title}</p>
                  <p className="text-xs text-gray-400">{q.questionsCount} Qs · {q.timeLimitMinutes} min · <span className={`capitalize ${q.difficulty === "hard" ? "text-red-500" : q.difficulty === "medium" ? "text-orange-500" : "text-green-500"}`}>{q.difficulty}</span></p>
                </div>
                <ChevronRight size={14} className="text-gray-400 flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* Recent Papers */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "#1E3A8A" }}>Recent Papers</h3>
            <button onClick={() => setView("papers")} className="text-[#1E3A8A] text-xs flex items-center gap-1 hover:underline">
              View all <ChevronRight size={12} />
            </button>
          </div>
          <div className="space-y-2">
            {recentPapers.map(p => (
              <button
                key={p.id}
                onClick={() => { setSelectedPaperId(p.id); setView("paper-detail"); }}
                className="w-full text-left bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-200 rounded-xl p-3 transition-all flex items-center gap-3"
              >
                <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
                  <BookOpen size={16} className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate" style={{ fontFamily: "Poppins, sans-serif" }}>{p.title}</p>
                  <p className="text-xs text-gray-400">{p.subject} · {p.year} · {p.marks} marks</p>
                </div>
                <ChevronRight size={14} className="text-gray-400 flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Weak Areas */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100/50 border border-orange-200 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Zap size={18} className="text-[#F97316]" />
          <h3 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "#C2410C" }}>Practice Suggestions</h3>
        </div>
        <p className="text-sm text-orange-700 mb-3">Based on your performance, focus on these topics:</p>
        <div className="flex flex-wrap gap-2">
          {["Science Pt.2", "Geography", "Trigonometry", "Chemical Reactions"].map(t => (
            <span key={t} className="bg-white text-orange-700 border border-orange-200 text-xs px-3 py-1.5 rounded-full">
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
