import { useState, useRef, useEffect } from "react";
import {
  Search, Eye, Download, Bookmark, BookmarkCheck, FileText,
  X, ChevronDown, Clock, Award, TrendingUp,
  BarChart2, ChevronRight, Eye as ViewsIcon,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { papers, subjects, PAPER_TYPE_CONFIG } from "../data/mockData";
import type { PaperType, Medium } from "../data/mockData";
import { HierarchicalFilter, EMPTY_FILTER, resolveGoalCategory, filterBreadcrumb } from "./HierarchicalFilter";
import type { HierarchicalFilterState } from "./HierarchicalFilter";
import { SubjectIcon } from "../shared/GoalIcons";


const YEARS = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018];

interface FilterState {
  subject: string;
  year: number | "";
  type: PaperType | "";
  medium: Medium | "";
}

// ── Sort Dropdown ─────────────────────────────────────────────────────────────
type SortKey = "popular" | "newest" | "oldest" | "marks-high" | "marks-low";
const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "popular",    label: "Most Popular" },
  { value: "newest",     label: "Newest First" },
  { value: "oldest",     label: "Oldest First" },
  { value: "marks-high", label: "Most Marks"  },
  { value: "marks-low",  label: "Fewest Marks" },
];

// Pill button helper
function Pill({
  active, onClick, children,
}: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 cursor-pointer select-none whitespace-nowrap flex-shrink-0
        ${active
          ? "bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white border-transparent shadow-[0_4px_14px_rgba(30,58,138,0.35)] scale-105"
          : "bg-white text-gray-600 border-gray-200 hover:border-[#1E3A8A] hover:text-[#1E3A8A] hover:shadow-md hover:scale-105 active:scale-95"
        }`}
    >
      {children}
    </button>
  );
}

// ── Paper Preview Card ────────────────────────────────────────────────────────
function PaperCard({
  paper: p,
  bookmarked,
  onView,
  onBookmark,
}: {
  paper: (typeof papers)[number];
  bookmarked: boolean;
  onView: () => void;
  onBookmark: () => void;
}) {
  const typeCfg = PAPER_TYPE_CONFIG[p.type];
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="rounded-2xl hover:-translate-y-0.5 transition-all duration-200 flex flex-col overflow-hidden" style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.9)", boxShadow: "0 2px 12px rgba(30,58,138,0.06)" }}
    >
      {/* Top colour strip */}
      <div
        className="h-1 w-full"
        style={{ background: `linear-gradient(90deg, ${typeCfg.text}, ${typeCfg.border})` }}
      />

      <div className="p-4 flex flex-col flex-1">
        {/* Badges row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap gap-1.5 min-w-0">
            <span
              className="text-[10px] px-2 py-0.5 rounded-full font-semibold border flex-shrink-0"
              style={{ background: typeCfg.bg, color: typeCfg.text, borderColor: typeCfg.border }}
            >
              {typeCfg.label}
            </span>
            <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full flex-shrink-0">
              {p.year}
            </span>
            {p.medium && (
              <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full capitalize flex-shrink-0">
                {p.medium}
              </span>
            )}
            {p.session && (
              <span className="text-[10px] bg-violet-50 text-violet-700 px-2 py-0.5 rounded-full capitalize flex-shrink-0">
                {p.session}
              </span>
            )}
            {p.shift && (
              <span className="text-[10px] bg-sky-50 text-sky-700 px-2 py-0.5 rounded-full capitalize flex-shrink-0">
                {p.shift.replace("-", " ")}
              </span>
            )}
          </div>
          <button
            onClick={onBookmark}
            className={`flex-shrink-0 p-1.5 rounded-xl transition-colors ${
              bookmarked ? "text-[#F97316] bg-orange-50" : "text-gray-300 hover:text-[#F97316] hover:bg-orange-50"
            }`}
            aria-label={bookmarked ? "Remove bookmark" : "Bookmark paper"}
          >
            {bookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
          </button>
        </div>

        {/* Title */}
        <h3 className="text-sm font-bold text-[#1E3A8A] font-['Poppins'] leading-snug mb-0.5">
          {p.title}
        </h3>
        <p className="text-xs text-gray-400 mb-3">{p.subject}</p>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-1.5 mb-3">
          <div className="bg-blue-50 rounded-xl p-2 text-center">
            <Award size={12} className="text-[#1E3A8A] mx-auto mb-0.5" />
            <p className="text-[10px] text-gray-500">Marks</p>
            <p className="text-xs font-bold text-[#1E3A8A]">{p.marks}</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-2 text-center">
            <Clock size={12} className="text-purple-600 mx-auto mb-0.5" />
            <p className="text-[10px] text-gray-500">Time</p>
            <p className="text-xs font-bold text-purple-600">{p.durationMinutes}m</p>
          </div>
          <div className="bg-orange-50 rounded-xl p-2 text-center">
            <TrendingUp size={12} className="text-[#F97316] mx-auto mb-0.5" />
            <p className="text-[10px] text-gray-500">Downloads</p>
            <p className="text-xs font-bold text-[#F97316]">
              {p.analytics.downloads >= 1000
                ? `${(p.analytics.downloads / 1000).toFixed(1)}k`
                : p.analytics.downloads}
            </p>
          </div>
        </div>

        {/* Expandable preview panel */}
        {expanded && (
          <div className="mb-3 bg-gray-50 rounded-xl p-3 animate-fade-in">
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Paper Details</p>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-gray-500">Views</span>
                <span className="text-[10px] font-semibold text-gray-700 flex items-center gap-1">
                  <ViewsIcon size={9} />
                  {p.analytics.views.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-gray-500">Bookmarks</span>
                <span className="text-[10px] font-semibold text-gray-700">{p.analytics.bookmarks.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-gray-500">Added</span>
                <span className="text-[10px] font-semibold text-gray-700">
                  {new Date(p.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                </span>
              </div>
              {p.examName && (
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-gray-500">Exam</span>
                  <span className="text-[10px] font-semibold text-gray-700">{p.examName}</span>
                </div>
              )}
            </div>
            <div className="mt-2 pt-2 border-t border-gray-200">
              <div className="flex items-center gap-1.5">
                <BarChart2 size={11} className="text-gray-400" />
                <span className="text-[10px] text-gray-500">
                  Popularity score: <span className="font-semibold text-[#1E3A8A]">
                    {Math.round((p.analytics.downloads / Math.max(p.analytics.views, 1)) * 100)}%
                  </span> download rate
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          <button
            onClick={onView}
            className="flex-1 bg-[#1E3A8A] hover:bg-[#1D4ED8] text-white py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors min-h-[40px]"
          >
            <Eye size={13} /> View Paper
          </button>
          <button
            onClick={() => setExpanded(e => !e)}
            className={`px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all min-h-[40px] border ${
              expanded
                ? "bg-[#1E3A8A]/10 text-[#1E3A8A] border-[#1E3A8A]/20"
                : "bg-gray-100 text-gray-600 border-transparent hover:bg-gray-200"
            }`}
            title={expanded ? "Hide details" : "Show details"}
          >
            <ChevronRight
              size={13}
              className={`transition-transform duration-200 ${expanded ? "rotate-90" : ""}`}
            />
          </button>
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 px-3 rounded-xl text-xs flex items-center gap-1.5 transition-colors min-h-[40px]">
            <Download size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export function PapersList() {
  const { setView, setSelectedPaperId, toggleBookmark, isBookmarked } = useApp();
  const [search, setSearch]     = useState("");
  const [hierFilter, setHierFilter] = useState<HierarchicalFilterState>(EMPTY_FILTER);
  const [filters, setFilters]   = useState<FilterState>({ subject: "", year: "", type: "", medium: "" });
  const [sort, setSort]         = useState<SortKey>("popular");
  const [sortOpen, setSortOpen] = useState(false);
  const [page, setPage]         = useState(1);
  const sortRef = useRef<HTMLDivElement>(null);
  const PER_PAGE = 12;

  // Resolve hierarchical filter to goalCategory
  const cat      = resolveGoalCategory(hierFilter) || undefined;
  const stream   = hierFilter.stream || undefined;

  // Close sort dropdown on outside click
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  // Stream-aware deduplicated subjects
  const availableSubjects = Array.from(
    new Map(
      subjects
        .filter(s => {
          if (cat && s.goalCategory !== cat) return false;
          if (stream && s.stream && s.stream !== stream) return false;
          return true;
        })
        .map(s => [s.name, s])
    ).values()
  );

  // Dynamic years list from published papers
  const availableYears = Array.from(
    new Set(papers.filter(p => p.status === "published").map(p => p.year))
  ).sort((a, b) => b - a);

  // Relevant paper types
  const isBoard = cat?.startsWith("board");
  const relevantTypes: PaperType[] = !cat
    ? ["board", "prelims", "model", "practice", "unit-test", "semester", "chapter-wise", "pyq", "mock-test", "subject-wise", "minor-test", "major-test"]
    : isBoard
      ? ["board", "prelims", "model", "practice", "unit-test", "semester", "chapter-wise"]
      : ["pyq", "mock-test", "subject-wise", "chapter-wise", "minor-test", "major-test", "practice"];

  // Filter papers
  let filtered = papers.filter(p => {
    if (p.status !== "published") return false;
    if (cat && p.goalCategory !== cat) return false;
    // stream filter: if stream selected and paper has stream, match it
    if (stream && p.stream && p.stream !== stream) return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.subject.toLowerCase().includes(search.toLowerCase())) return false;
    if (filters.subject) {
      const selectedSub = availableSubjects.find(s => s.id === filters.subject || s.name === filters.subject);
      if (selectedSub && p.subject !== selectedSub.name && p.subjectId !== filters.subject) return false;
    }
    if (filters.year    && p.year !== filters.year)          return false;
    if (filters.type    && p.type !== filters.type)          return false;
    if (filters.medium  && p.medium !== filters.medium)      return false;
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

  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const activeFilterCount = [filters.subject, filters.year, filters.type, filters.medium].filter(Boolean).length;

  const updateFilters = (partial: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...partial }));
    setPage(1);
  };
  const clearFilters = () => {
    setHierFilter(EMPTY_FILTER);
    setFilters({ subject: "", year: "", type: "", medium: "" });
    setPage(1);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4 min-w-0">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-2 flex-wrap">
        <div>
          <h2 className="text-lg font-bold text-[#1E3A8A] font-['Poppins'] flex items-center gap-2">
            <FileText size={18} className="text-[#1E3A8A]" />
            Question Papers
          </h2>
          <p className="text-gray-500 text-xs mt-0.5">
            <span className="font-medium text-gray-600">{filterBreadcrumb(hierFilter)}</span>
            {" "}&middot; <span className="font-medium text-gray-700">{filtered.length}</span> papers
          </p>
        </div>
      </div>

      {/* ── Hierarchical Filter ── */}
      <HierarchicalFilter
        value={hierFilter}
        onChange={next => { setHierFilter(next); setFilters({ subject: "", year: "", type: "", medium: "" }); setPage(1); }}
      />

      {/* ── Inline Filter Panel ── */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.9)", boxShadow: "0 2px 12px rgba(30,58,138,0.06)" }}>
        {/* Search + Sort row */}
        <div className="p-3 sm:p-4 border-b border-gray-50 flex gap-2">
          <div className="flex-1 relative min-w-0">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search papers…"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-8 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1E3A8A] bg-[#F8FAFC] placeholder:text-gray-400 min-w-0"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Sort */}
          <div className="relative flex-shrink-0" ref={sortRef}>
            <button
              onClick={() => setSortOpen(o => !o)}
              className="flex items-center gap-1.5 px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-[#F8FAFC] text-gray-600 hover:border-gray-300 min-h-[44px] whitespace-nowrap"
            >
              <span className="hidden sm:inline text-xs">{SORT_OPTIONS.find(s => s.value === sort)?.label}</span>
              <span className="sm:hidden text-xs">Sort</span>
              <ChevronDown size={13} className={`transition-transform ${sortOpen ? "rotate-180" : ""}`} />
            </button>
            {sortOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-100 rounded-xl shadow-lg z-30 w-44 py-1">
                {SORT_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => { setSort(opt.value); setSortOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm min-h-[44px] transition-colors ${
                      sort === opt.value ? "bg-blue-50 text-[#1E3A8A] font-semibold" : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Subject filter */}
        {availableSubjects.length > 0 && (
          <div className="px-3 sm:px-4 py-3 border-b border-gray-50">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Subject</p>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              <Pill active={!filters.subject} onClick={() => updateFilters({ subject: "" })}>All</Pill>
              {availableSubjects.map(s => (
                <Pill
                  key={s.id}
                  active={filters.subject === s.id}
                  onClick={() => updateFilters({ subject: filters.subject === s.id ? "" : s.id })}
                >
                  <SubjectIcon name={s.name} size={13} className="inline mr-1 -mt-0.5" /> {s.name}
                </Pill>
              ))}

            </div>
          </div>
        )}

        {/* Paper Type filter */}
        <div className="px-3 sm:px-4 py-3 border-b border-gray-50">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Paper Type</p>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <Pill active={!filters.type} onClick={() => updateFilters({ type: "" })}>All Types</Pill>
            {relevantTypes.map(t => {
              const cfg = PAPER_TYPE_CONFIG[t];
              return (
                <Pill
                  key={t}
                  active={filters.type === t}
                  onClick={() => updateFilters({ type: filters.type === t ? "" : t })}
                >
                  {cfg.label}
                </Pill>
              );
            })}
          </div>
        </div>

        {/* Year + Medium row */}
        <div className="px-3 sm:px-4 py-3">
          <div className="space-y-2.5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Year</p>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                <Pill active={!filters.year} onClick={() => updateFilters({ year: "" })}>All</Pill>
                {availableYears.map(y => (
                  <Pill
                    key={y}
                    active={filters.year === y}
                    onClick={() => updateFilters({ year: filters.year === y ? "" : y })}
                  >
                    {y}
                  </Pill>
                ))}

              </div>
            </div>

            {isBoard && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Medium</p>
                <div className="flex gap-2 flex-wrap">
                  {(["", "english", "semi-english", "marathi"] as const).map(m => (
                    <Pill
                      key={m}
                      active={filters.medium === m}
                      onClick={() => updateFilters({ medium: m as Medium | "" })}
                    >
                      {m === ""             ? "All"
                       : m === "english"     ? "English"
                       : m === "semi-english" ? "Semi-English"
                       : "Marathi"}
                    </Pill>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Active filter pills + clear */}
        {activeFilterCount > 0 && (
          <div className="px-3 sm:px-4 pb-3 flex flex-wrap gap-1.5 items-center border-t border-gray-50 pt-2.5">
            <span className="text-[10px] text-gray-400 font-medium">Active:</span>
            {filters.subject && (
              <span className="flex items-center gap-1 bg-blue-50 text-[#1E3A8A] border border-blue-100 text-[10px] px-2 py-0.5 rounded-full">
                {availableSubjects.find(s => s.id === filters.subject)?.name ?? filters.subject}
                <button onClick={() => updateFilters({ subject: "" })}><X size={10} /></button>
              </span>
            )}
            {filters.type && (
              <span className="flex items-center gap-1 bg-blue-50 text-[#1E3A8A] border border-blue-100 text-[10px] px-2 py-0.5 rounded-full">
                {PAPER_TYPE_CONFIG[filters.type]?.label}
                <button onClick={() => updateFilters({ type: "" })}><X size={10} /></button>
              </span>
            )}
            {filters.year && (
              <span className="flex items-center gap-1 bg-blue-50 text-[#1E3A8A] border border-blue-100 text-[10px] px-2 py-0.5 rounded-full">
                {filters.year}
                <button onClick={() => updateFilters({ year: "" })}><X size={10} /></button>
              </span>
            )}
            {filters.medium && (
              <span className="flex items-center gap-1 bg-blue-50 text-[#1E3A8A] border border-blue-100 text-[10px] px-2 py-0.5 rounded-full capitalize">
                {filters.medium}
                <button onClick={() => updateFilters({ medium: "" })}><X size={10} /></button>
              </span>
            )}
            <button onClick={clearFilters} className="text-[10px] text-red-500 hover:underline font-semibold ml-1">
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* ── Papers Grid ── */}
      {paginated.length === 0 ? (
        <div className="text-center py-16 text-gray-400 rounded-2xl" style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.9)", boxShadow: "0 2px 12px rgba(30,58,138,0.06)" }}>
          <FileText size={44} className="mx-auto mb-3 opacity-20" />
          <p className="text-gray-500 font-medium">No papers found</p>
          <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
          {activeFilterCount > 0 && (
            <button onClick={clearFilters} className="mt-3 text-[#1E3A8A] text-sm hover:underline">
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
          {paginated.map(paper => (
            <PaperCard
              key={paper.id}
              paper={paper}
              bookmarked={isBookmarked("paper", paper.id)}
              onView={() => { setSelectedPaperId(paper.id); setView("paper-detail"); }}
              onBookmark={() => toggleBookmark("paper", paper.id)}
            />
          ))}
        </div>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-1.5 pt-2 flex-wrap">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${
                page === p ? "bg-[#1E3A8A] text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-[#1E3A8A]"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      <style>{`
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: none; } }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
      `}</style>
    </div>
  );
}
