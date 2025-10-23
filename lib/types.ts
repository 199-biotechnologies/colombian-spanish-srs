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
  isReverse?: boolean; // For reverse cards (English→Spanish)
}

export interface CardProgress {
  cardId: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  dueDate: Date;
  lastReviewed: Date | null;
  isFavorite?: boolean;
  personalNotes?: string; // User's personal context/examples
  guessHistory?: string[]; // Track guesses for new cards
}

export interface ReviewResult {
  quality: number; // 0-5 (Anki scale: 0=complete blackout, 5=perfect response)
}

export type StudyMode = 'normal' | 'type-to-answer' | 'listening-first';

export interface StudySettings {
  mode: StudyMode;
  showGuessPrompt: boolean; // Guess-before-you-know for new cards
  includeReverseCards: boolean;
}
