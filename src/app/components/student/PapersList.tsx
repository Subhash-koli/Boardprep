import { useState, useRef, useEffect } from "react";
import { Search, SlidersHorizontal, Eye, Download, Bookmark, BookmarkCheck, FileText, X, ChevronDown } from "lucide-react";
import { GoalIcon } from "../shared/GoalIcons";
import { useApp } from "../context/AppContext";
import { papers, subjects, PAPER_TYPE_CONFIG } from "../data/mockData";
import type { PaperType, Medium, GoalCategory } from "../data/mockData";

const YEARS = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018];

const ALL_TYPES: PaperType[] = [
  "board", "prelims", "model", "pyq", "mock-test",
  "practice", "chapter-wise", "subject-wise",
  "unit-test", "semester", "minor-test", "major-test",
];

// ── Mobile Filter Sheet ───────────────────────────────────────────────────────
interface FilterState {
  subject: string;
  year: number | "";
  type: PaperType | "";
  medium: Medium | "";
}

function FilterSheet({
  open, onClose, filters, onChange, onClear, availableSubjects, goalCategory,
}: {
  open: boolean; onClose: () => void;
  filters: FilterState; onChange: (f: Partial<FilterState>) => void;
  onClear: () => void; availableSubjects: typeof subjects;
  goalCategory: GoalCategory | undefined;
}) {
  const isBoard = goalCategory?.startsWith("board");

  // Relevant paper types for this goal
  const relevantTypes: PaperType[] = isBoard
    ? ["board", "prelims", "model", "practice", "unit-test", "semester", "chapter-wise"]
    : ["pyq", "mock-test", "subject-wise", "chapter-wise", "minor-test", "major-test", "practice"];

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-sm sm:mx-4 rounded-t-3xl sm:rounded-2xl max-h-[85vh] overflow-y-auto animate-slide-up">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <span className="font-semibold text-gray-900 font-['Poppins']">Filter Papers</span>
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
                onClick={() => onChange({ subject: "" })}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 cursor-pointer select-none ${!filters.subject ? "bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white border-transparent shadow-[0_4px_14px_rgba(30,58,138,0.35)] scale-105" : "bg-white text-gray-600 border-gray-200 hover:border-[#1E3A8A] hover:text-[#1E3A8A] hover:shadow-md hover:scale-105 active:scale-95"}`}
              >
                All
              </button>
              {availableSubjects.map(s => (
                <button
                  key={s.id}
                  onClick={() => onChange({ subject: filters.subject === s.id ? "" : s.id })}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 cursor-pointer select-none ${filters.subject === s.id ? "bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white border-transparent shadow-[0_4px_14px_rgba(30,58,138,0.35)] scale-105" : "bg-white text-gray-600 border-gray-200 hover:border-[#1E3A8A] hover:text-[#1E3A8A] hover:shadow-md hover:scale-105 active:scale-95"}`}
                >
                  {s.icon} {s.name}
                </button>
              ))}
            </div>
          </div>

          {/* Paper Type */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Paper Type</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onChange({ type: "" })}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 cursor-pointer select-none ${!filters.type ? "bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white border-transparent shadow-[0_4px_14px_rgba(30,58,138,0.35)] scale-105" : "bg-white text-gray-600 border-gray-200 hover:border-[#1E3A8A] hover:text-[#1E3A8A] hover:shadow-md hover:scale-105 active:scale-95"}`}
              >
                All Types
              </button>
              {relevantTypes.map(t => {
                const cfg = PAPER_TYPE_CONFIG[t];
                return (
                  <button
                    key={t}
                    onClick={() => onChange({ type: filters.type === t ? "" : t })}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 cursor-pointer select-none ${filters.type === t ? "bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white border-transparent shadow-[0_4px_14px_rgba(30,58,138,0.35)] scale-105" : "bg-white text-gray-600 border-gray-200 hover:border-[#1E3A8A] hover:text-[#1E3A8A] hover:shadow-md hover:scale-105 active:scale-95"}`}
                  >
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Year */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Year</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onChange({ year: "" })}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 cursor-pointer select-none ${!filters.year ? "bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white border-transparent shadow-[0_4px_14px_rgba(30,58,138,0.35)] scale-105" : "bg-white text-gray-600 border-gray-200 hover:border-[#1E3A8A] hover:text-[#1E3A8A] hover:shadow-md hover:scale-105 active:scale-95"}`}
              >
                All Years
              </button>
              {YEARS.map(y => (
                <button
                  key={y}
                  onClick={() => onChange({ year: filters.year === y ? "" : y })}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 cursor-pointer select-none ${filters.year === y ? "bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white border-transparent shadow-[0_4px_14px_rgba(30,58,138,0.35)] scale-105" : "bg-white text-gray-600 border-gray-200 hover:border-[#1E3A8A] hover:text-[#1E3A8A] hover:shadow-md hover:scale-105 active:scale-95"}`}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>

          {/* Medium (board only) */}
          {isBoard && (
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Medium</label>
              <div className="flex flex-wrap gap-2">
                {(["", "english", "semi-english", "marathi"] as const).map(m => (
                  <button
                    key={m}
                    onClick={() => onChange({ medium: m as Medium | "" })}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 cursor-pointer select-none ${filters.medium === m ? "bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white border-transparent shadow-[0_4px_14px_rgba(30,58,138,0.35)] scale-105" : "bg-white text-gray-600 border-gray-200 hover:border-[#1E3A8A] hover:text-[#1E3A8A] hover:shadow-md hover:scale-105 active:scale-95"}`}
                  >
                    {m === "" ? "All" : m === "english" ? "English" : m === "semi-english" ? "Semi-English" : "Marathi"}
                  </button>
                ))}
              </div>
            </div>
          )}
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
      <style>{`
        @keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .animate-slide-up { animation: slide-up 0.25s ease-out; }
      `}</style>
    </div>
  );
}

// ── Sort Dropdown ─────────────────────────────────────────────────────────────
type SortKey = "popular" | "newest" | "oldest" | "marks-high" | "marks-low";
const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "popular", label: "Most Popular" },
  { value: "newest",  label: "Newest First" },
  { value: "oldest",  label: "Oldest First" },
  { value: "marks-high", label: "Most Marks" },
  { value: "marks-low",  label: "Fewest Marks" },
];

// ── Main Component ────────────────────────────────────────────────────────────
export function PapersList() {
  const { currentGoal, setView, setSelectedPaperId, toggleBookmark, isBookmarked } = useApp();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FilterState>({ subject: "", year: "", type: "", medium: "" });
  const [sort, setSort] = useState<SortKey>("popular");
  const [showFilters, setShowFilters] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [page, setPage] = useState(1);
  const sortRef = useRef<HTMLDivElement>(null);
  const PER_PAGE = 12;

  const cat = currentGoal?.category as GoalCategory | undefined;

  // Close sort dropdown on outside click
  useEffect(() => {
    const h = (e: MouseEvent) => { if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const availableSubjects = subjects.filter(s => s.goalCategory === cat);

  // Filter
  let filtered = papers.filter(p => {
    if (p.status !== "published") return false;
    if (p.goalCategory !== cat) return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.subject.toLowerCase().includes(search.toLowerCase())) return false;
    if (filters.subject && p.subjectId !== filters.subject) return false;
    if (filters.year && p.year !== filters.year) return false;
    if (filters.type && p.type !== filters.type) return false;
    if (filters.medium && p.medium !== filters.medium) return false;
    return true;
  });

  // Sort
  filtered = [...filtered].sort((a, b) => {
    if (sort === "popular")    return b.analytics.downloads - a.analytics.downloads;
    if (sort === "newest")     return b.year - a.year;
    if (sort === "oldest")     return a.year - b.year;
    if (sort === "marks-high") return b.marks - a.marks;
    if (sort === "marks-low")  return a.marks - b.marks;
    return 0;
  });

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const activeFilterCount = [filters.subject, filters.year, filters.type, filters.medium].filter(Boolean).length;

  const updateFilters = (partial: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...partial }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ subject: "", year: "", type: "", medium: "" });
    setPage(1);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4">

      {/* ── Header ── */}
      <div>
        <h2 className="text-lg font-bold text-[#1E3A8A] font-['Poppins'] flex items-center gap-2">
          {currentGoal && <GoalIcon category={currentGoal.category} size={18} className="text-[#1E3A8A]" />}
          Question Papers
        </h2>
        <p className="text-gray-500 text-sm mt-0.5">
          {currentGoal?.label} · <span className="font-medium text-gray-700">{filtered.length}</span> papers
        </p>
      </div>

      {/* ── Search + Controls ── */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by subject, year, topic..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1E3A8A] bg-white placeholder:text-gray-400"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="relative" ref={sortRef}>
          <button
            onClick={() => setSortOpen(o => !o)}
            className="flex items-center gap-1.5 px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white text-gray-600 hover:border-gray-300 min-h-[44px] whitespace-nowrap"
          >
            <span className="hidden sm:inline">{SORT_OPTIONS.find(s => s.value === sort)?.label}</span>
            <ChevronDown size={14} className={`transition-transform ${sortOpen ? "rotate-180" : ""}`} />
          </button>
          {sortOpen && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-100 rounded-xl shadow-lg z-30 w-44 py-1">
              {SORT_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => { setSort(opt.value); setSortOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm min-h-[44px] transition-colors ${sort === opt.value ? "bg-blue-50 text-[#1E3A8A] font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Filter button */}
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
            <span className="bg-white text-[#1E3A8A] text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* ── Active filter pills ── */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.subject && (
            <span className="flex items-center gap-1.5 bg-blue-50 text-[#1E3A8A] border border-blue-200 text-xs px-3 py-1.5 rounded-full">
              {availableSubjects.find(s => s.id === filters.subject)?.name ?? filters.subject}
              <button onClick={() => updateFilters({ subject: "" })}><X size={11} /></button>
            </span>
          )}
          {filters.type && (
            <span className="flex items-center gap-1.5 bg-blue-50 text-[#1E3A8A] border border-blue-200 text-xs px-3 py-1.5 rounded-full">
              {PAPER_TYPE_CONFIG[filters.type]?.label}
              <button onClick={() => updateFilters({ type: "" })}><X size={11} /></button>
            </span>
          )}
          {filters.year && (
            <span className="flex items-center gap-1.5 bg-blue-50 text-[#1E3A8A] border border-blue-200 text-xs px-3 py-1.5 rounded-full">
              {filters.year}
              <button onClick={() => updateFilters({ year: "" })}><X size={11} /></button>
            </span>
          )}
          {filters.medium && (
            <span className="flex items-center gap-1.5 bg-blue-50 text-[#1E3A8A] border border-blue-200 text-xs px-3 py-1.5 rounded-full capitalize">
              {filters.medium}
              <button onClick={() => updateFilters({ medium: "" })}><X size={11} /></button>
            </span>
          )}
          <button onClick={clearFilters} className="text-xs text-red-500 hover:underline font-medium px-1">Clear all</button>
        </div>
      )}

      {/* ── Papers Grid ── */}
      {paginated.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <FileText size={44} className="mx-auto mb-3 opacity-20" />
          <p className="text-gray-500 font-medium">No papers found</p>
          <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
          {activeFilterCount > 0 && (
            <button onClick={clearFilters} className="mt-3 text-[#1E3A8A] text-sm hover:underline">Clear filters</button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {paginated.map(paper => {
            const bookmarked = isBookmarked("paper", paper.id);
            const typeCfg = PAPER_TYPE_CONFIG[paper.type];
            return (
              <div
                key={paper.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-5 flex flex-col"
              >
                {/* Top badges + bookmark */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span
                      className="text-xs px-2.5 py-1 rounded-full font-medium border"
                      style={{ background: typeCfg.bg, color: typeCfg.text, borderColor: typeCfg.border }}
                    >
                      {typeCfg.label}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{paper.year}</span>
                    {paper.medium && (
                      <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full capitalize">{paper.medium}</span>
                    )}
                    {paper.session && (
                      <span className="text-xs bg-violet-50 text-violet-700 px-2.5 py-1 rounded-full capitalize">{paper.session}</span>
                    )}
                    {paper.shift && (
                      <span className="text-xs bg-sky-50 text-sky-700 px-2.5 py-1 rounded-full capitalize">{paper.shift.replace("-", " ")}</span>
                    )}
                  </div>
                  <button
                    onClick={() => toggleBookmark("paper", paper.id)}
                    className={`ml-2 flex-shrink-0 p-1 rounded-lg transition-colors ${bookmarked ? "text-[#F97316]" : "text-gray-300 hover:text-[#F97316]"}`}
                    aria-label={bookmarked ? "Remove bookmark" : "Bookmark paper"}
                  >
                    {bookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                  </button>
                </div>

                {/* Title */}
                <h3 className="text-sm font-semibold text-[#1E3A8A] font-['Poppins'] leading-snug mb-1 flex-1">{paper.title}</h3>
                <p className="text-xs text-gray-400 mb-3">{paper.subject}</p>

                {/* Meta */}
                <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
                  <span>{paper.marks}M</span>
                  <span>·</span>
                  <span>{paper.durationMinutes} min</span>
                  <span>·</span>
                  <span>{paper.analytics.downloads.toLocaleString()} downloads</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => { setSelectedPaperId(paper.id); setView("paper-detail"); }}
                    className="flex-1 bg-[#1E3A8A] hover:bg-[#1D4ED8] text-white py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors min-h-[40px]"
                  >
                    <Eye size={13} /> View Paper
                  </button>
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 px-3 rounded-xl text-xs flex items-center gap-1.5 transition-colors min-h-[40px]">
                    <Download size={13} /> PDF
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-1.5 pt-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${page === p ? "bg-[#1E3A8A] text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-[#1E3A8A]"}`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* ── Filter Sheet ── */}
      <FilterSheet
        open={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onChange={updateFilters}
        onClear={clearFilters}
        availableSubjects={availableSubjects}
        goalCategory={cat}
      />
    </div>
  );
}
