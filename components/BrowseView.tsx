'use client';

import { useState } from 'react';
import { Card } from '@/lib/types';

interface BrowseViewProps {
  cards: Card[];
}

export default function BrowseView({ cards }: BrowseViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const filteredCards = cards.filter(
    (card) =>
      card.front.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.back.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.tags.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const playAudio = (card: Card) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(card.front);
      utterance.lang = 'es-CO';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto px-6 py-8">
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search cards..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-transparent"
        />
        <p className="text-sm text-stone-500 mt-2">
          Showing {filteredCards.length} of {cards.length} cards
        </p>
      </div>

      <div className="space-y-3">
        {filteredCards.map((card) => (
          <div
            key={card.id}
            className="bg-white rounded-lg p-6 shadow hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedCard(card)}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-serif text-stone-900 mb-2">
                  {card.front}
                </h3>
                <p className="text-stone-600 mb-3">{card.back}</p>
                {card.tags && (
                  <div className="flex flex-wrap gap-2">
                    {card.tags.split(' ').map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-stone-100 text-stone-600 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playAudio(card);
                }}
                className="px-3 py-2 text-amber-700 border border-amber-700 rounded-lg hover:bg-amber-50 transition-colors text-sm flex-shrink-0"
              >
                🔊
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedCard && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50"
          onClick={() => setSelectedCard(null)}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedCard(null)}
              className="float-right text-stone-400 hover:text-stone-600"
            >
              ✕
            </button>
            <h2 className="text-3xl font-serif text-stone-900 mb-4">
              {selectedCard.front}
            </h2>
            <p className="text-2xl text-stone-700 mb-6">{selectedCard.back}</p>
            {selectedCard.notes && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-stone-600 mb-1">
                  Notes:
                </h4>
                <p className="text-stone-600">{selectedCard.notes}</p>
              </div>
            )}
            {selectedCard.alternative && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-stone-600 mb-1">
                  Alternative:
                </h4>
                <p className="text-stone-600">{selectedCard.alternative}</p>
              </div>
            )}
            {selectedCard.tags && (
              <div className="flex flex-wrap gap-2 mt-6">
                {selectedCard.tags.split(' ').map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <button
              onClick={() => playAudio(selectedCard)}
              className="mt-6 px-6 py-3 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors w-full"
            >
              🔊 Listen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
