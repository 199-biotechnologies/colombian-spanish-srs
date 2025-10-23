'use client';

import { useState, useEffect } from 'react';
import { coreVocabulary, CoreWord } from '@/lib/coreVocabulary';

interface MatchPair {
  id: string;
  word: CoreWord;
  column: 1 | 2; // Column 1 = Spanish, Column 2 = English
  matched: boolean;
}

interface WordDifficulty {
  word: string;
  weight: number; // Higher = appears more often
  wrongAttempts: number;
  correctStreak: number; // Consecutive correct matches
  totalExposures: number; // CRITICAL: Need 3+ exposures even if all correct
  totalCorrect: number;
  averageHesitation: number; // Average time to FIRST click (ms)
  lastAttemptTime: number;
}

export default function MemoryMatch() {
  const [pairs, setPairs] = useState<MatchPair[]>([]);
  const [selected, setSelected] = useState<{ id: string; column: 1 | 2 } | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [pendingReplacements, setPendingReplacements] = useState<Set<string>>(new Set());
  const [flashGood, setFlashGood] = useState(false);
  const [flashBad, setFlashBad] = useState(false);
  const [wordDifficulties, setWordDifficulties] = useState<Map<string, WordDifficulty>>(new Map());
  const [firstClickTime, setFirstClickTime] = useState<number | null>(null);
  const [pairCount, setPairCount] = useState(6); // Adaptive: 4, 6, or 8
  const [recentAccuracy, setRecentAccuracy] = useState<boolean[]>([]); // Last 20 matches

  // Initialize game with adaptive pair count
  useEffect(() => {
    initializeGame();
  }, []);

  // Adaptive difficulty: adjust pair count based on recent accuracy
  useEffect(() => {
    if (recentAccuracy.length < 10) return; // Need enough data

    const accuracy = recentAccuracy.filter(Boolean).length / recentAccuracy.length;

    let newPairCount = pairCount;

    if (accuracy < 0.5) {
      newPairCount = 4; // Struggling - reduce to 4 pairs
    } else if (accuracy < 0.75) {
      newPairCount = 6; // Intermediate - stay at 6 pairs
    } else {
      newPairCount = 8; // Advanced - increase to 8 pairs
    }

    if (newPairCount !== pairCount) {
      setPairCount(newPairCount);
      // Reinitialize with new pair count after current batch completes
      if (pairs.filter(p => p.matched).length >= 3) {
        initializeGame();
      }
    }
  }, [recentAccuracy]);

  function initializeGame() {
    const selectedWords = getWeightedRandomWords(pairCount);
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

  function getWeightedRandomWords(count: number, exclude: Set<string> = new Set()): CoreWord[] {
    // Get available words (not currently in play)
    const available = coreVocabulary.filter(w => !exclude.has(w.spanish));

    // Calculate total weight
    let totalWeight = 0;
    const weights = available.map(word => {
      const difficulty = wordDifficulties.get(word.spanish);
      const weight = difficulty?.weight ?? 1.0;
      totalWeight += weight;
      return { word, weight };
    });

    // Weighted random selection
    const selected: CoreWord[] = [];
    const remaining = [...weights];

    for (let i = 0; i < count && remaining.length > 0; i++) {
      const random = Math.random() * totalWeight;
      let cumulative = 0;

      for (let j = 0; j < remaining.length; j++) {
        cumulative += remaining[j].weight;
        if (random <= cumulative) {
          selected.push(remaining[j].word);
          totalWeight -= remaining[j].weight;
          remaining.splice(j, 1);
          break;
        }
      }
    }

    return selected;
  }

  function updateWordDifficulty(wordSpanish: string, correct: boolean, hesitation?: number) {
    setWordDifficulties(prev => {
      const current = prev.get(wordSpanish) || {
        word: wordSpanish,
        weight: 1.5, // Start higher for new words in speed mode
        wrongAttempts: 0,
        correctStreak: 0,
        totalExposures: 0,
        totalCorrect: 0,
        averageHesitation: 0,
        lastAttemptTime: Date.now(),
      };

      let newWeight = current.weight;
      let newStreak = current.correctStreak;
      let newTotal = current.totalCorrect;
      let newExposures = current.totalExposures + 1;

      // Update average hesitation (rolling average)
      let newAvgHesitation = current.averageHesitation;
      if (hesitation && correct) {
        newAvgHesitation = current.averageHesitation === 0
          ? hesitation
          : (current.averageHesitation * 0.7 + hesitation * 0.3); // Weighted average
      }

      if (correct) {
        newStreak += 1;
        newTotal += 1;

        // HYBRID SRS FOR SPEED MODE:
        // 1. Must have 3+ total exposures (not just streak)
        // 2. Must have 3+ correct streak
        // 3. Hesitation must be <800ms (fast retrieval)

        const hasEnoughExposures = newExposures >= 3;
        const hasGoodStreak = newStreak >= 3;
        const hasFastRetrieval = newAvgHesitation < 800;

        if (hasEnoughExposures && hasGoodStreak && hasFastRetrieval) {
          // MASTERED in speed mode - reduce weight significantly
          newWeight = Math.max(0.3, newWeight - 0.4);
        } else if (hasEnoughExposures && hasGoodStreak) {
          // Good streak but slow retrieval - moderate reduction
          newWeight = Math.max(0.5, newWeight - 0.2);
        } else if (hasEnoughExposures) {
          // Has exposures but inconsistent - slight reduction
          newWeight = Math.max(0.8, newWeight - 0.1);
        } else {
          // Still need more exposures - KEEP WEIGHT HIGH
          // Even if correct and fast, speed game needs repetition!
          if (hesitation && hesitation > 1500) {
            // Slow hesitation = struggling
            newWeight = Math.min(3.0, newWeight + 0.3);
          }
          // Don't reduce weight until 3+ exposures!
        }
      } else {
        // Wrong match - decay streak but don't reset to 0
        newStreak = Math.max(0, newStreak - 1);
        newWeight = Math.min(3.0, newWeight + 1.5);
      }

      const updated = new Map(prev);
      updated.set(wordSpanish, {
        word: wordSpanish,
        weight: newWeight,
        wrongAttempts: correct ? current.wrongAttempts : current.wrongAttempts + 1,
        correctStreak: newStreak,
        totalExposures: newExposures,
        totalCorrect: newTotal,
        averageHesitation: newAvgHesitation,
        lastAttemptTime: Date.now(),
      });

      return updated;
    });
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

    // If no selection, select this one and start hesitation timer
    if (!selected) {
      setSelected({ id, column });
      setFirstClickTime(Date.now()); // Track FIRST click time
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

      // Calculate HESITATION (time to first click) and update difficulty
      const hesitation = firstClickTime ? Date.now() - firstClickTime : undefined;
      updateWordDifficulty(selectedPair.word.spanish, true, hesitation);
      setFirstClickTime(null);

      // Track accuracy for adaptive difficulty
      setRecentAccuracy(prev => [...prev.slice(-19), true]); // Keep last 20

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

      // Increase difficulty for both words involved in wrong match
      if (selectedPair) updateWordDifficulty(selectedPair.word.spanish, false);
      if (clickedPair) updateWordDifficulty(clickedPair.word.spanish, false);
      setFirstClickTime(null);

      // Track accuracy for adaptive difficulty
      setRecentAccuracy(prev => [...prev.slice(-19), false]); // Keep last 20

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

      // Get words currently in play (not matched)
      const inPlay = new Set(prev.filter(p => !p.matched).map(p => p.word.spanish));

      // Get weighted random new words (excluding those currently in play)
      const newWords = getWeightedRandomWords(numPairsToReplace, inPlay);

      if (newWords.length === 0) return prev; // All words used

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
    <div className="min-h-screen bg-[#fdfcf9] py-12 px-6 select-none overflow-hidden touch-none">
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
            <div>
              <div className="text-3xl font-bold text-amber-700">{pairCount}</div>
              <div className="text-sm text-stone-600">
                {pairCount === 4 ? '🌱 Learning' : pairCount === 6 ? '⚡ Active' : '🔥 Expert'}
              </div>
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
