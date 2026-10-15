import { QuizResult } from '../types/quiz';

/**
 * Format time in seconds to MM:SS
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(Math.max(0, seconds) / 60);
  const secs = Math.max(0, seconds) % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Generate formatted WhatsApp message text
 */
export function generateWhatsAppMessage(result: QuizResult): string {
  const statusEmoji = result.isPassed ? '✅' : '⚠️';
  const statusText = result.isPassed ? 'LULUS (合格)' : 'BELUM LULUS (不合格)';
  
  const wrongQuestionsText = result.wrongQuestionIndices.length > 0
    ? `No. ${result.wrongQuestionIndices.join(', ')}`
    : 'Tidak ada (Sempurna 100%! 🎉)';

  const remainingFormatted = formatTime(result.timeRemainingSeconds);
  const spentFormatted = formatTime(result.timeSpentSeconds);

  return [
    `📊 *LAPORAN HASIL KUIS BAHASA JEPANG* 🇯🇵`,
    `*Program:* 日本語クラス (${result.chapterModeTitle})`,
    `━━━━━━━━━━━━━━━━━━━━`,
    `👤 *Nama Peserta:* ${result.participantName}`,
    `🎯 *Jumlah Benar:* ${result.correctCount} / ${result.totalQuestions} Benar`,
    `⭐ *Nilai Akhir:* ${result.score} / 100`,
    `⏱️ *Sisa Waktu:* ${remainingFormatted} (Waktu Pengerjaan: ${spentFormatted})`,
    `🎖️ *Status:* ${statusEmoji} ${statusText}`,
    `❌ *Soal Salah:* ${wrongQuestionsText}`,
    `━━━━━━━━━━━━━━━━━━━━`,
    `📅 *Tanggal:* ${result.completedAt}`,
    `_Dikirim otomatis dari Sistem Kuis 日本語クラス_`
  ].join('\n');
}

/**
 * Generate WhatsApp universal link
 */
export function getWhatsAppShareUrl(result: QuizResult): string {
  const message = generateWhatsAppMessage(result);
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
}

/**
 * Copy text to clipboard with fallback
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);
      return successful;
    }
  } catch {
    return false;
  }
}
