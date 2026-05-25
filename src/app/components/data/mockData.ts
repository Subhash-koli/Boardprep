export type Standard = "10" | "12";
export type Medium = "english" | "semi-english" | "marathi";
export type PaperType = "board" | "model" | "practice";
export type Difficulty = "easy" | "medium" | "hard";
export type QuizStatus = "draft" | "published" | "scheduled";

export interface Subject {
  id: string;
  name: string;
  standard: Standard;
  icon: string;
  color: string;
  chaptersCount: number;
}

export interface Chapter {
  id: string;
  name: string;
  subjectId: string;
  number: number;
}

export interface Paper {
  id: string;
  title: string;
  standard: Standard;
  subject: string;
  subjectId: string;
  chapter?: string;
  year: number;
  type: PaperType;
  medium: Medium;
  marks: number;
  durationMinutes: number;
  status: "draft" | "published";
  analytics: { views: number; downloads: number; bookmarks: number };
  createdAt: string;
}

export interface Question {
  id: string;
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: "A" | "B" | "C" | "D";
  explanation: string;
  marks: number;
}

export interface Quiz {
  id: string;
  title: string;
  standard: Standard;
  subject: string;
  subjectId: string;
  chapter: string;
  difficulty: Difficulty;
  timeLimitMinutes: number;
  totalMarks: number;
  questionsCount: number;
  instructions: string;
  status: QuizStatus;
  analytics: { totalAttempts: number; avgScore: number };
  createdAt: string;
  questions: Question[];
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  targetAudience: "all" | "10" | "12";
  expiresAt: string;
  isActive: boolean;
  createdAt: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  quizTitle: string;
  subject: string;
  mode: "practice" | "exam";
  totalScore: number;
  maxScore: number;
  percentage: number;
  timeTakenSeconds: number;
  isCompleted: boolean;
  submittedAt: string;
  answers: {
    questionId: string;
    selectedOption: "A" | "B" | "C" | "D" | null;
    isCorrect: boolean;
    marksAwarded: number;
  }[];
}

export interface Student {
  id: string;
  name: string;
  email: string;
  standard: Standard;
  medium: Medium;
  streak: number;
  isBlocked: boolean;
  isVerified: boolean;
  joinedAt: string;
  lastActiveAt: string;
  totalAttempts: number;
  avgScore: number;
}

export const subjects: Subject[] = [
  { id: "s1", name: "Mathematics", standard: "10", icon: "📐", color: "#3B82F6", chaptersCount: 10 },
  { id: "s2", name: "Science & Technology Pt.1", standard: "10", icon: "⚗️", color: "#8B5CF6", chaptersCount: 9 },
  { id: "s3", name: "Science & Technology Pt.2", standard: "10", icon: "🌿", color: "#10B981", chaptersCount: 8 },
  { id: "s4", name: "English", standard: "10", icon: "📖", color: "#F59E0B", chaptersCount: 12 },
  { id: "s5", name: "Marathi", standard: "10", icon: "🔤", color: "#EF4444", chaptersCount: 11 },
  { id: "s6", name: "History & Political Science", standard: "10", icon: "🏛️", color: "#6366F1", chaptersCount: 9 },
  { id: "s7", name: "Geography", standard: "10", icon: "🗺️", color: "#14B8A6", chaptersCount: 7 },
  { id: "s8", name: "Hindi", standard: "10", icon: "📝", color: "#F97316", chaptersCount: 10 },
  { id: "s9", name: "Physics", standard: "12", icon: "⚡", color: "#3B82F6", chaptersCount: 14 },
  { id: "s10", name: "Chemistry", standard: "12", icon: "🧪", color: "#8B5CF6", chaptersCount: 16 },
  { id: "s11", name: "Biology", standard: "12", icon: "🧬", color: "#10B981", chaptersCount: 16 },
  { id: "s12", name: "Mathematics & Statistics", standard: "12", icon: "📊", color: "#6366F1", chaptersCount: 12 },
  { id: "s13", name: "Economics", standard: "12", icon: "📈", color: "#F59E0B", chaptersCount: 10 },
  { id: "s14", name: "English", standard: "12", icon: "📚", color: "#EF4444", chaptersCount: 8 },
];

