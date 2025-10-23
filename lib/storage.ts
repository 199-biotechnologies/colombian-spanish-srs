import { CardProgress } from './types';

const STORAGE_KEY = 'spanish-srs-progress';

export function saveProgress(progress: CardProgress[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }
}

export function loadProgress(): CardProgress[] {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      // Convert date strings back to Date objects
      return parsed.map((p: any) => ({
        ...p,
        dueDate: new Date(p.dueDate),
        lastReviewed: p.lastReviewed ? new Date(p.lastReviewed) : null,
      }));
    }
  }
  return [];
}

export function saveProgressItem(progress: CardProgress): void {
  const allProgress = loadProgress();
  const index = allProgress.findIndex((p) => p.cardId === progress.cardId);

  if (index >= 0) {
    allProgress[index] = progress;
  } else {
    allProgress.push(progress);
  }

  saveProgress(allProgress);
}
