import { useState } from "react";
import { Search, Filter, Brain, Clock, Target, ChevronRight, Bookmark, BookmarkCheck, X } from "lucide-react";
import { useApp } from "../context/AppContext";
import { quizzes, subjects } from "../data/mockData";
import type { Difficulty, Standard } from "../data/mockData";

export function QuizList() {
  const { user, setView, setSelectedQuizId, toggleBookmark, isBookmarked } = useApp();
  const [search, setSearch] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [filterDiff, setFilterDiff] = useState<Difficulty | "">("");
  const [showFilters, setShowFilters] = useState(false);

  const availableSubjects = subjects.filter(s => s.standard === (user?.standard as Standard));

  const filtered = quizzes.filter(q => {
    if (q.standard !== user?.standard) return false;
    if (q.status !== "published") return false;
    if (search && !q.title.toLowerCase().includes(search.toLowerCase()) && !q.subject.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterSubject && q.subjectId !== filterSubject) return false;
    if (filterDiff && q.difficulty !== filterDiff) return false;
    return true;
  });

  const diffColor: Record<Difficulty, string> = {
    easy: "bg-green-100 text-green-700",
    medium: "bg-orange-100 text-orange-700",
    hard: "bg-red-100 text-red-700",
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, color: "#1E3A8A" }}>MCQ Quizzes</h2>
          <p className="text-gray-500 text-sm mt-0.5">{user?.standard}th Standard · {filtered.length} quizzes available</p>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search quizzes by subject or chapter..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1E3A8A] bg-white"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm transition-colors ${showFilters ? "border-[#1E3A8A] bg-blue-50 text-[#1E3A8A]" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"}`}
        >
          <Filter size={15} /> Filters
        </button>
      </div>

      {showFilters && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Subject</label>
              <select
                value={filterSubject}
                onChange={e => setFilterSubject(e.target.value)}
                className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-[#1E3A8A] bg-gray-50"
              >
                <option value="">All Subjects</option>
                {availableSubjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Difficulty</label>
              <select
                value={filterDiff}
                onChange={e => setFilterDiff(e.target.value as Difficulty | "")}
                className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-[#1E3A8A] bg-gray-50"
              >
                <option value="">All Levels</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Brain size={48} className="mx-auto mb-3 opacity-30" />
          <p>No quizzes found. Try different filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map(quiz => {
            const bookmarked = isBookmarked("quiz", quiz.id);
            return (
              <div key={quiz.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex flex-wrap gap-2">
                    <span className={`text-xs px-2.5 py-1 rounded-full capitalize ${diffColor[quiz.difficulty]}`}>{quiz.difficulty}</span>
                    <span className="text-xs bg-blue-50 text-[#1E3A8A] px-2.5 py-1 rounded-full">{quiz.subject}</span>
                  </div>
                  <button
                    onClick={() => toggleBookmark("quiz", quiz.id)}
                    className={`ml-2 flex-shrink-0 ${bookmarked ? "text-[#F97316]" : "text-gray-300 hover:text-[#F97316]"} transition-colors`}
                  >
                    {bookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                  </button>
                </div>

                <h3 className="text-sm mb-1 leading-snug" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "#1E3A8A" }}>{quiz.title}</h3>
                <p className="text-xs text-gray-400 mb-3">{quiz.chapter}</p>

                <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
                  <span className="flex items-center gap-1"><Brain size={12} /> {quiz.questionsCount} questions</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> {quiz.timeLimitMinutes} min</span>
                  <span className="flex items-center gap-1"><Target size={12} /> {quiz.totalMarks} marks</span>
                </div>

                <div className="bg-gray-50 rounded-lg px-3 py-2 text-xs text-gray-500 mb-4 flex items-center justify-between">
                  <span>{quiz.analytics.totalAttempts.toLocaleString()} attempts</span>
                  <span>Avg score: <strong className="text-gray-700">{quiz.analytics.avgScore.toFixed(1)}/{quiz.totalMarks}</strong></span>
                </div>

                <button
                  onClick={() => { setSelectedQuizId(quiz.id); setView("quiz-detail"); }}
                  className="w-full bg-[#1E3A8A] hover:bg-blue-900 text-white py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  Start Quiz <ChevronRight size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
