import { getTrackById, getLessonsByTrack } from "@/data/tracks";
import { getStoredJSON, setStoredJSON } from "@/utils/storage";

const MENTOR_QUIZZES_KEY = "lms-mentor-quizzes";
const QUIZ_ATTEMPTS_KEY = "lms-quiz-attempts";

const CLOUD_QUESTIONS = {
  "Linux primer": [
    {
      question: "Which command lists running processes on a Linux server?",
      options: ["ls -la", "ps aux", "chmod +x", "grep -r"],
      correctIndex: 1,
      explanation: "`ps aux` shows all running processes with user and resource details.",
      topic: "Linux",
    },
    {
      question: "What does chmod 755 typically grant?",
      options: [
        "Read-only for everyone",
        "Owner rwx, group/others rx",
        "Full access to all users",
        "Execute-only for owner",
      ],
      correctIndex: 1,
      explanation: "755 means owner read/write/execute; group and others read/execute.",
      topic: "Linux",
    },
  ],
  "IAM & permissions": [
    {
      question: "In AWS IAM, what is the principle of least privilege?",
      options: [
        "Grant admin to all developers",
        "Give only permissions required for the task",
        "Use one shared root account",
        "Disable MFA for service accounts",
      ],
      correctIndex: 1,
      explanation: "Least privilege limits blast radius by granting minimal required access.",
      topic: "IAM",
    },
    {
      question: "Which IAM entity is best for EC2 instances to call AWS APIs?",
      options: ["Root user", "IAM user with access keys", "IAM role", "Security group"],
      correctIndex: 2,
      explanation: "IAM roles provide temporary credentials without embedding keys.",
      topic: "IAM",
    },
  ],
  "VPC, subnets, routing": [
    {
      question: "A public subnet requires which component for internet access?",
      options: ["NAT Gateway only", "Internet Gateway + route table", "VPC endpoint", "Security group rule"],
      correctIndex: 1,
      explanation: "Public subnets route 0.0.0.0/0 to an Internet Gateway.",
      topic: "Networking",
    },
    {
      question: "Private subnets typically use what for outbound internet?",
      options: ["Internet Gateway", "NAT Gateway in public subnet", "Direct public IP", "Route 53"],
      correctIndex: 1,
      explanation: "NAT Gateway allows private instances outbound access without inbound exposure.",
      topic: "Networking",
    },
  ],
  "EC2, S3, Lambda": [
    {
      question: "Which S3 storage class is best for infrequent access with retrieval fees?",
      options: ["S3 Standard", "S3 Glacier Instant", "S3 Intelligent-Tiering", "S3 One Zone-IA"],
      correctIndex: 3,
      explanation: "One Zone-IA is cheaper for infrequently accessed, non-critical data.",
      topic: "AWS",
    },
    {
      question: "Lambda billing is primarily based on:",
      options: ["EC2 instance hours", "Requests and duration", "Allocated memory only", "VPC peering"],
      correctIndex: 1,
      explanation: "Lambda charges per invocation and GB-seconds of execution time.",
      topic: "AWS",
    },
  ],
  default: [
    {
      question: "What is the recommended first step when debugging a production incident?",
      options: ["Deploy a hotfix immediately", "Assess impact and gather logs", "Restart all servers", "Disable monitoring"],
      correctIndex: 1,
      explanation: "Understanding scope and collecting evidence prevents making things worse.",
      topic: "General",
    },
    {
      question: "Infrastructure as Code primarily helps with:",
      options: ["Manual SSH changes", "Repeatable, versioned deployments", "Removing code reviews", "Hiding config from teams"],
      correctIndex: 1,
      explanation: "IaC makes infrastructure reproducible and auditable via version control.",
      topic: "DevOps",
    },
    {
      question: "Which metric best indicates user-perceived latency?",
      options: ["CPU utilization", "p95 response time", "Disk IOPS", "Network packet count"],
      correctIndex: 1,
      explanation: "Tail latency (p95/p99) reflects what most users actually experience.",
      topic: "Performance",
    },
    {
      question: "Multi-region architecture primarily improves:",
      options: ["Single-server cost", "Availability and disaster recovery", "Code compile time", "Local dev speed"],
      correctIndex: 1,
      explanation: "Geographic redundancy reduces downtime during regional failures.",
      topic: "Architecture",
    },
  ],
};

