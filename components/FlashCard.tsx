'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, StudyMode } from '@/lib/types';
import { getTextLines } from '@/lib/formatText';
import { checkAnswer, getMatchFeedback } from '@/lib/fuzzyMatch';

interface FlashCardProps {
  card: Card;
  onReview: (quality: number) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  studyMode: StudyMode;
  showGuessPrompt: boolean;
  isNewCard: boolean;
  personalNote?: string;
  onSavePersonalNote?: (note: string) => void;
}

export default function FlashCard({
  card,
  onReview,
  isFavorite,
  onToggleFavorite,
  studyMode = 'normal',
  showGuessPrompt = false,
  isNewCard = false,
  personalNote = '',
  onSavePersonalNote,
}: FlashCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [playingAudio, setPlayingAudio] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [matchResult, setMatchResult] = useState<{ match: 'perfect' | 'close' | 'wrong'; similarity: number } | null>(null);
  const [guessAttempt, setGuessAttempt] = useState('');
  const [showGuessInput, setShowGuessInput] = useState(isNewCard && showGuessPrompt);
  const [hasGuessed, setHasGuessed] = useState(false);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteText, setNoteText] = useState(personalNote || '');
  const [audioPlayed, setAudioPlayed] = useState(false);
  const [textRevealed, setTextRevealed] = useState(studyMode !== 'listening-first');
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-play audio in listening-first mode
  useEffect(() => {
    if (studyMode === 'listening-first' && !audioPlayed) {
      setTimeout(() => playAudio(), 300); // Small delay for smooth UX
    }
  }, [studyMode, audioPlayed, card.id]);

  // Focus input in type-to-answer mode
  useEffect(() => {
    if (studyMode === 'type-to-answer' && inputRef.current && !hasSubmitted) {
      inputRef.current.focus();
    }
  }, [studyMode, hasSubmitted, card.id]);

  // Reset state when card changes
  useEffect(() => {
    setIsFlipped(false);
    setUserAnswer('');
    setHasSubmitted(false);
    setMatchResult(null);
    setGuessAttempt('');
    setShowGuessInput(isNewCard && showGuessPrompt);
    setHasGuessed(false);
    setShowNoteInput(false);
    setNoteText(personalNote || '');
    setAudioPlayed(false);
    setTextRevealed(studyMode !== 'listening-first');
  }, [card.id]);

  const playAudio = () => {
    if (card.audio) {
      setPlayingAudio(true);
      const audio = new Audio(`/audio/${card.audio}`);
      audio.onended = () => setPlayingAudio(false);
      audio.onerror = () => {
        setPlayingAudio(false);
        speak(card.front);
      };
      audio.play().catch(() => {
        setPlayingAudio(false);
        speak(card.front);
      });
    } else {
      speak(card.front);
    }
    setAudioPlayed(true);
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-CO';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleFlip = () => {
    if (studyMode === 'type-to-answer' && !hasSubmitted) return;
    if (showGuessInput && !hasGuessed) return;
    setIsFlipped(!isFlipped);
  };

  const handleTypeSubmit = () => {
    const result = checkAnswer(userAnswer, card.back);
    setMatchResult(result);
    setHasSubmitted(true);
    setIsFlipped(true);
  };

  const handleGuessSubmit = () => {
    setHasGuessed(true);
    setShowGuessInput(false);
  };

  const handleSkipGuess = () => {
    setHasGuessed(true);
    setShowGuessInput(false);
  };

  const handleRevealText = () => {
    setTextRevealed(true);
  };

  const handleQuality = (quality: number) => {
    onReview(quality);
    setIsFlipped(false);
    setUserAnswer('');
    setHasSubmitted(false);
    setMatchResult(null);
  };

  const handleSaveNote = () => {
    if (onSavePersonalNote) {
      onSavePersonalNote(noteText);
    }
    setShowNoteInput(false);
  };

  // Guess-before-you-know UI
  if (showGuessInput && !hasGuessed) {
    return (
      <div className="w-full">
        <div className="mb-4 flex justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            className="p-2 rounded-lg hover:bg-amber-50 transition-colors"
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <span className="text-3xl">{isFavorite ? '⭐' : '☆'}</span>
          </button>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 min-h-[400px] flex flex-col">
          <div className="text-center mb-6">
            <div className="inline-block px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium mb-4">
              🎯 New Card - Try Guessing!
            </div>
            <h2 className="text-3xl md:text-4xl font-serif text-stone-900 mb-4">
              {getTextLines(card.front).map((line, i) => (
                <span key={i}>
                  {line}
                  {i < getTextLines(card.front).length - 1 && <br />}
                </span>
              ))}
            </h2>
            <p className="text-sm text-stone-600 mb-6">
              Take a guess before seeing the answer. Even wrong guesses help you remember!
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                playAudio();
              }}
              disabled={playingAudio}
              className="px-4 py-2 text-amber-700 border border-amber-700 rounded-lg hover:bg-amber-50 transition-colors disabled:opacity-50 mb-6"
            >
              {playingAudio ? '🔊 Playing...' : '🔊 Listen'}
            </button>
          </div>
          <div className="flex-1">
            <input
              type="text"
              value={guessAttempt}
              onChange={(e) => setGuessAttempt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && guessAttempt.trim()) {
                  handleGuessSubmit();
                }
              }}
              placeholder="Type your guess (in English)..."
              className="w-full px-4 py-3 border-2 border-stone-300 rounded-lg focus:border-amber-700 focus:outline-none text-lg"
              autoFocus
            />
          </div>
          <div className="grid grid-cols-2 gap-3 mt-6">
            <button
              onClick={handleSkipGuess}
              className="py-3 px-4 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition-colors font-medium"
            >
              Skip Guess
            </button>
            <button
              onClick={handleGuessSubmit}
              disabled={!guessAttempt.trim()}
              className="py-3 px-4 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Guess
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4 flex justify-end">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className="p-2 rounded-lg hover:bg-amber-50 transition-colors"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <span className="text-3xl">{isFavorite ? '⭐' : '☆'}</span>
        </button>
      </div>
      <div
        className="bg-white rounded-2xl shadow-lg p-8 md:p-12 min-h-[400px] flex flex-col justify-between cursor-pointer transition-all hover:shadow-xl"
        onClick={handleFlip}
      >
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-center w-full">
            {/* Listening-first mode: hide text until revealed */}
            {studyMode === 'listening-first' && !textRevealed ? (
              <div className="space-y-6">
                <div className="text-6xl mb-4">🎧</div>
                <p className="text-xl text-stone-600 mb-4">Listen and try to understand...</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playAudio();
                  }}
                  disabled={playingAudio}
                  className="px-6 py-3 text-amber-700 border-2 border-amber-700 rounded-lg hover:bg-amber-50 transition-colors disabled:opacity-50 font-medium"
                >
                  {playingAudio ? '🔊 Playing...' : '🔊 Listen Again'}
                </button>
                <div className="mt-6">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRevealText();
                    }}
                    className="px-6 py-3 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors font-medium"
                  >
                    Reveal Text
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-3xl md:text-4xl font-serif leading-relaxed text-stone-900 mb-6">
                  {getTextLines(card.front).map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < getTextLines(card.front).length - 1 && <br />}
                    </span>
                  ))}
                </h2>

                {/* Type-to-answer mode */}
                {studyMode === 'type-to-answer' && !hasSubmitted && (
                  <div className="mt-6 space-y-4">
                    <input
                      ref={inputRef}
                      type="text"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && userAnswer.trim()) {
                          handleTypeSubmit();
                        }
                      }}
                      placeholder="Type the English translation..."
                      className="w-full px-4 py-3 border-2 border-stone-300 rounded-lg focus:border-amber-700 focus:outline-none text-lg"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTypeSubmit();
                      }}
                      disabled={!userAnswer.trim()}
                      className="px-6 py-3 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Check Answer
                    </button>
                  </div>
                )}

                {/* Show guess attempt if user guessed */}
                {hasGuessed && guessAttempt && (
                  <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="text-sm text-purple-800">
                      <strong>Your guess:</strong> {guessAttempt}
                    </div>
                  </div>
                )}

                {/* Show match feedback for type-to-answer */}
                {hasSubmitted && matchResult && (
                  <div className={`mt-4 p-3 rounded-lg ${
                    matchResult.match === 'perfect'
                      ? 'bg-green-50 border border-green-200'
                      : matchResult.match === 'close'
                      ? 'bg-yellow-50 border border-yellow-200'
                      : 'bg-red-50 border border-red-200'
                  }`}>
                    <div className={`text-sm font-medium ${
                      matchResult.match === 'perfect'
                        ? 'text-green-800'
                        : matchResult.match === 'close'
                        ? 'text-yellow-800'
                        : 'text-red-800'
                    }`}>
                      {getMatchFeedback(matchResult.match, userAnswer, card.back)}
                    </div>
                  </div>
                )}

                {isFlipped && (
                  <div className="mt-8 pt-6 border-t-2 border-stone-200">
                    <p className="text-2xl md:text-3xl text-stone-700 leading-relaxed mb-4">
                      {getTextLines(card.back).map((line, i) => (
                        <span key={i}>
                          {line}
                          {i < getTextLines(card.back).length - 1 && <br />}
                        </span>
                      ))}
                    </p>
                    {card.notes && (
                      <p className="text-sm text-stone-500 italic mt-4">{card.notes}</p>
                    )}
                    {personalNote && (
                      <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="text-xs text-amber-700 font-medium mb-1">
                          📝 Your Personal Note:
                        </div>
                        <div className="text-sm text-amber-900">{personalNote}</div>
                      </div>
                    )}
                    {card.tags && (
                      <div className="flex flex-wrap gap-2 justify-center mt-6">
                        {card.tags.split(' ').map((tag, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {!isFlipped && studyMode !== 'type-to-answer' && textRevealed && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playAudio();
                    }}
                    disabled={playingAudio}
                    className="px-4 py-2 text-amber-700 border border-amber-700 rounded-lg hover:bg-amber-50 transition-colors disabled:opacity-50"
                  >
                    {playingAudio ? '🔊 Playing...' : '🔊 Listen'}
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {textRevealed && (studyMode === 'normal' || hasSubmitted) && (
          <>
            {!isFlipped ? (
              <div className="text-center mt-8">
                <p className="text-sm text-stone-500">Click to reveal answer</p>
              </div>
            ) : (
              <div className="space-y-3 mt-8">
                {/* Personal Notes Section */}
                {isFlipped && !showNoteInput && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowNoteInput(true);
                    }}
                    className="w-full py-2 text-sm text-amber-700 border border-amber-300 rounded-lg hover:bg-amber-50 transition-colors"
                  >
                    {personalNote ? '✏️ Edit Personal Note' : '+ Add Personal Note'}
                  </button>
                )}

                {showNoteInput && (
                  <div className="p-4 bg-amber-50 rounded-lg space-y-3" onClick={(e) => e.stopPropagation()}>
                    <textarea
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Add a personal example or memory to help you remember..."
                      className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:border-amber-700 focus:outline-none text-sm"
                      rows={3}
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveNote}
                        className="flex-1 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors text-sm font-medium"
                      >
                        Save Note
                      </button>
                      <button
                        onClick={() => setShowNoteInput(false)}
                        className="px-4 py-2 bg-stone-200 text-stone-700 rounded-lg hover:bg-stone-300 transition-colors text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-4 gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuality(0);
                    }}
                    className="py-3 px-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                  >
                    Again
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuality(3);
                    }}
                    className="py-3 px-2 bg-orange-100 text-orange-800 rounded-lg hover:bg-orange-200 transition-colors text-sm font-medium"
                  >
                    Hard
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuality(4);
                    }}
                    className="py-3 px-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
                  >
                    Good
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuality(5);
                    }}
                    className="py-3 px-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                  >
                    Easy
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
