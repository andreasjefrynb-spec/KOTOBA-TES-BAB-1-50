import React, { useState, useEffect, useRef } from 'react';
import { Question } from '../types/quiz';
import { soundService } from '../utils/sound';
import { Clock, Volume2, User, ChevronLeft, ChevronRight, CheckCircle2, AlertTriangle } from 'lucide-react';

interface QuizScreenProps {
  participantName: string;
  questions: Question[];
  timeLimitSeconds: number;
  onComplete: (answers: { [questionId: number]: number }, timeRemaining: number) => void;
  chapterModeTitle: string;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({
  participantName,
  questions,
  timeLimitSeconds,
  onComplete,
  chapterModeTitle,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [questionId: number]: number }>({});
  const [timeRemaining, setTimeRemaining] = useState(timeLimitSeconds);
  const [isFinishing, setIsFinishing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const isLastQuestion = currentIndex === totalQuestions - 1;

  // Countdown timer logic
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleTimeExpired = () => {
    setIsFinishing(true);
    soundService.playTryAgain();
    onComplete(answers, 0);
  };

  // Option selection handler - automatically saves and moves to next question
  const handleSelectOption = (optionIndex: number) => {
    soundService.playOptionSelect();

    const updatedAnswers = {
      ...answers,
      [currentQuestion.id]: optionIndex,
    };
    setAnswers(updatedAnswers);

    // If last question, finish the quiz automatically
    if (isLastQuestion) {
      setIsFinishing(true);
      if (timerRef.current) clearInterval(timerRef.current);
      setTimeout(() => {
        onComplete(updatedAnswers, timeRemaining);
      }, 250);
    } else {
      // Auto-advance to next question smoothly
      setTimeout(() => {
        setCurrentIndex((prev) => Math.min(prev + 1, totalQuestions - 1));
      }, 180);
    }
  };

  // Format timer MM:SS
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const isTimeCritical = timeRemaining <= 60; // < 1 minute left

  const progressPercent = ((currentIndex + 1) / totalQuestions) * 100;
  const answeredCount = Object.keys(answers).length;

  const handlePronounce = () => {
    soundService.speakJapanese(currentQuestion.hiragana || currentQuestion.japanese);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 sm:py-6">
      {/* Quiz Header Bar */}
      <div className="bg-white rounded-2xl shadow-xs border border-stone-200 p-3.5 sm:p-4 mb-4">
        <div className="flex items-center justify-between gap-2.5">
          {/* Participant Info */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-700 shrink-0">
              <User className="w-4 h-4 text-stone-600" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] text-stone-500 font-medium truncate">{chapterModeTitle}</div>
              <div className="text-xs sm:text-sm font-bold text-stone-900 leading-tight truncate">
                {participantName}
              </div>
            </div>
          </div>

          {/* Countdown Timer */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-mono text-xs sm:text-sm font-bold transition-all shrink-0 ${
              isTimeCritical
                ? 'bg-rose-50 text-rose-700 border border-rose-300 animate-pulse'
                : 'bg-stone-100 text-stone-800 border border-stone-200'
            }`}
          >
            <Clock className={`w-3.5 h-3.5 ${isTimeCritical ? 'text-rose-600' : 'text-stone-500'}`} />
            <span>{formattedTime}</span>
          </div>
        </div>

        {/* Progress Bar & Counter */}
        <div className="mt-3 pt-2.5 border-t border-stone-100">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-600 mb-1.5">
            <span>
              Soal <strong className="text-rose-600 font-bold">{currentIndex + 1}</strong> dari {totalQuestions}
            </span>
            <span className="text-stone-400 font-normal">
              Terjawab: {answeredCount} / {totalQuestions}
            </span>
          </div>
          <div className="w-full h-1.5 sm:h-2 bg-stone-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-500 to-red-600 transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-white rounded-2xl shadow-md shadow-stone-200/50 border border-stone-200 overflow-hidden mb-4">
        {/* Top Tag & Category */}
        <div className="px-4 sm:px-5 py-2.5 bg-stone-50 border-b border-stone-200/80 flex items-center justify-between text-xs font-semibold text-stone-600">
          <span className="px-2 py-0.5 rounded-md bg-stone-200/70 text-stone-800 font-bold text-[11px]">
            {currentQuestion.chapterLabel}
          </span>
          <span className="text-stone-400 text-[11px] truncate">{currentQuestion.category}</span>
        </div>

        <div className="p-4 sm:p-6">
          {/* Question Prompt */}
          <p className="text-xs sm:text-sm font-medium text-stone-500 mb-3 text-center sm:text-left">
            {currentQuestion.questionPrompt}
          </p>

          {/* Primary Japanese Target Word Display (Comfortable Font Size) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-stone-50/80 border border-stone-200 text-center mb-4 sm:mb-5 relative">
            <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
              <span className="text-xl sm:text-2xl md:text-3xl font-bold text-stone-900 font-serif tracking-normal break-words">
                {currentQuestion.japanese}
              </span>
              <button
                type="button"
                onClick={handlePronounce}
                title="Dengarkan Pelafalan (Audio)"
                className="p-1.5 rounded-full bg-white border border-stone-200 text-stone-600 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50 shadow-2xs transition-all cursor-pointer"
                aria-label="Dengarkan pelafalan audio"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
            {currentQuestion.romaji && (
              <div className="mt-1 text-xs text-stone-400 font-mono">
                [ {currentQuestion.romaji} ]
              </div>
            )}
          </div>

          {/* 4 Answer Options */}
          <div className="space-y-2 sm:space-y-2.5">
            {currentQuestion.options.map((option, idx) => {
              const optionLabel = ['A', 'B', 'C', 'D'][idx];
              const isSelected = answers[currentQuestion.id] === idx;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full p-3 sm:p-3.5 rounded-xl border text-left flex items-center gap-2.5 sm:gap-3 transition-all cursor-pointer text-xs sm:text-sm ${
                    isSelected
                      ? 'border-rose-600 bg-rose-50/80 text-rose-950 font-semibold ring-2 ring-rose-500/20 shadow-xs'
                      : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50 text-stone-800'
                  } active:scale-[0.99]`}
                >
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-rose-600 text-white'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {optionLabel}
                  </span>
                  <span className="flex-1 font-medium text-stone-900 leading-snug">
                    {option}
                  </span>
                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation & Controls */}
      <div className="flex items-center justify-between gap-2.5">
        <button
          type="button"
          onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className={`px-3.5 py-2 rounded-xl border flex items-center gap-1.5 text-xs font-semibold transition-all ${
            currentIndex === 0
              ? 'opacity-40 border-stone-200 text-stone-400 cursor-not-allowed'
              : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700 cursor-pointer'
          }`}
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Sebelumnya</span>
        </button>

        <div className="flex items-center gap-2">
          {!isLastQuestion ? (
            <button
              type="button"
              onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
              className="px-3.5 py-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            >
              <span>Berikutnya</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowConfirmModal(true)}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-sm shadow-rose-600/20 cursor-pointer transition-all"
            >
              Selesaikan Kuis
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-stone-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-stone-200">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-stone-900 text-center">
              Selesaikan Kuis Sekarang?
            </h3>
            <p className="text-xs text-stone-500 text-center mt-1 mb-4 leading-relaxed">
              Anda telah menjawab {answeredCount} dari {totalQuestions} pertanyaan. Hasil kuis akan dihitung dan dievaluasi.
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2 px-3 rounded-xl border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50 cursor-pointer"
              >
                Kembali
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowConfirmModal(false);
                  setIsFinishing(true);
                  if (timerRef.current) clearInterval(timerRef.current);
                  onComplete(answers, timeRemaining);
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-sm cursor-pointer"
              >
                Ya, Selesaikan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
