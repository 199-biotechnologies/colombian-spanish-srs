'use client';

import { useState } from 'react';
import { Card } from '@/lib/types';
import { getTextLines } from '@/lib/formatText';

interface FlashCardProps {
  card: Card;
  onReview: (quality: number) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export default function FlashCard({ card, onReview, isFavorite, onToggleFavorite }: FlashCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [playingAudio, setPlayingAudio] = useState(false);

  const playAudio = () => {
    if (card.audio) {
      setPlayingAudio(true);
      const audio = new Audio(`/audio/${card.audio}`);
      audio.onended = () => setPlayingAudio(false);
      audio.onerror = () => {
        setPlayingAudio(false);
        // Fallback to TTS if audio file not found
        speak(card.front);
      };
      audio.play().catch(() => {
        setPlayingAudio(false);
        speak(card.front);
      });
    } else {
      speak(card.front);
    }
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
    setIsFlipped(!isFlipped);
  };

  const handleQuality = (quality: number) => {
    onReview(quality);
    setIsFlipped(false);
  };

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
          <span className="text-3xl">
            {isFavorite ? '⭐' : '☆'}
          </span>
        </button>
      </div>
      <div
        className="bg-white rounded-2xl shadow-lg p-8 md:p-12 min-h-[400px] flex flex-col justify-between cursor-pointer transition-all hover:shadow-xl"
        onClick={handleFlip}
      >
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-center w-full">
            <h2 className="text-3xl md:text-4xl font-serif leading-relaxed text-stone-900 mb-6">
              {getTextLines(card.front).map((line, i) => (
                <span key={i}>
                  {line}
                  {i < getTextLines(card.front).length - 1 && <br />}
                </span>
              ))}
            </h2>

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
                  <p className="text-sm text-stone-500 italic mt-4">
                    {card.notes}
                  </p>
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

            {!isFlipped && (
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
          </div>
        </div>

        {!isFlipped ? (
          <div className="text-center mt-8">
            <p className="text-sm text-stone-500">Click to reveal answer</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2 mt-8">
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
        )}
      </div>
    </div>
  );
}
