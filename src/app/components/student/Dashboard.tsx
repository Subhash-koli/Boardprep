import { Flame, BookOpen, Brain, Star, TrendingUp, ChevronRight, Bell, Zap, Target, Calendar, Trophy } from "lucide-react";
import { GoalIcon } from "../shared/GoalIcons";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useApp } from "../context/AppContext";
import { announcements, quizzes, papers, scoreTrendData } from "../data/mockData";
import { DIFFICULTY_CONFIG } from "../data/mockData";

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color, bg }: { icon: any; label: string; value: string | number; color: string; bg: string }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col gap-2">
      <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center`}>
        <Icon size={18} className={color} />
      </div>
      <div className="text-2xl font-bold font-['Poppins'] text-[#1E3A8A]">{value}</div>
      <div className="text-gray-500 text-xs leading-tight">{label}</div>
    </div>
  );
}

// ── Exam Countdown Banner ─────────────────────────────────────────────────────
function CountdownBanner({ days, label, color, category }: { days: number; label: string; color: string; category: import("../data/mockData").GoalCategory }) {
  const urgency = days <= 30 ? "red" : days <= 90 ? "orange" : "blue";
  const bg = urgency === "red" ? "from-red-600 to-red-500" : urgency === "orange" ? "from-orange-500 to-amber-500" : "from-[#1E3A8A] to-blue-600";
  return (
    <div className={`bg-gradient-to-r ${bg} rounded-2xl p-4 flex items-center gap-4`}>
      <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
        <GoalIcon category={category} size={22} className="text-white" />
      </div>
      <div className="flex-1">
        <p className="text-white/80 text-xs font-medium">{label}</p>
        <p className="text-white text-2xl font-bold font-['Poppins']">{days} <span className="text-base font-medium">days left</span></p>
      </div>
      <div className="text-right hidden sm:block">
        <p className="text-white/70 text-xs">Stay consistent</p>
        <p className="text-white text-xs font-semibold flex items-center gap-1 justify-end"><Flame size={12} className="text-orange-300" /> Keep going!</p>
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export function Dashboard() {
  const { user, currentGoal, setView, setSelectedQuizId, setSelectedPaperId, completedAttempts } = useApp();

  // Goal-aware filtering
  const cat = currentGoal?.category;

  const activeAnnouncements = announcements.filter(a => {
    if (!a.isActive) return false;
    if (a.targetGoals.includes("all")) return true;
    if (cat && a.targetGoals.includes(cat)) return true;
    return false;
  });

  const recentQuizzes = quizzes
    .filter(q => q.goalCategory === cat && q.status === "published")
    .slice(0, 3);

  const recentPapers = papers
    .filter(p => p.goalCategory === cat && p.status === "published")
    .slice(0, 3);

  // Stats derived from attempts for current goal
  const goalAttempts = completedAttempts.filter(a => a.goalCategory === cat);
  const avgScore = goalAttempts.length > 0
    ? Math.round(goalAttempts.reduce((sum, a) => sum + a.percentage, 0) / goalAttempts.length)
    : 0;

  // Exam countdown
  const daysLeft = currentGoal?.examDate
    ? Math.max(0, Math.ceil((new Date(currentGoal.examDate).getTime() - Date.now()) / 86400000))
    : null;

  // Score trend from recent attempts
  const trendData = goalAttempts.length >= 2
    ? goalAttempts.slice(0, 6).reverse().map((a, i) => ({
        date: new Date(a.submittedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
        score: Math.round(a.percentage),
      }))
    : scoreTrendData;

  // Performance analysis  
  const lastAttempt = goalAttempts[0] ?? null;
  const isNEETorJEE = cat === "neet" || cat === "jee-mains" || cat === "jee-advanced";

  return (
    <div className="max-w-5xl mx-auto space-y-5">

      {/* ── Welcome Hero ── */}
      <div
        className="rounded-2xl p-5 text-white relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${currentGoal?.color ?? "#1E3A8A"} 0%, #1D4ED8 100%)` }}
      >
        {/* Decorative circle */}
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/5 rounded-full" />
        <div className="absolute -right-2 top-8 w-20 h-20 bg-white/5 rounded-full" />

        <div className="relative flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold font-['Poppins'] truncate">
              Welcome back, {user?.name?.split(" ")[0]}!
            </h2>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-white/80 text-sm flex items-center gap-1.5">
                <GoalIcon category={currentGoal.category} size={14} className="text-white/80" />
                {currentGoal?.shortLabel}
              </span>
              {currentGoal?.examDate && (
                <span className="text-white/60 text-xs">· {daysLeft} days left</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-white/15 rounded-xl px-3 py-2 flex-shrink-0">
            <Flame size={16} className="text-orange-300" />
            <span className="font-bold text-sm">{user?.streak ?? 0}</span>
            <span className="text-white/70 text-xs hidden sm:block">streak</span>
          </div>
        </div>

        <div className="relative mt-4 flex gap-2 flex-wrap">
          <button
            onClick={() => setView("quizzes")}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-sm transition-all font-medium min-h-[40px]"
          >
            <Brain size={15} /> Take a Quiz
          </button>
          <button
            onClick={() => setView("papers")}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-sm transition-all min-h-[40px]"
          >
            <BookOpen size={15} /> Browse Papers
          </button>
        </div>
      </div>

      {/* ── Exam Countdown (if close) ── */}
      {daysLeft !== null && daysLeft <= 180 && currentGoal && (
        <CountdownBanner
          days={daysLeft}
          label={currentGoal.label}
          color={currentGoal.color}
          category={currentGoal.category}
        />
      )}

      {/* ── Resume Banner (if in-progress attempt) ── */}
      {lastAttempt && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Trophy size={18} className="text-amber-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-amber-900 font-['Poppins'] truncate">Last: {lastAttempt.quizTitle}</p>
            <p className="text-xs text-amber-700 mt-0.5">
              Score: {lastAttempt.totalScore}/{lastAttempt.maxScore} ({Math.round(lastAttempt.percentage)}%)
              {lastAttempt.negativeMarks < 0 && ` · -${Math.abs(lastAttempt.negativeMarks)} negative`}
            </p>
          </div>
          <button
            onClick={() => setView("quizzes")}
            className="flex-shrink-0 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-colors min-h-[36px]"
          >
            Practice Again
          </button>
        </div>
      )}

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard icon={BookOpen} label="Papers Available" value={papers.filter(p => p.goalCategory === cat).length} color="text-blue-600"   bg="bg-blue-50" />
        <StatCard icon={Brain}    label="Quizzes Taken"   value={goalAttempts.length}                                                        color="text-violet-600" bg="bg-violet-50" />
        <StatCard icon={Star}     label="Avg. Score"      value={avgScore > 0 ? `${avgScore}%` : "—"}                                        color="text-orange-600" bg="bg-orange-50" />
        <StatCard icon={Flame}    label="Day Streak"      value={user?.streak ?? 0}                                                           color="text-red-500"   bg="bg-red-50" />
      </div>

      {/* ── NEET/JEE specific marking info ── */}
      {isNEETorJEE && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
          <Target size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-emerald-900 font-['Poppins']">Negative Marking Active</p>
            <p className="text-xs text-emerald-700 mt-0.5">
              {cat === "neet" ? "NEET: +4 correct, −1 wrong. Skip if unsure." :
               cat === "jee-advanced" ? "JEE Advanced: +3 correct, −1 wrong." :
               "JEE Mains: +4 correct, −1 wrong. Numericals carry no negative."}
            </p>
          </div>
        </div>
      )}

      {/* ── Score Trend + Subject Progress ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Score Trend Chart */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-[#1E3A8A] font-['Poppins'] mb-4 flex items-center gap-2 text-sm">
            <TrendingUp size={16} /> Score Trend
          </h3>
          {trendData.length >= 2 ? (
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={trendData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#94A3B8" }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#94A3B8" }} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 12, padding: "4px 10px" }}
                  formatter={(v: any) => [`${v}%`, "Score"]}
                />
                <Line
                  type="monotone" dataKey="score"
                  stroke={currentGoal?.color ?? "#1E3A8A"} strokeWidth={2.5}
                  dot={{ fill: currentGoal?.color ?? "#1E3A8A", r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-40 flex flex-col items-center justify-center text-gray-400">
              <TrendingUp size={32} className="mb-2 opacity-30" />
              <p className="text-sm">Take quizzes to see your trend</p>
            </div>
          )}
        </div>

        {/* Subject breakdown (goal subjects) */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-[#1E3A8A] font-['Poppins'] mb-4 flex items-center gap-2 text-sm">
            <Target size={16} /> Subject Coverage
          </h3>
          {recentQuizzes.length === 0 ? (
            <div className="h-40 flex flex-col items-center justify-center text-gray-400">
              <Brain size={32} className="mb-2 opacity-30" />
              <p className="text-sm text-center">No quizzes taken yet for {currentGoal?.shortLabel}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentQuizzes.map(q => {
                const attemptsForQuiz = goalAttempts.filter(a => a.quizId === q.id);
                const bestScore = attemptsForQuiz.length > 0
                  ? Math.round(Math.max(...attemptsForQuiz.map(a => a.percentage)))
                  : 0;
                const pct = bestScore;
                return (
                  <div key={q.id}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-700 font-medium truncate max-w-[60%]">{q.subject}</span>
                      <span className="text-gray-500 flex-shrink-0">{attemptsForQuiz.length} attempt{attemptsForQuiz.length !== 1 ? "s" : ""}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${pct}%`,
                          background: pct >= 70 ? "#16A34A" : pct >= 40 ? (currentGoal?.color ?? "#1E3A8A") : "#F97316"
                        }}
                      />
                    </div>
                    <div className="text-[10px] text-gray-400 mt-0.5">{pct > 0 ? `${pct}% best score` : "Not attempted"}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Announcements ── */}
      {activeAnnouncements.length > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-[#1E3A8A] font-['Poppins'] mb-4 flex items-center gap-2 text-sm">
            <Bell size={16} /> Announcements
          </h3>
          <div className="space-y-3">
            {activeAnnouncements.slice(0, 3).map(a => (
              <div
                key={a.id}
                className={`rounded-xl p-4 border-l-4 ${
                  a.priority === "urgent" ? "bg-red-50 border-l-red-400" :
                  a.priority === "important" ? "bg-amber-50 border-l-amber-400" :
                  "bg-blue-50 border-l-[#1E3A8A]/40"
                }`}
              >
                <div className="flex items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 font-['Poppins'] leading-snug">{a.title}</p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">{a.body}</p>
                  </div>
                  {a.priority !== "normal" && (
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                      a.priority === "urgent" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                    }`}>
                      {a.priority.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Quick Access: Quizzes + Papers ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Recent Quizzes */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#1E3A8A] font-['Poppins'] text-sm">Recommended Quizzes</h3>
            <button onClick={() => setView("quizzes")} className="text-[#1E3A8A] text-xs flex items-center gap-1 hover:underline">
              View all <ChevronRight size={12} />
            </button>
          </div>
          {recentQuizzes.length === 0 ? (
            <div className="text-center py-6 text-gray-400">
              <Brain size={28} className="mx-auto mb-2 opacity-30" />
              <p className="text-xs">No quizzes for {currentGoal?.shortLabel} yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentQuizzes.map(q => {
                const diffCfg = DIFFICULTY_CONFIG[q.difficulty] ?? DIFFICULTY_CONFIG.medium;
                return (
                  <button
                    key={q.id}
                    onClick={() => { setSelectedQuizId(q.id); setView("quiz-detail"); }}
                    className="w-full text-left bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-200 rounded-xl p-3 transition-all flex items-center gap-3 min-h-[56px]"
                  >
                    <div className="w-9 h-9 bg-violet-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Brain size={15} className="text-violet-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-800 truncate font-['Poppins']">{q.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-gray-400">{q.questionsCount}Q · {q.timeLimitMinutes}min</span>
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                          style={{ backgroundColor: diffCfg.bg, color: diffCfg.text }}
                        >
                          {diffCfg.label}
                        </span>
                        {q.markingScheme.hasNegativeMarking && (
                          <span className="text-[10px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded-full">−marking</span>
                        )}
                      </div>
                    </div>
                    <ChevronRight size={13} className="text-gray-400 flex-shrink-0" />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Papers */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#1E3A8A] font-['Poppins'] text-sm">Top Papers</h3>
            <button onClick={() => setView("papers")} className="text-[#1E3A8A] text-xs flex items-center gap-1 hover:underline">
              View all <ChevronRight size={12} />
            </button>
          </div>
          {recentPapers.length === 0 ? (
            <div className="text-center py-6 text-gray-400">
              <BookOpen size={28} className="mx-auto mb-2 opacity-30" />
              <p className="text-xs">No papers for {currentGoal?.shortLabel} yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentPapers.map(p => (
                <button
                  key={p.id}
                  onClick={() => { setSelectedPaperId(p.id); setView("paper-detail"); }}
                  className="w-full text-left bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-200 rounded-xl p-3 transition-all flex items-center gap-3 min-h-[56px]"
                >
                  <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <BookOpen size={15} className="text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate font-['Poppins']">{p.title}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{p.subject} · {p.year} · {p.marks}M · {p.analytics.downloads.toLocaleString()} downloads</p>
                  </div>
                  <ChevronRight size={13} className="text-gray-400 flex-shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Practice Suggestions ── */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Zap size={17} className="text-[#F97316]" />
          <h3 className="font-semibold text-orange-800 font-['Poppins'] text-sm">Practice Suggestions</h3>
        </div>
        <p className="text-xs text-orange-700 mb-3">Based on your goal, prioritise these high-weightage topics:</p>
        <div className="flex flex-wrap gap-2">
          {(cat === "neet"
            ? ["Genetics & Evolution", "Chemical Bonding", "Mechanics", "Plant Physiology", "Human Reproduction"]
            : cat === "jee-mains" || cat === "jee-advanced"
            ? ["Calculus", "Electrostatics", "Organic Chemistry", "Coordinate Geometry", "Thermodynamics"]
            : cat === "mht-cet-pcb" || cat === "mht-cet-pcm"
            ? ["Electromagnetic Induction", "Chemical Equilibrium", "Definite Integration", "Genetics", "Matrices"]
            : ["Trigonometry", "Chemical Reactions", "Statistics", "Geography", "History"]
          ).map(t => (
            <span key={t} className="bg-white text-orange-700 border border-orange-200 text-xs px-3 py-1.5 rounded-full font-medium">
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
