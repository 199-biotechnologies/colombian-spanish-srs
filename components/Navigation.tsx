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
      <div className="container max-w-6xl mx-auto px-4 md:px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            {view !== 'categories' && (
              <button
                onClick={onBackToCategories}
                className="px-2 py-1 text-stone-600 hover:bg-stone-100 rounded-lg transition-colors flex-shrink-0"
                aria-label="Back to categories"
              >
                ←
              </button>
            )}
            <div className="min-w-0">
              <div className="flex items-baseline gap-2 flex-wrap">
                <h1 className="text-xl md:text-2xl font-serif text-stone-900 whitespace-nowrap">
                  Cariñosas
                </h1>
                {category && (
                  <span className="text-sm text-stone-600 truncate">
                    {category.emoji} {category.name}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-1.5 md:gap-2 flex-shrink-0">
            <button
              onClick={() => setView('study')}
              className={`px-2 md:px-4 py-2 rounded-lg transition-colors text-sm md:text-base ${
                view === 'study'
                  ? 'bg-amber-700 text-white'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              Study
            </button>
            <button
              onClick={() => setView('browse')}
              className={`px-2 md:px-4 py-2 rounded-lg transition-colors text-sm md:text-base ${
                view === 'browse'
                  ? 'bg-amber-700 text-white'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              Browse
            </button>
            <button
              onClick={() => setView('match')}
              className={`px-2 md:px-4 py-2 rounded-lg transition-colors text-sm md:text-base ${
                view === 'match'
                  ? 'bg-amber-700 text-white'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              Match
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