export const chapters: Chapter[] = [
  { id: "c1", name: "Real Numbers", subjectId: "s1", number: 1 },
  { id: "c2", name: "Polynomials", subjectId: "s1", number: 2 },
  { id: "c3", name: "Arithmetic Progression", subjectId: "s1", number: 3 },
  { id: "c4", name: "Linear Equations", subjectId: "s1", number: 4 },
  { id: "c5", name: "Quadratic Equations", subjectId: "s1", number: 5 },
  { id: "c6", name: "Trigonometry", subjectId: "s1", number: 6 },
  { id: "c7", name: "Statistics", subjectId: "s1", number: 7 },
  { id: "c8", name: "Chemical Reactions", subjectId: "s2", number: 1 },
  { id: "c9", name: "Acids, Bases and Salts", subjectId: "s2", number: 2 },
  { id: "c10", name: "Metals and Non-Metals", subjectId: "s2", number: 3 },
  { id: "c11", name: "Light", subjectId: "s2", number: 4 },
  { id: "c12", name: "Electricity", subjectId: "s2", number: 5 },
  { id: "c13", name: "Rotational Motion", subjectId: "s9", number: 1 },
  { id: "c14", name: "Mechanical Properties", subjectId: "s9", number: 2 },
  { id: "c15", name: "Kinetic Theory", subjectId: "s9", number: 3 },
  { id: "c16", name: "Thermodynamics", subjectId: "s9", number: 4 },
  { id: "c17", name: "Electrostatics", subjectId: "s9", number: 5 },
  { id: "c18", name: "Solid State", subjectId: "s10", number: 1 },
  { id: "c19", name: "Solutions", subjectId: "s10", number: 2 },
  { id: "c20", name: "Electrochemistry", subjectId: "s10", number: 3 },
];

