import { useState } from "react";
import { Search, SlidersHorizontal, Brain, Clock, Target, ChevronRight, Bookmark, BookmarkCheck, X, Zap } from "lucide-react";
import { GoalIcon } from "../shared/GoalIcons";
import { useApp } from "../context/AppContext";
import { quizzes, subjects, DIFFICULTY_CONFIG } from "../data/mockData";
import type { Difficulty, GoalCategory } from "../data/mockData";

// ── Filter Sheet (Mobile) ─────────────────────────────────────────────────────
function FilterSheet({
  open, onClose, filterSubject, filterDiff, onSubjectChange, onDiffChange, onClear, availableSubjects,
}: {
  open: boolean; onClose: () => void;
  filterSubject: string; filterDiff: Difficulty | "";
  onSubjectChange: (s: string) => void; onDiffChange: (d: Difficulty | "") => void;
  onClear: () => void; availableSubjects: typeof subjects;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-sm sm:mx-4 rounded-t-3xl sm:rounded-2xl max-h-[80vh] overflow-y-auto animate-slide-up">
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <span className="font-semibold text-gray-900 font-['Poppins']">Filter Quizzes</span>
          <div className="flex items-center gap-3">
            <button onClick={onClear} className="text-xs text-red-500 font-medium">Clear all</button>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* Subject */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Subject</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onSubjectChange("")}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 cursor-pointer select-none ${!filterSubject ? "bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white border-transparent shadow-[0_4px_14px_rgba(30,58,138,0.35)] scale-105" : "bg-white text-gray-600 border-gray-200 hover:border-[#1E3A8A] hover:text-[#1E3A8A] hover:shadow-md hover:scale-105 active:scale-95"}`}
              >
                All Subjects
              </button>
              {availableSubjects.map(s => (
                <button
                  key={s.id}
                  onClick={() => onSubjectChange(filterSubject === s.id ? "" : s.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 cursor-pointer select-none ${filterSubject === s.id ? "bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white border-transparent shadow-[0_4px_14px_rgba(30,58,138,0.35)] scale-105" : "bg-white text-gray-600 border-gray-200 hover:border-[#1E3A8A] hover:text-[#1E3A8A] hover:shadow-md hover:scale-105 active:scale-95"}`}
                >
                  {s.icon} {s.name}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Difficulty</label>
            <div className="flex gap-2 flex-wrap">
              {(["", "easy", "medium", "hard", "mixed"] as const).map(d => {
                const cfg = d ? DIFFICULTY_CONFIG[d] : null;
                return (
                  <button
                    key={d}
                    onClick={() => onDiffChange(d as Difficulty | "")}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 cursor-pointer select-none ${filterDiff === d ? "bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white border-transparent shadow-[0_4px_14px_rgba(30,58,138,0.35)] scale-105" : "bg-white text-gray-600 border-gray-200 hover:border-[#1E3A8A] hover:text-[#1E3A8A] hover:shadow-md hover:scale-105 active:scale-95"}`}
                  >
                    {d === "" ? "All Levels" : cfg?.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="px-5 pb-6 pt-2">
          <button
            onClick={onClose}
            className="w-full bg-[#1E3A8A] text-white py-3 rounded-xl font-semibold font-['Poppins'] text-sm"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Marking Scheme Pill ───────────────────────────────────────────────────────
function MarkingSchemePill({ correct, wrong }: { correct: number; wrong: number }) {
  const hasNeg = wrong < 0;
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${hasNeg ? "bg-red-50 text-red-600" : "bg-green-50 text-green-700"}`}>
      <Zap size={9} />
      +{correct}{hasNeg ? ` / ${wrong}` : " / 0"}
    </span>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export function QuizList() {
  const { currentGoal, setView, setSelectedQuizId, toggleBookmark, isBookmarked, completedAttempts } = useApp();
  const [search, setSearch]         = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [filterDiff, setFilterDiff] = useState<Difficulty | "">("") ;
  const [showFilters, setShowFilters] = useState(false);

  const cat = currentGoal?.category as GoalCategory | undefined;

  const availableSubjects = subjects.filter(s => s.goalCategory === cat);

  const filtered = quizzes.filter(q => {
    if (q.goalCategory !== cat) return false;
    if (q.status !== "published") return false;
    if (search && !q.title.toLowerCase().includes(search.toLowerCase()) && !q.subject.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterSubject && q.subjectId !== filterSubject) return false;
    if (filterDiff && q.difficulty !== filterDiff) return false;
    return true;
  });

  const activeFilterCount = [filterSubject, filterDiff].filter(Boolean).length;

  const clearFilters = () => { setFilterSubject(""); setFilterDiff(""); };

  // Map quizId → best attempt percentage for this user
  const bestScoreMap: Record<string, number> = {};
  completedAttempts.filter(a => a.goalCategory === cat).forEach(a => {
    if (!bestScoreMap[a.quizId] || a.percentage > bestScoreMap[a.quizId]) {
      bestScoreMap[a.quizId] = a.percentage;
    }
  });

  return (
    <div className="max-w-5xl mx-auto space-y-4">

      {/* ── Header ── */}
      <div>
        <h2 className="text-lg font-bold text-[#1E3A8A] font-['Poppins'] flex items-center gap-2">
          {currentGoal && <GoalIcon category={currentGoal.category} size={18} className="text-[#1E3A8A]" />}
          MCQ Quizzes
        </h2>
        <p className="text-gray-500 text-sm mt-0.5">
          {currentGoal?.label} · <span className="font-medium text-gray-700">{filtered.length}</span> quizzes
        </p>
      </div>

      {/* ── Negative Marking Banner (NEET/JEE) ── */}
      {(cat === "neet" || cat === "jee-mains" || cat === "jee-advanced") && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
          <Zap size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-800 font-['Poppins']">Negative Marking Applies</p>
            <p className="text-xs text-red-700 mt-0.5 leading-relaxed">
              {cat === "neet"
                ? "NEET pattern: +4 for correct, −1 for wrong. Unattempted = 0. Skip if not sure."
                : cat === "jee-advanced"
                ? "JEE Advanced: +3 correct, −1 wrong. Read question type carefully."
                : "JEE Mains: +4 MCQ correct, −1 MCQ wrong. Numerical type: +4 correct, 0 wrong."}
            </p>
          </div>
        </div>
      )}

      {/* ── Search + Filter ── */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by subject or chapter..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-9 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1E3A8A] bg-white"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <X size={14} />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(true)}
          className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 min-h-[44px] cursor-pointer select-none hover:scale-105 active:scale-95 ${
            activeFilterCount > 0
              ? "bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white shadow-[0_4px_14px_rgba(30,58,138,0.45)] border-transparent"
              : "bg-gradient-to-r from-[#F97316] to-[#FB923C] text-white shadow-[0_4px_14px_rgba(249,115,22,0.4)] border-transparent hover:shadow-[0_6px_20px_rgba(249,115,22,0.5)]"
          }`}
        >
          <SlidersHorizontal size={16} />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="bg-white text-[#1E3A8A] text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center animate-pulse">{activeFilterCount}</span>
          )}
        </button>
      </div>

      {/* ── Active filter pills ── */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filterSubject && (
            <span className="flex items-center gap-1.5 bg-blue-50 text-[#1E3A8A] border border-blue-200 text-xs px-3 py-1.5 rounded-full">
              {availableSubjects.find(s => s.id === filterSubject)?.name ?? filterSubject}
              <button onClick={() => setFilterSubject("")}><X size={11} /></button>
            </span>
          )}
          {filterDiff && (
            <span className="flex items-center gap-1.5 bg-blue-50 text-[#1E3A8A] border border-blue-200 text-xs px-3 py-1.5 rounded-full capitalize">
              {filterDiff}
              <button onClick={() => setFilterDiff("")}><X size={11} /></button>
            </span>
          )}
          <button onClick={clearFilters} className="text-xs text-red-500 hover:underline font-medium">Clear all</button>
        </div>
      )}

      {/* ── Quiz Grid ── */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Brain size={44} className="mx-auto mb-3 text-gray-200" />
          <p className="text-gray-500 font-medium">No quizzes found</p>
          <p className="text-sm text-gray-400 mt-1">Try different filters or search terms</p>
          {activeFilterCount > 0 && (
            <button onClick={clearFilters} className="mt-3 text-[#1E3A8A] text-sm hover:underline">Clear filters</button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map(quiz => {
            const bookmarked   = isBookmarked("quiz", quiz.id);
            const diffCfg      = DIFFICULTY_CONFIG[quiz.difficulty] ?? DIFFICULTY_CONFIG.medium;
            const bestScore    = bestScoreMap[quiz.id];
            const hasAttempted = bestScore !== undefined;
            const { markingScheme: ms } = quiz;

            return (
              <div
                key={quiz.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-5 flex flex-col"
              >
                {/* Top row: badges + bookmark */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex flex-wrap gap-1.5">
                    {/* Difficulty */}
                    <span
                      className="text-xs px-2.5 py-1 rounded-full font-medium"
                      style={{ backgroundColor: diffCfg.bg, color: diffCfg.text }}
                    >
                      <span className="mr-1" style={{ color: diffCfg.dot }}>●</span>{diffCfg.label}
                    </span>
                    {/* Marking scheme */}
                    <MarkingSchemePill correct={ms.correctMarks} wrong={ms.wrongMarks} />
                    {/* Best score badge */}
                    {hasAttempted && (
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">
                        Best {Math.round(bestScore)}%
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => toggleBookmark("quiz", quiz.id)}
                    className={`ml-1.5 flex-shrink-0 p-1 rounded-lg transition-colors ${bookmarked ? "text-[#F97316]" : "text-gray-300 hover:text-[#F97316]"}`}
                    aria-label={bookmarked ? "Remove bookmark" : "Bookmark quiz"}
                  >
                    {bookmarked ? <BookmarkCheck size={17} /> : <Bookmark size={17} />}
                  </button>
                </div>

                {/* Title + chapter */}
                <h3 className="text-sm font-semibold text-[#1E3A8A] font-['Poppins'] leading-snug mb-0.5 flex-1">
                  {quiz.title}
                </h3>
                <p className="text-xs text-gray-400 mb-3">{quiz.chapter}</p>

                {/* Stats row */}
                <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                  <span className="flex items-center gap-1"><Brain size={11} /> {quiz.questionsCount}Q</span>
                  <span className="flex items-center gap-1"><Clock size={11} /> {quiz.timeLimitMinutes}min</span>
                  <span className="flex items-center gap-1"><Target size={11} /> {quiz.totalMarks}M</span>
                </div>

                {/* Community stats */}
                <div className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2 text-xs text-gray-500 mb-4">
                  <span>{quiz.analytics.totalAttempts.toLocaleString()} attempts</span>
                  <span>
                    Avg:{" "}
                    <strong className="text-gray-700">
                      {quiz.analytics.avgScore.toFixed(1)}/{quiz.totalMarks}
                    </strong>
                  </span>
                </div>

                {/* CTA */}
                <button
                  onClick={() => { setSelectedQuizId(quiz.id); setView("quiz-detail"); }}
                  className="w-full bg-[#1E3A8A] hover:bg-[#1D4ED8] text-white py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors min-h-[44px]"
                >
                  {hasAttempted ? "Retake Quiz" : "Start Quiz"}
                  <ChevronRight size={15} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Filter Sheet ── */}
      <FilterSheet
        open={showFilters}
        onClose={() => setShowFilters(false)}
        filterSubject={filterSubject}
        filterDiff={filterDiff}
        onSubjectChange={setFilterSubject}
        onDiffChange={setFilterDiff}
        onClear={clearFilters}
        availableSubjects={availableSubjects}
      />
    </div>
  );
}
