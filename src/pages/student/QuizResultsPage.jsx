import { ChevronLeft, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getContinueLearningUrl } from '@/features/learn/learningSession';

const QUIZ_DATA = {
  title: 'React Hooks Fundamentals',
  score: 85,
  passingScore: 80,
  timeSpent: '14m 20s',
  totalQuestions: 10,
  correct: 8,
  strengths: [
    { label: 'useState', value: 100 },
    { label: 'useEffect', value: 90 },
    { label: 'Custom Hooks', value: 60 },
    { label: 'useContext', value: 80 },
  ],
  answers: [
    { q: 'Which hook is used for side effects?', yourAnswer: 'useEffect', isCorrect: true },
    { q: 'Can you use hooks inside regular JS functions?', yourAnswer: 'Yes', isCorrect: false, explanation: 'Hooks can only be called inside React functional components or custom hooks.' },
  ]
};

export default function QuizResultsPage() {
  const navigate = useNavigate();
  const passed = QUIZ_DATA.score >= QUIZ_DATA.passingScore;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto py-8">
      
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-bold text-muted hover:text-text transition-colors">
        <ChevronLeft className="h-4 w-4" /> Back to Lesson
      </button>

      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-text font-display tracking-tight">Quiz Results</h1>
        <p className="text-lg text-muted font-medium">{QUIZ_DATA.title}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Score Hero */}
        <div className="md:col-span-1 bg-surface border border-border rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-card relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-bg to-transparent pointer-events-none" />
          
          <div className="relative z-10 w-40 h-40 rounded-lg border-8 border-bg flex items-center justify-center mb-6 shadow-inner bg-surface">
            {/* SVG Circular Progress */}
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle cx="72" cy="72" r="68" className="stroke-bg" strokeWidth="8" fill="none" />
              <circle cx="72" cy="72" r="68" className={passed ? "stroke-success" : "stroke-danger"} strokeWidth="8" fill="none" strokeDasharray="427" strokeDashoffset={427 - (427 * QUIZ_DATA.score) / 100} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1.5s ease-in-out' }} />
            </svg>
            <div className="text-center">
              <span className={`text-4xl font-display font-bold ${passed ? 'text-success' : 'text-danger'}`}>
                {QUIZ_DATA.score}%
              </span>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-text mb-2">
            {passed ? 'Outstanding!' : 'Keep Trying!'}
          </h2>
          <p className="text-muted font-medium mb-6">
            You got {QUIZ_DATA.correct} out of {QUIZ_DATA.totalQuestions} correct.
          </p>

          <Link
            to={getContinueLearningUrl()}
            className="block w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-hover shadow-md transition-colors text-center"
          >
            {passed ? 'Continue to Next Lesson' : 'Retake Quiz'}
          </Link>
        </div>

        {/* Analytics & Strengths */}
        <div className="md:col-span-2 space-y-8">
          <div className="bg-surface border border-border rounded-3xl p-8 shadow-sm">
            <h3 className="font-bold text-xl text-text mb-6">Topic Strengths</h3>
            <div className="space-y-5">
              {QUIZ_DATA.strengths.map(topic => (
                <div key={topic.label}>
                  <div className="flex justify-between text-sm font-bold mb-2">
                    <span className="text-text">{topic.label}</span>
                    <span className={topic.value < 70 ? 'text-warning' : 'text-success'}>{topic.value}%</span>
                  </div>
                  <div className="h-2 w-full bg-bg rounded-lg overflow-hidden">
                    <div 
                      className={`h-full rounded-lg ${topic.value < 70 ? 'bg-warning' : 'bg-success'}`} 
                      style={{ width: `${topic.value}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Review */}
          <div className="bg-surface border border-border rounded-3xl p-8 shadow-sm">
            <h3 className="font-bold text-xl text-text mb-6">Detailed Review</h3>
            <div className="space-y-6">
              {QUIZ_DATA.answers.map((ans, idx) => (
                <div key={idx} className="p-5 rounded-2xl border border-border bg-bg/50">
                  <p className="font-bold text-text mb-3">Q: {ans.q}</p>
                  <div className="flex items-start gap-3">
                    {ans.isCorrect ? (
                      <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-danger shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-text">Your Answer: <span className={ans.isCorrect ? 'text-success' : 'text-danger font-bold'}>{ans.yourAnswer}</span></p>
                      {!ans.isCorrect && (
                        <div className="mt-3 p-3 bg-danger/10 border border-danger/20 rounded-lg flex gap-3 text-sm">
                          <AlertTriangle className="h-5 w-5 text-danger shrink-0" />
                          <p className="text-danger font-medium">{ans.explanation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
