import React, { useState, useRef, useEffect } from "react";
import {
  Brain, Clock, Target, ChevronRight, Bookmark, BookmarkCheck, Zap,
  Folder, FolderOpen, ArrowLeft, List, FolderTree, Award, Info
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { quizzes, DIFFICULTY_CONFIG } from "../data/mockData";
import { MAIN_FOLDERS } from "./FolderExplorer";
import type { FolderNode } from "./FolderExplorer";

function MarkingSchemePill({ correct, wrong }: { correct: number; wrong: number }) {
  const hasNeg = wrong < 0;
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${hasNeg ? "bg-red-50 text-red-600 border-red-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"}`}>
      <Zap size={8} />
      +{correct}{hasNeg ? ` / ${wrong}` : " / 0"}
    </span>
  );
}

// ── Mobile Responsive Quiz Row Component ──────────────────────────────────────
function QuizRow({
  quiz,
  bookmarked,
  bestScore,
  onStart,
  onBookmark,
}: {
  quiz: (typeof quizzes)[number];
  bookmarked: boolean;
  bestScore?: number;
  onStart: () => void;
  onBookmark: () => void;
}) {
  const diffCfg = DIFFICULTY_CONFIG[quiz.difficulty] ?? DIFFICULTY_CONFIG.medium;
  const hasAttempted = bestScore !== undefined;
  const { markingScheme: ms } = quiz;
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="group bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl rounded-2xl p-3.5 sm:p-4 border border-white/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        {/* Left: Icon + Title & Badges */}
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-violet-500/10 to-indigo-600/15 text-[#1E3A8A] dark:text-violet-400 flex flex-col items-center justify-center font-bold flex-shrink-0 mt-0.5 border border-violet-500/20 shadow-2xs">
            <Brain size={16} className="sm:w-[18px] sm:h-[18px]" />
            <span className="text-[7px] sm:text-[8px] font-black tracking-wider uppercase text-violet-700 dark:text-violet-300 mt-0.5">QUIZ</span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap mb-1">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${diffCfg.bg} ${diffCfg.text}`}>
                {diffCfg.label}
              </span>
              <MarkingSchemePill correct={ms.correctMarks} wrong={ms.wrongMarks} />
              {hasAttempted && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#1E3A8A]/10 text-[#1E3A8A] border border-[#1E3A8A]/20">
                  Best {bestScore}%
                </span>
              )}
            </div>

            <h3 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm font-['Poppins'] group-hover:text-[#1E3A8A] dark:group-hover:text-blue-400 transition-colors leading-snug">
              {quiz.title}
            </h3>
            {quiz.chapter && (
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{quiz.chapter}</p>
            )}
          </div>
        </div>

        {/* Middle & Right Footer Group on Mobile */}
        <div className="flex flex-wrap items-center justify-between md:justify-end gap-2.5 pt-2.5 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
          {/* Metadata Specs */}
          <div className="flex items-center gap-3 text-[11px] sm:text-xs font-semibold text-slate-600 dark:text-slate-300 md:border-x border-slate-100 dark:border-slate-800 md:px-4">
            <span className="flex items-center gap-1">
              <Target size={13} className="text-slate-400" /> {quiz.questionsCount}Q
            </span>
            <span className="flex items-center gap-1 text-violet-700 dark:text-violet-400">
              <Clock size={13} /> {quiz.timeLimitMinutes}m
            </span>
            <span className="flex items-center gap-1 text-[#F97316]">
              <Award size={13} /> {quiz.totalMarks}M
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
              onClick={onStart}
              className="bg-[#1E3A8A] hover:bg-[#1D4ED8] text-white px-3.5 py-2 rounded-xl text-xs font-bold font-['Poppins'] flex items-center gap-1 transition-colors shadow-xs active:scale-95 cursor-pointer min-h-[38px]"
            >
              {hasAttempted ? "Retake" : "Start"}
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Spec Drawer */}
      {expanded && (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 bg-slate-50/80 dark:bg-slate-800/60 p-2.5 rounded-xl animate-fade-in">
          <div>
            <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-wider">Marking Rule</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{ms.label}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-wider">Total Attempts</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{quiz.analytics.totalAttempts.toLocaleString()} Students</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-wider">Average Score</span>
            <span className="font-semibold text-blue-700 dark:text-blue-400">{quiz.analytics.avgScore} / {quiz.totalMarks} Marks</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export function QuizList() {
  const { setView, setSelectedQuizId, toggleBookmark, isBookmarked, completedAttempts } = useApp();
  const [pathStack, setPathStack] = useState<FolderNode[]>([]);
  const [viewMode, setViewMode] = useState<"folders" | "flat">("folders");

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

  // Filter matching quizzes
  const filtered = quizzes.filter(q => {
    if (q.status !== "published") return false;
    if (activeGoal && q.goalCategory !== activeGoal) return false;
    if (activeStream && q.stream && q.stream !== activeStream) return false;
    if (activeSubject && q.subject !== activeSubject) return false;
    return true;
  });

  // Helper count
  const countQuizzesInFolder = (fNode: FolderNode): number => {
    const targetGoal = fNode.goalCategory ?? activeGoal;
    const targetStream = fNode.stream ?? activeStream;
    const targetSubject = fNode.subject ?? activeSubject;

    return quizzes.filter(q => {
      if (q.status !== "published") return false;
      if (targetGoal && q.goalCategory !== targetGoal) return false;
      if (targetStream && q.stream && q.stream !== targetStream) return false;
      if (targetSubject && q.subject !== targetSubject) return false;
      return true;
    }).length;
  };

  // Map quizId → best attempt percentage
  const bestScoreMap: Record<string, number> = {};
  completedAttempts.filter(a => !activeGoal || a.goalCategory === activeGoal).forEach(a => {
    if (!bestScoreMap[a.quizId] || a.percentage > bestScoreMap[a.quizId]) {
      bestScoreMap[a.quizId] = a.percentage;
    }
  });

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
            <Brain size={18} className="text-[#1E3A8A] dark:text-blue-400 flex-shrink-0" />
            <span className="whitespace-nowrap sm:whitespace-normal font-extrabold text-xs sm:text-lg tracking-tight">
              {currentFolder ? currentFolder.name : "Instant Rank Challenger Explorer"}
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
              <Brain size={13} /> All Quizzes ({filtered.length})
            </button>
          </div>
        </div>
      </div>

      {/* ── Mode 1: Mobile Responsive Directory List Rows ── */}
      {viewMode === "folders" && childFolders.length > 0 ? (
        <div className="space-y-2">
          {childFolders.map(folder => {
            const quizCount = countQuizzesInFolder(folder);
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

                {/* Right Side: Quiz Count Badge & Arrow */}
                <div className="flex items-center justify-between sm:justify-end gap-2 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200/70 dark:border-slate-700 flex items-center gap-1.5">
                    <Brain size={12} className="text-[#1E3A8A] dark:text-blue-400" />
                    <span>{quizCount} Quizzes</span>
                  </span>
                  <ChevronRight size={16} className="text-slate-400 group-hover:text-[#1E3A8A] dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      {/* ── Mode 2 / Leaf View: Detailed Quiz Rows ── */}
      {(viewMode === "flat" || childFolders.length === 0) && (
        <div className="space-y-2.5">
          {filtered.length === 0 ? (
            <div className="text-center py-14 text-slate-400 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/80 dark:border-slate-800 shadow-sm p-4">
              <Brain size={40} className="mx-auto mb-2 opacity-20" />
              <p className="text-slate-500 font-medium text-xs sm:text-sm">No rank challenges found in this directory</p>
              <button onClick={() => setPathStack([])} className="mt-2 text-[#1E3A8A] dark:text-blue-400 text-xs font-semibold hover:underline">
                Back to Root Directory
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filtered.map(quiz => {
                const bookmarked = isBookmarked("quiz", quiz.id);
                const bestScore = bestScoreMap[quiz.id];

                return (
                  <QuizRow
                    key={quiz.id}
                    quiz={quiz}
                    bookmarked={bookmarked}
                    bestScore={bestScore}
                    onStart={() => {
                      setSelectedQuizId(quiz.id);
                      setView("quiz-detail");
                    }}
                    onBookmark={() => toggleBookmark("quiz", quiz.id)}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
