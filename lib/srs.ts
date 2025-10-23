import { CardProgress, ReviewResult } from './types';

/**
 * Anki SM-2 Algorithm Implementation
 * Quality scale: 0-5
 * 0: Complete blackout
 * 1: Incorrect response; correct answer recalled with difficulty
 * 2: Incorrect response; correct answer seemed easy to recall
 * 3: Correct response; recalled with serious difficulty
 * 4: Correct response; recalled after some hesitation
 * 5: Perfect response; recalled immediately
 */

const INITIAL_EASE_FACTOR = 2.5;
const MINIMUM_EASE_FACTOR = 1.3;

export function initializeCardProgress(cardId: string): CardProgress {
  return {
    cardId,
    easeFactor: INITIAL_EASE_FACTOR,
    interval: 0,
    repetitions: 0,
    dueDate: new Date(),
    lastReviewed: null,
  };
}

export function calculateNextReview(
  progress: CardProgress,
  result: ReviewResult
): CardProgress {
  const { quality } = result;
  const { easeFactor, interval, repetitions } = progress;

  let newEaseFactor = easeFactor;
  let newInterval = interval;
  let newRepetitions = repetitions;

  // Update ease factor
  newEaseFactor = Math.max(
    MINIMUM_EASE_FACTOR,
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );

  // Update interval based on quality
  if (quality < 3) {
    // Failed: start again
    newRepetitions = 0;
    newInterval = 0;
  } else {
    // Passed: increase interval
    newRepetitions += 1;

    if (newRepetitions === 1) {
      newInterval = 1; // 1 day
    } else if (newRepetitions === 2) {
      newInterval = 6; // 6 days
    } else {
      newInterval = Math.round(interval * newEaseFactor);
    }
  }

  const now = new Date();
  const dueDate = new Date(now.getTime() + newInterval * 24 * 60 * 60 * 1000);

  return {
    ...progress,
    easeFactor: newEaseFactor,
    interval: newInterval,
    repetitions: newRepetitions,
    dueDate,
    lastReviewed: now,
  };
}

export function getDueCards(allProgress: CardProgress[]): CardProgress[] {
  const now = new Date();
  return allProgress.filter((progress) => progress.dueDate <= now);
}

export function getNewCards(
  allProgress: CardProgress[],
  allCardIds: string[],
  limit: number = 10
): string[] {
  const reviewedCardIds = new Set(allProgress.map((p) => p.cardId));
  const newCardIds = allCardIds.filter((id) => !reviewedCardIds.has(id));
  return newCardIds.slice(0, limit);
}
