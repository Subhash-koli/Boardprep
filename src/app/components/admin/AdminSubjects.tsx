import { useState } from "react";
import { Plus, Edit2, Trash2, X, CheckCircle, ChevronDown, ChevronRight, BookOpen, Layers } from "lucide-react";
import { subjects as initialSubjects, chapters as initialChapters } from "../data/mockData";
import type { Subject, Chapter } from "../data/mockData";

export function AdminSubjects() {
  const [subjectList, setSubjectList] = useState(initialSubjects);
  const [chapterList, setChapterList] = useState(initialChapters);
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  const [activeStandard, setActiveStandard] = useState<"10" | "12">("10");

  const [showSubjectForm, setShowSubjectForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [subjectForm, setSubjectForm] = useState({ name: "", standard: "10" as "10" | "12", color: "#1E3A8A", icon: "📚" });
  const [subjectSaved, setSubjectSaved] = useState(false);

  const [showChapterForm, setShowChapterForm] = useState<string | null>(null);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [chapterForm, setChapterForm] = useState({ name: "", chapterNumber: 1, subjectId: "" });
  const [chapterSaved, setChapterSaved] = useState(false);

  const filteredSubjects = subjectList.filter(s => s.standard === activeStandard);

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
    setSubjectForm({ name: sub.name, standard: sub.standard, color: sub.color || "#1E3A8A", icon: sub.icon || "📚" });
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

  const icons = ["📚", "🔢", "⚗️", "🧬", "🌍", "📖", "🎭", "🧮", "💻", "🎨"];
  const colors = ["#1E3A8A", "#7C3AED", "#059669", "#DC2626", "#D97706", "#0284C7", "#DB2777", "#65A30D"];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, color: "#1E3A8A" }}>Subjects & Chapters</h2>
          <p className="text-gray-500 text-sm">{subjectList.length} subjects · {chapterList.length} chapters</p>
        </div>
        <button
          onClick={() => { setEditingSubject(null); setSubjectForm({ name: "", standard: activeStandard, color: "#1E3A8A", icon: "📚" }); setShowSubjectForm(true); }}
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
              <label className="text-xs text-gray-500 mb-1 block">Standard</label>
              <select value={subjectForm.standard} onChange={e => setSubjectForm(p => ({ ...p, standard: e.target.value as any }))}
                className="w-full border border-gray-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-[#1E3A8A] bg-gray-50">
                <option value="10">10th (SSC)</option>
                <option value="12">12th (HSC)</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Icon</label>
              <div className="flex flex-wrap gap-2">
                {icons.map(ic => (
                  <button key={ic} onClick={() => setSubjectForm(p => ({ ...p, icon: ic }))}
                    className={`w-9 h-9 rounded-lg text-base flex items-center justify-center transition-all ${subjectForm.icon === ic ? "ring-2 ring-[#1E3A8A] bg-blue-50" : "bg-gray-50 hover:bg-gray-100"}`}>
                    {ic}
                  </button>
                ))}
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs text-gray-500 mb-1 block">Color</label>
              <div className="flex gap-2">
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

      {/* Standard Tabs */}
      <div className="flex gap-2 mb-4">
        {(["10", "12"] as const).map(std => (
          <button key={std} onClick={() => setActiveStandard(std)}
            className={`px-5 py-2 rounded-xl text-sm transition-colors ${activeStandard === std ? "bg-[#1E3A8A] text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
            {std}th Standard ({subjectList.filter(s => s.standard === std).length} subjects)
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
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0" style={{ backgroundColor: `${sub.color}15` }}>
                    {sub.icon || "📚"}
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
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-lg bg-gray-100 text-xs text-gray-500 flex items-center justify-center flex-shrink-0">{ch.chapterNumber}</span>
                            <span className="text-sm text-gray-700">{ch.name}</span>
                            <span className="text-xs text-gray-400">{ch.totalQuestions} Qs</span>
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
