'use client';

interface NavigationProps {
  view: 'study' | 'browse';
  setView: (view: 'study' | 'browse') => void;
}

export default function Navigation({ view, setView }: NavigationProps) {
  return (
    <nav className="border-b border-stone-200 bg-white">
      <div className="container max-w-4xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-serif text-stone-900">
            Colombian Spanish
          </h1>
          <div className="flex gap-2">
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
          </div>
        </div>
      </div>
    </nav>
  );
}
