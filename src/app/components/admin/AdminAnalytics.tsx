import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { adminAnalyticsData, papers, quizzes, students } from "../data/mockData";
import { TrendingUp, Users, FileText, Brain, Activity, Download, Eye, Trophy } from "lucide-react";

const COLORS = ["#1E3A8A", "#F97316", "#16A34A", "#7C3AED", "#DC2626"];

const subjectEngagement = [
  { subject: "Maths", views: 420, attempts: 280 },
  { subject: "Physics", views: 310, attempts: 195 },
  { subject: "Chemistry", views: 290, attempts: 175 },
  { subject: "Biology", views: 255, attempts: 160 },
  { subject: "History", views: 180, attempts: 95 },
  { subject: "English", views: 160, attempts: 80 },
];

const mediumData = [
  { name: "English", value: 58 },
  { name: "Semi-English", value: 27 },
  { name: "Marathi", value: 15 },
];

const examDistData = [
  { name: "NEET UG",    value: students.filter(s => s.goalCategories.includes("neet")).length },
  { name: "Board 10th", value: students.filter(s => s.goalCategories.includes("board-10")).length },
  { name: "Board 12th", value: students.filter(s => s.goalCategories.includes("board-12")).length },
  { name: "JEE Mains",  value: students.filter(s => s.goalCategories.includes("jee-mains")).length },
  { name: "MHT-CET",    value: students.filter(s => s.goalCategories.some(g => g.startsWith("mht"))).length },
];

const dailyAttempts = [
  { day: "Mon", attempts: 420 }, { day: "Tue", attempts: 580 },
  { day: "Wed", attempts: 490 }, { day: "Thu", attempts: 720 },
  { day: "Fri", attempts: 680 }, { day: "Sat", attempts: 890 },
  { day: "Sun", attempts: 760 },
];

function StatCard({ icon: Icon, label, value, sub, color, bg }: any) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
        <Icon size={18} className={color} />
      </div>
      <div className="text-2xl mb-0.5" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, color: "#1E3A8A" }}>{value}</div>
      <div className="text-gray-500 text-sm">{label}</div>
      {sub && <div className="text-xs text-green-600 mt-1">{sub}</div>}
    </div>
  );
}

export function AdminAnalytics() {
  const topPapers = [...papers]
    .sort((a, b) => b.analytics.downloads - a.analytics.downloads)
    .slice(0, 5);

  const topQuizzes = [...quizzes]
    .sort((a, b) => b.analytics.totalAttempts - a.analytics.totalAttempts)
    .slice(0, 5);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, color: "#1E3A8A" }}>Analytics</h2>
        <p className="text-gray-500 text-sm">Platform-wide performance metrics</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Students" value={adminAnalyticsData.totalStudents.toLocaleString()} sub="+64 this week" color="text-blue-600" bg="bg-blue-100" />
        <StatCard icon={Activity} label="Total Attempts" value={adminAnalyticsData.totalAttempts.toLocaleString()} sub="+842 today" color="text-green-600" bg="bg-green-100" />
        <StatCard icon={TrendingUp} label="Daily Active" value={adminAnalyticsData.dailyActiveUsers} sub="avg this week" color="text-purple-600" bg="bg-purple-100" />
        <StatCard icon={Trophy} label="Avg Score" value="68%" sub="across all quizzes" color="text-orange-600" bg="bg-orange-100" />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="mb-4" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "#1E3A8A" }}>Student Registrations</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={adminAnalyticsData.registrationTrend}>
              <defs>
                <linearGradient id="regGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1E3A8A" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#1E3A8A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94A3B8" }} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 12 }} />
              <Area type="monotone" dataKey="count" stroke="#1E3A8A" fill="url(#regGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="mb-4" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "#1E3A8A" }}>Daily Quiz Attempts (This Week)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dailyAttempts}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94A3B8" }} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 12 }} />
              <Bar dataKey="attempts" fill="#F97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Subject Engagement */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h3 className="mb-4" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "#1E3A8A" }}>Subject Engagement</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={subjectEngagement} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11, fill: "#94A3B8" }} />
            <YAxis dataKey="subject" type="category" tick={{ fontSize: 11, fill: "#94A3B8" }} width={60} />
            <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 12 }} />
            <Bar dataKey="views" name="Views" fill="#1E3A8A" radius={[0, 4, 4, 0]} />
            <Bar dataKey="attempts" name="Attempts" fill="#F97316" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="mb-4" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "#1E3A8A" }}>Medium Distribution</h3>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-full sm:w-[140px] flex-shrink-0" style={{ height: 140 }}>
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie data={mediumData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                    {mediumData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 w-full space-y-2">
              {mediumData.map((d, i) => (
                <div key={d.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                    <span className="text-xs text-gray-600">{d.name}</span>
                  </div>
                  <span className="text-xs font-semibold text-gray-700">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="mb-4" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "#1E3A8A" }}>Goal Distribution</h3>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-full sm:w-[140px] flex-shrink-0" style={{ height: 140 }}>
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie data={examDistData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                    {examDistData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 w-full space-y-3">
              {examDistData.map((d, i) => (
                <div key={d.name}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="text-xs text-gray-600">{d.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-700">{d.value}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full">
                    <div className="h-full rounded-full" style={{ width: `${students.length > 0 ? (d.value / students.length) * 100 : 0}%`, backgroundColor: COLORS[i % COLORS.length] }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="mb-4" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "#1E3A8A" }}>Most Downloaded Papers</h3>
          <div className="space-y-3">
            {topPapers.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-700 text-xs flex items-center justify-center flex-shrink-0 font-bold">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 truncate">{p.title}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                    <Eye size={10} /> {p.analytics.views}
                    <Download size={10} className="ml-1" /> {p.analytics.downloads}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="mb-4" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "#1E3A8A" }}>Most Attempted Quizzes</h3>
          <div className="space-y-3">
            {topQuizzes.map((q, i) => (
              <div key={q.id}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-orange-50 text-orange-600 text-xs flex items-center justify-center flex-shrink-0 font-bold">{i + 1}</span>
                    <p className="text-sm text-gray-700 truncate flex-1">{q.title}</p>
                  </div>
                  <span className="text-xs text-gray-500 flex-shrink-0">{q.analytics.totalAttempts.toLocaleString()}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden ml-8">
                  <div className="h-full bg-[#F97316] rounded-full" style={{ width: `${(q.analytics.totalAttempts / (topQuizzes[0]?.analytics.totalAttempts || 1)) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
