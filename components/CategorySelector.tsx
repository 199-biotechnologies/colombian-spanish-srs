'use client';

import { categories, Category } from '@/lib/categories';

interface CategorySelectorProps {
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  cardCounts: Map<string, number>;
}

export default function CategorySelector({
  selectedCategory,
  onSelectCategory,
  cardCounts,
}: CategorySelectorProps) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-serif text-stone-900 mb-4">
        Choose Your Focus
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <button
          onClick={() => onSelectCategory(null)}
          className={`p-4 rounded-lg border-2 transition-all text-left ${
            selectedCategory === null
              ? 'border-amber-700 bg-amber-50'
              : 'border-stone-200 hover:border-stone-300 bg-white'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">📚</span>
            <span className="font-semibold text-stone-900">All Cards</span>
          </div>
          <p className="text-sm text-stone-600">
            Study everything ({Array.from(cardCounts.values()).reduce((a, b) => a + b, 0)} cards)
          </p>
        </button>

        {categories.map((category) => {
          const count = cardCounts.get(category.id) || 0;
          return (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selectedCategory === category.id
                  ? 'border-amber-700 bg-amber-50'
                  : 'border-stone-200 hover:border-stone-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{category.emoji}</span>
                <span className="font-semibold text-stone-900">
                  {category.name}
                </span>
              </div>
              <p className="text-xs text-stone-600 mb-2">
                {category.description}
              </p>
              <p className="text-xs font-medium text-amber-700">
                {count} cards
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
