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
import { getCardsByCategory } from '@/lib/categories';
import FlashCard from '@/components/FlashCard';
import Navigation from '@/components/Navigation';
import BrowseView from '@/components/BrowseView';
import CategorySelector from '@/components/CategorySelector';

export default function Home() {
  const [cards, setCards] = useState<Card[]>([]);
  const [progress, setProgress] = useState<CardProgress[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [studyQueue, setStudyQueue] = useState<Card[]>([]);
  const [view, setView] = useState<'study' | 'browse' | 'categories'>('categories');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryMap, setCategoryMap] = useState<Map<string, Card[]>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const loadedCards = await loadCards();
      const loadedProgress = await loadProgress();

      setCards(loadedCards);
      setProgress(loadedProgress);

      // Categorize cards
      const catMap = getCardsByCategory(loadedCards);
      setCategoryMap(catMap);

      setLoading(false);
    }

    init();
  }, []);

  // Update study queue when category changes
  useEffect(() => {
    if (cards.length === 0) return;

    const cardsToStudy = selectedCategory
      ? categoryMap.get(selectedCategory) || []
      : cards;

    // Get due cards and new cards from selected category
    const dueCardProgress = getDueCards(progress);
    const dueCardIds = new Set(dueCardProgress.map((p) => p.cardId));
    const dueCards = cardsToStudy.filter((c) => dueCardIds.has(c.id));

    const newCardIds = getNewCards(
      progress,
      cardsToStudy.map((c) => c.id),
      10
    );
    const newCards = cardsToStudy.filter((c) => newCardIds.includes(c.id));

    setStudyQueue([...dueCards, ...newCards]);
    setCurrentCardIndex(0);
  }, [selectedCategory, cards, progress, categoryMap]);

  const handleToggleFavorite = () => {
    if (studyQueue.length === 0) return;

    const currentCard = studyQueue[currentCardIndex];
    const currentProgress =
      progress.find((p) => p.cardId === currentCard.id) ||
      initializeCardProgress(currentCard.id);

    const updatedProgress = {
      ...currentProgress,
      isFavorite: !currentProgress.isFavorite,
    };

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
  };

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

  const handleSelectCategory = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    setView('study');
  };

  return (
    <div className="min-h-screen bg-[#fdfcf9]">
      <Navigation
        view={view}
        setView={setView}
        selectedCategory={selectedCategory}
        onBackToCategories={() => setView('categories')}
      />

      {view === 'categories' ? (
        <div className="container max-w-6xl mx-auto px-6 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-serif text-stone-900 mb-2">
              Build Fluency, Not Vocabulary
            </h1>
            <p className="text-lg text-stone-600">
              Learn to communicate effectively with minimal words. Start with high-priority categories.
            </p>
          </div>
          <CategorySelector
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
            cardCounts={new Map(
              Array.from(categoryMap.entries()).map(([id, cards]) => [id, cards.length])
            )}
          />
        </div>
      ) : view === 'study' ? (
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
                isFavorite={
                  progress.find((p) => p.cardId === studyQueue[currentCardIndex].id)
                    ?.isFavorite || false
                }
                onToggleFavorite={handleToggleFavorite}
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
        <BrowseView
          cards={selectedCategory ? (categoryMap.get(selectedCategory) || []) : cards}
          progress={progress}
          onToggleFavorite={(cardId) => {
          const currentProgress =
            progress.find((p) => p.cardId === cardId) ||
            initializeCardProgress(cardId);

          const updatedProgress = {
            ...currentProgress,
            isFavorite: !currentProgress.isFavorite,
          };

          saveProgressItem(updatedProgress);

          setProgress((prev) => {
            const index = prev.findIndex((p) => p.cardId === cardId);
            if (index >= 0) {
              const newProgress = [...prev];
              newProgress[index] = updatedProgress;
              return newProgress;
            } else {
              return [...prev, updatedProgress];
            }
          });
        }} />
      )}
    </div>
  );
}