export const papers: Paper[] = [
  { id: "p1", title: "SSC Mathematics March 2024 Board Paper", standard: "10", subject: "Mathematics", subjectId: "s1", year: 2024, type: "board", medium: "english", marks: 80, durationMinutes: 180, status: "published", analytics: { views: 3240, downloads: 1820, bookmarks: 456 }, createdAt: "2024-05-01" },
  { id: "p2", title: "SSC Mathematics March 2023 Board Paper", standard: "10", subject: "Mathematics", subjectId: "s1", year: 2023, type: "board", medium: "english", marks: 80, durationMinutes: 180, status: "published", analytics: { views: 4100, downloads: 2300, bookmarks: 612 }, createdAt: "2023-05-01" },
  { id: "p3", title: "SSC Science Part 1 March 2024", standard: "10", subject: "Science & Technology Pt.1", subjectId: "s2", year: 2024, type: "board", medium: "semi-english", marks: 80, durationMinutes: 180, status: "published", analytics: { views: 2890, downloads: 1560, bookmarks: 398 }, createdAt: "2024-05-02" },
  { id: "p4", title: "SSC Science Part 1 Model Paper 2024", standard: "10", subject: "Science & Technology Pt.1", subjectId: "s2", year: 2024, type: "model", medium: "english", marks: 80, durationMinutes: 180, status: "published", analytics: { views: 1560, downloads: 890, bookmarks: 210 }, createdAt: "2024-01-15" },
  { id: "p5", title: "SSC Mathematics Practice Set 1", standard: "10", subject: "Mathematics", subjectId: "s1", year: 2024, type: "practice", medium: "english", marks: 80, durationMinutes: 180, status: "published", analytics: { views: 987, downloads: 540, bookmarks: 132 }, createdAt: "2024-02-10" },
  { id: "p6", title: "SSC English March 2024", standard: "10", subject: "English", subjectId: "s4", year: 2024, type: "board", medium: "english", marks: 80, durationMinutes: 180, status: "published", analytics: { views: 2100, downloads: 1200, bookmarks: 320 }, createdAt: "2024-05-03" },
  { id: "p7", title: "SSC History March 2023", standard: "10", subject: "History & Political Science", subjectId: "s6", year: 2023, type: "board", medium: "semi-english", marks: 80, durationMinutes: 180, status: "published", analytics: { views: 1800, downloads: 980, bookmarks: 245 }, createdAt: "2023-05-05" },
  { id: "p8", title: "SSC Geography March 2024", standard: "10", subject: "Geography", subjectId: "s7", year: 2024, type: "board", medium: "english", marks: 80, durationMinutes: 180, status: "published", analytics: { views: 1450, downloads: 810, bookmarks: 198 }, createdAt: "2024-05-04" },
  { id: "p9", title: "HSC Physics March 2024 Board Paper", standard: "12", subject: "Physics", subjectId: "s9", year: 2024, type: "board", medium: "english", marks: 80, durationMinutes: 180, status: "published", analytics: { views: 5100, downloads: 2980, bookmarks: 720 }, createdAt: "2024-05-10" },
  { id: "p10", title: "HSC Chemistry March 2024 Board Paper", standard: "12", subject: "Chemistry", subjectId: "s10", year: 2024, type: "board", medium: "english", marks: 80, durationMinutes: 180, status: "published", analytics: { views: 4800, downloads: 2750, bookmarks: 680 }, createdAt: "2024-05-10" },
  { id: "p11", title: "HSC Physics March 2023", standard: "12", subject: "Physics", subjectId: "s9", year: 2023, type: "board", medium: "english", marks: 80, durationMinutes: 180, status: "published", analytics: { views: 5800, downloads: 3400, bookmarks: 890 }, createdAt: "2023-05-10" },
  { id: "p12", title: "HSC Biology March 2024", standard: "12", subject: "Biology", subjectId: "s11", year: 2024, type: "board", medium: "english", marks: 80, durationMinutes: 180, status: "published", analytics: { views: 3900, downloads: 2100, bookmarks: 510 }, createdAt: "2024-05-11" },
  { id: "p13", title: "HSC Mathematics March 2024", standard: "12", subject: "Mathematics & Statistics", subjectId: "s12", year: 2024, type: "board", medium: "english", marks: 80, durationMinutes: 180, status: "published", analytics: { views: 4200, downloads: 2400, bookmarks: 590 }, createdAt: "2024-05-12" },
  { id: "p14", title: "HSC Chemistry Model Paper 2024", standard: "12", subject: "Chemistry", subjectId: "s10", year: 2024, type: "model", medium: "english", marks: 80, durationMinutes: 180, status: "published", analytics: { views: 2100, downloads: 1100, bookmarks: 280 }, createdAt: "2024-01-20" },
  { id: "p15", title: "SSC Mathematics March 2022", standard: "10", subject: "Mathematics", subjectId: "s1", year: 2022, type: "board", medium: "english", marks: 80, durationMinutes: 180, status: "published", analytics: { views: 3600, downloads: 2100, bookmarks: 520 }, createdAt: "2022-05-01" },
  { id: "p16", title: "SSC Marathi March 2024", standard: "10", subject: "Marathi", subjectId: "s5", year: 2024, type: "board", medium: "marathi", marks: 80, durationMinutes: 180, status: "published", analytics: { views: 1200, downloads: 670, bookmarks: 145 }, createdAt: "2024-05-05" },
];

