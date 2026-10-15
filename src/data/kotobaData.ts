import { KotobaItem } from '../types/quiz';
import rawKotobaList from './kotobaAll50.json';

/**
 * Minna no Nihongo Bab 1 - 50 Lengkap (Total 2,910 Kotoba)
 * Sesuai dokumen resmi Oleh: Agus Hinji
 */
export const ALL_KOTOBA: KotobaItem[] = rawKotobaList as KotobaItem[];

export const KOTOBA_BAB_1_TO_5: KotobaItem[] = ALL_KOTOBA.filter((k) => k.chapter <= 5);

export function getKotobaByChapter(chapter: number): KotobaItem[] {
  return ALL_KOTOBA.filter((k) => k.chapter === chapter);
}

export function getAvailableChapters(): number[] {
  const set = new Set<number>();
  ALL_KOTOBA.forEach((k) => set.add(k.chapter));
  return Array.from(set).sort((a, b) => a - b);
}
