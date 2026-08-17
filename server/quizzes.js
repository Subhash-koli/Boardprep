import { randomUUID } from "crypto";
import { pool } from "./db.js";

const ALLOWED_DIFFICULTY = new Set(["easy", "medium", "hard"]);
const ALLOWED_STATUS = new Set(["draft", "published", "scheduled"]);
const ALLOWED_OPTIONS = new Set(["A", "B", "C", "D"]);

function parseMarkingScheme(raw) {
  if (!raw) return null;
  try {
    return typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch {
    return null;
  }
}

function toQuestion(row) {
  return {
    id: row.id,
    text: row.text,
    optionA: row.option_a || "",
    optionB: row.option_b || "",
    optionC: row.option_c || "",
    optionD: row.option_d || "",
    correctOption: row.correct_option || "A",
    explanation: row.explanation || "",
    marks: Number(row.marks ?? 1),
  };
}

async function getAttemptStats(quizId) {
  const [[row]] = await pool.query(
    `SELECT COUNT(*) AS totalAttempts, AVG(score) AS avgScore
     FROM quiz_attempts WHERE quiz_id = ?`,
    [quizId],
  );
  return {
    totalAttempts: Number(row?.totalAttempts ?? 0),
    avgScore: row?.avgScore != null ? Math.round(Number(row.avgScore) * 10) / 10 : 0,
  };
}

function shufflePick(items, count) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
}

export async function toQuiz(row, { includeQuestions = false } = {}) {
  const analytics = await getAttemptStats(row.id);
  const bankSize = Number(row.questions_count ?? 0);
  const questionsToShow = Number(row.questions_to_show ?? bankSize);
  const quiz = {
    id: row.id,
    title: row.title,
    subject: row.subject || "",
    subjectId: row.subject_id || "",
    chapter: row.chapter || "",
    goalCategory: row.goal_category || "",
    difficulty: row.difficulty || "medium",
    timeLimitMinutes: Number(row.time_limit_minutes ?? 15),
    totalMarks: Number(row.total_marks ?? 0),
    questionsCount: bankSize,
    bankSize,
    questionsToShow,
    instructions: row.instructions || "",
    markingScheme: parseMarkingScheme(row.marking_scheme),
    status: row.status || "draft",
    analytics,
    createdAt: row.created_at,
  };

  if (includeQuestions) {
    const [questionRows] = await pool.query(
      "SELECT * FROM quiz_questions WHERE quiz_id = ? ORDER BY sort_order ASC",
      [row.id],
    );
    quiz.questions = questionRows.map(toQuestion);
  }

  return quiz;
}