const mathQuestions: Question[] = [
  { id: "q1", text: "The sum of first n natural numbers is given by:", optionA: "n(n+1)/2", optionB: "n(n-1)/2", optionC: "n²/2", optionD: "n(n+1)", correctOption: "A", explanation: "The formula for sum of first n natural numbers is n(n+1)/2. This is a standard arithmetic series formula.", marks: 1 },
  { id: "q2", text: "Which of the following is an irrational number?", optionA: "√4", optionB: "√9", optionC: "√7", optionD: "√16", correctOption: "C", explanation: "√7 ≈ 2.6457... is non-terminating and non-repeating, hence irrational. Others are perfect squares.", marks: 1 },
  { id: "q3", text: "The discriminant of quadratic equation 2x² - 5x + 3 = 0 is:", optionA: "25", optionB: "1", optionC: "49", optionD: "−1", correctOption: "B", explanation: "D = b² - 4ac = (-5)² - 4(2)(3) = 25 - 24 = 1", marks: 1 },
  { id: "q4", text: "If HCF(a, b) = 4 and LCM(a, b) = 36, then a × b = ?", optionA: "40", optionB: "144", optionC: "9", optionD: "32", correctOption: "B", explanation: "HCF × LCM = a × b ⟹ 4 × 36 = 144", marks: 1 },
  { id: "q5", text: "nth term of an AP is given by an = 5 + 3(n-1). The common difference is:", optionA: "5", optionB: "8", optionC: "3", optionD: "2", correctOption: "C", explanation: "The general term an = a + (n-1)d. Comparing with 5 + 3(n-1), d = 3.", marks: 1 },
  { id: "q6", text: "The value of sin²θ + cos²θ is always:", optionA: "0", optionB: "2", optionC: "1", optionD: "Depends on θ", correctOption: "C", explanation: "This is the fundamental Pythagorean identity: sin²θ + cos²θ = 1 for all values of θ.", marks: 1 },
  { id: "q7", text: "The roots of x² - 5x + 6 = 0 are:", optionA: "2 and 3", optionB: "1 and 6", optionC: "-2 and -3", optionD: "2 and -3", correctOption: "A", explanation: "Factoring: x² - 5x + 6 = (x-2)(x-3) = 0, so x = 2 or x = 3.", marks: 1 },
  { id: "q8", text: "The mean of 5, 10, 15, 20, 25 is:", optionA: "10", optionB: "12.5", optionC: "15", optionD: "17.5", correctOption: "C", explanation: "Mean = (5+10+15+20+25)/5 = 75/5 = 15", marks: 1 },
  { id: "q9", text: "tan 45° is equal to:", optionA: "0", optionB: "1", optionC: "√3", optionD: "1/√3", correctOption: "B", explanation: "tan 45° = sin 45°/cos 45° = (1/√2)/(1/√2) = 1", marks: 1 },
  { id: "q10", text: "A polynomial of degree 3 is called:", optionA: "Linear", optionB: "Quadratic", optionC: "Cubic", optionD: "Biquadratic", correctOption: "C", explanation: "A polynomial with highest degree 3 is called a cubic polynomial.", marks: 1 },
];

