'use client';

import { getCategoryById } from '@/lib/categories';

interface NavigationProps {
  view: 'study' | 'browse' | 'categories' | 'match';
  setView: (view: 'study' | 'browse' | 'categories' | 'match') => void;
  selectedCategory?: string | null;
  onBackToCategories?: () => void;
}

export default function Navigation({ view, setView, selectedCategory, onBackToCategories }: NavigationProps) {
  const category = selectedCategory ? getCategoryById(selectedCategory) : null;
  return (
    <nav className="border-b border-stone-200 bg-white">
      <div className="container max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif text-stone-900">
              Cariñosas
            </h1>
            {category && (
              <p className="text-sm text-stone-600 mt-1">
                {category.emoji} {category.name}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            {view !== 'categories' && (
              <button
                onClick={onBackToCategories}
                className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
              >
                ← Categories
              </button>
            )}
            <button
              onClick={() => setView('study')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                view === 'study'
                  ? 'bg-amber-700 text-white'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              Study
            </button>
            <button
              onClick={() => setView('browse')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                view === 'browse'
                  ? 'bg-amber-700 text-white'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              Browse
            </button>
            <button
              onClick={() => setView('match')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                view === 'match'
                  ? 'bg-amber-700 text-white'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              🎮 Match
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