function parseQuizBody(body) {
  const title = String(body?.title ?? "").trim();
  const subject = String(body?.subject ?? "").trim();
  const subjectId = String(body?.subjectId ?? "").trim();
  const chapter = String(body?.chapter ?? "").trim();
  const goalCategory = String(body?.goalCategory ?? "").trim();
  const difficulty = String(body?.difficulty ?? "medium").trim();
  const timeLimitMinutes = Number(body?.timeLimitMinutes);
  const totalMarks = Number(body?.totalMarks);
  const instructions = String(body?.instructions ?? "").trim();
  const status = String(body?.status ?? "draft").trim();
  const bankSize = Number(body?.bankSize ?? body?.questionsCount);
  const questionsToShow = Number(body?.questionsToShow);
  const questions = Array.isArray(body?.questions) ? body.questions : [];

  if (!title) return { error: "Quiz title is required." };
  if (!subject) return { error: "Subject is required." };
  if (!ALLOWED_DIFFICULTY.has(difficulty)) return { error: "Invalid difficulty." };
  if (!ALLOWED_STATUS.has(status)) return { error: "Invalid status." };
  if (!Number.isFinite(timeLimitMinutes) || timeLimitMinutes < 1) {
    return { error: "Time limit must be at least 1 minute." };
  }
  if (!Number.isFinite(bankSize) || bankSize < 1) {
    return { error: "Total questions in bank must be at least 1." };
  }
  if (!Number.isFinite(questionsToShow) || questionsToShow < 1) {
    return { error: "Questions shown per attempt must be at least 1." };
  }
  if (questionsToShow > bankSize) {
    return { error: "Questions shown cannot be more than the total question bank." };
  }
  if (questions.length !== bankSize) {
    return { error: `Upload exactly ${bankSize} questions for this quiz bank.` };
  }

  const parsedQuestions = [];
  for (let i = 0; i < questions.length; i += 1) {
    const q = questions[i] ?? {};
    const text = String(q.text ?? "").trim();
    const optionA = String(q.optionA ?? "").trim();
    const optionB = String(q.optionB ?? "").trim();
    const optionC = String(q.optionC ?? "").trim();
    const optionD = String(q.optionD ?? "").trim();
    const correctOption = String(q.correctOption ?? "A").trim().toUpperCase();
    const explanation = String(q.explanation ?? "").trim();
    const marks = Number(q.marks ?? 1);

    if (!text) return { error: `Question ${i + 1} text is required.` };
    if (!optionA || !optionB || !optionC || !optionD) {
      return { error: `Question ${i + 1} needs all four options.` };
    }
    if (!ALLOWED_OPTIONS.has(correctOption)) {
      return { error: `Question ${i + 1} has an invalid correct answer.` };
    }
    if (!Number.isFinite(marks) || marks < 1) {
      return { error: `Question ${i + 1} marks must be at least 1.` };
    }

    parsedQuestions.push({
      text,
      optionA,
      optionB,
      optionC,
      optionD,
      correctOption,
      explanation,
      marks,
    });
  }

  const markingScheme = body?.markingScheme ?? { id: "board", label: "+1 / 0 (Board)" };
  const attemptMarks = parsedQuestions
    .slice(0, questionsToShow)
    .reduce((sum, q) => sum + q.marks, 0);

  return {
    title,
    subject,
    subjectId,
    chapter,
    goalCategory,
    difficulty,
    timeLimitMinutes,
    totalMarks: Number.isFinite(totalMarks) && totalMarks > 0 ? totalMarks : attemptMarks,
    instructions,
    status,
    bankSize,
    questionsToShow,
    questionsCount: parsedQuestions.length,
    markingScheme,
    questions: parsedQuestions,
  };
}

async function saveQuestions(quizId, questions) {
  await pool.query("DELETE FROM quiz_questions WHERE quiz_id = ?", [quizId]);
  for (let i = 0; i < questions.length; i += 1) {
    const q = questions[i];
    await pool.query(
      `INSERT INTO quiz_questions
        (id, quiz_id, sort_order, text, option_a, option_b, option_c, option_d, correct_option, explanation, marks)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        randomUUID(),
        quizId,
        i,
        q.text,
        q.optionA,
        q.optionB,
        q.optionC,
        q.optionD,
        q.correctOption,
        q.explanation || null,
        q.marks,
      ],
    );
  }
}

export async function listQuizzes(_req, res) {
  try {
    const [rows] = await pool.query("SELECT * FROM quizzes ORDER BY created_at DESC");
    const quizzes = await Promise.all(rows.map((row) => toQuiz(row, { includeQuestions: false })));
    return res.json({ quizzes });
  } catch (err) {
    console.error("listQuizzes failed:", err);
    return res.status(500).json({ error: "Could not load quizzes." });
  }
}

export async function getQuiz(req, res) {
  try {
    const id = String(req.params.id || "");
    const [rows] = await pool.query("SELECT * FROM quizzes WHERE id = ? LIMIT 1", [id]);
    if (!rows[0]) return res.status(404).json({ error: "Quiz not found." });
    return res.json({ quiz: await toQuiz(rows[0], { includeQuestions: true }) });
  } catch (err) {
    console.error("getQuiz failed:", err);
    return res.status(500).json({ error: "Could not load quiz." });
  }
}

export async function createQuiz(req, res) {
  try {
    const parsed = parseQuizBody(req.body);
    if (parsed.error) return res.status(400).json({ error: parsed.error });

    const id = randomUUID();
    await pool.query(
      `INSERT INTO quizzes
        (id, title, subject, subject_id, chapter, difficulty, time_limit_minutes, total_marks,
         questions_count, questions_to_show, instructions, marking_scheme, goal_category, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        parsed.title,
        parsed.subject,
        parsed.subjectId || null,
        parsed.chapter || null,
        parsed.difficulty,
        parsed.timeLimitMinutes,
        parsed.totalMarks,
        parsed.bankSize,
        parsed.questionsToShow,
        parsed.instructions || null,
        JSON.stringify(parsed.markingScheme),
        parsed.goalCategory || null,
        parsed.status,
      ],
    );

    await saveQuestions(id, parsed.questions);
    const [rows] = await pool.query("SELECT * FROM quizzes WHERE id = ? LIMIT 1", [id]);
    return res.status(201).json({ quiz: await toQuiz(rows[0], { includeQuestions: true }) });
  } catch (err) {
    console.error("createQuiz failed:", err);
    return res.status(500).json({ error: "Could not create quiz." });
  }
}