const physicsQuestions: Question[] = [
  { id: "pq1", text: "The SI unit of electric charge is:", optionA: "Ampere", optionB: "Coulomb", optionC: "Volt", optionD: "Ohm", correctOption: "B", explanation: "The SI unit of electric charge is Coulomb (C). Ampere is the unit of current.", marks: 1 },
  { id: "pq2", text: "Which law states that V = IR?", optionA: "Faraday's Law", optionB: "Coulomb's Law", optionC: "Ohm's Law", optionD: "Kirchhoff's Law", correctOption: "C", explanation: "Ohm's Law states that V = IR, where V is voltage, I is current, and R is resistance.", marks: 1 },
  { id: "pq3", text: "The moment of inertia depends on:", optionA: "Mass only", optionB: "Distribution of mass about axis", optionC: "Velocity of rotation", optionD: "Temperature", correctOption: "B", explanation: "Moment of inertia depends on both the mass of the body and the distribution of that mass about the axis of rotation.", marks: 1 },
  { id: "pq4", text: "The speed of light in vacuum is approximately:", optionA: "3 × 10⁶ m/s", optionB: "3 × 10⁸ m/s", optionC: "3 × 10¹⁰ m/s", optionD: "3 × 10⁴ m/s", correctOption: "B", explanation: "Speed of light in vacuum c ≈ 3 × 10⁸ m/s (exactly 299,792,458 m/s).", marks: 1 },
  { id: "pq5", text: "Which type of wave requires a medium to propagate?", optionA: "Electromagnetic waves", optionB: "Light waves", optionC: "Mechanical waves", optionD: "Radio waves", correctOption: "C", explanation: "Mechanical waves (sound, water waves) require a medium. Electromagnetic waves can travel through vacuum.", marks: 1 },
  { id: "pq6", text: "The dimension of Planck's constant is:", optionA: "ML²T⁻¹", optionB: "ML²T⁻²", optionC: "MLT⁻¹", optionD: "ML³T⁻²", correctOption: "A", explanation: "Planck's constant h has dimensions of energy × time = ML²T⁻², divided by frequency (T⁻¹) gives ML²T⁻¹.", marks: 1 },
  { id: "pq7", text: "Bernoulli's principle is based on:", optionA: "Conservation of momentum", optionB: "Conservation of mass", optionC: "Conservation of energy", optionD: "Conservation of charge", correctOption: "C", explanation: "Bernoulli's principle is based on conservation of energy for fluid flow.", marks: 1 },
  { id: "pq8", text: "The work done by a conservative force in a closed path is:", optionA: "Maximum", optionB: "Minimum", optionC: "Zero", optionD: "Infinite", correctOption: "C", explanation: "For a conservative force, the work done in any closed path is zero.", marks: 1 },
  { id: "pq9", text: "Angular momentum is conserved when:", optionA: "Linear velocity is constant", optionB: "Net external torque is zero", optionC: "Kinetic energy is constant", optionD: "Net force is zero", correctOption: "B", explanation: "Angular momentum is conserved when the net external torque acting on the system is zero.", marks: 1 },
  { id: "pq10", text: "The unit of magnetic flux is:", optionA: "Tesla", optionB: "Gauss", optionC: "Weber", optionD: "Henry", correctOption: "C", explanation: "Magnetic flux Φ = B·A, measured in Weber (Wb) = Tesla × m².", marks: 1 },
];

const chemistryQuestions: Question[] = [
  { id: "chq1", text: "The number of electrons in the outermost shell of Sodium (Na) is:", optionA: "2", optionB: "1", optionC: "8", optionD: "11", correctOption: "B", explanation: "Sodium (Z=11) has configuration 2,8,1. The outermost shell has 1 electron.", marks: 1 },
  { id: "chq2", text: "Which gas is produced when zinc reacts with dilute HCl?", optionA: "Oxygen", optionB: "Chlorine", optionC: "Hydrogen", optionD: "Nitrogen", correctOption: "C", explanation: "Zn + 2HCl → ZnCl₂ + H₂↑. Hydrogen gas is produced.", marks: 1 },
  { id: "chq3", text: "Rusting of iron is an example of:", optionA: "Reduction", optionB: "Oxidation", optionC: "Displacement", optionD: "Decomposition", correctOption: "B", explanation: "Rusting involves oxidation: 4Fe + 3O₂ + 6H₂O → 4Fe(OH)₃", marks: 1 },
  { id: "chq4", text: "pH of a neutral solution at 25°C is:", optionA: "0", optionB: "7", optionC: "14", optionD: "10", correctOption: "B", explanation: "At 25°C, a neutral solution has [H⁺] = [OH⁻] = 10⁻⁷ M, so pH = 7.", marks: 1 },
  { id: "chq5", text: "Which of the following is a strong electrolyte?", optionA: "Acetic acid", optionB: "Glucose", optionC: "Sodium chloride", optionD: "Ammonia", correctOption: "C", explanation: "NaCl completely dissociates in water, making it a strong electrolyte.", marks: 1 },
];

