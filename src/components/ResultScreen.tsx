import React, { useState, useEffect } from 'react';
import { QuizResult, Question } from '../types/quiz';
import { getWhatsAppShareUrl, generateWhatsAppMessage, copyToClipboard, formatTime } from '../utils/whatsapp';
import { soundService } from '../utils/sound';
import confetti from 'canvas-confetti';
import {
  Award,
  CheckCircle2,
  XCircle,
  Share2,
  Copy,
  RotateCcw,
  Clock,
  User,
  Volume2,
  Sparkles,
  BookOpen,
  MessageSquare
} from 'lucide-react';

interface ResultScreenProps {
  result: QuizResult;
  onRestart: () => void;
  onShowAlert: (msg: string, type?: 'error' | 'success' | 'info') => void;
}

type TabFilter = 'wrong' | 'all' | 'correct';

export const ResultScreen: React.FC<ResultScreenProps> = ({ result, onRestart, onShowAlert }) => {
  // Default to showing wrong questions as explicitly required by the prompt
  const hasWrongQuestions = result.wrongQuestionIndices.length > 0;
  const [activeTab, setActiveTab] = useState<TabFilter>(hasWrongQuestions ? 'wrong' : 'all');
  const [copied, setCopied] = useState(false);

  // Trigger celebration or sound on mount
  useEffect(() => {
    if (result.isPassed) {
      soundService.playPassChime();
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {
        // Fallback
      }
    } else {
      soundService.playTryAgain();
    }
  }, [result.isPassed]);

  const handleShareWhatsApp = () => {
    const shareUrl = getWhatsAppShareUrl(result);
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyReport = async () => {
    const reportText = generateWhatsAppMessage(result);
    const success = await copyToClipboard(reportText);
    if (success) {
      setCopied(true);
      onShowAlert('Teks laporan berhasil disalin ke clipboard!', 'success');
      setTimeout(() => setCopied(false), 3000);
    } else {
      onShowAlert('Gagal menyalin teks laporan.', 'error');
    }
  };

  // Filter questions based on active tab
  const filteredQuestions: { question: Question; index: number; isCorrect: boolean }[] = result.questions
    .map((q, idx) => {
      const chosenIndex = result.answers[q.id];
      const isCorrect = chosenIndex === q.correctIndex;
      return { question: q, index: idx + 1, isCorrect };
    })
    .filter((item) => {
      if (activeTab === 'wrong') return !item.isCorrect;
      if (activeTab === 'correct') return item.isCorrect;
      return true; // 'all'
    });

  const correctCount = result.correctCount;
  const wrongCount = result.totalQuestions - correctCount;

  return (
    <div className="max-w-2xl mx-auto px-4 py-5 sm:py-8 space-y-5 sm:space-y-6">
      {/* 1. KOTAK SKOR */}
      <div className="bg-white rounded-2xl shadow-md shadow-stone-200/50 border border-stone-200 overflow-hidden">
        {/* Top Status Gradient Bar */}
        <div
          className={`h-2.5 w-full ${
            result.isPassed
              ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600'
              : 'bg-gradient-to-r from-rose-500 via-red-500 to-amber-600'
          }`}
        />

        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
            {/* Participant & Class Details */}
            <div>
              <div className="flex items-center gap-1.5 text-stone-500 text-xs font-semibold uppercase tracking-wider mb-1">
                <User className="w-3.5 h-3.5 text-stone-400" />
                <span>Peserta: {result.participantName}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
                Hasil Evaluasi Kuis
              </h2>
              <div className="text-xs text-stone-500 mt-0.5">
                {result.chapterModeTitle} • Minna no Nihongo
              </div>
            </div>

            {/* Status Pill Badge */}
            <div
              className={`px-3.5 py-2 rounded-xl flex items-center gap-2.5 border ${
                result.isPassed
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              {result.isPassed ? (
                <div className="p-1.5 rounded-lg bg-emerald-600 text-white shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              ) : (
                <div className="p-1.5 rounded-lg bg-rose-600 text-white shrink-0">
                  <XCircle className="w-4 h-4" />
                </div>
              )}
              <div>
                <div className="text-[10px] uppercase tracking-wider font-semibold opacity-75 leading-none">
                  Status
                </div>
                <div className="text-sm sm:text-base font-black">
                  {result.isPassed ? 'LULUS (合格)' : 'BELUM LULUS (不合格)'}
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4">
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 text-center">
              <div className="text-[11px] font-semibold text-stone-500 mb-0.5">Nilai Akhir</div>
              <div
                className={`text-2xl sm:text-3xl font-black tracking-tight ${
                  result.isPassed ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {result.score}
              </div>
              <div className="text-[10px] text-stone-400 font-medium">skala 0 - 100</div>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 text-center">
              <div className="text-[11px] font-semibold text-stone-500 mb-0.5">Jumlah Benar</div>
              <div className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                {result.correctCount}
                <span className="text-xs font-normal text-stone-400">/{result.totalQuestions}</span>
              </div>
              <div className="text-[10px] text-emerald-600 font-semibold">
                {Math.round((result.correctCount / result.totalQuestions) * 100)}% Akurasi
              </div>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 text-center">
              <div className="text-[11px] font-semibold text-stone-500 mb-0.5">Jumlah Salah</div>
              <div className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                {wrongCount}
              </div>
              <div className="text-[10px] text-rose-500 font-semibold">
                {wrongCount > 0 ? `${wrongCount} Soal Keliru` : 'Tanpa Kesalahan'}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 text-center">
              <div className="text-[11px] font-semibold text-stone-500 mb-0.5">Sisa Waktu</div>
              <div className="text-xl sm:text-2xl font-black text-stone-800 tracking-tight font-mono mt-0.5">
                {formatTime(result.timeRemainingSeconds)}
              </div>
              <div className="text-[10px] text-stone-400 flex items-center justify-center gap-1">
                <Clock className="w-2.5 h-2.5" />
                <span>Terpakai: {formatTime(result.timeSpentSeconds)}</span>
              </div>
            </div>
          </div>

          {/* Motivational Quote & Note */}
          <div className="mt-4 p-3 rounded-xl bg-stone-50 border border-stone-200 text-stone-700 text-xs flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              {result.isPassed ? (
                <span>
                  <strong>おめでとうございます (Selamat)!</strong> Anda berhasil melampaui standar kelulusan kuis
                  bahasa Jepang dengan nilai {result.score}. Pertahankan semangat belajarnya!
                </span>
              ) : (
                <span>
                  <strong>がんばってください (Tetap Semangat)!</strong> Nilai minimal kelulusan adalah 60.
                  Pelajari kembali evaluasi soal salah di bawah ini untuk mengulang kuis berikutnya!
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. FITUR KIRIM KE GRUP WHATSAPP & SALIN LAPORAN */}
      <div className="bg-white rounded-2xl shadow-md shadow-stone-200/50 border border-stone-200 p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Share2 className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-stone-900">
            Kirim Laporan Nilai ke WhatsApp
          </h3>
        </div>
        <p className="text-xs text-stone-500 mb-4">
          Bagikan hasil kuis resmi Anda ke grup WhatsApp kelas atau simpan salinannya.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="w-full sm:flex-1 py-2.5 sm:py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm shadow-emerald-600/20 cursor-pointer transition-all"
          >
            <Share2 className="w-4 h-4" />
            <span>Kirim Hasil ke Grup WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={handleCopyReport}
            className="w-full sm:w-auto py-2.5 sm:py-3 px-4 rounded-xl border border-stone-300 hover:bg-stone-50 active:scale-[0.99] text-stone-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Tersalin!' : 'Salin Teks Laporan'}</span>
          </button>
        </div>

        {/* Preview of WhatsApp text */}
        <div className="mt-4 pt-4 border-t border-stone-100">
          <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <MessageSquare className="w-3 h-3" />
            Pratinjau Format Teks WhatsApp:
          </div>
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs font-mono text-stone-700 whitespace-pre-wrap leading-relaxed select-all">
            {generateWhatsAppMessage(result)}
          </div>
        </div>
      </div>

      {/* 3. EVALUASI & PEMBAHASAN SOAL */}
      <div className="bg-white rounded-2xl shadow-md shadow-stone-200/50 border border-stone-200 p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-stone-500 text-[11px] font-semibold uppercase tracking-wider mb-0.5">
              <BookOpen className="w-3.5 h-3.5 text-stone-400" />
              <span>Analisis Jawaban & Kunci Soal</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-stone-900">
              Evaluasi & Pembahasan Soal
            </h3>
          </div>

          {/* Interactive Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setActiveTab('wrong');
                soundService.playOptionSelect();
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'wrong'
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              ❌ Soal Salah ({wrongCount})
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('all');
                soundService.playOptionSelect();
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              📋 Semua Soal ({result.totalQuestions})
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('correct');
                soundService.playOptionSelect();
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'correct'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              ✅ Soal Benar ({correctCount})
            </button>
          </div>
        </div>

        {/* Empty state if no wrong questions and on 'wrong' tab */}
        {filteredQuestions.length === 0 && (
          <div className="py-8 text-center rounded-xl bg-stone-50 border border-stone-200 p-4">
            <Sparkles className="w-8 h-8 text-amber-500 mx-auto mb-1.5" />
            <h4 className="text-sm font-bold text-stone-900">
              Tidak Ada Soal yang Salah! 🎉
            </h4>
            <p className="text-xs text-stone-500 max-w-sm mx-auto mt-0.5">
              Luar biasa! Anda menjawab seluruh {result.totalQuestions} pertanyaan dengan benar tanpa kesalahan sama sekali.
            </p>
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className="mt-3 px-3.5 py-1.5 rounded-lg bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition-colors cursor-pointer"
            >
              Lihat Semua Soal ({result.totalQuestions})
            </button>
          </div>
        )}

        {/* Questions Cards List */}
        <div className="space-y-3">
          {filteredQuestions.map(({ question, index, isCorrect }) => {
            const chosenIndex = result.answers[question.id];
            const chosenAnswerText =
              chosenIndex !== undefined ? question.options[chosenIndex] : 'Tidak dijawab (Waktu Habis)';
            const correctAnswerText = question.options[question.correctIndex];

            return (
              <div
                key={question.id}
                className={`rounded-xl border p-4 transition-all ${
                  isCorrect
                    ? 'border-emerald-200/80 bg-emerald-50/20'
                    : 'border-rose-200/80 bg-rose-50/20'
                }`}
              >
                {/* Question Header */}
                <div className="flex items-center justify-between text-xs mb-2 pb-2 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs ${
                        isCorrect
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {index}
                    </span>
                    <span className="font-semibold text-stone-700 text-xs">
                      {question.chapterLabel} • {question.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isCorrect ? (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Benar
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <XCircle className="w-3 h-3" /> Salah
                      </span>
                    )}
                  </div>
                </div>

                {/* Target Word */}
                <div className="flex items-center justify-between mb-3 bg-white p-3 rounded-lg border border-stone-200/80">
                  <div>
                    <div className="text-base sm:text-lg font-bold text-stone-900 font-serif">
                      {question.japanese}
                    </div>
                    {question.romaji && (
                      <div className="text-[11px] text-stone-400 font-mono mt-0.5">
                        [ {question.romaji} ]
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => soundService.speakJapanese(question.hiragana || question.japanese)}
                    title="Dengarkan Pelafalan"
                    className="p-1.5 rounded-lg bg-stone-50 border border-stone-200 text-stone-600 hover:text-rose-600 hover:border-rose-300 transition-colors cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Answers Comparison */}
                <div className="space-y-1.5 text-xs">
                  {/* User Answer */}
                  <div
                    className={`p-2.5 rounded-lg border flex items-start gap-2 ${
                      isCorrect
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                        : 'bg-rose-50 border-rose-200 text-rose-950'
                    }`}
                  >
                    <span className="font-bold shrink-0 text-xs">Jawaban Kamu:</span>
                    <span className="font-medium">{chosenAnswerText}</span>
                  </div>

                  {/* Correct Answer */}
                  {!isCorrect && (
                    <div className="p-2.5 rounded-lg border bg-emerald-50 border-emerald-200 text-emerald-950 flex items-start gap-2">
                      <span className="font-bold text-emerald-800 shrink-0 text-xs">Kunci Jawaban Benar:</span>
                      <span className="font-semibold text-emerald-900">{correctAnswerText}</span>
                    </div>
                  )}

                  {/* Explanation */}
                  <div className="p-2.5 rounded-lg bg-stone-100/70 border border-stone-200/60 text-stone-600 text-[11px] leading-relaxed">
                    <strong className="text-stone-800">Pembahasan:</strong> {question.explanation}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. TOMBOL ULANGI TES */}
      <div className="text-center pt-2 pb-6">
        <button
          type="button"
          onClick={onRestart}
          className="w-full sm:w-auto px-8 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 active:scale-[0.99] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 mx-auto shadow-md transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Ulangi Tes Kuis</span>
        </button>
      </div>
    </div>
  );
};
