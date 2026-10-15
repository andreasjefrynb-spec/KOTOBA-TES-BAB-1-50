import React, { useState, useMemo } from 'react';
import { ChapterFilter } from '../types/quiz';
import { ALL_KOTOBA } from '../data/kotobaData';
import { CHAPTER_METADATA } from '../data/chapterMetadata';
import { calculateQuizTimeLimit } from '../data/questions';
import { ArrowRight, User, AlertCircle, Check, Info, Clock, CheckCircle2 } from 'lucide-react';
import { soundService } from '../utils/sound';

interface StartScreenProps {
  onStart: (name: string, filter: ChapterFilter) => void;
  onShowAlert: (msg: string, type?: 'error' | 'success' | 'info') => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart, onShowAlert }) => {
  const [participantName, setParticipantName] = useState('');
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<ChapterFilter>('bab1');
  const [selectedBabGroup, setSelectedBabGroup] = useState<number>(0); // 0: 1-10, 1: 11-20, 2: 21-30, 3: 31-40, 4: 41-50

  // Calculate question count and time for currently selected chapter
  const currentChapterStats = useMemo(() => {
    const babNum = parseInt(selectedFilter.replace('bab', ''), 10) || 1;
    const items = ALL_KOTOBA.filter((k) => k.chapter === babNum);
    const questionCount = items.length;
    const meta = CHAPTER_METADATA[babNum];
    const label = `Bab ${babNum}: ${meta?.title || 'Minna no Nihongo'}`;
    const timeLimitSec = calculateQuizTimeLimit(questionCount);
    const timeLimitMin = Math.round(timeLimitSec / 60);

    return {
      babNum,
      questionCount,
      title: meta?.title || 'Kosakata Minna no Nihongo',
      label,
      timeLimitSec,
      timeLimitMin,
    };
  }, [selectedFilter]);

  const handleStartTest = (e: React.FormEvent) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);

    const trimmed = participantName.trim();
    if (!trimmed) {
      onShowAlert('Silakan masukkan nama peserta terlebih dahulu!', 'error');
      soundService.playTryAgain();
      return;
    }

    soundService.playOptionSelect();
    onStart(trimmed, selectedFilter);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-5 sm:py-8">
      {/* Brand Header */}
      <div className="text-center mb-5">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-semibold tracking-wide mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>
          Kuis Full Kotoba Per Bab
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight font-serif">
          日本語クラス
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-rose-700 mt-1">
          Minna no Nihongo {currentChapterStats.label}
        </p>
        <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 leading-relaxed">
          Uji pemahaman kosakata secara menyeluruh sesuai dokumen resmi (50 Bab Lengkap).
        </p>
      </div>

      {/* Main Form Card */}
      <div className="bg-white rounded-2xl shadow-md shadow-stone-200/50 border border-stone-200 overflow-hidden">
        {/* Japanese Accent Ribbon */}
        <div className="h-1.5 bg-gradient-to-r from-rose-500 via-red-600 to-amber-500" />

        <form onSubmit={handleStartTest} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
          {/* 1. Input Nama Peserta */}
          <div className="space-y-1.5">
            <label htmlFor="participantName" className="block text-xs sm:text-sm font-semibold text-stone-800">
              Nama Peserta <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                <User className="w-4 h-4" />
              </div>
              <input
                id="participantName"
                type="text"
                value={participantName}
                onChange={(e) => {
                  setParticipantName(e.target.value);
                  if (hasAttemptedSubmit && e.target.value.trim()) {
                    setHasAttemptedSubmit(false);
                  }
                }}
                placeholder="Masukkan nama lengkap peserta"
                className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-stone-900 placeholder:text-stone-400 text-xs sm:text-sm font-medium transition-all focus:outline-none focus:ring-2 ${
                  hasAttemptedSubmit && !participantName.trim()
                    ? 'border-rose-400 bg-rose-50/40 focus:border-rose-500 focus:ring-rose-200'
                    : 'border-stone-200 bg-stone-50/50 hover:border-stone-300 focus:bg-white focus:border-stone-800 focus:ring-stone-200'
                }`}
                autoComplete="name"
              />
            </div>
            {hasAttemptedSubmit && !participantName.trim() && (
              <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 pt-0.5 animate-in fade-in">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Nama wajib diisi sebelum mulai kuis</span>
              </div>
            )}
          </div>

          {/* 2. Pemilihan Bab (50 Bab Lengkap) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs sm:text-sm font-semibold text-stone-800">
                Pilih Bab Kuis (Bab 1–50)
              </label>
              <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                Bab {currentChapterStats.babNum}: {currentChapterStats.questionCount} Soal Full
              </span>
            </div>

            {/* Range Selector Tabs: 1-10, 11-20, 21-30, 31-40, 41-50 */}
            <div className="grid grid-cols-5 gap-1 p-1 bg-stone-100 rounded-xl">
              {[
                { idx: 0, label: '1–10' },
                { idx: 1, label: '11–20' },
                { idx: 2, label: '21–30' },
                { idx: 3, label: '31–40' },
                { idx: 4, label: '41–50' },
              ].map((grp) => (
                <button
                  key={grp.idx}
                  type="button"
                  onClick={() => {
                    setSelectedBabGroup(grp.idx);
                    soundService.playOptionSelect();
                  }}
                  className={`py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    selectedBabGroup === grp.idx
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  {grp.label}
                </button>
              ))}
            </div>

            {/* 10 Chapters Grid in Current Group */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
              {Array.from({ length: 10 }).map((_, i) => {
                const babNum = selectedBabGroup * 10 + (i + 1);
                if (babNum > 50) return null;
                const isSelected = selectedFilter === `bab${babNum}`;
                const kotobaCount = ALL_KOTOBA.filter((k) => k.chapter === babNum).length;
                const meta = CHAPTER_METADATA[babNum];

                return (
                  <button
                    key={babNum}
                    type="button"
                    onClick={() => {
                      setSelectedFilter(`bab${babNum}` as ChapterFilter);
                      soundService.playOptionSelect();
                    }}
                    className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-rose-600 bg-rose-50/80 text-rose-950 font-semibold ring-2 ring-rose-500/20 shadow-xs'
                        : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50 text-stone-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">Bab {babNum}</span>
                      {isSelected && <Check className="w-3 h-3 text-rose-600 shrink-0" />}
                    </div>
                    <div className="text-[11px] font-bold text-rose-600 mt-0.5">
                      {kotobaCount} Kotoba
                    </div>
                    <div className="text-[10px] text-stone-400 truncate mt-0.5" title={meta?.title}>
                      {meta?.title || 'Minna no Nihongo'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. KOTAK INFORMASI KETENTUAN TES (Sesuai Permintaan Spesifikasi) */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-stone-50/90 border border-stone-200 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800">
              <Info className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span>Ketentuan Tes Kuis:</span>
            </div>
            <ul className="space-y-1.5 text-xs text-stone-600 pl-4 list-disc marker:text-rose-500">
              <li>
                <strong>{currentChapterStats.questionCount} Soal Pilihan Ganda</strong>: Menebak seluruh total kosakata {currentChapterStats.label}.
              </li>
              <li>
                <strong>Durasi Waktu {currentChapterStats.timeLimitMin} Menit</strong> ({currentChapterStats.timeLimitSec} detik): Timer hitung mundur otomatis selesai jika waktu habis.
              </li>
              <li>
                <strong>Auto-Advance</strong>: Memilih jawaban otomatis tersimpan dan langsung lanjut ke soal berikutnya.
              </li>
            </ul>
          </div>

          {/* 4. Tombol Mulai Tes Sekarang (Single, clean, focused) */}
          <div className="pt-1">
            <button
              type="submit"
              className="w-full py-3 sm:py-3.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 active:scale-[0.99] text-white font-bold text-xs sm:text-sm shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>Mulai Tes Bab {currentChapterStats.babNum} ({currentChapterStats.questionCount} Soal Full)</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </form>
      </div>

      {/* Footer Info */}
      <div className="text-center text-xs text-stone-400 mt-5 space-y-0.5">
        <p>Kelas Bahasa Jepang • 日本語能力試験 (JLPT N5 & N4)</p>
        <p>Standar Kelulusan: Nilai Minimal 60 / 100</p>
      </div>
    </div>
  );
};
