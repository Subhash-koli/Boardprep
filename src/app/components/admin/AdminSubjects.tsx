import { useEffect, useMemo, useState } from "react";
import {
  Plus, Edit2, Trash2, X, ChevronDown, ChevronRight, BookOpen, Loader2,
  Calculator, FlaskConical, Atom, Dna, Microscope, Map, Landmark, TrendingUp,
  BarChart2, BookText, Globe, BookMarked, Sigma, type LucideIcon,
} from "lucide-react";
import { SubjectIcon } from "../shared/GoalIcons";
import {
  createAdminChapter,
  createAdminSubject,
  deleteAdminChapter,
  deleteAdminSubject,
  fetchAdminSubjects,
  updateAdminChapter,
  updateAdminSubject,
  type AdminChapter,
  type AdminSubject,
} from "../../lib/api";

const GOAL_OPTIONS = [
  { id: "board-10", label: "SSC (10th)" },
  { id: "board-12", label: "HSC (12th)" },
  { id: "board-8", label: "Class 8" },
  { id: "board-9", label: "Class 9" },
  { id: "board-11", label: "Class 11" },
  { id: "neet", label: "NEET UG" },
  { id: "jee-mains", label: "JEE Mains" },
  { id: "mht-cet-pcb", label: "MHT-CET PCB" },
  { id: "mht-cet-pcm", label: "MHT-CET PCM" },
];

const ICON_OPTIONS: { key: string; Icon: LucideIcon }[] = [
  { key: "calculator", Icon: Calculator },
  { key: "flask", Icon: FlaskConical },
  { key: "atom", Icon: Atom },
  { key: "dna", Icon: Dna },
  { key: "microscope", Icon: Microscope },
  { key: "book", Icon: BookOpen },
  { key: "booktext", Icon: BookText },
  { key: "bookmarked", Icon: BookMarked },
  { key: "map", Icon: Map },
  { key: "landmark", Icon: Landmark },
  { key: "trending", Icon: TrendingUp },
  { key: "barchart", Icon: BarChart2 },
  { key: "globe", Icon: Globe },
  { key: "sigma", Icon: Sigma },
];

const COLORS = ["#1E3A8A", "#7C3AED", "#059669", "#DC2626", "#D97706", "#0284C7", "#DB2777", "#65A30D"];

