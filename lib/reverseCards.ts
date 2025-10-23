import { Card } from './types';

/**
 * Generate reverse cards (English → Spanish) from regular cards (Spanish → English)
 * For bidirectional learning and production practice
 */
export function generateReverseCards(cards: Card[]): Card[] {
  const reverseCards: Card[] = [];

  cards.forEach((card) => {
    // Skip if already a reverse card
    if (card.isReverse) return;

    // Create reverse version
    const reverseCard: Card = {
      id: `${card.id}-reverse`,
      front: card.back, // English becomes front
      back: card.front, // Spanish becomes back
      audio: card.audio, // Same audio (Spanish pronunciation)
      notes: card.notes,
      alternative: card.alternative,
      reply: card.reply,
      type: card.type,
      tags: `${card.tags} reverse`.trim(),
      level: card.level,
      isReverse: true,
    };

    reverseCards.push(reverseCard);
  });

  return reverseCards;
}

/**
 * Mix reverse cards into study queue at specified ratio
 * @param regularCards - Normal Spanish→English cards
 * @param reverseCards - Reverse English→Spanish cards
 * @param reverseRatio - Percentage of reverse cards (0-1), default 0.3 (30%)
 */
export function mixReverseCards(
  regularCards: Card[],
  reverseCards: Card[],
  reverseRatio: number = 0.3
): Card[] {
  const totalCards = regularCards.length + reverseCards.length;
  const targetReverseCount = Math.floor(totalCards * reverseRatio);

  // Shuffle and take subset of reverse cards
  const shuffledReverse = [...reverseCards].sort(() => Math.random() - 0.5);
  const selectedReverse = shuffledReverse.slice(0, targetReverseCount);

  // Combine and shuffle
  const mixed = [...regularCards, ...selectedReverse];
  return mixed.sort(() => Math.random() - 0.5);
}
