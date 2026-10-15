import { Question, ChapterFilter, KotobaItem } from '../types/quiz';
import { ALL_KOTOBA } from './kotobaData';

/**
 * Shuffle array using Fisher-Yates algorithm
 */
function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Generate a clean multiple choice question from a KotobaItem
 */
function createQuestionFromKotoba(
  item: KotobaItem,
  chapterCandidates: KotobaItem[],
  allCandidates: KotobaItem[],
  id: number
): Question {
  const japaneseDisplay = item.kanji && item.kanji !== item.japanese
    ? `${item.japanese} (${item.kanji})`
    : item.japanese;

  // Filter out identical meanings or identical japanese
  const cleanMeaning = item.indonesian.trim();
  const lowerMeaning = cleanMeaning.toLowerCase();

  const sameChapterOthers = chapterCandidates.filter(
    (c) => c.indonesian.trim().toLowerCase() !== lowerMeaning && c.japanese !== item.japanese
  );

  const globalOthers = allCandidates.filter(
    (c) => c.indonesian.trim().toLowerCase() !== lowerMeaning && c.japanese !== item.japanese
  );

  // Pick 3 distractors, prioritizing items from the same chapter if available
  const pool = [...shuffle(sameChapterOthers), ...shuffle(globalOthers)];
  const distractors: string[] = [];
  const seenTexts = new Set<string>([lowerMeaning]);

  for (const other of pool) {
    const candidateMeaning = other.indonesian.trim();
    const candidateLower = candidateMeaning.toLowerCase();
    if (!seenTexts.has(candidateLower)) {
      seenTexts.add(candidateLower);
      distractors.push(candidateMeaning);
    }
    if (distractors.length === 3) break;
  }

  // Combine and shuffle options
  const rawOptions = [cleanMeaning, ...distractors];
  const shuffledOptions = shuffle(rawOptions);
  const correctIndex = shuffledOptions.indexOf(cleanMeaning);

  return {
    id,
    chapter: item.chapter,
    chapterLabel: `Bab ${item.chapter}`,
    japanese: japaneseDisplay,
    kanji: item.kanji,
    hiragana: item.japanese,
    meaning: cleanMeaning,
    questionPrompt: 'Pilihlah arti bahasa Indonesia yang tepat untuk kosakata berikut:',
    options: shuffledOptions,
    correctIndex,
    explanation: `「${japaneseDisplay}」berarti "${cleanMeaning}" (Minna no Nihongo Bab ${item.chapter}, No. ${item.no}).`,
    category: `Bab ${item.chapter} No. ${item.no}`
  };
}

/**
 * Calculate recommended time limit in seconds based on question count:
 * ~20-25 seconds per question with a minimum of 10 minutes (600s),
 * rounded to neat whole minutes.
 */
export function calculateQuizTimeLimit(totalQuestions: number): number {
  return Math.max(600, Math.ceil((totalQuestions * 20) / 60) * 60);
}

/**
 * Generate questions for the test session.
 * For specific chapters ('bab1' to 'bab50'):
 * Returns 100% OF ALL KOTOBA IN THAT CHAPTER (menebak keseluruhan total per bab).
 */
export function getQuizQuestions(filter: ChapterFilter = 'bab1'): Question[] {
  let selectedKotobas: KotobaItem[] = [];
  let chapterPool: KotobaItem[] = [];

  if (filter === 'all') {
    selectedKotobas = shuffle(ALL_KOTOBA).slice(0, 30);
    chapterPool = ALL_KOTOBA;
  } else if (filter === 'shokyuu1') {
    chapterPool = ALL_KOTOBA.filter((k) => k.chapter <= 25);
    selectedKotobas = shuffle(chapterPool).slice(0, 25);
  } else if (filter === 'shokyuu2') {
    chapterPool = ALL_KOTOBA.filter((k) => k.chapter >= 26);
    selectedKotobas = shuffle(chapterPool).slice(0, 25);
  } else {
    // Specific chapter: 'bab1' to 'bab50'
    // Returns 100% OF ALL KOTOBA IN THIS CHAPTER!
    const chapterNum = parseInt(filter.replace('bab', ''), 10) || 1;
    chapterPool = ALL_KOTOBA.filter((k) => k.chapter === chapterNum);

    if (chapterPool.length > 0) {
      // Shuffle the order so the test is engaging, but includes ALL kotoba in the chapter!
      selectedKotobas = shuffle(chapterPool);
    } else {
      selectedKotobas = shuffle(ALL_KOTOBA).slice(0, 20);
    }
  }

  return selectedKotobas.map((item, index) =>
    createQuestionFromKotoba(item, chapterPool, ALL_KOTOBA, index + 1)
  );
}

export { ALL_KOTOBA };
