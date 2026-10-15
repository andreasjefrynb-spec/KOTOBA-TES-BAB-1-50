/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { StartScreen } from './components/StartScreen';
import { QuizScreen } from './components/QuizScreen';
import { ResultScreen } from './components/ResultScreen';
import { NotificationToast, ToastMessage } from './components/NotificationToast';
import { Question, ChapterFilter, QuizResult } from './types/quiz';
import { getQuizQuestions, calculateQuizTimeLimit } from './data/questions';

export default function App() {
  const [screen, setScreen] = useState<'start' | 'quiz' | 'result'>('start');
  const [participantName, setParticipantName] = useState('');
  const [chapterFilter, setChapterFilter] = useState<ChapterFilter>('bab1');
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [timeLimitSeconds, setTimeLimitSeconds] = useState<number>(600);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showAlert = (message: string, type: 'error' | 'success' | 'info' = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Start the test
  const handleStartQuiz = (name: string, filter: ChapterFilter) => {
    setParticipantName(name);
    setChapterFilter(filter);

    // Get all questions for this chapter (100% of the chapter's kotoba)
    const questions = getQuizQuestions(filter);
    const limit = calculateQuizTimeLimit(questions.length);

    setCurrentQuestions(questions);
    setTimeLimitSeconds(limit);
    setScreen('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Complete the test
  const handleCompleteQuiz = (answers: { [questionId: number]: number }, timeRemaining: number) => {
    const totalQuestions = currentQuestions.length;
    let correctCount = 0;
    const wrongQuestionIndices: number[] = [];

    currentQuestions.forEach((q, idx) => {
      const chosen = answers[q.id];
      if (chosen === q.correctIndex) {
        correctCount += 1;
      } else {
        // 1-based question number for reporting
        wrongQuestionIndices.push(idx + 1);
      }
    });

    const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const isPassed = score >= 60;
    const timeSpent = timeLimitSeconds - timeRemaining;

    const getChapterTitle = (filter: ChapterFilter): string => {
      if (filter === 'all') return 'Minna no Nihongo Bab 1–50 (Lengkap)';
      if (filter === 'shokyuu1') return 'Minna no Nihongo Bab 1–25 (Shokyuu I)';
      if (filter === 'shokyuu2') return 'Minna no Nihongo Bab 26–50 (Shokyuu II)';
      if (filter.startsWith('bab')) {
        const num = filter.replace('bab', '');
        return `Minna no Nihongo Bab ${num}`;
      }
      return 'Minna no Nihongo';
    };

    const now = new Date();
    const formattedDate = new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'full',
      timeStyle: 'short',
    }).format(now);

    const result: QuizResult = {
      participantName,
      chapterModeTitle: getChapterTitle(chapterFilter),
      totalQuestions,
      correctCount,
      score,
      isPassed,
      timeLimitSeconds,
      timeRemainingSeconds: timeRemaining,
      timeSpentSeconds: timeSpent,
      answers,
      wrongQuestionIndices,
      questions: currentQuestions,
      completedAt: formattedDate,
    };

    setQuizResult(result);
    setScreen('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Restart quiz
  const handleRestartQuiz = () => {
    setQuizResult(null);
    setScreen('start');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getActiveModeDisplay = (): string => {
    if (chapterFilter === 'all') return 'Bab 1–50';
    if (chapterFilter === 'shokyuu1') return 'Bab 1–25 (N5)';
    if (chapterFilter === 'shokyuu2') return 'Bab 26–50 (N4)';
    if (chapterFilter.startsWith('bab')) return `Bab ${chapterFilter.replace('bab', '')}`;
    return 'Minna no Nihongo';
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans">
      {/* Toast Notification Container */}
      <NotificationToast toasts={toasts} onDismiss={handleDismissToast} />

      {/* Top Global Navigation Bar - Clean, comfortable, responsive */}
      <header className="border-b border-stone-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 h-14 sm:h-16 flex items-center justify-between">
          <button
            type="button"
            onClick={handleRestartQuiz}
            className="flex items-center gap-2.5 text-left cursor-pointer group"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-rose-600 to-red-700 flex items-center justify-center text-white font-serif font-black shadow-xs group-hover:scale-105 transition-transform text-sm sm:text-base">
              日
            </div>
            <div>
              <div className="font-extrabold text-stone-900 text-sm sm:text-base leading-none tracking-tight">
                日本語クラス
              </div>
              <div className="text-[10px] sm:text-[11px] text-stone-500 font-medium mt-0.5">
                Minna no Nihongo (Bab 1–50)
              </div>
            </div>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 border border-stone-200">
              {getActiveModeDisplay()}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pb-12 sm:pb-16">
        {screen === 'start' && (
          <StartScreen
            onStart={handleStartQuiz}
            onShowAlert={showAlert}
          />
        )}

        {screen === 'quiz' && (
          <QuizScreen
            participantName={participantName}
            questions={currentQuestions}
            timeLimitSeconds={timeLimitSeconds}
            onComplete={handleCompleteQuiz}
            chapterModeTitle={getActiveModeDisplay()}
          />
        )}

        {screen === 'result' && quizResult && (
          <ResultScreen
            result={quizResult}
            onRestart={handleRestartQuiz}
            onShowAlert={showAlert}
          />
        )}
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-stone-200/70 bg-white py-4 sm:py-5 text-center text-xs text-stone-500">
        <div className="max-w-3xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            © 2026 <strong>日本語クラス</strong> • Kuis Interaktif Minna no Nihongo
          </div>
          <div className="text-stone-400">
            50 Bab Lengkap • Persiapan JLPT N5 & N4
          </div>
        </div>
      </footer>
    </div>
  );
}
