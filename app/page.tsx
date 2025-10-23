'use client';

import { useEffect, useState } from 'react';
import { Card, CardProgress } from '@/lib/types';
import { loadCards } from '@/lib/data';
import {
  initializeCardProgress,
  calculateNextReview,
  getDueCards,
  getNewCards,
} from '@/lib/srs';
import { loadProgress, saveProgressItem } from '@/lib/storage';
import FlashCard from '@/components/FlashCard';
import Navigation from '@/components/Navigation';
import BrowseView from '@/components/BrowseView';

export default function Home() {
  const [cards, setCards] = useState<Card[]>([]);
  const [progress, setProgress] = useState<CardProgress[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [studyQueue, setStudyQueue] = useState<Card[]>([]);
  const [view, setView] = useState<'study' | 'browse'>('study');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const loadedCards = await loadCards();
      const loadedProgress = loadProgress();

      setCards(loadedCards);
      setProgress(loadedProgress);

      // Get due cards and new cards
      const dueCardProgress = getDueCards(loadedProgress);
      const dueCardIds = new Set(dueCardProgress.map((p) => p.cardId));
      const dueCards = loadedCards.filter((c) => dueCardIds.has(c.id));

      const newCardIds = getNewCards(
        loadedProgress,
        loadedCards.map((c) => c.id),
        10
      );
      const newCards = loadedCards.filter((c) => newCardIds.includes(c.id));

      setStudyQueue([...dueCards, ...newCards]);
      setLoading(false);
    }

    init();
  }, []);

  const handleReview = (quality: number) => {
    if (studyQueue.length === 0) return;

    const currentCard = studyQueue[currentCardIndex];
    const currentProgress =
      progress.find((p) => p.cardId === currentCard.id) ||
      initializeCardProgress(currentCard.id);

    const updatedProgress = calculateNextReview(currentProgress, { quality });

    saveProgressItem(updatedProgress);

    setProgress((prev) => {
      const index = prev.findIndex((p) => p.cardId === currentCard.id);
      if (index >= 0) {
        const newProgress = [...prev];
        newProgress[index] = updatedProgress;
        return newProgress;
      } else {
        return [...prev, updatedProgress];
      }
    });

    // Move to next card
    if (currentCardIndex < studyQueue.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      // End of queue
      setCurrentCardIndex(0);
      setStudyQueue([]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfcf9]">
        <div className="text-center">
          <h1 className="text-3xl font-serif mb-4">Colombian Spanish</h1>
          <p className="text-lg text-stone-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfcf9]">
      <Navigation view={view} setView={setView} />

      {view === 'study' ? (
        <div className="container max-w-2xl mx-auto px-6 py-12">
          {studyQueue.length > 0 ? (
            <>
              <div className="mb-8 text-center">
                <p className="text-sm text-stone-500">
                  Card {currentCardIndex + 1} of {studyQueue.length}
                </p>
              </div>
              <FlashCard
                card={studyQueue[currentCardIndex]}
                onReview={handleReview}
              />
            </>
          ) : (
            <div className="text-center py-20">
              <h2 className="text-3xl font-serif mb-4">All done!</h2>
              <p className="text-lg text-stone-600 mb-8">
                You've reviewed all your cards for today.
              </p>
              <button
                onClick={() => setView('browse')}
                className="px-6 py-3 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors"
              >
                Browse All Cards
              </button>
            </div>
          )}
        </div>
      ) : (
        <BrowseView cards={cards} />
      )}
    </div>
  );
}
