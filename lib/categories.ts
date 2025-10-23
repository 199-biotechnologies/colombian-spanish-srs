import { Card } from './types';

export interface Category {
  id: string;
  name: string;
  description: string;
  emoji: string;
  priority: number; // Lower = more important for fluency
}

export const categories: Category[] = [
  {
    id: 'survival',
    name: 'Survival Essentials',
    description: 'Critical phrases for day 1 - greetings, yes/no, basic needs',
    emoji: '🆘',
    priority: 1,
  },
  {
    id: 'conversation-flow',
    name: 'Conversation Flow',
    description: 'Keep conversations going - responses, reactions, transitions',
    emoji: '💬',
    priority: 2,
  },
  {
    id: 'daily-life',
    name: 'Daily Life',
    description: 'Eating, sleeping, getting ready, daily routines',
    emoji: '☀️',
    priority: 3,
  },
  {
    id: 'social-lubricants',
    name: 'Social Lubricants',
    description: 'Sound natural - Colombian slang, informal expressions',
    emoji: '🇨🇴',
    priority: 4,
  },
  {
    id: 'time-planning',
    name: 'Time & Planning',
    description: 'Making plans, talking about time, scheduling',
    emoji: '📅',
    priority: 5,
  },
  {
    id: 'getting-around',
    name: 'Getting Around',
    description: 'Directions, locations, transportation, navigation',
    emoji: '🗺️',
    priority: 6,
  },
  {
    id: 'requests-offers',
    name: 'Requests & Offers',
    description: 'Asking for things, offering help, negotiations',
    emoji: '🤝',
    priority: 7,
  },
  {
    id: 'feelings-opinions',
    name: 'Feelings & Opinions',
    description: 'Express emotions, agree/disagree, give opinions',
    emoji: '💭',
    priority: 8,
  },
  {
    id: 'romance-relationships',
    name: 'Romance & Relationships',
    description: 'Flirting, compliments, relationship talk',
    emoji: '❤️',
    priority: 9,
  },
  {
    id: 'useful-patterns',
    name: 'Useful Patterns',
    description: 'Flexible sentence templates you can reuse',
    emoji: '🔄',
    priority: 10,
  },
];

export function categorizeCard(card: Card): string {
  const front = card.front.toLowerCase();
  const tags = card.tags.toLowerCase();
  const type = card.type.toLowerCase();

  // Survival Essentials (40-60 cards)
  if (
    tags.includes('greeting') ||
    tags.includes('pair essential') ||
    tags.includes('essential') && (
      front.includes('hola') ||
      front.includes('gracias') ||
      front.includes('perdón') ||
      front.includes('por favor') ||
      front.includes('sí') ||
      front.includes('no') ||
      front.includes('¿cómo') ||
      front.includes('¿dónde') ||
      front.includes('¿qué') ||
      front.includes('¿cuánto')
    )
  ) {
    return 'survival';
  }

  // Conversation Flow (60-80 cards)
  if (
    tags.includes('response') ||
    tags.includes('pair') ||
    front.includes('claro') ||
    front.includes('dale') ||
    front.includes('bueno') ||
    front.includes('entonces') ||
    front.includes('tranqui') ||
    front.includes('todo bien') ||
    front.includes('listo') ||
    front.includes('de una') ||
    front.includes('¿y tú?') ||
    front.includes('¿y usted?')
  ) {
    return 'conversation-flow';
  }

  // Daily Life (80-100 cards)
  if (
    tags.includes('daily') ||
    tags.includes('eating') ||
    tags.includes('sleeping') ||
    tags.includes('getting_ready') ||
    tags.includes('tired') ||
    tags.includes('work') ||
    front.includes('comer') ||
    front.includes('dormir') ||
    front.includes('desayun') ||
    front.includes('almuerz') ||
    front.includes('cena') ||
    front.includes('despert') ||
    front.includes('levant')
  ) {
    return 'daily-life';
  }

  // Social Lubricants (Colombian slang & informal)
  if (
    tags.includes('slang') ||
    tags.includes('colombian') ||
    front.includes('parcero') ||
    front.includes('parce') ||
    front.includes('chévere') ||
    front.includes('berraco') ||
    front.includes('chimba') ||
    front.includes('bacano') ||
    front.includes('gonorrea') ||
    front.includes('marica') ||
    front.includes('vaina') ||
    front.includes('de pronto')
  ) {
    return 'social-lubricants';
  }

  // Time & Planning
  if (
    tags.includes('plans') ||
    front.includes('ahorita') ||
    front.includes('luego') ||
    front.includes('después') ||
    front.includes('mañana') ||
    front.includes('hoy') ||
    front.includes('ayer') ||
    front.includes('cuando') ||
    front.includes('hora') ||
    front.includes('¿a qué hora') ||
    front.includes('me sirve') ||
    front.includes('¿te queda bien')
  ) {
    return 'time-planning';
  }

  // Getting Around
  if (
    tags.includes('directions') ||
    tags.includes('location') ||
    tags.includes('transit') ||
    tags.includes('traffic') ||
    front.includes('¿dónde') ||
    front.includes('aquí') ||
    front.includes('allá') ||
    front.includes('derecha') ||
    front.includes('izquierda') ||
    front.includes('uber') ||
    front.includes('taxi') ||
    front.includes('bus')
  ) {
    return 'getting-around';
  }

  // Requests & Offers
  if (
    front.includes('¿me prestas') ||
    front.includes('¿puedes') ||
    front.includes('¿puedo') ||
    front.includes('necesito') ||
    front.includes('quiero') ||
    front.includes('ayuda') ||
    front.includes('favor') ||
    front.includes('dame') ||
    front.includes('dime') ||
    front.includes('préstame')
  ) {
    return 'requests-offers';
  }

  // Romance & Relationships
  if (
    tags.includes('romance') ||
    front.includes('amor') ||
    front.includes('hermosa') ||
    front.includes('preciosa') ||
    front.includes('guapo') ||
    front.includes('linda') ||
    front.includes('beso') ||
    front.includes('te amo') ||
    front.includes('te quiero') ||
    front.includes('mi vida') ||
    front.includes('cariño')
  ) {
    return 'romance-relationships';
  }

  // Feelings & Opinions
  if (
    front.includes('me gusta') ||
    front.includes('me encanta') ||
    front.includes('creo que') ||
    front.includes('pienso que') ||
    front.includes('siento') ||
    front.includes('estoy') && (
      front.includes('feliz') ||
      front.includes('triste') ||
      front.includes('cansado') ||
      front.includes('bien') ||
      front.includes('mal')
    )
  ) {
    return 'feelings-opinions';
  }

  // Useful Patterns
  if (
    tags.includes('pattern') ||
    tags.includes('frame') ||
    tags.includes('subjunctive') ||
    front.includes('{{') ||
    front.includes('acabo de') ||
    front.includes('apenas') ||
    front.includes('cuando') ||
    front.includes('si') && front.includes('{{')
  ) {
    return 'useful-patterns';
  }

  // Default to conversation flow if no clear category
  return 'conversation-flow';
}

export function getCardsByCategory(cards: Card[]): Map<string, Card[]> {
  const categoryMap = new Map<string, Card[]>();

  categories.forEach(cat => {
    categoryMap.set(cat.id, []);
  });

  cards.forEach(card => {
    const categoryId = categorizeCard(card);
    const categoryCards = categoryMap.get(categoryId) || [];
    categoryCards.push(card);
    categoryMap.set(categoryId, categoryCards);
  });

  return categoryMap;
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find(cat => cat.id === id);
}
