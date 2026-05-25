import { useState } from "react";
import { Search, Filter, Eye, Download, Bookmark, BookmarkCheck, ChevronRight, FileText, X } from "lucide-react";
import { useApp } from "../context/AppContext";
import { papers, subjects } from "../data/mockData";
import type { PaperType, Standard, Medium } from "../data/mockData";

const YEARS = [2024, 2023, 2022, 2021, 2020];
const TYPES: { value: PaperType | ""; label: string }[] = [
  { value: "", label: "All Types" },
  { value: "board", label: "Board Exam" },
  { value: "model", label: "Model Paper" },
  { value: "practice", label: "Practice Set" },
];

export function PapersList() {
  const { user, setView, setSelectedPaperId, toggleBookmark, isBookmarked } = useApp();
  const [search, setSearch] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [filterYear, setFilterYear] = useState<number | "">("");
  const [filterType, setFilterType] = useState<PaperType | "">("");
  const [filterMedium, setFilterMedium] = useState<Medium | "">("");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);

  const PER_PAGE = 20;
  const availableSubjects = subjects.filter(s => s.standard === (user?.standard as Standard));

  const filtered = papers.filter(p => {
    if (p.status !== "published") return false;
    if (p.standard !== user?.standard) return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.subject.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterSubject && p.subjectId !== filterSubject) return false;
    if (filterYear && p.year !== filterYear) return false;
    if (filterType && p.type !== filterType) return false;
    if (filterMedium && p.medium !== filterMedium) return false;
    return true;
  });

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  const activeFilterCount = [filterSubject, filterYear, filterType, filterMedium].filter(Boolean).length;

  const clearFilters = () => {
    setFilterSubject(""); setFilterYear(""); setFilterType(""); setFilterMedium("");
  };

  const typeColor: Record<PaperType, string> = {
    board: "bg-blue-100 text-blue-700",
    model: "bg-purple-100 text-purple-700",
    practice: "bg-green-100 text-green-700",
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, color: "#1E3A8A" }}>Question Papers</h2>
          <p className="text-gray-500 text-sm mt-0.5">{user?.standard}th Standard · {filtered.length} papers found</p>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search papers by subject, year, topic..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1E3A8A] bg-white"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm transition-colors ${showFilters || activeFilterCount > 0 ? "border-[#1E3A8A] bg-blue-50 text-[#1E3A8A]" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"}`}
        >
          <Filter size={15} />
          Filters
          {activeFilterCount > 0 && <span className="bg-[#1E3A8A] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{activeFilterCount}</span>}
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="font-semibold text-sm" style={{ fontFamily: "Poppins, sans-serif", color: "#1E3A8A" }}>Filter Papers</span>
            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="text-xs text-gray-500 hover:text-red-500 flex items-center gap-1">
                <X size={12} /> Clear all
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Subject</label>
              <select
                value={filterSubject}
                onChange={e => { setFilterSubject(e.target.value); setPage(1); }}
                className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-[#1E3A8A] bg-gray-50"
              >
                <option value="">All Subjects</option>
                {availableSubjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Year</label>
              <select
                value={filterYear}
                onChange={e => { setFilterYear(e.target.value ? Number(e.target.value) : ""); setPage(1); }}
                className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-[#1E3A8A] bg-gray-50"
              >
                <option value="">All Years</option>
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Paper Type</label>
              <select
                value={filterType}
                onChange={e => { setFilterType(e.target.value as PaperType | ""); setPage(1); }}
                className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-[#1E3A8A] bg-gray-50"
              >
                {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Medium</label>
              <select
                value={filterMedium}
                onChange={e => { setFilterMedium(e.target.value as Medium | ""); setPage(1); }}
                className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-[#1E3A8A] bg-gray-50"
              >
                <option value="">All Mediums</option>
                <option value="english">English</option>
                <option value="semi-english">Semi-English</option>
                <option value="marathi">Marathi</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Papers Grid */}
      {paginated.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <FileText size={48} className="mx-auto mb-3 opacity-30" />
          <p className="text-gray-500">No papers found matching your filters.</p>
          <button onClick={clearFilters} className="mt-3 text-[#1E3A8A] text-sm hover:underline">Clear filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {paginated.map(paper => {
            const bookmarked = isBookmarked("paper", paper.id);
            return (
              <div key={paper.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${typeColor[paper.type]}`}>{paper.type === "board" ? "Board Exam" : paper.type === "model" ? "Model" : "Practice"}</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{paper.year}</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">{paper.medium}</span>
                  </div>
                  <button
                    onClick={() => toggleBookmark("paper", paper.id)}
                    className={`ml-2 flex-shrink-0 ${bookmarked ? "text-[#F97316]" : "text-gray-300 hover:text-[#F97316]"} transition-colors`}
                  >
                    {bookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                  </button>
                </div>
                <h3 className="text-sm leading-snug mb-1" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "#1E3A8A" }}>{paper.title}</h3>
                <p className="text-xs text-gray-400 mb-3">{paper.subject}</p>
                <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
                  <span>{paper.marks} marks</span>
                  <span>·</span>
                  <span>{paper.durationMinutes} min</span>
                  <span>·</span>
                  <span>{paper.analytics.downloads} downloads</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setSelectedPaperId(paper.id); setView("paper-detail"); }}
                    className="flex-1 bg-[#1E3A8A] hover:bg-blue-900 text-white py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Eye size={13} /> View Paper
                  </button>
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-xl text-xs flex items-center gap-1.5 transition-colors">
                    <Download size={13} /> PDF
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-8 h-8 rounded-lg text-sm ${page === p ? "bg-[#1E3A8A] text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-[#1E3A8A]"}`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
