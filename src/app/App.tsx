import { AppProvider, useApp } from "./components/context/AppContext";
import { LandingPage } from "./components/LandingPage";
import { LoginPage, RegisterPage, VerifyOTPPage, ForgotPasswordPage, ResetPasswordPage } from "./components/AuthPages";
import { OnboardingFlow } from "./components/OnboardingFlow";
import { StudentLayout } from "./components/student/StudentLayout";
import { Dashboard } from "./components/student/Dashboard";
import { PapersList } from "./components/student/PapersList";
import { PaperDetail } from "./components/student/PaperDetail";
import { QuizList } from "./components/student/QuizList";
import { QuizDetail, QuizAttempt, QuizResult, QuizReview } from "./components/student/QuizEngine";
import { Bookmarks } from "./components/student/Bookmarks";
import { Profile } from "./components/student/Profile";
import { AdminLogin } from "./components/admin/AdminLogin";
import { AdminLayout } from "./components/admin/AdminLayout";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { AdminPapers } from "./components/admin/AdminPapers";
import { AdminQuizzes } from "./components/admin/AdminQuizzes";
import { AdminUsers } from "./components/admin/AdminUsers";
import { AdminAnnouncements } from "./components/admin/AdminAnnouncements";
import { AdminSubjects } from "./components/admin/AdminSubjects";
import { AdminAnalytics } from "./components/admin/AdminAnalytics";

const ADMIN_VIEWS = [
  "admin-dashboard", "admin-papers", "admin-paper-upload",
  "admin-quizzes", "admin-quiz-create", "admin-quiz-edit", "admin-quiz-preview",
  "admin-users", "admin-user-detail", "admin-subjects", "admin-announcements", "admin-analytics",
];

const STUDENT_VIEWS = [
  "dashboard", "papers", "paper-detail", "quizzes", "quiz-detail",
  "quiz-attempt", "quiz-result", "quiz-review", "bookmarks", "profile",
];

function AppContent() {
  const { view } = useApp();

  // Public pages (no layout wrapper)
  if (view === "landing") return <LandingPage />;
  if (view === "login") return <LoginPage />;
  if (view === "register") return <RegisterPage />;
  if (view === "verify-otp") return <VerifyOTPPage />;
  if (view === "forgot-password") return <ForgotPasswordPage />;
  if (view === "reset-password") return <ResetPasswordPage />;
  if (view === "onboarding") return <OnboardingFlow />;
  if (view === "admin-login") return <AdminLogin />;

  // Admin panel
  if (ADMIN_VIEWS.includes(view)) {
    return (
      <AdminLayout>
        {view === "admin-dashboard" && <AdminDashboard />}
        {view === "admin-papers" && <AdminPapers />}
        {(view === "admin-paper-upload") && <AdminPapers />}
        {(view === "admin-quizzes" || view === "admin-quiz-create" || view === "admin-quiz-edit" || view === "admin-quiz-preview") && <AdminQuizzes />}
        {(view === "admin-users" || view === "admin-user-detail") && <AdminUsers />}
        {view === "admin-announcements" && <AdminAnnouncements />}
        {view === "admin-subjects" && <AdminSubjects />}
        {view === "admin-analytics" && <AdminAnalytics />}
      </AdminLayout>
    );
  }

  // Student portal
  if (STUDENT_VIEWS.includes(view)) {
    return (
      <StudentLayout>
        {view === "dashboard" && <Dashboard />}
        {view === "papers" && <PapersList />}
        {view === "paper-detail" && <PaperDetail />}
        {view === "quizzes" && <QuizList />}
        {view === "quiz-detail" && <QuizDetail />}
        {view === "quiz-attempt" && <QuizAttempt />}
        {view === "quiz-result" && <QuizResult />}
        {view === "quiz-review" && <QuizReview />}
        {view === "bookmarks" && <Bookmarks />}
        {view === "profile" && <Profile />}
      </StudentLayout>
    );
  }

  // Fallback
  return <LandingPage />;
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
