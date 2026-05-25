import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Clock, CheckCircle, XCircle, ChevronLeft, ChevronRight, Flag, Send, Brain, Target, Timer, BookOpen } from "lucide-react";
import { useApp } from "../context/AppContext";
import { quizzes } from "../data/mockData";
import type { QuizAttempt } from "../data/mockData";

// --- Quiz Detail Page ---
export function QuizDetail() {
  const { selectedQuizId, setView, setCurrentAttempt } = useApp();
  const [selectedMode, setSelectedMode] = useState<"practice" | "exam" | null>(null);

  const quiz = quizzes.find(q => q.id === selectedQuizId);
  if (!quiz) return (
    <div className="text-center py-20">
      <p className="text-gray-400">Quiz not found.</p>
      <button onClick={() => setView("quizzes")} className="text-[#1E3A8A] mt-3">Back</button>
    </div>
  );

  const startQuiz = () => {
    if (!selectedMode) return;
    setCurrentAttempt({
      quizId: quiz.id,
      mode: selectedMode,
      answers: {},
      startedAt: new Date(),
    });
    setView("quiz-attempt");
  };

  const diffColor = { easy: "text-green-600 bg-green-50", medium: "text-orange-600 bg-orange-50", hard: "text-red-600 bg-red-50" };

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={() => setView("quizzes")} className="flex items-center gap-2 text-gray-500 hover:text-[#1E3A8A] mb-4 text-sm">
        <ArrowLeft size={16} /> Back to Quizzes
      </button>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`text-xs px-2.5 py-1 rounded-full capitalize ${diffColor[quiz.difficulty]}`}>{quiz.difficulty}</span>
          <span className="text-xs bg-blue-50 text-[#1E3A8A] px-2.5 py-1 rounded-full">{quiz.subject}</span>
        </div>
        <h1 className="text-xl mb-1" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, color: "#1E3A8A" }}>{quiz.title}</h1>
        <p className="text-gray-500 text-sm mb-5">{quiz.chapter}</p>

        <div className="grid grid-cols-3 gap-4 mb-5">
          {[
            { icon: Brain, label: "Questions", value: quiz.questionsCount },
            { icon: Clock, label: "Time Limit", value: `${quiz.timeLimitMinutes} min` },
            { icon: Target, label: "Total Marks", value: quiz.totalMarks },
          ].map(s => (
            <div key={s.label} className="text-center bg-gray-50 rounded-xl p-3">
              <s.icon size={18} className="mx-auto text-[#1E3A8A] mb-1" />
              <div className="font-semibold text-sm" style={{ fontFamily: "Poppins, sans-serif", color: "#1E3A8A" }}>{s.value}</div>
              <div className="text-xs text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 rounded-xl p-4 mb-5">
          <p className="text-xs text-[#1E3A8A] font-semibold mb-1">Instructions</p>
          <p className="text-xs text-blue-700 leading-relaxed">{quiz.instructions}</p>
        </div>

        <h3 className="mb-3" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "#1E3A8A" }}>Select Quiz Mode</h3>
        <div className="grid grid-cols-2 gap-4 mb-5">
          {([
            { mode: "practice", icon: BookOpen, title: "Practice Mode", desc: "Get instant feedback after each question. Best for learning.", badge: "Recommended" },
            { mode: "exam", icon: Timer, title: "Exam Mode", desc: "Answer all questions first, then see results. Simulates real exam.", badge: "" },
          ] as const).map(m => (
            <button
              key={m.mode}
              onClick={() => setSelectedMode(m.mode)}
              className={`border-2 rounded-xl p-4 text-left transition-all ${selectedMode === m.mode ? "border-[#1E3A8A] bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}
            >
              <m.icon size={22} className={`mb-2 ${selectedMode === m.mode ? "text-[#1E3A8A]" : "text-gray-500"}`} />
              <div className="font-semibold text-sm mb-1 flex items-center gap-1.5" style={{ fontFamily: "Poppins, sans-serif", color: selectedMode === m.mode ? "#1E3A8A" : "#374151" }}>
                {m.title}
                {m.badge && <span className="text-xs bg-[#F97316] text-white px-1.5 py-0.5 rounded-full">{m.badge}</span>}
              </div>
              <p className="text-xs text-gray-500">{m.desc}</p>
            </button>
          ))}
        </div>

        <button
          onClick={startQuiz}
          disabled={!selectedMode}
          className="w-full bg-[#1E3A8A] hover:bg-blue-900 disabled:bg-gray-200 disabled:text-gray-400 text-white py-3 rounded-xl transition-colors font-semibold flex items-center justify-center gap-2"
        >
          {selectedMode ? `Start ${selectedMode === "practice" ? "Practice" : "Exam"} Mode` : "Select a mode to start"} <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

// --- Quiz Attempt Page ---
export function QuizAttempt() {
  const { currentAttempt, setCurrentAttempt, setView, addAttempt } = useApp();
  const quiz = quizzes.find(q => q.id === currentAttempt?.quizId);
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, "A" | "B" | "C" | "D" | null>>(currentAttempt?.answers || {});
  const [showFeedback, setShowFeedback] = useState(false);
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [timeLeft, setTimeLeft] = useState((quiz?.timeLimitMinutes || 15) * 60);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (currentAttempt?.mode !== "exam") return;
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(interval); handleSubmit(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentAttempt?.mode]);

  const handleSubmit = useCallback(() => {
    if (submitted || !quiz || !currentAttempt) return;
    setSubmitted(true);
    const attemptAnswers = quiz.questions.map(q => ({
      questionId: q.id,
      selectedOption: answers[q.id] || null,
      isCorrect: answers[q.id] === q.correctOption,
      marksAwarded: answers[q.id] === q.correctOption ? q.marks : 0,
    }));
    const totalScore = attemptAnswers.reduce((sum, a) => sum + a.marksAwarded, 0);
    const attempt: QuizAttempt = {
      id: `att_${Date.now()}`,
      quizId: quiz.id,
      quizTitle: quiz.title,
      subject: quiz.subject,
      mode: currentAttempt.mode,
      totalScore,
      maxScore: quiz.totalMarks,
      percentage: Math.round((totalScore / quiz.totalMarks) * 100),
      timeTakenSeconds: (quiz.timeLimitMinutes * 60) - timeLeft,
      isCompleted: true,
      submittedAt: new Date().toISOString(),
      answers: attemptAnswers,
    };
    addAttempt(attempt);
    setCurrentAttempt(null);
    setView("quiz-result");
  }, [answers, quiz, currentAttempt, timeLeft, submitted]);

  if (!quiz || !currentAttempt) return (
    <div className="text-center py-20">
      <p className="text-gray-400">No active quiz.</p>
      <button onClick={() => setView("quizzes")} className="text-[#1E3A8A] mt-3">Back to Quizzes</button>
    </div>
  );

  const q = quiz.questions[qIndex];
  const isPractice = currentAttempt.mode === "practice";
  const hasAnswered = q.id in answers && answers[q.id] !== null;
  const selectedOpt = answers[q.id];
  const isCorrect = selectedOpt === q.correctOption;

  const selectAnswer = (opt: "A" | "B" | "C" | "D") => {
    if (isPractice && hasAnswered) return;
    setAnswers(prev => ({ ...prev, [q.id]: opt }));
    if (isPractice) setShowFeedback(true);
  };

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timerWarning = timeLeft < 120;

  const optionLabels = ["A", "B", "C", "D"] as const;
  const optionTexts = [q.optionA, q.optionB, q.optionC, q.optionD];

  const getOptionStyle = (opt: "A" | "B" | "C" | "D") => {
    if (!isPractice) {
      return selectedOpt === opt
        ? "border-[#1E3A8A] bg-blue-50 text-[#1E3A8A]"
        : "border-gray-200 hover:border-gray-300 text-gray-700";
    }
    if (!hasAnswered) return "border-gray-200 hover:border-[#1E3A8A] hover:bg-blue-50 text-gray-700";
    if (opt === q.correctOption) return "border-green-400 bg-green-50 text-green-700";
    if (opt === selectedOpt && !isCorrect) return "border-red-400 bg-red-50 text-red-600";
    return "border-gray-100 bg-gray-50 text-gray-400";
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide">{isPractice ? "Practice Mode" : "Exam Mode"}</p>
          <h3 className="text-sm" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, color: "#1E3A8A" }}>{quiz.title}</h3>
        </div>
        {!isPractice && (
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold ${timerWarning ? "bg-red-100 text-red-600" : "bg-blue-50 text-[#1E3A8A]"}`}>
            <Clock size={15} />
            {mins.toString().padStart(2, "0")}:{secs.toString().padStart(2, "0")}
          </div>
        )}
      </div>

      {/* Progress */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500">Question {qIndex + 1} of {quiz.questions.length}</span>
          <span className="text-xs text-gray-500">{Object.keys(answers).length} answered</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-[#1E3A8A] rounded-full transition-all" style={{ width: `${((qIndex + 1) / quiz.questions.length) * 100}%` }} />
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <span className="text-xs text-gray-400 mb-2 block">Question {qIndex + 1} · {q.marks} mark{q.marks > 1 ? "s" : ""}</span>
            <p className="text-gray-800 leading-relaxed">{q.text}</p>
          </div>
          <button
            onClick={() => setFlagged(prev => { const s = new Set(prev); s.has(q.id) ? s.delete(q.id) : s.add(q.id); return s; })}
            className={`ml-3 flex-shrink-0 ${flagged.has(q.id) ? "text-[#F97316]" : "text-gray-300 hover:text-[#F97316]"} transition-colors`}
          >
            <Flag size={16} />
          </button>
        </div>

        <div className="space-y-2">
          {optionLabels.map((opt, i) => (
            <button
              key={opt}
              onClick={() => selectAnswer(opt)}
              disabled={isPractice && hasAnswered}
              className={`w-full text-left flex items-center gap-3 p-4 border-2 rounded-xl transition-all disabled:cursor-default ${getOptionStyle(opt)}`}
            >
              <span className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-sm flex-shrink-0 ${selectedOpt === opt || (isPractice && hasAnswered && opt === q.correctOption) ? "border-current bg-current/10" : "border-gray-300"}`} style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
                {opt}
              </span>
              <span className="text-sm">{optionTexts[i]}</span>
              {isPractice && hasAnswered && opt === q.correctOption && <CheckCircle size={16} className="ml-auto text-green-500 flex-shrink-0" />}
              {isPractice && hasAnswered && opt === selectedOpt && !isCorrect && opt !== q.correctOption && <XCircle size={16} className="ml-auto text-red-500 flex-shrink-0" />}
            </button>
          ))}
        </div>

        {/* Feedback (Practice Mode) */}
        {isPractice && hasAnswered && (
          <div className={`mt-4 p-4 rounded-xl ${isCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
            <div className="flex items-center gap-2 mb-2">
              {isCorrect ? <CheckCircle size={16} className="text-green-600" /> : <XCircle size={16} className="text-red-600" />}
              <span className="font-semibold text-sm" style={{ fontFamily: "Poppins, sans-serif", color: isCorrect ? "#16A34A" : "#DC2626" }}>
                {isCorrect ? "Correct!" : `Wrong! Correct answer: ${q.correctOption}`}
              </span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">{q.explanation}</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => { setQIndex(i => i - 1); setShowFeedback(false); }}
          disabled={qIndex === 0}
          className="flex items-center gap-1.5 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
        >
          <ChevronLeft size={16} /> Previous
        </button>
        {qIndex < quiz.questions.length - 1 ? (
          <button
            onClick={() => { setQIndex(i => i + 1); setShowFeedback(false); }}
            className="flex-1 bg-[#1E3A8A] hover:bg-blue-900 text-white py-2.5 rounded-xl text-sm flex items-center justify-center gap-1.5 transition-colors"
          >
            Next <ChevronRight size={16} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="flex-1 bg-[#F97316] hover:bg-orange-600 text-white py-2.5 rounded-xl text-sm flex items-center justify-center gap-1.5 transition-colors font-semibold"
          >
            <Send size={15} /> Submit Quiz
          </button>
        )}
      </div>

      {/* Question Navigator */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <p className="text-xs text-gray-500 mb-3">Question Navigator</p>
        <div className="flex flex-wrap gap-2">
          {quiz.questions.map((question, i) => {
            const answered = question.id in answers && answers[question.id];
            const flaggedQ = flagged.has(question.id);
            return (
              <button
                key={question.id}
                onClick={() => { setQIndex(i); setShowFeedback(false); }}
                className={`w-8 h-8 rounded-lg text-xs transition-all border ${i === qIndex ? "bg-[#1E3A8A] text-white border-[#1E3A8A]" : answered ? "bg-blue-50 text-[#1E3A8A] border-blue-200" : flaggedQ ? "bg-orange-50 text-[#F97316] border-orange-200" : "bg-gray-50 text-gray-500 border-gray-200"}`}
                style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-blue-50 border border-blue-200 inline-block" /> Answered</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-gray-50 border border-gray-200 inline-block" /> Not visited</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-orange-50 border border-orange-200 inline-block" /> Flagged</span>
        </div>
      </div>

      {/* Submit button (visible any time in exam mode) */}
      {!isPractice && (
        <button
          onClick={handleSubmit}
          className="w-full mt-4 bg-[#F97316] hover:bg-orange-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <Send size={16} /> Submit All Answers
        </button>
      )}
    </div>
  );
}

// --- Quiz Result Page ---
export function QuizResult() {
  const { completedAttempts, setView, setSelectedQuizId, setCurrentAttempt } = useApp();
  const attempt = completedAttempts[0];
  const quiz = quizzes.find(q => q.id === attempt?.quizId);

  if (!attempt || !quiz) return (
    <div className="text-center py-20">
      <p className="text-gray-400">No result available.</p>
      <button onClick={() => setView("quizzes")} className="text-[#1E3A8A] mt-3">Back to Quizzes</button>
    </div>
  );

  const pct = attempt.percentage;
  const passed = pct >= 60;
  const mins = Math.floor(attempt.timeTakenSeconds / 60);
  const secs = attempt.timeTakenSeconds % 60;
  const correct = attempt.answers.filter(a => a.isCorrect).length;
  const wrong = attempt.answers.length - correct;
  const unattempted = quiz.questions.length - attempt.answers.length;

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5 text-center">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${passed ? "bg-green-100" : "bg-red-100"}`}>
          {passed ? <CheckCircle size={36} className="text-green-600" /> : <XCircle size={36} className="text-red-500" />}
        </div>
        <h1 className="text-2xl mb-1" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, color: passed ? "#16A34A" : "#DC2626" }}>
          {passed ? "Great Job!" : "Keep Practicing!"}
        </h1>
        <p className="text-gray-500 text-sm mb-5">{quiz.title}</p>

        <div className="relative w-32 h-32 mx-auto mb-5">
          <svg className="w-32 h-32 -rotate-90">
            <circle cx="64" cy="64" r="56" fill="none" stroke="#F1F5F9" strokeWidth="8" />
            <circle cx="64" cy="64" r="56" fill="none" stroke={passed ? "#16A34A" : "#DC2626"} strokeWidth="8"
              strokeDasharray={`${(pct / 100) * 351.86} 351.86`} strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, color: passed ? "#16A34A" : "#DC2626" }}>{pct}%</span>
            <span className="text-xs text-gray-400">{attempt.totalScore}/{attempt.maxScore}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: "Correct", value: correct, color: "text-green-600 bg-green-50" },
            { label: "Wrong", value: wrong, color: "text-red-500 bg-red-50" },
            { label: "Skipped", value: unattempted, color: "text-gray-500 bg-gray-50" },
          ].map(s => (
            <div key={s.label} className={`rounded-xl p-3 ${s.color}`}>
              <div className="text-xl" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700 }}>{s.value}</div>
              <div className="text-xs">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-6 bg-gray-50 rounded-xl p-3">
          <Clock size={15} />
          Time taken: <strong>{mins}m {secs}s</strong>
          &nbsp;·&nbsp;
          Mode: <strong className="capitalize">{attempt.mode}</strong>
        </div>

        <div className="flex flex-col gap-3">
          <button onClick={() => setView("quiz-review")} className="w-full bg-[#1E3A8A] hover:bg-blue-900 text-white py-3 rounded-xl transition-colors font-semibold">
            Review Answers
          </button>
          <button
            onClick={() => {
              setSelectedQuizId(quiz.id);
              setCurrentAttempt({ quizId: quiz.id, mode: attempt.mode, answers: {}, startedAt: new Date() });
              setView("quiz-attempt");
            }}
            className="w-full border border-[#1E3A8A] text-[#1E3A8A] hover:bg-blue-50 py-3 rounded-xl transition-colors"
          >
            Reattempt Quiz
          </button>
          <button onClick={() => setView("quizzes")} className="text-gray-400 hover:text-gray-600 text-sm">
            Back to Quizzes
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Quiz Review Page ---
export function QuizReview() {
  const { completedAttempts, setView } = useApp();
  const attempt = completedAttempts[0];
  const quiz = quizzes.find(q => q.id === attempt?.quizId);

  if (!attempt || !quiz) return (
    <div className="text-center py-20">
      <p className="text-gray-400">No review available.</p>
      <button onClick={() => setView("quizzes")} className="text-[#1E3A8A] mt-3">Back</button>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={() => setView("quiz-result")} className="flex items-center gap-2 text-gray-500 hover:text-[#1E3A8A] mb-4 text-sm">
        <ArrowLeft size={16} /> Back to Result
      </button>
      <h2 className="text-xl mb-5" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, color: "#1E3A8A" }}>Review Answers</h2>

      <div className="space-y-4">
        {quiz.questions.map((q, i) => {
          const ans = attempt.answers.find(a => a.questionId === q.id);
          const selected = ans?.selectedOption || null;
          const correct = q.correctOption;
          const isRight = selected === correct;
          const skipped = !selected;
          const optionTexts = [q.optionA, q.optionB, q.optionC, q.optionD];
          const optLabels = ["A", "B", "C", "D"] as const;

          return (
            <div key={q.id} className={`bg-white rounded-2xl border shadow-sm p-5 ${isRight ? "border-green-200" : skipped ? "border-gray-200" : "border-red-200"}`}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-gray-400">Q{i + 1}</span>
                {skipped ? (
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Skipped</span>
                ) : isRight ? (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle size={10} /> Correct</span>
                ) : (
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full flex items-center gap-1"><XCircle size={10} /> Wrong</span>
                )}
              </div>
              <p className="text-gray-800 text-sm mb-3">{q.text}</p>
              <div className="space-y-1.5 mb-3">
                {optLabels.map((opt, j) => (
                  <div
                    key={opt}
                    className={`flex items-center gap-2 p-2.5 rounded-lg text-sm ${opt === correct ? "bg-green-50 border border-green-200 text-green-700" : opt === selected && !isRight ? "bg-red-50 border border-red-200 text-red-600" : "bg-gray-50 text-gray-500"}`}
                  >
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 border" style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600, borderColor: "currentColor" }}>{opt}</span>
                    <span>{optionTexts[j]}</span>
                    {opt === correct && <CheckCircle size={13} className="ml-auto text-green-500" />}
                    {opt === selected && !isRight && <XCircle size={13} className="ml-auto text-red-500" />}
                  </div>
                ))}
              </div>
              <div className="bg-blue-50 rounded-lg p-3 text-xs text-blue-700">
                <span className="font-semibold">Explanation: </span>{q.explanation}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