function hashSeed(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h << 5) - h + str.charCodeAt(i);
  return Math.abs(h);
}

function buildQuestionsForLesson(lesson, track) {
  const course = track.curriculum[lesson.courseIndex];
  const topics = course?.topics ?? track.skills?.slice(0, 3) ?? ["General"];
  const pool = [];

  topics.forEach((topic) => {
    const topicQs = CLOUD_QUESTIONS[topic] ?? CLOUD_QUESTIONS.default;
    topicQs.forEach((q, i) => {
      pool.push({
        ...q,
        id: `${lesson.id}-q-${topic.replace(/\s+/g, "-").toLowerCase()}-${i}`,
      });
    });
  });

  if (pool.length < 6) {
    CLOUD_QUESTIONS.default.forEach((q, i) => {
      pool.push({
        ...q,
        id: `${lesson.id}-default-${i}`,
        question: q.question.replace("production", course?.title?.toLowerCase() ?? "cloud"),
      });
    });
  }

  const seed = hashSeed(lesson.id);
  const shuffled = [...pool].sort((a, b) => hashSeed(a.id + seed) - hashSeed(b.id + seed));
  return shuffled.slice(0, 8);
}

function buildGeneratedQuiz(lesson, track) {
  return {
    id: lesson.id,
    lessonId: lesson.id,
    trackId: track.id,
    title: lesson.title,
    courseTitle: lesson.courseTitle,
    passingScore: 70,
    timeLimitMinutes: null,
    source: "platform",
    questions: buildQuestionsForLesson(lesson, track),
  };
}

export function loadMentorQuizzes() {
  return getStoredJSON(MENTOR_QUIZZES_KEY, []);
}

export function getQuizForLesson(lessonId, trackId) {
  const mentorQuiz = loadMentorQuizzes().find(
    (q) => q.lessonId === lessonId || q.id === lessonId
  );
  if (mentorQuiz) return mentorQuiz;

  const track = getTrackById(trackId);
  if (!track) return null;

  const lessons = getLessonsByTrack(trackId);
  const lesson = lessons.find((l) => l.id === lessonId);
  if (!lesson) return null;

  if (lesson.type !== "quiz") {
    const moduleQuiz = lessons.find(
      (l) => l.type === "quiz" && l.courseIndex === lesson.courseIndex
    );
    if (moduleQuiz) return buildGeneratedQuiz(moduleQuiz, track);
    return null;
  }

  return buildGeneratedQuiz(lesson, track);
}

export function loadQuizAttempts() {
  return getStoredJSON(QUIZ_ATTEMPTS_KEY, {});
}

export function saveQuizAttempt(attempt) {
  const all = loadQuizAttempts();
  const key = attempt.quizId;
  const prev = all[key] ?? [];
  const next = [{ ...attempt, completedAt: new Date().toISOString() }, ...prev].slice(0, 10);
  all[key] = next;
  setStoredJSON(QUIZ_ATTEMPTS_KEY, all);
  return all;
}

export function getBestAttempt(quizId) {
  const attempts = loadQuizAttempts()[quizId] ?? [];
  if (!attempts.length) return null;
  return attempts.reduce((best, a) => (a.score > best.score ? a : best), attempts[0]);
}

export function scoreQuiz(quiz, answers) {
  let correct = 0;
  const reviewed = quiz.questions.map((q) => {
    const selected = answers[q.id];
    const isCorrect = selected === q.correctIndex;
    if (isCorrect) correct += 1;
    return {
      questionId: q.id,
      question: q.question || q.prompt || "",
      selectedIndex: selected,
      correctIndex: q.correctIndex,
      isCorrect,
      explanation: q.explanation,
      topic: q.topic || "General",
    };
  });

  const score = Math.round((correct / quiz.questions.length) * 100);
  const passed = score >= (quiz.passingScore ?? 70);

  const topicMap = {};
  reviewed.forEach((r) => {
    if (!topicMap[r.topic]) topicMap[r.topic] = { correct: 0, total: 0 };
    topicMap[r.topic].total += 1;
    if (r.isCorrect) topicMap[r.topic].correct += 1;
  });

  const strengths = Object.entries(topicMap).map(([label, { correct: c, total }]) => ({
    label,
    value: Math.round((c / total) * 100),
  }));

  return { score, passed, correct, total: quiz.questions.length, reviewed, strengths };
}
