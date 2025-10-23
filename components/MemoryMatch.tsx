'use client';

import { useState, useEffect } from 'react';
import { coreVocabulary, CoreWord } from '@/lib/coreVocabulary';

interface MatchPair {
  id: string;
  word: CoreWord;
  column: 1 | 2; // Column 1 = Spanish, Column 2 = English
  matched: boolean;
}

export default function MemoryMatch() {
  const [pairs, setPairs] = useState<MatchPair[]>([]);
  const [selected, setSelected] = useState<{ id: string; column: 1 | 2 } | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isReplacing, setIsReplacing] = useState(false);

  // Initialize game with 6 random words
  useEffect(() => {
    initializeGame();
  }, []);

  function initializeGame() {
    const selectedWords = getRandomWords(6);
    const newPairs: MatchPair[] = [];

    selectedWords.forEach((word, index) => {
      // Spanish word (left column)
      newPairs.push({
        id: `${word.spanish}-${index}-spanish`,
        word,
        column: 1,
        matched: false,
      });

      // English word (right column)
      newPairs.push({
        id: `${word.english}-${index}-english`,
        word,
        column: 2,
        matched: false,
      });
    });

    // Shuffle each column independently to prevent pattern recognition
    const column1 = shuffle(newPairs.filter(p => p.column === 1));
    const column2 = shuffle(newPairs.filter(p => p.column === 2));

    setPairs([...column1, ...column2]);
  }

  function getRandomWords(count: number): CoreWord[] {
    const shuffled = [...coreVocabulary].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  function shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  function handleSelect(id: string, column: 1 | 2) {
    // Ignore if already matched or currently replacing
    if (pairs.find(p => p.id === id)?.matched || isReplacing) return;

    // If no selection, select this one
    if (!selected) {
      setSelected({ id, column });
      return;
    }

    // If clicking the same item, deselect
    if (selected.id === id) {
      setSelected(null);
      return;
    }

    // If clicking same column, switch selection
    if (selected.column === column) {
      setSelected({ id, column });
      return;
    }

    // Check if it's a match
    const selectedPair = pairs.find(p => p.id === selected.id);
    const clickedPair = pairs.find(p => p.id === id);

    if (selectedPair && clickedPair && selectedPair.word.spanish === clickedPair.word.spanish) {
      // Match!
      setScore(score + 10);
      setStreak(streak + 1);

      // Mark as matched
      setPairs(prev => prev.map(p =>
        p.id === selected.id || p.id === id ? { ...p, matched: true } : p
      ));

      setSelected(null);

      // Replace with new words after 2.5 seconds to keep empty space visible
      setIsReplacing(true);
      setTimeout(() => {
        replaceMatchedPair(selectedPair, clickedPair);
        setIsReplacing(false);
      }, 2500);
    } else {
      // Not a match - reset selection and break streak
      setStreak(0);
      setSelected(null);
    }
  }

  function replaceMatchedPair(pair1: MatchPair, pair2: MatchPair) {
    const unusedWords = coreVocabulary.filter(w =>
      !pairs.some(p => p.word.spanish === w.spanish && !p.matched)
    );

    if (unusedWords.length === 0) return; // All words used

    const newWord = unusedWords[Math.floor(Math.random() * unusedWords.length)];
    const timestamp = Date.now();

    setPairs(prev => prev.map(p => {
      if (p.id === pair1.id) {
        return {
          id: `${newWord.spanish}-${timestamp}-spanish`,
          word: newWord,
          column: 1 as 1 | 2,
          matched: false,
        };
      }
      if (p.id === pair2.id) {
        return {
          id: `${newWord.english}-${timestamp}-english`,
          word: newWord,
          column: 2 as 1 | 2,
          matched: false,
        };
      }
      return p;
    }));
  }

  const column1Items = pairs.filter(p => p.column === 1);
  const column2Items = pairs.filter(p => p.column === 2);

  return (
    <div className="min-h-screen bg-[#fdfcf9] py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif text-stone-900 mb-2">Memory Match</h1>
          <p className="text-lg text-stone-600 mb-4">
            Match Spanish words with their English translations
          </p>
          <div className="flex justify-center gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-amber-700">{score}</div>
              <div className="text-sm text-stone-600">Score</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-amber-700">{streak}</div>
              <div className="text-sm text-stone-600">Streak</div>
            </div>
          </div>
        </div>

        {/* Game Grid */}
        <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
          {/* Column 1 - Spanish */}
          <div className="space-y-3">
            <h3 className="text-center text-sm font-semibold text-stone-700 mb-2">
              Español
            </h3>
            {column1Items.map((pair) => (
              <button
                key={pair.id}
                onClick={() => handleSelect(pair.id, pair.column)}
                disabled={pair.matched}
                className={`w-full py-4 px-6 rounded-xl font-medium text-lg transition-all transform
                  ${pair.matched
                    ? 'bg-green-100 text-green-700 opacity-0 scale-95'
                    : selected?.id === pair.id
                    ? 'bg-amber-600 text-white shadow-lg scale-105'
                    : 'bg-white text-stone-900 hover:bg-amber-50 hover:shadow-md hover:scale-102 border-2 border-stone-200'
                  }
                  ${isReplacing ? 'pointer-events-none' : ''}
                `}
              >
                {pair.word.spanish}
              </button>
            ))}
          </div>

          {/* Column 2 - English */}
          <div className="space-y-3">
            <h3 className="text-center text-sm font-semibold text-stone-700 mb-2">
              English
            </h3>
            {column2Items.map((pair) => (
              <button
                key={pair.id}
                onClick={() => handleSelect(pair.id, pair.column)}
                disabled={pair.matched}
                className={`w-full py-4 px-6 rounded-xl font-medium text-lg transition-all transform
                  ${pair.matched
                    ? 'bg-green-100 text-green-700 opacity-0 scale-95'
                    : selected?.id === pair.id
                    ? 'bg-amber-600 text-white shadow-lg scale-105'
                    : 'bg-white text-stone-900 hover:bg-amber-50 hover:shadow-md hover:scale-102 border-2 border-stone-200'
                  }
                  ${isReplacing ? 'pointer-events-none' : ''}
                `}
              >
                {pair.word.english}
              </button>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-12 text-center text-sm text-stone-600 max-w-md mx-auto">
          <p>
            Click a word in Spanish, then click its English translation to make a match.
            Each correct match earns 10 points and extends your streak!
          </p>
        </div>
      </div>
    </div>
  );
}
