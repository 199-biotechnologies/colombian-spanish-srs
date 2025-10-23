import { Card } from './types';

export async function loadCards(): Promise<Card[]> {
  const response = await fetch('/cards.csv');
  const text = await response.text();
  return parseCSV(text);
}

export function parseCSV(csv: string): Card[] {
  const lines = csv.split('\n');
  const cards: Card[] = [];

  // Skip header
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const parts = parseCSVLine(line);
    if (parts.length >= 9) {
      const audioMatch = parts[2].match(/\[sound:(.*?)\]/);
      const audioFile = audioMatch ? audioMatch[1] : null;

      cards.push({
        id: `card-${i}`,
        front: parts[0],
        back: parts[1],
        audio: audioFile,
        notes: parts[3] || '',
        alternative: parts[4] || '',
        reply: parts[5] || '',
        type: parts[6] || '',
        tags: parts[7] || '',
        level: parseInt(parts[8]) || 1,
      });
    }
  }

  return cards;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}
