import { CardProgress } from './types';

const STORAGE_KEY = 'spanish-srs-progress';
const USER_ID_KEY = 'spanish-srs-user-id';

function getUserId(): string {
  if (typeof window === 'undefined') return '';

  let userId = localStorage.getItem(USER_ID_KEY);
  if (!userId) {
    userId = `user-${Date.now()}-${Math.random().toString(36).substring(2)}`;
    localStorage.setItem(USER_ID_KEY, userId);

    // Set cookie for API requests
    document.cookie = `userId=${userId}; path=/; max-age=31536000; SameSite=Strict`;
  }
  return userId;
}

export async function saveProgress(progress: CardProgress[]): Promise<void> {
  // Save to localStorage first (immediate)
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }

  // Then sync to KV (background)
  try {
    const userId = getUserId();
    await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(progress),
    });
  } catch (error) {
    console.error('Failed to sync to cloud:', error);
    // Fail silently, localStorage is the source of truth
  }
}

export async function loadProgress(): Promise<CardProgress[]> {
  // Try to load from KV first
  try {
    const response = await fetch('/api/progress');
    if (response.ok) {
      const data = await response.json();
      if (data && Array.isArray(data) && data.length > 0) {
        // Parse dates
        const progress = data.map((p: any) => ({
          ...p,
          dueDate: new Date(p.dueDate),
          lastReviewed: p.lastReviewed ? new Date(p.lastReviewed) : null,
        }));

        // Update localStorage with cloud data
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
        }

        return progress;
      }
    }
  } catch (error) {
    console.error('Failed to load from cloud, using local:', error);
  }

  // Fallback to localStorage
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      return parsed.map((p: any) => ({
        ...p,
        dueDate: new Date(p.dueDate),
        lastReviewed: p.lastReviewed ? new Date(p.lastReviewed) : null,
      }));
    }
  }

  return [];
}

export async function saveProgressItem(progress: CardProgress): Promise<void> {
  const allProgress = await loadProgressLocal();
  const index = allProgress.findIndex((p) => p.cardId === progress.cardId);

  if (index >= 0) {
    allProgress[index] = progress;
  } else {
    allProgress.push(progress);
  }

  await saveProgress(allProgress);
}

function loadProgressLocal(): CardProgress[] {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      return parsed.map((p: any) => ({
        ...p,
        dueDate: new Date(p.dueDate),
        lastReviewed: p.lastReviewed ? new Date(p.lastReviewed) : null,
      }));
    }
  }
  return [];
}