const scienceQuestions: Question[] = [
  { id: "scq1", text: "The process by which plants make food using sunlight is called:", optionA: "Respiration", optionB: "Photosynthesis", optionC: "Transpiration", optionD: "Digestion", correctOption: "B", explanation: "Photosynthesis: 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂. Plants convert light energy to chemical energy.", marks: 1 },
  { id: "scq2", text: "Newton's first law of motion is also called:", optionA: "Law of gravitation", optionB: "Law of acceleration", optionC: "Law of inertia", optionD: "Law of action-reaction", correctOption: "C", explanation: "Newton's first law (an object at rest stays at rest unless acted upon) describes inertia.", marks: 1 },
  { id: "scq3", text: "The chemical formula of water is:", optionA: "H₂O₂", optionB: "HO₂", optionC: "H₃O", optionD: "H₂O", correctOption: "D", explanation: "Water is H₂O — two hydrogen atoms bonded to one oxygen atom.", marks: 1 },
  { id: "scq4", text: "Which planet is known as the Red Planet?", optionA: "Jupiter", optionB: "Mars", optionC: "Venus", optionD: "Saturn", correctOption: "B", explanation: "Mars appears red due to iron oxide (rust) on its surface.", marks: 1 },
  { id: "scq5", text: "The loudness of sound depends on its:", optionA: "Frequency", optionB: "Wavelength", optionC: "Amplitude", optionD: "Speed", correctOption: "C", explanation: "Loudness depends on amplitude. Greater the amplitude, louder the sound.", marks: 1 },
];

export const quizzes: Quiz[] = [
  { id: "qz1", title: "Mathematics - Arithmetic Progression Quiz", standard: "10", subject: "Mathematics", subjectId: "s1", chapter: "Arithmetic Progression", difficulty: "medium", timeLimitMinutes: 15, totalMarks: 10, questionsCount: 10, instructions: "This quiz has 10 multiple choice questions. Each question carries 1 mark. No negative marking. You can select Practice Mode or Exam Mode.", status: "published", analytics: { totalAttempts: 1240, avgScore: 7.2 }, createdAt: "2024-01-15", questions: mathQuestions },
  { id: "qz2", title: "Mathematics - Trigonometry Basics", standard: "10", subject: "Mathematics", subjectId: "s1", chapter: "Trigonometry", difficulty: "easy", timeLimitMinutes: 10, totalMarks: 10, questionsCount: 10, instructions: "Basic trigonometry quiz covering sin, cos, tan values and identities. 10 questions, 1 mark each.", status: "published", analytics: { totalAttempts: 980, avgScore: 8.1 }, createdAt: "2024-01-20", questions: mathQuestions },
  { id: "qz3", title: "Science - Chemical Reactions", standard: "10", subject: "Science & Technology Pt.1", subjectId: "s2", chapter: "Chemical Reactions", difficulty: "medium", timeLimitMinutes: 15, totalMarks: 10, questionsCount: 5, instructions: "Test your knowledge of chemical reactions and equations. 5 questions, 2 marks each.", status: "published", analytics: { totalAttempts: 760, avgScore: 6.8 }, createdAt: "2024-02-01", questions: scienceQuestions },
  { id: "qz4", title: "Physics - Rotational Motion", standard: "12", subject: "Physics", subjectId: "s9", chapter: "Rotational Motion", difficulty: "hard", timeLimitMinutes: 20, totalMarks: 10, questionsCount: 10, instructions: "Advanced physics quiz on rotational motion. Requires knowledge of moment of inertia, torque, and angular momentum.", status: "published", analytics: { totalAttempts: 890, avgScore: 5.9 }, createdAt: "2024-02-10", questions: physicsQuestions },
  { id: "qz5", title: "Physics - Electrostatics", standard: "12", subject: "Physics", subjectId: "s9", chapter: "Electrostatics", difficulty: "medium", timeLimitMinutes: 15, totalMarks: 10, questionsCount: 10, instructions: "10 MCQ questions on electrostatics fundamentals. 1 mark per question.", status: "published", analytics: { totalAttempts: 1100, avgScore: 6.5 }, createdAt: "2024-02-15", questions: physicsQuestions },
  { id: "qz6", title: "Chemistry - Electrochemistry", standard: "12", subject: "Chemistry", subjectId: "s10", chapter: "Electrochemistry", difficulty: "hard", timeLimitMinutes: 20, totalMarks: 10, questionsCount: 5, instructions: "Electrochemistry quiz — covers electrolytic cells, galvanic cells, Faraday's laws.", status: "published", analytics: { totalAttempts: 650, avgScore: 5.4 }, createdAt: "2024-02-20", questions: chemistryQuestions },
  { id: "qz7", title: "Mathematics - Quadratic Equations", standard: "10", subject: "Mathematics", subjectId: "s1", chapter: "Quadratic Equations", difficulty: "easy", timeLimitMinutes: 10, totalMarks: 10, questionsCount: 10, instructions: "Practice quadratic equations — factoring, discriminant, nature of roots.", status: "published", analytics: { totalAttempts: 1450, avgScore: 7.8 }, createdAt: "2024-03-01", questions: mathQuestions },
  { id: "qz8", title: "Physics - Thermodynamics", standard: "12", subject: "Physics", subjectId: "s9", chapter: "Thermodynamics", difficulty: "medium", timeLimitMinutes: 15, totalMarks: 10, questionsCount: 10, instructions: "Thermodynamics quiz — laws of thermodynamics, heat engines, entropy.", status: "published", analytics: { totalAttempts: 720, avgScore: 6.2 }, createdAt: "2024-03-05", questions: physicsQuestions },
];

