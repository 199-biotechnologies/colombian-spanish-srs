export interface Card {
  id: string;
  front: string;
  back: string;
  audio: string | null;
  notes: string;
  alternative: string;
  reply: string;
  type: string;
  tags: string;
  level: number;
}

export interface CardProgress {
  cardId: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  dueDate: Date;
  lastReviewed: Date | null;
  isFavorite?: boolean;
}

export interface ReviewResult {
  quality: number; // 0-5 (Anki scale: 0=complete blackout, 5=perfect response)
}