export async function updateQuiz(req, res) {
  try {
    const id = String(req.params.id || "");
    const [existingRows] = await pool.query("SELECT id FROM quizzes WHERE id = ? LIMIT 1", [id]);
    if (!existingRows[0]) return res.status(404).json({ error: "Quiz not found." });

    const parsed = parseQuizBody(req.body);
    if (parsed.error) return res.status(400).json({ error: parsed.error });

    await pool.query(
      `UPDATE quizzes
       SET title = ?, subject = ?, subject_id = ?, chapter = ?, difficulty = ?,
           time_limit_minutes = ?, total_marks = ?, questions_count = ?, questions_to_show = ?,
           instructions = ?, marking_scheme = ?, goal_category = ?, status = ?
       WHERE id = ?`,
      [
        parsed.title,
        parsed.subject,
        parsed.subjectId || null,
        parsed.chapter || null,
        parsed.difficulty,
        parsed.timeLimitMinutes,
        parsed.totalMarks,
        parsed.bankSize,
        parsed.questionsToShow,
        parsed.instructions || null,
        JSON.stringify(parsed.markingScheme),
        parsed.goalCategory || null,
        parsed.status,
        id,
      ],
    );

    await saveQuestions(id, parsed.questions);
    const [rows] = await pool.query("SELECT * FROM quizzes WHERE id = ? LIMIT 1", [id]);
    return res.json({ quiz: await toQuiz(rows[0], { includeQuestions: true }) });
  } catch (err) {
    console.error("updateQuiz failed:", err);
    return res.status(500).json({ error: "Could not update quiz." });
  }
}

export async function startQuizSession(req, res) {
  try {
    const id = String(req.params.id || "");
    const [rows] = await pool.query(
      "SELECT * FROM quizzes WHERE id = ? AND status = 'published' LIMIT 1",
      [id],
    );
    if (!rows[0]) return res.status(404).json({ error: "Quiz not found or not published." });

    const [questionRows] = await pool.query(
      "SELECT * FROM quiz_questions WHERE quiz_id = ? ORDER BY sort_order ASC",
      [id],
    );
    const bank = questionRows.map(toQuestion);
    const questionsToShow = Number(rows[0].questions_to_show ?? bank.length);
    if (bank.length < questionsToShow) {
      return res.status(400).json({ error: "Quiz question bank is not ready yet." });
    }

    const selected = shufflePick(bank, questionsToShow);
    const quiz = await toQuiz(rows[0], { includeQuestions: false });

    return res.json({
      quiz: {
        ...quiz,
        questionsCount: questionsToShow,
        totalMarks: selected.reduce((sum, q) => sum + q.marks, 0),
      },
      questions: selected,
    });
  } catch (err) {
    console.error("startQuizSession failed:", err);
    return res.status(500).json({ error: "Could not start quiz." });
  }
}

export async function deleteQuiz(req, res) {
  try {
    const id = String(req.params.id || "");
    const [rows] = await pool.query("SELECT id FROM quizzes WHERE id = ? LIMIT 1", [id]);
    if (!rows[0]) return res.status(404).json({ error: "Quiz not found." });

    await pool.query("DELETE FROM quiz_questions WHERE quiz_id = ?", [id]);
    await pool.query("DELETE FROM quiz_attempts WHERE quiz_id = ?", [id]);
    await pool.query("DELETE FROM quizzes WHERE id = ?", [id]);
    return res.json({ ok: true });
  } catch (err) {
    console.error("deleteQuiz failed:", err);
    return res.status(500).json({ error: "Could not delete quiz." });
  }
}