export const announcements: Announcement[] = [
  { id: "a1", title: "HSC Board Exams 2025 — Timetable Released", body: "Maharashtra State Board has released the timetable for HSC March 2025 board examinations. Exams will begin from March 4, 2025. Download the full timetable from the official MSBSHSE website. We have updated our quiz schedule accordingly.", targetAudience: "12", expiresAt: "2025-03-01", isActive: true, createdAt: "2024-12-10" },
  { id: "a2", title: "New Practice Papers Added — Mathematics SSC", body: "We have added 5 new practice papers for SSC Mathematics. These papers include previous year patterns and model questions designed by experienced teachers. Start practicing now!", targetAudience: "10", expiresAt: "2025-06-01", isActive: true, createdAt: "2024-12-15" },
  { id: "a3", title: "Platform Maintenance — Sunday 2 AM to 4 AM", body: "MahaBoard Prep will undergo scheduled maintenance this Sunday from 2:00 AM to 4:00 AM IST. The platform will be temporarily unavailable during this time. We apologize for any inconvenience.", targetAudience: "all", expiresAt: "2025-01-10", isActive: true, createdAt: "2025-01-05" },
  { id: "a4", title: "Welcome to MahaBoard Prep!", body: "We're excited to have you join MahaBoard Prep — the dedicated platform for Maharashtra Board students. Explore past papers, take MCQ quizzes, and track your progress. All the best for your board exams!", targetAudience: "all", expiresAt: "2025-12-31", isActive: true, createdAt: "2024-11-01" },
];

