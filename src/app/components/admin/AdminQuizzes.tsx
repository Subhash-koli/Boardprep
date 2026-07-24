﻿import { useState } from "react";
import { Plus, Search, Edit2, Trash2, Eye, X, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import { quizzes as initialQuizzes, subjects } from "../data/mockData";
import type { Quiz, Question } from "../data/mockData";

export function AdminQuizzes() {
  const [quizList, setQuizList] = useState(initialQuizzes);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Quiz | null>(null);
  const [saved, setSaved] = useState(false);
  const [expandedQuiz, setExpandedQuiz] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "", goalCategory: "board-10" as string, subjectId: "", chapter: "",
    difficulty: "medium" as "easy" | "medium" | "hard", timeLimitMinutes: 15,
    totalMarks: 10, instructions: "Read each question carefully before answering.", status: "draft" as any,
  });
  const [questions, setQuestions] = useState<Partial<Question>[]>([
    { text: "", optionA: "", optionB: "", optionC: "", optionD: "", correctOption: "A", explanation: "", marks: 1 }
  ]);

  const filtered = quizList.filter(q =>
    q.title.toLowerCase().includes(search.toLowerCase()) || q.subject.toLowerCase().includes(search.toLowerCase())
  );

  const addQuestion = () => {
    setQuestions(prev => [...prev, { text: "", optionA: "", optionB: "", optionC: "", optionD: "", correctOption: "A", explanation: "", marks: 1 }]);
  };

  const removeQuestion = (i: number) => {
    setQuestions(prev => prev.filter((_, idx) => idx !== i));
  };

  const updateQuestion = (i: number, key: string, value: any) => {
    setQuestions(prev => prev.map((q, idx) => idx === i ? { ...q, [key]: value } : q));
  };

  const handleSave = () => {
    const subject = subjects.find(s => s.id === formData.subjectId);
    if (!formData.title || !formData.subjectId) return;
    const finalQuestions: Question[] = questions.map((q, i) => ({
      id: `q_${Date.now()}_${i}`,
      text: q.text || "",
      optionA: q.optionA || "",
      optionB: q.optionB || "",
      optionC: q.optionC || "",
      optionD: q.optionD || "",
      correctOption: (q.correctOption || "A") as "A" | "B" | "C" | "D",
      explanation: q.explanation || "",
      marks: q.marks || 1,
    }));

    if (editing) {
      setQuizList(prev => prev.map(q => q.id === editing.id ? { ...q, ...formData, subject: subject?.name || q.subject, questions: finalQuestions, questionsCount: finalQuestions.length } : q));
    } else {
      const newQuiz: Quiz = {
        id: `qz_${Date.now()}`, ...formData, subject: subject?.name || "",
        questionsCount: finalQuestions.length, questions: finalQuestions,
        analytics: { totalAttempts: 0, avgScore: 0 }, createdAt: new Date().toISOString().split("T")[0],
      };
      setQuizList(prev => [newQuiz, ...prev]);
    }
    setSaved(true);
    setTimeout(() => { setSaved(false); setShowForm(false); setEditing(null); }, 1500);
  };

  const handleEdit = (quiz: Quiz) => {
    setEditing(quiz);
    setFormData({ title: quiz.title, goalCategory: quiz.goalCategory ?? "board-10", subjectId: quiz.subjectId, chapter: quiz.chapter, difficulty: quiz.difficulty, timeLimitMinutes: quiz.timeLimitMinutes, totalMarks: quiz.totalMarks, instructions: quiz.instructions, status: quiz.status });
    setQuestions(quiz.questions.map(q => ({ ...q })));
    setShowForm(true);
  };

  const diffColor: Record<string, string> = {
    easy: "bg-green-100 text-green-700",
    medium: "bg-orange-100 text-orange-700",
    hard: "bg-red-100 text-red-700",
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, color: "#1E3A8A" }}>MCQ Quizzes</h2>
          <p className="text-gray-500 text-sm">{quizList.length} quizzes total</p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setFormData({ title: "", standard: "10", subjectId: "", chapter: "", difficulty: "medium", timeLimitMinutes: 15, totalMarks: 10, instructions: "Read each question carefully before answering.", status: "draft" });
            setQuestions([{ text: "", optionA: "", optionB: "", optionC: "", optionD: "", correctOption: "A", explanation: "", marks: 1 }]);
            setShowForm(true);
          }}
          className="bg-[#1E3A8A] hover:bg-blue-900 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-colors"
        >
          <Plus size={16} /> Create Quiz
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="rounded-2xl p-6 mb-5" style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.9)", boxShadow: "0 2px 12px rgba(30,58,138,0.06)" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "#1E3A8A" }}>{editing ? "Edit Quiz" : "Create New Quiz"}</h3>
            <button onClick={() => setShowForm(false)}><X size={18} className="text-gray-400" /></button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div className="sm:col-span-2">
              <label className="text-xs text-gray-500 mb-1 block">Quiz Title *</label>
              <input value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Mathematics - Quadratic Equations Quiz" className="w-full border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#1E3A8A] bg-gray-50" />
            </div>
            {[
              { label: "Exam Goal", key: "goalCategory", opts: [
                  { value: "board-10", label: "SSC (10th)" },
                  { value: "board-12", label: "HSC (12th)" },
                  { value: "neet",     label: "NEET UG" },
                  { value: "jee-mains",label: "JEE Mains" },
                  { value: "mht-cet-pcb", label: "MHT-CET PCB" },
                ] },
              { label: "Difficulty", key: "difficulty", opts: [{ value: "easy", label: "Easy" }, { value: "medium", label: "Medium" }, { value: "hard", label: "Hard" }] },
              { label: "Time Limit (min)", key: "timeLimitMinutes", type: "number" },
              { label: "Total Marks", key: "totalMarks", type: "number" },
              { label: "Status", key: "status", opts: [{ value: "draft", label: "Draft" }, { value: "published", label: "Published" }, { value: "scheduled", label: "Scheduled" }] },
            ].map(f => (
              <div key={f.key}>
                <label className="text-xs text-gray-500 mb-1 block">{f.label}</label>
                {f.opts ? (
                  <select value={(formData as any)[f.key]} onChange={e => setFormData(p => ({ ...p, [f.key]: f.type === "number" ? Number(e.target.value) : e.target.value }))} className="w-full border border-gray-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-[#1E3A8A] bg-gray-50">
                    {f.opts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                ) : (
                  <input type="number" value={(formData as any)[f.key]} onChange={e => setFormData(p => ({ ...p, [f.key]: Number(e.target.value) }))} className="w-full border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#1E3A8A] bg-gray-50" />
                )}
              </div>
            ))}
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Subject *</label>
              <select value={formData.subjectId} onChange={e => setFormData(p => ({ ...p, subjectId: e.target.value }))} className="w-full border border-gray-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-[#1E3A8A] bg-gray-50">
                <option value="">Select Subject</option>
                {subjects.filter(s => s.goalCategory === formData.goalCategory).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Chapter</label>
              <input value={formData.chapter} onChange={e => setFormData(p => ({ ...p, chapter: e.target.value }))} placeholder="e.g. Chapter 3 - Arithmetic Progression" className="w-full border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#1E3A8A] bg-gray-50" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs text-gray-500 mb-1 block">Instructions</label>
              <textarea value={formData.instructions} onChange={e => setFormData(p => ({ ...p, instructions: e.target.value }))} rows={2} className="w-full border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#1E3A8A] bg-gray-50 resize-none" />
            </div>
          </div>

          {/* Questions Builder */}
          <div className="border-t border-gray-100 pt-5">
            <div className="flex items-center justify-between mb-3">
              <h4 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "#1E3A8A" }}>Questions ({questions.length})</h4>
              <button onClick={addQuestion} className="text-xs bg-blue-50 text-[#1E3A8A] px-3 py-1.5 rounded-lg hover:bg-blue-100 flex items-center gap-1">
                <Plus size={12} /> Add Question
              </button>
            </div>
            <div className="space-y-4">
              {questions.slice(0, 5).map((q, i) => (
                <div key={i} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-gray-500" style={{ fontFamily: "Poppins, sans-serif" }}>Question {i + 1}</span>
                    {questions.length > 1 && (
                      <button onClick={() => removeQuestion(i)} className="text-red-400 hover:text-red-600"><X size={14} /></button>
                    )}
                  </div>
                  <textarea value={q.text} onChange={e => updateQuestion(i, "text", e.target.value)} placeholder="Enter question text..." rows={2} className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm mb-3 focus:outline-none focus:border-[#1E3A8A] bg-gray-50 resize-none" />
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {(["A", "B", "C", "D"] as const).map(opt => (
                      <div key={opt} className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded bg-gray-100 flex items-center justify-center text-xs flex-shrink-0" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>{opt}</span>
                        <input
                          value={(q as any)[`option${opt}`]}
                          onChange={e => updateQuestion(i, `option${opt}`, e.target.value)}
                          placeholder={`Option ${opt}`}
                          className="flex-1 border border-gray-200 rounded-lg py-1.5 px-2 text-xs focus:outline-none focus:border-[#1E3A8A] bg-gray-50"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="text-xs text-gray-500 mb-1 block">Correct Answer</label>
                      <select value={q.correctOption} onChange={e => updateQuestion(i, "correctOption", e.target.value)} className="w-full border border-gray-200 rounded-lg py-1.5 px-2 text-xs focus:outline-none focus:border-[#1E3A8A] bg-gray-50">
                        {["A", "B", "C", "D"].map(o => <option key={o} value={o}>Option {o}</option>)}
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-gray-500 mb-1 block">Marks</label>
                      <input type="number" value={q.marks} onChange={e => updateQuestion(i, "marks", Number(e.target.value))} className="w-full border border-gray-200 rounded-lg py-1.5 px-2 text-xs focus:outline-none focus:border-[#1E3A8A] bg-gray-50" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <label className="text-xs text-gray-500 mb-1 block">Explanation (optional)</label>
                    <input value={q.explanation} onChange={e => updateQuestion(i, "explanation", e.target.value)} placeholder="Explanation for the correct answer..." className="w-full border border-gray-200 rounded-lg py-1.5 px-3 text-xs focus:outline-none focus:border-[#1E3A8A] bg-gray-50" />
                  </div>
                </div>
              ))}
              {questions.length > 5 && <p className="text-xs text-gray-400 text-center">Showing first 5 of {questions.length} questions</p>}
            </div>
          </div>

          <div className="flex gap-3 mt-5">
            <button onClick={handleSave} className="flex-1 bg-[#1E3A8A] hover:bg-blue-900 text-white py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors">
              {saved ? <><CheckCircle size={15} /> Saved!</> : editing ? "Update Quiz" : "Create Quiz"}
            </button>
            <button onClick={() => setShowForm(false)} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-500 hover:bg-gray-50">Cancel</button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-4">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Search quizzes..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1E3A8A] bg-white" />
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.9)", boxShadow: "0 2px 12px rgba(30,58,138,0.06)" }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs text-gray-500" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>Title</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 hidden sm:table-cell" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>Subject</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 hidden md:table-cell" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>Difficulty</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 hidden md:table-cell" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>Qs</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>Status</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 hidden lg:table-cell" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>Attempts</th>
                <th className="text-right px-4 py-3 text-xs text-gray-500" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(quiz => (
                <tr key={quiz.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 max-w-[160px] sm:max-w-none">
                    <p className="text-sm font-medium text-gray-800 truncate">{quiz.title}</p>
                    <p className="text-xs text-gray-400 truncate sm:hidden">{quiz.subject}</p>
                    <div className="flex items-center gap-1.5 mt-0.5 sm:hidden">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full capitalize ${diffColor[quiz.difficulty]}`}>{quiz.difficulty}</span>
                      <span className="text-[10px] text-gray-400">{quiz.questionsCount} Qs</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell text-sm text-gray-600">{quiz.subject}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${diffColor[quiz.difficulty]}`}>{quiz.difficulty}</span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-sm text-gray-600">{quiz.questionsCount}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${quiz.status === "published" ? "bg-green-100 text-green-700" : quiz.status === "scheduled" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"}`}>{quiz.status}</span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-sm text-gray-600">{quiz.analytics.totalAttempts.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => handleEdit(quiz)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 size={13} /></button>
                      <button onClick={() => setQuizList(prev => prev.filter(q => q.id !== quiz.id))} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-10 text-center text-gray-400 text-sm">No quizzes found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
