import { kv } from '@vercel/kv';
import { CardProgress } from './types';

const PROGRESS_KEY_PREFIX = 'user:progress:';

export async function saveProgressToKV(
  userId: string,
  progress: CardProgress[]
): Promise<void> {
  const key = `${PROGRESS_KEY_PREFIX}${userId}`;
  await kv.set(key, JSON.stringify(progress));
}

export async function loadProgressFromKV(
  userId: string
): Promise<CardProgress[]> {
  const key = `${PROGRESS_KEY_PREFIX}${userId}`;
  const data = await kv.get<string>(key);

  if (!data) return [];

  const parsed = JSON.parse(data);
  // Convert date strings back to Date objects
  return parsed.map((p: any) => ({
    ...p,
    dueDate: new Date(p.dueDate),
    lastReviewed: p.lastReviewed ? new Date(p.lastReviewed) : null,
  }));
}

export async function saveProgressItemToKV(
  userId: string,
  progress: CardProgress
): Promise<void> {
  const allProgress = await loadProgressFromKV(userId);
  const index = allProgress.findIndex((p) => p.cardId === progress.cardId);

  if (index >= 0) {
    allProgress[index] = progress;
  } else {
    allProgress.push(progress);
  }

  await saveProgressToKV(userId, allProgress);
}
