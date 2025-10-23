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
  const [pendingReplacements, setPendingReplacements] = useState<Set<string>>(new Set());
  const [flashGood, setFlashGood] = useState(false);
  const [flashBad, setFlashBad] = useState(false);

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
    // Ignore if already matched or pending replacement
    const pair = pairs.find(p => p.id === id);
    if (!pair || pair.matched || pendingReplacements.has(id)) return;

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
      // Match! Flash green
      setFlashGood(true);
      setTimeout(() => setFlashGood(false), 300);

      setScore(score + 10);
      setStreak(streak + 1);

      // Mark as matched and add to pending replacements
      setPairs(prev => prev.map(p =>
        p.id === selected.id || p.id === id ? { ...p, matched: true } : p
      ));

      const newPending = new Set(pendingReplacements).add(selected.id).add(id);
      setPendingReplacements(newPending);

      setSelected(null);

      // Count unique word pairs in pending (each word appears twice - spanish + english)
      const uniqueWords = new Set<string>();
      pairs.forEach(p => {
        if (newPending.has(p.id)) {
          uniqueWords.add(p.word.spanish);
        }
      });

      // Only replace when we have 3+ matched pairs
      if (uniqueWords.size >= 3) {
        setTimeout(() => {
          replaceAllMatched();
        }, 800);
      }
    } else {
      // Not a match - flash red and shake
      setFlashBad(true);
      setTimeout(() => setFlashBad(false), 400);

      setStreak(0);
      setSelected(null);
    }
  }

  function replaceAllMatched() {
    setPairs(prev => {
      // Get all matched pairs that need replacement
      const matchedPairs = prev.filter(p => p.matched);
      if (matchedPairs.length === 0) return prev;

      // Count how many unique words are matched (pairs)
      const matchedWords = new Set(matchedPairs.map(p => p.word.spanish));
      const numPairsToReplace = matchedWords.size;

      // Get unused words
      const unusedWords = coreVocabulary.filter(w =>
        !prev.some(p => p.word.spanish === w.spanish && !p.matched)
      );

      if (unusedWords.length === 0) return prev; // All words used

      // Get random new words
      const newWords = shuffle(unusedWords).slice(0, numPairsToReplace);

      // Get indices of matched cards in each column
      const col1Indices = prev
        .map((p, idx) => p.column === 1 && p.matched ? idx : -1)
        .filter(idx => idx !== -1);
      const col2Indices = prev
        .map((p, idx) => p.column === 2 && p.matched ? idx : -1)
        .filter(idx => idx !== -1);

      // Shuffle the indices so new cards go to RANDOM positions
      const shuffledCol1Indices = shuffle(col1Indices);
      const shuffledCol2Indices = shuffle(col2Indices);

      // Create new pairs array
      const updated = [...prev];

      newWords.forEach((word, i) => {
        const timestamp = Date.now() + i;

        // Place Spanish word in random empty col1 position
        if (i < shuffledCol1Indices.length) {
          updated[shuffledCol1Indices[i]] = {
            id: `${word.spanish}-${timestamp}-spanish`,
            word,
            column: 1,
            matched: false,
          };
        }

        // Place English word in random empty col2 position
        if (i < shuffledCol2Indices.length) {
          updated[shuffledCol2Indices[i]] = {
            id: `${word.english}-${timestamp}-english`,
            word,
            column: 2,
            matched: false,
          };
        }
      });

      return updated;
    });

    // Clear pending replacements
    setPendingReplacements(new Set());
  }

  const column1Items = pairs.filter(p => p.column === 1);
  const column2Items = pairs.filter(p => p.column === 2);

  return (
    <div className="min-h-screen bg-[#fdfcf9] py-12 px-6">
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        .shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
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
        <div className={`grid grid-cols-2 gap-4 max-w-2xl mx-auto rounded-2xl p-6 transition-all duration-300 ${
          flashGood ? 'bg-green-100 shadow-lg shadow-green-200' :
          flashBad ? 'bg-red-100 shadow-lg shadow-red-200 shake' :
          'bg-transparent'
        }`}>
          {/* Column 1 - Spanish */}
          <div className="space-y-3">
            <h3 className="text-center text-sm font-semibold text-stone-700 mb-2">
              Español
            </h3>
            {column1Items.map((pair) => (
              <button
                key={pair.id}
                onClick={() => handleSelect(pair.id, pair.column)}
                disabled={pair.matched || pendingReplacements.has(pair.id)}
                className={`w-full py-4 px-6 rounded-xl font-medium text-lg transition-all transform duration-300
                  ${pair.matched
                    ? 'bg-green-100 text-green-700 opacity-0 scale-95'
                    : selected?.id === pair.id
                    ? 'bg-amber-600 text-white shadow-lg scale-105'
                    : 'bg-white text-stone-900 hover:bg-amber-50 hover:shadow-md hover:scale-102 border-2 border-stone-200'
                  }
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
                disabled={pair.matched || pendingReplacements.has(pair.id)}
                className={`w-full py-4 px-6 rounded-xl font-medium text-lg transition-all transform duration-300
                  ${pair.matched
                    ? 'bg-green-100 text-green-700 opacity-0 scale-95'
                    : selected?.id === pair.id
                    ? 'bg-amber-600 text-white shadow-lg scale-105'
                    : 'bg-white text-stone-900 hover:bg-amber-50 hover:shadow-md hover:scale-102 border-2 border-stone-200'
                  }
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
