import { useState } from "react";
import { Search, Shield, ShieldOff, Eye, X, Mail, BookOpen, Brain, Trophy, Calendar } from "lucide-react";
import { students } from "../data/mockData";
import type { Student } from "../data/mockData";

export function AdminUsers() {
  const [studentList, setStudentList] = useState(students);
  const [search, setSearch] = useState("");
  const [filterGoal, setFilterGoal] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const filtered = studentList.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase());
    const matchGoal = filterGoal === "all" || s.goalCategories.includes(filterGoal as any);
    const matchStatus = filterStatus === "all" || (filterStatus === "blocked" ? s.isBlocked : !s.isBlocked);
    return matchSearch && matchGoal && matchStatus;
  });

  const toggleBlock = (id: string) => {
    setStudentList(prev => prev.map(s => s.id === id ? { ...s, isBlocked: !s.isBlocked } : s));
    if (selectedStudent?.id === id) setSelectedStudent(prev => prev ? { ...prev, isBlocked: !prev.isBlocked } : null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-[60] bg-black/40 flex items-end sm:items-center justify-center sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-xl w-full sm:max-w-lg max-h-[92vh] sm:max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="flex justify-center pt-3 pb-1 sm:hidden">
              <div className="w-10 h-1 bg-gray-200 rounded-full" />
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "#1E3A8A" }}>Student Profile</h3>
                <button onClick={() => setSelectedStudent(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
              </div>

              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 bg-[#1E3A8A] rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                  {selectedStudent.name[0]}
                </div>
                <div>
                  <h4 className="text-gray-800" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>{selectedStudent.name}</h4>
                  <div className="flex items-center gap-1 text-gray-400 text-sm mt-0.5">
                    <Mail size={12} /> {selectedStudent.email}
                  </div>
                  <span className={`mt-1 inline-block text-xs px-2 py-0.5 rounded-full ${selectedStudent.isBlocked ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
                    {selectedStudent.isBlocked ? "Blocked" : "Active"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  { icon: BookOpen, label: "Primary Goal", value: selectedStudent.goalLabels[0] ?? "—" },
                  { icon: Brain, label: "Medium", value: selectedStudent.medium },
                  { icon: Trophy, label: "Total Attempts", value: selectedStudent.totalAttempts },
                  { icon: Calendar, label: "Streak", value: `${selectedStudent.streak} days` },
                ].map(item => (
                  <div key={item.label} className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
                    <item.icon size={16} className="text-[#1E3A8A] flex-shrink-0" />
                    <div>
                      <div className="text-xs text-gray-400">{item.label}</div>
                      <div className="text-sm text-gray-700 capitalize">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mb-5">
                <div className="text-xs text-gray-500 mb-2">Avg Score</div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#1E3A8A] rounded-full" style={{ width: `${selectedStudent.avgScore}%` }} />
                  </div>
                  <span className="text-sm font-semibold text-[#1E3A8A]">{selectedStudent.avgScore}%</span>
                </div>
              </div>

              <div className="mb-5">
                <div className="text-xs text-gray-500 mb-2">Exam Goals</div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedStudent.goalLabels.map(label => (
                    <span key={label} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-lg">{label}</span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => toggleBlock(selectedStudent.id)}
                className={`w-full py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors ${selectedStudent.isBlocked ? "bg-green-600 hover:bg-green-700 text-white" : "bg-red-500 hover:bg-red-600 text-white"}`}
              >
                {selectedStudent.isBlocked ? <><Shield size={15} /> Unblock Student</> : <><ShieldOff size={15} /> Block Student</>}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, color: "#1E3A8A" }}>Students</h2>
          <p className="text-gray-500 text-sm">{studentList.length} registered students</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-full">{studentList.filter(s => !s.isBlocked).length} Active</span>
          <span className="text-xs bg-red-100 text-red-600 px-3 py-1.5 rounded-full">{studentList.filter(s => s.isBlocked).length} Blocked</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1E3A8A] bg-white"
          />
        </div>
        <select
          value={filterGoal}
          onChange={e => setFilterGoal(e.target.value)}
          className="border border-gray-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-[#1E3A8A] bg-white"
        >
          <option value="all">All Exam Goals</option>
          <option value="neet">NEET UG</option>
          <option value="jee-mains">JEE Mains</option>
          <option value="jee-advanced">JEE Advanced</option>
          <option value="board-10">SSC Class 10</option>
          <option value="board-12">HSC Class 12</option>
          <option value="mht-cet-pcb">MHT-CET PCB</option>
          <option value="mht-cet-pcm">MHT-CET PCM</option>
        </select>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="border border-gray-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-[#1E3A8A] bg-white"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs text-gray-500" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>Student</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 hidden sm:table-cell" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>Goal</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 hidden md:table-cell" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>Attempts</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 hidden md:table-cell" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>Avg Score</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>Status</th>
                <th className="text-right px-4 py-3 text-xs text-gray-500" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(student => (
                <tr key={student.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#1E3A8A] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {student.name[0]}
                      </div>
                      <div>
                        <p className="text-sm text-gray-800">{student.name}</p>
                        <p className="text-xs text-gray-400">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell text-sm text-gray-600">{student.goalLabels[0] ?? "—"}</td>
                  <td className="px-4 py-3 hidden md:table-cell text-sm text-gray-600">{student.totalAttempts}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#1E3A8A] rounded-full" style={{ width: `${student.avgScore}%` }} />
                      </div>
                      <span className="text-xs text-gray-500">{student.avgScore}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${student.isBlocked ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
                      {student.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setSelectedStudent(student)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="View details">
                        <Eye size={14} />
                      </button>
                      <button onClick={() => toggleBlock(student.id)} className={`p-1.5 rounded-lg transition-colors ${student.isBlocked ? "text-green-600 hover:bg-green-50" : "text-red-400 hover:bg-red-50"}`} title={student.isBlocked ? "Unblock" : "Block"}>
                        {student.isBlocked ? <Shield size={14} /> : <ShieldOff size={14} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-400 text-sm">No students found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
