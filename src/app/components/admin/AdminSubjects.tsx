import { useState } from "react";
import {
  Plus, Edit2, Trash2, X, CheckCircle, ChevronDown, ChevronRight, BookOpen, Layers,
  Calculator, FlaskConical, Atom, Dna, Microscope, Map, Landmark, TrendingUp,
  BarChart2, BookText, Globe, BookMarked, Sigma, type LucideIcon,
} from "lucide-react";
import { SubjectIcon } from "../shared/GoalIcons";
import { subjects as initialSubjects, chapters as initialChapters } from "../data/mockData";
import type { Subject, Chapter } from "../data/mockData";

export function AdminSubjects() {
  const [subjectList, setSubjectList] = useState(initialSubjects);
  const [chapterList, setChapterList] = useState(initialChapters);
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  const [activeGoalCategory, setActiveGoalCategory] = useState<string>("board-10");

  const [showSubjectForm, setShowSubjectForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [subjectForm, setSubjectForm] = useState({ name: "", goalCategory: "board-10", color: "#1E3A8A", icon: "book" });
  const [subjectSaved, setSubjectSaved] = useState(false);

  const [showChapterForm, setShowChapterForm] = useState<string | null>(null);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [chapterForm, setChapterForm] = useState({ name: "", chapterNumber: 1, subjectId: "" });
  const [chapterSaved, setChapterSaved] = useState(false);

  const filteredSubjects = subjectList.filter(s => s.goalCategory === activeGoalCategory);

  const handleSaveSubject = () => {
    if (!subjectForm.name) return;
    if (editingSubject) {
      setSubjectList(prev => prev.map(s => s.id === editingSubject.id ? { ...s, ...subjectForm } : s));
    } else {
      const newSubject: Subject = {
        id: `sub_${Date.now()}`, ...subjectForm,
        totalChapters: 0, totalPapers: 0, totalQuizzes: 0,
      };
      setSubjectList(prev => [...prev, newSubject]);
    }
    setSubjectSaved(true);
    setTimeout(() => { setSubjectSaved(false); setShowSubjectForm(false); setEditingSubject(null); }, 1500);
  };

  const handleDeleteSubject = (id: string) => {
    setSubjectList(prev => prev.filter(s => s.id !== id));
    setChapterList(prev => prev.filter(c => c.subjectId !== id));
  };

  const handleSaveChapter = () => {
    if (!chapterForm.name || !chapterForm.subjectId) return;
    if (editingChapter) {
      setChapterList(prev => prev.map(c => c.id === editingChapter.id ? { ...c, ...chapterForm } : c));
    } else {
      const newChapter: Chapter = {
        id: `ch_${Date.now()}`, ...chapterForm,
        totalQuestions: 0,
      };
      setChapterList(prev => [...prev, newChapter]);
    }
    setChapterSaved(true);
    setTimeout(() => { setChapterSaved(false); setShowChapterForm(null); setEditingChapter(null); }, 1500);
  };

  const handleDeleteChapter = (id: string) => {
    setChapterList(prev => prev.filter(c => c.id !== id));
  };

  const openEditSubject = (sub: Subject) => {
    setEditingSubject(sub);
    setSubjectForm({ name: sub.name, goalCategory: sub.goalCategory ?? activeGoalCategory, color: sub.color || "#1E3A8A", icon: sub.icon || "book" });
    setShowSubjectForm(true);
  };

  const openAddChapter = (subjectId: string) => {
    setEditingChapter(null);
    const existing = chapterList.filter(c => c.subjectId === subjectId);
    setChapterForm({ name: "", chapterNumber: existing.length + 1, subjectId });
    setShowChapterForm(subjectId);
  };

  const openEditChapter = (ch: Chapter) => {
    setEditingChapter(ch);
    setChapterForm({ name: ch.name, chapterNumber: ch.chapterNumber, subjectId: ch.subjectId });
    setShowChapterForm(ch.subjectId);
  };

  const ICON_OPTIONS: { key: string; Icon: LucideIcon }[] = [
    { key: "calculator",  Icon: Calculator },
    { key: "flask",       Icon: FlaskConical },
    { key: "atom",        Icon: Atom },
    { key: "dna",         Icon: Dna },
    { key: "microscope",  Icon: Microscope },
    { key: "book",        Icon: BookOpen },
    { key: "booktext",    Icon: BookText },
    { key: "bookmarked",  Icon: BookMarked },
    { key: "map",         Icon: Map },
    { key: "landmark",    Icon: Landmark },
    { key: "trending",    Icon: TrendingUp },
    { key: "barchart",    Icon: BarChart2 },
    { key: "globe",       Icon: Globe },
    { key: "sigma",       Icon: Sigma },
  ];
  const colors = ["#1E3A8A", "#7C3AED", "#059669", "#DC2626", "#D97706", "#0284C7", "#DB2777", "#65A30D"];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, color: "#1E3A8A" }}>Subjects & Chapters</h2>
          <p className="text-gray-500 text-sm">{subjectList.length} subjects · {chapterList.length} chapters</p>
        </div>
        <button
          onClick={() => { setEditingSubject(null); setSubjectForm({ name: "", goalCategory: activeGoalCategory, color: "#1E3A8A", icon: "book" }); setShowSubjectForm(true); }}
          className="bg-[#1E3A8A] hover:bg-blue-900 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-colors"
        >
          <Plus size={16} /> Add Subject
        </button>
      </div>

      {/* Subject Form */}
      {showSubjectForm && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "#1E3A8A" }}>
              {editingSubject ? "Edit Subject" : "Add New Subject"}
            </h3>
            <button onClick={() => setShowSubjectForm(false)} className="text-gray-400"><X size={18} /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs text-gray-500 mb-1 block">Subject Name *</label>
              <input
                value={subjectForm.name}
                onChange={e => setSubjectForm(p => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Mathematics"
                className="w-full border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#1E3A8A] bg-gray-50"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Exam Goal</label>
              <select value={subjectForm.goalCategory} onChange={e => setSubjectForm(p => ({ ...p, goalCategory: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-[#1E3A8A] bg-gray-50">
                <option value="board-10">SSC (10th)</option>
                <option value="board-11">Class 11</option>
                <option value="board-12">HSC (12th)</option>
                <option value="neet">NEET UG</option>
                <option value="jee-mains">JEE Mains</option>
                <option value="jee-advanced">JEE Advanced</option>
                <option value="mht-cet-pcb">MHT-CET PCB</option>
                <option value="mht-cet-pcm">MHT-CET PCM</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Icon</label>
              <div className="flex flex-wrap gap-2">
                {ICON_OPTIONS.map(({ key, Icon }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSubjectForm(p => ({ ...p, icon: key }))}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                      subjectForm.icon === key
                        ? "ring-2 ring-[#1E3A8A] bg-blue-50 text-[#1E3A8A]"
                        : "bg-gray-50 hover:bg-gray-100 text-gray-500"
                    }`}
                  >
                    <Icon size={16} />
                  </button>
                ))}
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs text-gray-500 mb-1 block">Color</label>
              <div className="flex flex-wrap gap-2">
                {colors.map(c => (
                  <button key={c} onClick={() => setSubjectForm(p => ({ ...p, color: c }))}
                    className={`w-8 h-8 rounded-full transition-all ${subjectForm.color === c ? "ring-2 ring-offset-2 ring-gray-400 scale-110" : ""}`}
                    style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleSaveSubject} className="flex-1 bg-[#1E3A8A] hover:bg-blue-900 text-white py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
              {subjectSaved ? <><CheckCircle size={15} /> Saved!</> : editingSubject ? "Update Subject" : "Add Subject"}
            </button>
            <button onClick={() => setShowSubjectForm(false)} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-500 hover:bg-gray-50">Cancel</button>
          </div>
        </div>
      )}

      {/* Goal Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {([
          { id: "board-10", label: "SSC (10th)" },
          { id: "board-12", label: "HSC (12th)" },
          { id: "neet",     label: "NEET UG" },
          { id: "jee-mains",label: "JEE Mains" },
        ]).map(cat => (
          <button key={cat.id} onClick={() => setActiveGoalCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer select-none
              ${activeGoalCategory === cat.id
                ? "bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white shadow-[0_4px_14px_rgba(30,58,138,0.4)] scale-105"
                : "bg-white border border-gray-200 text-gray-600 hover:border-[#1E3A8A] hover:text-[#1E3A8A] hover:shadow-md hover:scale-105 active:scale-95"
              }`}>
            {cat.label} ({subjectList.filter(s => s.goalCategory === cat.id).length})
          </button>
        ))}

      </div>

      {/* Subject + Chapter List */}
      <div className="space-y-3">
        {filteredSubjects.map(sub => {
          const subChapters = chapterList.filter(c => c.subjectId === sub.id).sort((a, b) => a.chapterNumber - b.chapterNumber);
          const isExpanded = expandedSubject === sub.id;
          return (
            <div key={sub.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 p-4">
                <button onClick={() => setExpandedSubject(isExpanded ? null : sub.id)} className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${sub.color}20` }}
                  >
                    <SubjectIcon name={sub.name} size={18} style={{ color: sub.color }} />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-800" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>{sub.name}</span>
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{subChapters.length} chapters</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-400">
                      <span>{sub.totalPapers} papers</span>
                      <span>·</span>
                      <span>{sub.totalQuizzes} quizzes</span>
                    </div>
                  </div>
                  {isExpanded ? <ChevronDown size={16} className="text-gray-400 flex-shrink-0" /> : <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />}
                </button>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => openEditSubject(sub)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 size={14} /></button>
                  <button onClick={() => handleDeleteSubject(sub.id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-gray-50 px-4 pb-4 pt-3">
                  {/* Chapter Form */}
                  {showChapterForm === sub.id && (
                    <div className="bg-gray-50 rounded-xl p-4 mb-3">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-700" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500 }}>
                          {editingChapter ? "Edit Chapter" : "Add Chapter"}
                        </span>
                        <button onClick={() => { setShowChapterForm(null); setEditingChapter(null); }} className="text-gray-400"><X size={14} /></button>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={chapterForm.chapterNumber}
                          onChange={e => setChapterForm(p => ({ ...p, chapterNumber: Number(e.target.value) }))}
                          className="w-16 border border-gray-200 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-[#1E3A8A] bg-white"
                          placeholder="No."
                        />
                        <input
                          value={chapterForm.name}
                          onChange={e => setChapterForm(p => ({ ...p, name: e.target.value }))}
                          placeholder="Chapter name..."
                          className="flex-1 border border-gray-200 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-[#1E3A8A] bg-white"
                        />
                        <button onClick={handleSaveChapter} className="bg-[#1E3A8A] text-white px-3 py-2 rounded-xl text-sm flex items-center gap-1">
                          {chapterSaved ? <CheckCircle size={14} /> : editingChapter ? "Update" : "Add"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Chapter List */}
                  {subChapters.length > 0 ? (
                    <div className="space-y-1.5">
                      {subChapters.map(ch => (
                        <div key={ch.id} className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-3 min-w-0 flex-1 mr-2">
                            <span className="w-6 h-6 rounded-lg bg-gray-100 text-xs text-gray-500 flex items-center justify-center flex-shrink-0">{ch.chapterNumber}</span>
                            <span className="text-sm text-gray-700 truncate min-w-0">{ch.name}</span>
                            <span className="text-xs text-gray-400 flex-shrink-0">{ch.totalQuestions} Qs</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button onClick={() => openEditChapter(ch)} className="p-1 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 size={12} /></button>
                            <button onClick={() => handleDeleteChapter(ch.id)} className="p-1 text-red-400 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={12} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 text-center py-3">No chapters added yet</p>
                  )}

                  {showChapterForm !== sub.id && (
                    <button
                      onClick={() => openAddChapter(sub.id)}
                      className="mt-3 w-full border border-dashed border-gray-200 text-gray-400 hover:border-[#1E3A8A] hover:text-[#1E3A8A] py-2 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Plus size={13} /> Add Chapter
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {filteredSubjects.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
            <BookOpen size={32} className="mx-auto text-gray-200 mb-3" />
            <p className="text-gray-400 text-sm">No subjects for {activeStandard}th standard. Add one above.</p>
          </div>
        )}
      </div>
    </div>
  );
}
