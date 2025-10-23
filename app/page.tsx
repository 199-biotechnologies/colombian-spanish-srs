'use client';

import { useEffect, useState } from 'react';
import { Card, CardProgress, StudySettings } from '@/lib/types';
import { loadCards } from '@/lib/data';
import {
  initializeCardProgress,
  calculateNextReview,
  getDueCards,
  getNewCards,
} from '@/lib/srs';
import { loadProgress, saveProgressItem } from '@/lib/storage';
import { getCardsByCategory } from '@/lib/categories';
import { generateReverseCards, mixReverseCards } from '@/lib/reverseCards';
import FlashCard from '@/components/FlashCard';
import Navigation from '@/components/Navigation';
import BrowseView from '@/components/BrowseView';
import CategorySelector from '@/components/CategorySelector';
import StudyModeSelector from '@/components/StudyModeSelector';

export default function Home() {
  const [cards, setCards] = useState<Card[]>([]);
  const [allCards, setAllCards] = useState<Card[]>([]); // Includes reverse cards
  const [progress, setProgress] = useState<CardProgress[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [studyQueue, setStudyQueue] = useState<Card[]>([]);
  const [view, setView] = useState<'study' | 'browse' | 'categories'>('categories');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryMap, setCategoryMap] = useState<Map<string, Card[]>>(new Map());
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [studySettings, setStudySettings] = useState<StudySettings>({
    mode: 'normal',
    showGuessPrompt: false,
    includeReverseCards: false,
  });

  useEffect(() => {
    async function init() {
      const loadedCards = await loadCards();
      const loadedProgress = await loadProgress();

      setCards(loadedCards);
      setProgress(loadedProgress);

      // Generate reverse cards
      const reverseCards = generateReverseCards(loadedCards);
      const combinedCards = [...loadedCards, ...reverseCards];
      setAllCards(combinedCards);

      // Categorize cards (only original cards for category view)
      const catMap = getCardsByCategory(loadedCards);
      setCategoryMap(catMap);

      setLoading(false);
    }

    init();
  }, []);

  // Update study queue when category or settings change
  useEffect(() => {
    if (cards.length === 0) return;

    let cardsToStudy = selectedCategory
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

    let queue = [...dueCards, ...newCards];

    // Mix in reverse cards if setting enabled
    if (studySettings.includeReverseCards) {
      const reverseCardsForCategory = allCards.filter(
        (c) => c.isReverse && queue.some((q) => q.id === c.id.replace('-reverse', ''))
      );
      queue = mixReverseCards(queue, reverseCardsForCategory, 0.3);
    }

    setStudyQueue(queue);
    setCurrentCardIndex(0);
  }, [selectedCategory, cards, progress, categoryMap, studySettings.includeReverseCards, allCards]);

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

  const handleSavePersonalNote = (note: string) => {
    if (studyQueue.length === 0) return;

    const currentCard = studyQueue[currentCardIndex];
    const currentProgress =
      progress.find((p) => p.cardId === currentCard.id) ||
      initializeCardProgress(currentCard.id);

    const updatedProgress = {
      ...currentProgress,
      personalNotes: note,
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
          <h1 className="text-3xl font-serif mb-4">Cariñosas</h1>
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
              Cariñosas
            </h1>
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
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-stone-500">
                  Card {currentCardIndex + 1} of {studyQueue.length}
                </p>
                <button
                  onClick={() => setShowSettings(true)}
                  className="px-4 py-2 text-sm text-amber-700 border border-amber-700 rounded-lg hover:bg-amber-50 transition-colors"
                >
                  ⚙️ Study Settings
                </button>
              </div>
              <FlashCard
                card={studyQueue[currentCardIndex]}
                onReview={handleReview}
                isFavorite={
                  progress.find((p) => p.cardId === studyQueue[currentCardIndex].id)
                    ?.isFavorite || false
                }
                onToggleFavorite={handleToggleFavorite}
                studyMode={studySettings.mode}
                showGuessPrompt={studySettings.showGuessPrompt}
                isNewCard={
                  !progress.find((p) => p.cardId === studyQueue[currentCardIndex].id)
                    ?.lastReviewed
                }
                personalNote={
                  progress.find((p) => p.cardId === studyQueue[currentCardIndex].id)
                    ?.personalNotes || ''
                }
                onSavePersonalNote={handleSavePersonalNote}
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

      {showSettings && (
        <StudyModeSelector
          settings={studySettings}
          onSettingsChange={setStudySettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
