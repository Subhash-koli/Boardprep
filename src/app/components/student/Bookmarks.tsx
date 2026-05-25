import { Bookmark, BookOpen, Brain, Trash2, Eye, ChevronRight } from "lucide-react";
import { useApp } from "../context/AppContext";
import { papers, quizzes } from "../data/mockData";

export function Bookmarks() {
  const { bookmarks, toggleBookmark, setView, setSelectedPaperId, setSelectedQuizId } = useApp();

  const bookmarkedPapers = bookmarks
    .filter(b => b.type === "paper")
    .map(b => ({ bookmark: b, paper: papers.find(p => p.id === b.refId) }))
    .filter(b => b.paper);

  const bookmarkedQuizzes = bookmarks
    .filter(b => b.type === "quiz")
    .map(b => ({ bookmark: b, quiz: quizzes.find(q => q.id === b.refId) }))
    .filter(b => b.quiz);

  if (bookmarks.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <h2 className="text-xl mb-6" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, color: "#1E3A8A" }}>Bookmarks</h2>
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <Bookmark size={48} className="mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500 mb-2">No bookmarks yet</p>
          <p className="text-gray-400 text-sm mb-5">Save papers and quizzes for quick access</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => setView("papers")} className="bg-[#1E3A8A] text-white px-5 py-2 rounded-xl text-sm">Browse Papers</button>
            <button onClick={() => setView("quizzes")} className="border border-[#1E3A8A] text-[#1E3A8A] px-5 py-2 rounded-xl text-sm">Browse Quizzes</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-xl mb-1" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, color: "#1E3A8A" }}>Bookmarks</h2>
      <p className="text-gray-500 text-sm mb-5">{bookmarks.length} saved item{bookmarks.length !== 1 ? "s" : ""}</p>

      {bookmarkedPapers.length > 0 && (
        <div className="mb-6">
          <h3 className="flex items-center gap-2 mb-3" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "#1E3A8A" }}>
            <BookOpen size={17} /> Question Papers ({bookmarkedPapers.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {bookmarkedPapers.map(({ bookmark, paper }) => paper && (
              <div key={bookmark.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <BookOpen size={18} className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate" style={{ fontFamily: "Poppins, sans-serif" }}>{paper.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{paper.subject} · {paper.year} · {paper.marks} marks</p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => { setSelectedPaperId(paper.id); setView("paper-detail"); }}
                      className="text-xs bg-[#1E3A8A] text-white px-3 py-1 rounded-lg flex items-center gap-1"
                    >
                      <Eye size={11} /> View
                    </button>
                    <button
                      onClick={() => toggleBookmark("paper", paper.id)}
                      className="text-xs text-red-400 hover:text-red-600 border border-red-200 hover:bg-red-50 px-2 py-1 rounded-lg flex items-center gap-1 transition-colors"
                    >
                      <Trash2 size={11} /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {bookmarkedQuizzes.length > 0 && (
        <div>
          <h3 className="flex items-center gap-2 mb-3" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "#1E3A8A" }}>
            <Brain size={17} /> MCQ Quizzes ({bookmarkedQuizzes.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {bookmarkedQuizzes.map(({ bookmark, quiz }) => quiz && (
              <div key={bookmark.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-start gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Brain size={18} className="text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate" style={{ fontFamily: "Poppins, sans-serif" }}>{quiz.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{quiz.questionsCount} questions · {quiz.timeLimitMinutes} min · <span className="capitalize">{quiz.difficulty}</span></p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => { setSelectedQuizId(quiz.id); setView("quiz-detail"); }}
                      className="text-xs bg-purple-600 text-white px-3 py-1 rounded-lg flex items-center gap-1"
                    >
                      Start <ChevronRight size={11} />
                    </button>
                    <button
                      onClick={() => toggleBookmark("quiz", quiz.id)}
                      className="text-xs text-red-400 hover:text-red-600 border border-red-200 hover:bg-red-50 px-2 py-1 rounded-lg flex items-center gap-1 transition-colors"
                    >
                      <Trash2 size={11} /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