export function AdminSubjects() {
  const [subjectList, setSubjectList] = useState<AdminSubject[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  const [activeGoalCategory, setActiveGoalCategory] = useState("board-10");
  const [listError, setListError] = useState("");

  const [showSubjectForm, setShowSubjectForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState<AdminSubject | null>(null);
  const [subjectForm, setSubjectForm] = useState({ name: "", goalCategory: "board-10", color: "#1E3A8A", icon: "book" });
  const [subjectSaving, setSubjectSaving] = useState(false);
  const [subjectError, setSubjectError] = useState("");

  const [showChapterForm, setShowChapterForm] = useState<string | null>(null);
  const [editingChapter, setEditingChapter] = useState<AdminChapter | null>(null);
  const [chapterForm, setChapterForm] = useState({ name: "", chapterNumber: 1, subjectId: "" });
  const [chapterSaving, setChapterSaving] = useState(false);
  const [chapterError, setChapterError] = useState("");

  const chapterCount = useMemo(
    () => subjectList.reduce((sum, s) => sum + (s.chapters?.length ?? s.totalChapters ?? 0), 0),
    [subjectList],
  );

  const loadSubjects = async () => {
    setListError("");
    try {
      const data = await fetchAdminSubjects();
      setSubjectList(data.subjects);
    } catch (err) {
      setListError(err instanceof Error ? err.message : "Could not load subjects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadSubjects();
  }, []);

  const filteredSubjects = subjectList.filter((s) => s.goalCategory === activeGoalCategory);
  const activeGoalLabel = GOAL_OPTIONS.find((g) => g.id === activeGoalCategory)?.label ?? activeGoalCategory;

  const handleSaveSubject = async () => {
    setSubjectError("");
    if (!subjectForm.name.trim()) {
      setSubjectError("Subject name is required.");
      return;
    }
    setSubjectSaving(true);
    try {
      if (editingSubject) {
        const { subject } = await updateAdminSubject(editingSubject.id, subjectForm);
        setSubjectList((prev) => prev.map((s) => (s.id === subject.id ? subject : s)));
      } else {
        const { subject } = await createAdminSubject(subjectForm);
        setSubjectList((prev) => [...prev, subject]);
      }
      setShowSubjectForm(false);
      setEditingSubject(null);
    } catch (err) {
      setSubjectError(err instanceof Error ? err.message : "Could not save subject.");
    } finally {
      setSubjectSaving(false);
    }
  };

  const handleDeleteSubject = async (id: string) => {
    if (!window.confirm("Delete this subject and all its chapters?")) return;
    try {
      await deleteAdminSubject(id);
      setSubjectList((prev) => prev.filter((s) => s.id !== id));
      if (expandedSubject === id) setExpandedSubject(null);
    } catch (err) {
      setListError(err instanceof Error ? err.message : "Could not delete subject.");
    }
  };

  const handleSaveChapter = async () => {
    setChapterError("");
    if (!chapterForm.name.trim() || !chapterForm.subjectId) {
      setChapterError("Chapter name is required.");
      return;
    }
    setChapterSaving(true);
    try {
      if (editingChapter) {
        const { chapter } = await updateAdminChapter(editingChapter.id, {
          name: chapterForm.name,
          chapterNumber: chapterForm.chapterNumber,
        });
        setSubjectList((prev) => prev.map((s) => {
          if (s.id !== chapterForm.subjectId) return s;
          const chapters = (s.chapters ?? []).map((c) => (c.id === chapter.id ? chapter : c));
          return { ...s, chapters, totalChapters: chapters.length };
        }));
      } else {
        const { chapter } = await createAdminChapter(chapterForm.subjectId, {
          name: chapterForm.name,
          chapterNumber: chapterForm.chapterNumber,
        });
        setSubjectList((prev) => prev.map((s) => {
          if (s.id !== chapterForm.subjectId) return s;
          const chapters = [...(s.chapters ?? []), chapter].sort((a, b) => a.chapterNumber - b.chapterNumber);
          return { ...s, chapters, totalChapters: chapters.length };
        }));
      }
      setShowChapterForm(null);
      setEditingChapter(null);
    } catch (err) {
      setChapterError(err instanceof Error ? err.message : "Could not save chapter.");
    } finally {
      setChapterSaving(false);
    }
  };

  const handleDeleteChapter = async (subjectId: string, chapterId: string) => {
    try {
      await deleteAdminChapter(chapterId);
      setSubjectList((prev) => prev.map((s) => {
        if (s.id !== subjectId) return s;
        const chapters = (s.chapters ?? []).filter((c) => c.id !== chapterId);
        return { ...s, chapters, totalChapters: chapters.length };
      }));
    } catch (err) {
      setListError(err instanceof Error ? err.message : "Could not delete chapter.");
    }
  };

  const openEditSubject = (sub: AdminSubject) => {
    setEditingSubject(sub);
    setSubjectForm({ name: sub.name, goalCategory: sub.goalCategory, color: sub.color || "#1E3A8A", icon: sub.icon || "book" });
    setSubjectError("");
    setShowSubjectForm(true);
  };

  const openAddChapter = (subjectId: string) => {
    const sub = subjectList.find((s) => s.id === subjectId);
    const existing = sub?.chapters ?? [];
    setEditingChapter(null);
    setChapterForm({ name: "", chapterNumber: existing.length + 1, subjectId });
    setChapterError("");
    setShowChapterForm(subjectId);
  };

  const openEditChapter = (ch: AdminChapter) => {
    setEditingChapter(ch);
    setChapterForm({ name: ch.name, chapterNumber: ch.chapterNumber, subjectId: ch.subjectId });
    setChapterError("");
    setShowChapterForm(ch.subjectId);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, color: "#1E3A8A" }}>Subjects & Chapters</h2>
          <p className="text-gray-500 text-sm">{subjectList.length} subjects · {chapterCount} chapters in database</p>
        </div>
        <button
          onClick={() => {
            setEditingSubject(null);
            setSubjectForm({ name: "", goalCategory: activeGoalCategory, color: "#1E3A8A", icon: "book" });
            setSubjectError("");
            setShowSubjectForm(true);
          }}
          className="bg-[#1E3A8A] hover:bg-blue-900 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-colors"
        >
          <Plus size={16} /> Add Subject
        </button>
      </div>

      {listError && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{listError}</div>
      )}

      {showSubjectForm && (
        <div className="rounded-2xl p-6 mb-5" style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.9)", boxShadow: "0 2px 12px rgba(30,58,138,0.06)" }}>
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
                onChange={(e) => setSubjectForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Mathematics"
                className="w-full border border-gray-200 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-[#1E3A8A] bg-gray-50"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Exam Goal</label>
              <select
                value={subjectForm.goalCategory}
                onChange={(e) => setSubjectForm((p) => ({ ...p, goalCategory: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-[#1E3A8A] bg-gray-50"
              >
                {GOAL_OPTIONS.map((g) => <option key={g.id} value={g.id}>{g.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Icon</label>
              <div className="flex flex-wrap gap-2">
                {ICON_OPTIONS.map(({ key, Icon }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSubjectForm((p) => ({ ...p, icon: key }))}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                      subjectForm.icon === key ? "ring-2 ring-[#1E3A8A] bg-blue-50 text-[#1E3A8A]" : "bg-gray-50 hover:bg-gray-100 text-gray-500"
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
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSubjectForm((p) => ({ ...p, color: c }))}
                    className={`w-8 h-8 rounded-full transition-all ${subjectForm.color === c ? "ring-2 ring-offset-2 ring-gray-400 scale-110" : ""}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>
          {subjectError && <p className="text-red-500 text-sm mt-3">{subjectError}</p>}
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => void handleSaveSubject()}
              disabled={subjectSaving}
              className="flex-1 bg-[#1E3A8A] hover:bg-blue-900 text-white py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {subjectSaving ? <><Loader2 size={15} className="animate-spin" /> Saving...</> : editingSubject ? "Update Subject" : "Add Subject"}
            </button>
            <button onClick={() => setShowSubjectForm(false)} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-500 hover:bg-gray-50">Cancel</button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {GOAL_OPTIONS.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveGoalCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              activeGoalCategory === cat.id
                ? "bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white shadow-[0_4px_14px_rgba(30,58,138,0.4)]"
                : "bg-white border border-gray-200 text-gray-600 hover:border-[#1E3A8A] hover:text-[#1E3A8A]"
            }`}
          >
            {cat.label} ({subjectList.filter((s) => s.goalCategory === cat.id).length})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-16 text-center text-gray-400 flex items-center justify-center gap-2">
          <Loader2 size={18} className="animate-spin" /> Loading subjects...
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSubjects.map((sub) => {
            const subChapters = [...(sub.chapters ?? [])].sort((a, b) => a.chapterNumber - b.chapterNumber);
            const isExpanded = expandedSubject === sub.id;
            return (
              <div key={sub.id} className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.9)", boxShadow: "0 2px 12px rgba(30,58,138,0.06)" }}>
                <div className="flex items-center gap-3 p-4">
                  <button onClick={() => setExpandedSubject(isExpanded ? null : sub.id)} className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${sub.color}20` }}>
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
                    <button onClick={() => void handleDeleteSubject(sub.id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14} /></button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-gray-50 px-4 pb-4 pt-3">
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
                            onChange={(e) => setChapterForm((p) => ({ ...p, chapterNumber: Number(e.target.value) }))}
                            className="w-16 border border-gray-200 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-[#1E3A8A] bg-white"
                          />
                          <input
                            value={chapterForm.name}
                            onChange={(e) => setChapterForm((p) => ({ ...p, name: e.target.value }))}
                            placeholder="Chapter name..."
                            className="flex-1 border border-gray-200 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-[#1E3A8A] bg-white"
                          />
                          <button
                            onClick={() => void handleSaveChapter()}
                            disabled={chapterSaving}
                            className="bg-[#1E3A8A] text-white px-3 py-2 rounded-xl text-sm flex items-center gap-1 disabled:opacity-60"
                          >
                            {chapterSaving ? <Loader2 size={14} className="animate-spin" /> : editingChapter ? "Update" : "Add"}
                          </button>
                        </div>
                        {chapterError && <p className="text-red-500 text-xs mt-2">{chapterError}</p>}
                      </div>
                    )}

                    {subChapters.length > 0 ? (
                      <div className="space-y-1.5">
                        {subChapters.map((ch) => (
                          <div key={ch.id} className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-3 min-w-0 flex-1 mr-2">
                              <span className="w-6 h-6 rounded-lg bg-gray-100 text-xs text-gray-500 flex items-center justify-center flex-shrink-0">{ch.chapterNumber}</span>
                              <span className="text-sm text-gray-700 truncate min-w-0">{ch.name}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <button onClick={() => openEditChapter(ch)} className="p-1 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 size={12} /></button>
                              <button onClick={() => void handleDeleteChapter(sub.id, ch.id)} className="p-1 text-red-400 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={12} /></button>
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
            <div className="rounded-2xl p-10 text-center" style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.9)", boxShadow: "0 2px 12px rgba(30,58,138,0.06)" }}>
              <BookOpen size={32} className="mx-auto text-gray-200 mb-3" />
              <p className="text-gray-400 text-sm">No subjects for {activeGoalLabel}. Add one above.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
