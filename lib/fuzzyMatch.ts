/**
 * Fuzzy matching utilities for type-to-answer feature
 * Uses Levenshtein distance to allow for minor typos
 */

/**
 * Calculate Levenshtein distance between two strings
 * Returns number of single-character edits (insertions, deletions, substitutions)
 */
function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix: number[][] = [];

  // Initialize matrix
  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  // Fill matrix
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,     // deletion
        matrix[i][j - 1] + 1,     // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return matrix[len1][len2];
}

/**
 * Normalize text for comparison (lowercase, trim, remove extra spaces)
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[.,;:!?¡¿]/g, ''); // Remove punctuation
}

/**
 * Check if user's answer matches the correct answer
 * Returns match quality: 'perfect' | 'close' | 'wrong'
 */
export function checkAnswer(
  userAnswer: string,
  correctAnswer: string
): { match: 'perfect' | 'close' | 'wrong'; similarity: number } {
  const normalizedUser = normalizeText(userAnswer);
  const normalizedCorrect = normalizeText(correctAnswer);

  // Exact match
  if (normalizedUser === normalizedCorrect) {
    return { match: 'perfect', similarity: 1.0 };
  }

  // Calculate similarity
  const distance = levenshteinDistance(normalizedUser, normalizedCorrect);
  const maxLength = Math.max(normalizedUser.length, normalizedCorrect.length);
  const similarity = 1 - (distance / maxLength);

  // Allow for minor typos (>= 85% similar)
  if (similarity >= 0.85) {
    return { match: 'close', similarity };
  }

  // Check if answer contains multiple valid alternatives (e.g., "thing / stuff")
  const alternatives = correctAnswer.split(/[\/|]/).map(alt => normalizeText(alt));
  for (const alt of alternatives) {
    const altDistance = levenshteinDistance(normalizedUser, alt);
    const altSimilarity = 1 - (altDistance / Math.max(normalizedUser.length, alt.length));
    if (altSimilarity >= 0.85) {
      return { match: 'close', similarity: altSimilarity };
    }
  }

  return { match: 'wrong', similarity };
}

/**
 * Get helpful feedback message based on match quality
 */
export function getMatchFeedback(
  match: 'perfect' | 'close' | 'wrong',
  userAnswer: string,
  correctAnswer: string
): string {
  if (match === 'perfect') {
    return '✓ Perfect!';
  }
  if (match === 'close') {
    return `✓ Close enough! (You typed: "${userAnswer}")`;
  }
  return `✗ Not quite. Correct answer: "${correctAnswer}"`;
}