export const students: Student[] = [
  { id: "u1", name: "Priya Sharma", email: "priya.sharma@gmail.com", standard: "12", medium: "semi-english", streak: 15, isBlocked: false, isVerified: true, joinedAt: "2024-11-15", lastActiveAt: "2025-01-10", totalAttempts: 42, avgScore: 78.5 },
  { id: "u2", name: "Rohan Patil", email: "rohan.patil@gmail.com", standard: "10", medium: "marathi", streak: 7, isBlocked: false, isVerified: true, joinedAt: "2024-12-01", lastActiveAt: "2025-01-09", totalAttempts: 18, avgScore: 65.2 },
  { id: "u3", name: "Sneha Kulkarni", email: "sneha.kulkarni@gmail.com", standard: "12", medium: "english", streak: 22, isBlocked: false, isVerified: true, joinedAt: "2024-11-20", lastActiveAt: "2025-01-10", totalAttempts: 67, avgScore: 85.1 },
  { id: "u4", name: "Arjun Desai", email: "arjun.desai@gmail.com", standard: "10", medium: "english", streak: 3, isBlocked: false, isVerified: true, joinedAt: "2025-01-05", lastActiveAt: "2025-01-08", totalAttempts: 8, avgScore: 72.3 },
  { id: "u5", name: "Pooja Joshi", email: "pooja.joshi@gmail.com", standard: "12", medium: "semi-english", streak: 0, isBlocked: true, isVerified: true, joinedAt: "2024-11-10", lastActiveAt: "2024-12-20", totalAttempts: 31, avgScore: 60.8 },
  { id: "u6", name: "Akash Nair", email: "akash.nair@gmail.com", standard: "10", medium: "english", streak: 10, isBlocked: false, isVerified: true, joinedAt: "2024-12-10", lastActiveAt: "2025-01-10", totalAttempts: 25, avgScore: 80.4 },
  { id: "u7", name: "Meera Bhosale", email: "meera.bhosale@gmail.com", standard: "12", medium: "marathi", streak: 5, isBlocked: false, isVerified: false, joinedAt: "2025-01-08", lastActiveAt: "2025-01-10", totalAttempts: 4, avgScore: 70.0 },
  { id: "u8", name: "Rahul Jadhav", email: "rahul.jadhav@gmail.com", standard: "10", medium: "semi-english", streak: 18, isBlocked: false, isVerified: true, joinedAt: "2024-11-25", lastActiveAt: "2025-01-10", totalAttempts: 55, avgScore: 88.2 },
];

export const subjectProgress = [
  { subject: "Mathematics", progress: 65, quizzesAttempted: 8, totalQuizzes: 12 },
  { subject: "Science Pt.1", progress: 40, quizzesAttempted: 4, totalQuizzes: 10 },
  { subject: "Science Pt.2", progress: 25, quizzesAttempted: 2, totalQuizzes: 8 },
  { subject: "English", progress: 80, quizzesAttempted: 8, totalQuizzes: 10 },
  { subject: "History", progress: 50, quizzesAttempted: 4, totalQuizzes: 8 },
];

export const scoreTrendData = [
  { date: "Jan 1", score: 60 },
  { date: "Jan 3", score: 72 },
  { date: "Jan 5", score: 68 },
  { date: "Jan 7", score: 75 },
  { date: "Jan 9", score: 80 },
  { date: "Jan 10", score: 78 },
];

export const adminAnalyticsData = {
  totalStudents: 1247,
  totalPapers: 89,
  totalQuizzes: 142,
  totalAttempts: 18430,
  dailyActiveUsers: 287,
  weeklyRegistrations: [45, 62, 38, 71, 55, 80, 64],
  registrationTrend: [
    { month: "Aug", count: 120 },
    { month: "Sep", count: 210 },
    { month: "Oct", count: 380 },
    { month: "Nov", count: 520 },
    { month: "Dec", count: 810 },
    { month: "Jan", count: 1247 },
  ],
  topQuizzes: [
    { title: "Math - Quadratic Equations", attempts: 1450 },
    { title: "Math - Arithmetic Progression", attempts: 1240 },
    { title: "Physics - Electrostatics", attempts: 1100 },
    { title: "Math - Trigonometry", attempts: 980 },
    { title: "Physics - Rotational Motion", attempts: 890 },
  ],
  topPapers: [
    { title: "HSC Physics March 2023", downloads: 3400 },
    { title: "SSC Math March 2023", downloads: 2300 },
    { title: "HSC Chemistry March 2024", downloads: 2750 },
    { title: "HSC Math March 2024", downloads: 2400 },
    { title: "SSC Math March 2024", downloads: 1820 },
  ],
};
