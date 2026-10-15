export interface KotobaItem {
  no: number;
  chapter: number;
  japanese: string;
  kanji?: string;
  indonesian: string;
}

export interface Question {
  id: number;
  chapter: number; // 1, 2, 3, 4, 5
  chapterLabel: string; // e.g. "Bab 1", "Bab 2"
  japanese: string; // e.g. "がくせい (学生)"
  kanji?: string;
  hiragana: string;
  romaji?: string;
  meaning: string;
  questionPrompt: string;
  options: string[]; // 4 options
  correctIndex: number; // 0..3
  explanation: string;
  category: string;
}

export type ChapterFilter = 'all' | 'shokyuu1' | 'shokyuu2' | `bab${number}`;

export interface QuizResult {
  participantName: string;
  chapterModeTitle: string;
  totalQuestions: number;
  correctCount: number;
  score: number; // 0 - 100
  isPassed: boolean; // score >= 60
  timeLimitSeconds: number; // 600
  timeRemainingSeconds: number;
  timeSpentSeconds: number;
  answers: { [questionId: number]: number }; // questionId -> chosen option index
  wrongQuestionIndices: number[]; // 1-based question numbers: e.g. [2, 5, 8]
  questions: Question[];
  completedAt: string;
}
