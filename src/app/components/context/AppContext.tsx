import React, { createContext, useContext, useState, ReactNode } from "react";
import type { Standard, Medium, QuizAttempt, Quiz, Question } from "../data/mockData";

export type View =
  | "landing" | "login" | "register" | "verify-otp" | "forgot-password" | "reset-password"
  | "onboarding"
  | "dashboard" | "papers" | "paper-detail" | "quizzes" | "quiz-detail"
  | "quiz-attempt" | "quiz-result" | "quiz-review" | "bookmarks" | "profile"
  | "admin-login" | "admin-dashboard" | "admin-papers" | "admin-paper-upload"
  | "admin-quizzes" | "admin-quiz-create" | "admin-quiz-edit" | "admin-quiz-preview"
  | "admin-users" | "admin-user-detail" | "admin-subjects" | "admin-announcements" | "admin-analytics";

export interface User {
  id: string;
  name: string;
  email: string;
  standard: Standard;
  medium: Medium;
  subjects: string[];
  streak: number;
  isAdmin: boolean;
  avatar?: string;
}

interface Bookmark {
  id: string;
  type: "paper" | "quiz";
  refId: string;
  createdAt: string;
}

interface AppContextType {
  view: View;
  setView: (v: View) => void;
  user: User | null;
  setUser: (u: User | null) => void;
  bookmarks: Bookmark[];
  toggleBookmark: (type: "paper" | "quiz", refId: string) => void;
  isBookmarked: (type: "paper" | "quiz", refId: string) => boolean;
  selectedPaperId: string | null;
  setSelectedPaperId: (id: string | null) => void;
  selectedQuizId: string | null;
  setSelectedQuizId: (id: string | null) => void;
  currentAttempt: ActiveAttempt | null;
  setCurrentAttempt: (a: ActiveAttempt | null) => void;
  completedAttempts: QuizAttempt[];
  addAttempt: (a: QuizAttempt) => void;
  lastAttemptId: string | null;
  setLastAttemptId: (id: string | null) => void;
  authEmail: string;
  setAuthEmail: (e: string) => void;
}

export interface ActiveAttempt {
  quizId: string;
  mode: "practice" | "exam";
  answers: Record<string, "A" | "B" | "C" | "D" | null>;
  startedAt: Date;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<View>("landing");
  const [user, setUser] = useState<User | null>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([
    { id: "bm1", type: "paper", refId: "p1", createdAt: "2025-01-05" },
    { id: "bm2", type: "quiz", refId: "qz1", createdAt: "2025-01-06" },
  ]);
  const [selectedPaperId, setSelectedPaperId] = useState<string | null>(null);
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [currentAttempt, setCurrentAttempt] = useState<ActiveAttempt | null>(null);
  const [completedAttempts, setCompletedAttempts] = useState<QuizAttempt[]>([
    { id: "att1", quizId: "qz2", quizTitle: "Mathematics - Trigonometry Basics", subject: "Mathematics", mode: "practice", totalScore: 8, maxScore: 10, percentage: 80, timeTakenSeconds: 420, isCompleted: true, submittedAt: "2025-01-08T10:30:00", answers: [] },
    { id: "att2", quizId: "qz7", quizTitle: "Mathematics - Quadratic Equations", subject: "Mathematics", mode: "exam", totalScore: 7, maxScore: 10, percentage: 70, timeTakenSeconds: 540, isCompleted: true, submittedAt: "2025-01-09T14:15:00", answers: [] },
  ]);
  const [lastAttemptId, setLastAttemptId] = useState<string | null>(null);
  const [authEmail, setAuthEmail] = useState("");

  const toggleBookmark = (type: "paper" | "quiz", refId: string) => {
    setBookmarks(prev => {
      const exists = prev.find(b => b.type === type && b.refId === refId);
      if (exists) return prev.filter(b => !(b.type === type && b.refId === refId));
      return [...prev, { id: `bm${Date.now()}`, type, refId, createdAt: new Date().toISOString().split("T")[0] }];
    });
  };

  const isBookmarked = (type: "paper" | "quiz", refId: string) =>
    bookmarks.some(b => b.type === type && b.refId === refId);

  const addAttempt = (a: QuizAttempt) => {
    setCompletedAttempts(prev => [a, ...prev]);
    setLastAttemptId(a.id);
  };

  return (
    <AppContext.Provider value={{
      view, setView, user, setUser, bookmarks, toggleBookmark, isBookmarked,
      selectedPaperId, setSelectedPaperId, selectedQuizId, setSelectedQuizId,
      currentAttempt, setCurrentAttempt, completedAttempts, addAttempt,
      lastAttemptId, setLastAttemptId, authEmail, setAuthEmail,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
