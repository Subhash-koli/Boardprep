import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env") });

import express from "express";
import cors from "cors";
import { initSchema } from "./db.js";
import { login, me, register, requireAuth, seedAdmin, updateMe } from "./auth.js";
import { deleteUser, getAnalytics, getDashboard, listUsers, requireAdmin, setUserBlocked, updateUser } from "./admin.js";
import {
  createPaper,
  deletePaper,
  downloadPaper,
  handleUploadError,
  listPapers,
  paperUpload,
  updatePaper,
} from "./papers.js";
import {
  createQuiz,
  deleteQuiz,
  getQuiz,
  listQuizzes,
  startQuizSession,
  updateQuiz,
} from "./quizzes.js";
import {
  getStudentPaper,
  getStudentQuiz,
  listStudentPapers,
  listStudentQuizzes,
  listStudentSubjects,
  viewStudentPaper,
} from "./content.js";
import {
  createChapter,
  createSubject,
  deleteChapter,
  deleteSubject,
  listSubjects,
  updateChapter,
  updateSubject,
} from "./subjects.js";
import {
  createAnnouncement,
  deleteAnnouncement,
  listAnnouncements,
  listStudentAnnouncements,
  updateAnnouncement,
} from "./announcements.js";

const app = express();
const port = Number(process.env.PORT) || 3001;

app.use(cors({ origin: true }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "parikshacrack-api" });
});

app.post("/api/auth/register", register);
app.post("/api/auth/login", login);
app.get("/api/auth/me", requireAuth, me);
app.patch("/api/auth/me", requireAuth, updateMe);

app.get("/api/admin/dashboard", requireAdmin, getDashboard);
app.get("/api/admin/analytics", requireAdmin, getAnalytics);
app.get("/api/admin/users", requireAdmin, listUsers);
app.patch("/api/admin/users/:id", requireAdmin, updateUser);
app.patch("/api/admin/users/:id/block", requireAdmin, setUserBlocked);
app.delete("/api/admin/users/:id", requireAdmin, deleteUser);

app.get("/api/admin/papers", requireAdmin, listPapers);
app.post("/api/admin/papers", requireAdmin, paperUpload.single("pdf"), handleUploadError, createPaper);
app.patch("/api/admin/papers/:id", requireAdmin, paperUpload.single("pdf"), handleUploadError, updatePaper);
app.delete("/api/admin/papers/:id", requireAdmin, deletePaper);
app.get("/api/admin/papers/:id/file", requireAdmin, downloadPaper);

app.get("/api/admin/quizzes", requireAdmin, listQuizzes);
app.get("/api/admin/quizzes/:id", requireAdmin, getQuiz);
app.post("/api/admin/quizzes", requireAdmin, createQuiz);
app.patch("/api/admin/quizzes/:id", requireAdmin, updateQuiz);
app.delete("/api/admin/quizzes/:id", requireAdmin, deleteQuiz);

app.post("/api/quizzes/:id/start", requireAuth, startQuizSession);

app.get("/api/subjects", requireAuth, listStudentSubjects);
app.get("/api/papers", requireAuth, listStudentPapers);
app.get("/api/papers/:id", requireAuth, getStudentPaper);
app.get("/api/papers/:id/file", requireAuth, viewStudentPaper);
app.get("/api/quizzes", requireAuth, listStudentQuizzes);
app.get("/api/quizzes/:id", requireAuth, getStudentQuiz);

app.get("/api/announcements", requireAuth, listStudentAnnouncements);

app.get("/api/admin/subjects", requireAdmin, listSubjects);
app.post("/api/admin/subjects", requireAdmin, createSubject);
app.patch("/api/admin/subjects/:id", requireAdmin, updateSubject);
app.delete("/api/admin/subjects/:id", requireAdmin, deleteSubject);
app.post("/api/admin/subjects/:subjectId/chapters", requireAdmin, createChapter);
app.patch("/api/admin/chapters/:id", requireAdmin, updateChapter);
app.delete("/api/admin/chapters/:id", requireAdmin, deleteChapter);

app.get("/api/admin/announcements", requireAdmin, listAnnouncements);
app.post("/api/admin/announcements", requireAdmin, createAnnouncement);
app.patch("/api/admin/announcements/:id", requireAdmin, updateAnnouncement);
app.delete("/api/admin/announcements/:id", requireAdmin, deleteAnnouncement);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Unexpected server error." });
});

async function start() {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not set.");
  }
  if (!process.env.PASSWORD_PEPPER) {
    throw new Error("PASSWORD_PEPPER is not set.");
  }

  await initSchema();
  await seedAdmin();

  app.listen(port, () => {
    console.log(`ParikshaCrack API listening on http://localhost:${port}`);
  });
}

start().catch((err) => {
  console.error("Failed to start API:", err);
  process.exit(1);
});
