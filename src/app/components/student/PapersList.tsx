import React, { useState, useRef, useEffect } from "react";
import {
  Eye, Download, Bookmark, BookmarkCheck, FileText,
  Clock, Award, ChevronRight, ArrowLeft, Folder, FolderOpen, List, FolderTree, Info, CheckCircle2
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { papers, PAPER_TYPE_CONFIG } from "../data/mockData";
import { MAIN_FOLDERS } from "./FolderExplorer";
import type { FolderNode } from "./FolderExplorer";

type SortKey = "popular" | "newest" | "oldest" | "marks-high" | "marks-low";

// ── Mobile Responsive Paper Row Component ─────────────────────────────────────
function PaperRow({
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
    <div className="group bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl rounded-2xl p-3.5 sm:p-4 border border-white/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        {/* Left: Icon + Title & Badges */}
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-600/15 text-[#1E3A8A] dark:text-blue-400 flex flex-col items-center justify-center font-bold flex-shrink-0 mt-0.5 border border-blue-500/20 shadow-2xs">
            <FileText size={16} className="sm:w-[18px] sm:h-[18px]" />
            <span className="text-[7px] sm:text-[8px] font-black tracking-wider uppercase text-blue-700 dark:text-blue-300 mt-0.5">PDF</span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap mb-1">
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-bold border flex-shrink-0"
                style={{ background: typeCfg.bg, color: typeCfg.text, borderColor: typeCfg.border }}
              >
                {typeCfg.label}
              </span>
              <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold px-2 py-0.5 rounded-full border border-slate-200/60 dark:border-slate-700">
                {p.year}
              </span>
              {p.medium && (
                <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium px-2 py-0.5 rounded-full capitalize border border-slate-200/60 dark:border-slate-700">
                  {p.medium}
                </span>
              )}
              {p.session && (
                <span className="text-[10px] bg-violet-50 text-violet-700 font-semibold px-2 py-0.5 rounded-full capitalize border border-violet-200/60">
                  {p.session}
                </span>
              )}
              {p.shift && (
                <span className="text-[10px] bg-sky-50 text-sky-700 font-semibold px-2 py-0.5 rounded-full capitalize border border-sky-200/60">
                  {p.shift.replace("-", " ")}
                </span>
              )}
            </div>

            <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm font-['Poppins'] group-hover:text-[#1E3A8A] dark:group-hover:text-blue-400 transition-colors leading-snug">
              {p.title}
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{p.subject}</p>
          </div>
        </div>

        {/* Middle & Right Footer Group on Mobile */}
        <div className="flex flex-wrap items-center justify-between md:justify-end gap-2.5 pt-2.5 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
          {/* Metadata Specs */}
          <div className="flex items-center gap-3 text-[11px] sm:text-xs font-semibold text-slate-600 dark:text-slate-300 md:border-x border-slate-100 dark:border-slate-800 md:px-4">
            <span className="flex items-center gap-1">
              <Award size={13} className="text-amber-500" /> {p.marks}M
            </span>
            <span className="flex items-center gap-1 text-violet-700 dark:text-violet-400">
              <Clock size={13} /> {p.durationMinutes}m
            </span>
            <span className="flex items-center gap-1 text-[#F97316]">
              <Download size={13} /> {(p.analytics.downloads / 1000).toFixed(1)}k
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setExpanded(e => !e)}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all border cursor-pointer ${
                expanded
                  ? "bg-blue-50 text-[#1E3A8A] border-blue-200"
                  : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200/80 dark:border-slate-700 hover:bg-slate-100"
              }`}
              title="Toggle details"
            >
              <Info size={14} />
            </button>
            <button
              onClick={onBookmark}
              className="text-slate-400 hover:text-[#F97316] transition-colors p-2 rounded-xl border border-slate-200/80 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              title={bookmarked ? "Remove Bookmark" : "Save Bookmark"}
            >
              {bookmarked ? (
                <BookmarkCheck size={15} className="text-[#F97316] fill-[#F97316]" />
              ) : (
                <Bookmark size={15} />
              )}
            </button>
            <button
              onClick={onView}
              className="bg-[#1E3A8A] hover:bg-[#1D4ED8] text-white px-3.5 py-2 rounded-xl text-xs font-bold font-['Poppins'] flex items-center gap-1 transition-colors shadow-xs active:scale-95 cursor-pointer min-h-[38px]"
            >
              <Eye size={13} /> View
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Spec Drawer */}
      {expanded && (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 bg-slate-50/80 dark:bg-slate-800/60 p-2.5 rounded-xl animate-fade-in">
          <div>
            <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-wider">Chapter / Context</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{p.chapter ?? "Full Syllabus Paper"}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-wider">Answer Key</span>
            <span className="font-semibold text-emerald-600 flex items-center gap-1 mt-0.5">
              <CheckCircle2 size={11} /> Solutions Included
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-wider">Views & Downloads</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{p.analytics.views.toLocaleString()} views</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export function PapersList() {
  const { setView, setSelectedPaperId, toggleBookmark, isBookmarked } = useApp();
  const [pathStack, setPathStack] = useState<FolderNode[]>([]);
  const [viewMode, setViewMode] = useState<"folders" | "flat">("folders");
  const [sort] = useState<SortKey>("popular");
  const [page, setPage] = useState(1);
  const PER_PAGE = 12;

  const breadcrumbRef = useRef<HTMLDivElement>(null);

  // Auto scroll breadcrumbs track rightward when navigating deeper
  useEffect(() => {
    if (breadcrumbRef.current) {
      breadcrumbRef.current.scrollLeft = breadcrumbRef.current.scrollWidth;
    }
  }, [pathStack]);

  // Active folder level
  const currentFolder = pathStack.length > 0 ? pathStack[pathStack.length - 1] : null;
  const childFolders = currentFolder ? currentFolder.children ?? [] : MAIN_FOLDERS;

  // Filter conditions
  const activeGoal = pathStack.find(f => f.goalCategory)?.goalCategory;
  const activeStream = pathStack.find(f => f.stream)?.stream;
  const activeSubject = pathStack.find(f => f.subject)?.subject;
  const activeYear = pathStack.find(f => f.year)?.year;
  const activePaperType = pathStack.find(f => f.paperType)?.paperType;

  // Filter matching papers
  let filtered = papers.filter(p => {
    if (p.status !== "published") return false;
    if (activeGoal && p.goalCategory !== activeGoal) return false;
    if (activeStream && p.stream && p.stream !== activeStream) return false;
    if (activeSubject && p.subject !== activeSubject) return false;
    if (activeYear && p.year !== activeYear) return false;
    if (activePaperType && p.type !== activePaperType) return false;
    return true;
  });

  // Sort
  filtered = [...filtered].sort((a, b) => {
    if (sort === "popular") return b.analytics.downloads - a.analytics.downloads;
    if (sort === "newest") return b.year - a.year;
    if (sort === "oldest") return a.year - b.year;
    if (sort === "marks-high") return b.marks - a.marks;
    if (sort === "marks-low") return a.marks - b.marks;
    return 0;
  });

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  // Helper count
  const countPapersInFolder = (fNode: FolderNode): number => {
    const targetGoal = fNode.goalCategory ?? activeGoal;
    const targetStream = fNode.stream ?? activeStream;
    const targetSubject = fNode.subject ?? activeSubject;
    const targetYear = fNode.year ?? activeYear;
    const targetPaperType = fNode.paperType ?? activePaperType;

    return papers.filter(p => {
      if (p.status !== "published") return false;
      if (targetGoal && p.goalCategory !== targetGoal) return false;
      if (targetStream && p.stream && p.stream !== targetStream) return false;
      if (targetSubject && p.subject !== targetSubject) return false;
      if (targetYear && p.year !== targetYear) return false;
      if (targetPaperType && p.type !== targetPaperType) return false;
      return true;
    }).length;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-3.5 min-w-0">

      {/* ── Top Header & Single-Line Scrollable Breadcrumbs Control Bar ── */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-3.5 sm:p-4 rounded-2xl border border-white/80 dark:border-slate-800 shadow-xs space-y-3 min-w-0">
        {/* Single-Line Scrollable Path Track */}
        <div className="flex items-center justify-between gap-2 min-w-0">
          <div
            ref={breadcrumbRef}
            className="flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-[#1E3A8A] dark:text-blue-400 font-['Poppins'] overflow-x-auto whitespace-nowrap py-1 scroll-smooth flex-1 min-w-0"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <button
              onClick={() => { setPathStack([]); setViewMode("folders"); }}
              className={`hover:underline flex items-center gap-1 cursor-pointer px-2.5 py-1 rounded-lg transition-colors flex-shrink-0 ${
                pathStack.length === 0
                  ? "text-slate-900 dark:text-white font-bold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  : "bg-blue-50 dark:bg-blue-900/40 text-[#1E3A8A] dark:text-blue-300 border border-blue-100 dark:border-blue-800"
              }`}
            >
              <FolderTree size={13} /> Root Directory
            </button>
            {pathStack.map((node, idx) => (
              <React.Fragment key={node.id}>
                <ChevronRight size={11} className="text-slate-400 flex-shrink-0" />
                <button
                  onClick={() => setPathStack(prev => prev.slice(0, idx + 1))}
                  className={`hover:underline cursor-pointer px-2 py-1 rounded-lg transition-colors flex-shrink-0 ${
                    idx === pathStack.length - 1
                      ? "text-slate-900 dark:text-white font-bold bg-slate-100 dark:bg-slate-800"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {node.name}
                </button>
              </React.Fragment>
            ))}
          </div>

          {pathStack.length > 0 && (
            <button
              onClick={() => setPathStack(prev => prev.slice(0, -1))}
              className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 flex items-center gap-1 cursor-pointer shadow-2xs active:scale-95 transition-all flex-shrink-0"
            >
              <ArrowLeft size={12} /> Back
            </button>
          )}
        </div>

        {/* Title & View Mode Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1 border-t border-slate-100 dark:border-slate-800">
          <h2 className="text-sm sm:text-lg font-bold text-slate-900 dark:text-white font-['Poppins'] flex items-center gap-2 leading-tight min-w-0">
            <FileText size={18} className="text-[#1E3A8A] dark:text-blue-400 flex-shrink-0" />
            <span className="whitespace-nowrap sm:whitespace-normal font-extrabold text-xs sm:text-lg tracking-tight">
              {currentFolder ? currentFolder.name : "Question Papers Explorer"}
            </span>
          </h2>

          {/* Segmented Switcher */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700 w-full sm:w-auto flex-shrink-0">
            <button
              onClick={() => setViewMode("folders")}
              className={`flex-1 sm:flex-none px-3 py-1 rounded-lg text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                viewMode === "folders"
                  ? "bg-white dark:bg-slate-900 text-[#1E3A8A] dark:text-blue-400 shadow-xs font-bold"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
            >
              <List size={13} /> Directory List
            </button>
            <button
              onClick={() => setViewMode("flat")}
              className={`flex-1 sm:flex-none px-3 py-1 rounded-lg text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                viewMode === "flat"
                  ? "bg-white dark:bg-slate-900 text-[#1E3A8A] dark:text-blue-400 shadow-xs font-bold"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
            >
              <FileText size={13} /> All Papers ({filtered.length})
            </button>
          </div>
        </div>
      </div>

      {/* ── Mode 1: Mobile Responsive Directory List Rows ── */}
      {viewMode === "folders" && childFolders.length > 0 ? (
        <div className="space-y-2">
          {childFolders.map(folder => {
            const paperCount = countPapersInFolder(folder);
            return (
              <div
                key={folder.id}
                onClick={() => setPathStack(prev => [...prev, folder])}
                className="group bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl rounded-2xl p-3.5 sm:p-4 border border-white/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.004] active:scale-[0.985] cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 overflow-hidden"
              >
                {/* Main Folder Info */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br ${folder.color ?? "from-blue-600 to-indigo-700"} text-white flex items-center justify-center font-bold shadow-xs group-hover:scale-105 transition-transform flex-shrink-0`}>
                    <Folder size={20} className="group-hover:hidden" />
                    <FolderOpen size={20} className="hidden group-hover:block" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base font-['Poppins'] group-hover:text-[#1E3A8A] dark:group-hover:text-blue-400 transition-colors leading-snug">
                        {folder.name}
                      </h3>
                      {folder.badge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/40 text-[#1E3A8A] dark:text-blue-300 border border-blue-100 dark:border-blue-800 flex-shrink-0">
                          {folder.badge}
                        </span>
                      )}
                    </div>
                    {folder.description && (
                      <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{folder.description}</p>
                    )}
                  </div>
                </div>

                {/* Right Side: Paper Count Badge & Arrow */}
                <div className="flex items-center justify-between sm:justify-end gap-2 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200/70 dark:border-slate-700 flex items-center gap-1.5">
                    <FileText size={12} className="text-[#1E3A8A] dark:text-blue-400" />
                    <span>{paperCount} Papers</span>
                  </span>
                  <ChevronRight size={16} className="text-slate-400 group-hover:text-[#1E3A8A] dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      {/* ── Mode 2 / Leaf View: Detailed Paper Rows ── */}
      {(viewMode === "flat" || childFolders.length === 0) && (
        <div className="space-y-2.5">
          {paginated.length === 0 ? (
            <div className="text-center py-14 text-slate-400 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/80 dark:border-slate-800 shadow-sm p-4">
              <FileText size={40} className="mx-auto mb-2 opacity-20" />
              <p className="text-slate-500 font-medium text-xs sm:text-sm">No papers found in this directory</p>
              <button onClick={() => setPathStack([])} className="mt-2 text-[#1E3A8A] dark:text-blue-400 text-xs font-semibold hover:underline">
                Back to Root Directory
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {paginated.map(paper => (
                <PaperRow
                  key={paper.id}
                  paper={paper}
                  bookmarked={isBookmarked("paper", paper.id)}
                  onView={() => { setSelectedPaperId(paper.id); setView("paper-detail"); }}
                  onBookmark={() => toggleBookmark("paper", paper.id)}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-1.5 pt-2 flex-wrap">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className={`w-8 h-8 rounded-xl text-xs font-medium transition-all ${
                    page === p ? "bg-[#1E3A8A] text-white" : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-[#1E3A8A]"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
