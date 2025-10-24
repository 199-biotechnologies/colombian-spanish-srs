'use client';

import { StudySettings, StudyMode } from '@/lib/types';

interface StudyModeSelectorProps {
  settings: StudySettings;
  onSettingsChange: (settings: StudySettings) => void;
  onClose: () => void;
}

export default function StudyModeSelector({ settings, onSettingsChange, onClose }: StudyModeSelectorProps) {
  const modes: { value: StudyMode; icon: string; name: string; description: string; benefit: string }[] = [
    {
      value: 'normal',
      icon: '📖',
      name: 'Normal',
      description: 'Classic flashcards - flip to reveal',
      benefit: 'Comfortable and familiar',
    },
    {
      value: 'type-to-answer',
      icon: '⌨️',
      name: 'Type to Answer',
      description: 'Type the translation before revealing',
      benefit: '2-3x better retention (Generation Effect)',
    },
    {
      value: 'listening-first',
      icon: '🎧',
      name: 'Listening First',
      description: 'Hear the audio before seeing text',
      benefit: 'Train your ear, real-world preparation',
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-stone-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-serif text-stone-900">Study Settings</h2>
              <p className="text-sm text-stone-600 mt-1">
                Customize your learning experience
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
              aria-label="Close"
            >
              <span className="text-2xl">✕</span>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Study Mode Selection */}
          <div>
            <h3 className="text-lg font-serif text-stone-900 mb-3">Study Mode</h3>
            <div className="space-y-3">
              {modes.map((mode) => (
                <button
                  key={mode.value}
                  onClick={() => onSettingsChange({ ...settings, mode: mode.value })}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    settings.mode === mode.value
                      ? 'border-amber-700 bg-amber-50'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl flex-shrink-0">{mode.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-stone-900 mb-1">{mode.name}</div>
                      <div className="text-sm text-stone-600 mb-2">{mode.description}</div>
                      <div className="text-xs text-amber-700 font-medium">
                        {mode.benefit}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Advanced Options */}
          <div className="pt-4 border-t border-stone-200">
            <h3 className="text-lg font-serif text-stone-900 mb-3">Advanced Options</h3>
            <div className="space-y-3">
              {/* Guess Before You Know */}
              <label className="flex items-start gap-3 p-4 rounded-xl border-2 border-stone-200 hover:border-stone-300 bg-white cursor-pointer transition-all">
                <input
                  type="checkbox"
                  checked={settings.showGuessPrompt}
                  onChange={(e) =>
                    onSettingsChange({ ...settings, showGuessPrompt: e.target.checked })
                  }
                  className="mt-1 w-5 h-5 rounded border-stone-300 text-amber-700 focus:ring-amber-700"
                />
                <div className="flex-1">
                  <div className="font-semibold text-stone-900 mb-1">
                    🎯 Guess Before You Know
                  </div>
                  <div className="text-sm text-stone-600 mb-2">
                    Try to guess new cards before seeing the answer
                  </div>
                  <div className="text-xs text-amber-700 font-medium">
                    10-15% better retention (Pre-Testing Effect)
                  </div>
                </div>
              </label>

              {/* Reverse Cards */}
              <label className="flex items-start gap-3 p-4 rounded-xl border-2 border-stone-200 hover:border-stone-300 bg-white cursor-pointer transition-all">
                <input
                  type="checkbox"
                  checked={settings.includeReverseCards}
                  onChange={(e) =>
                    onSettingsChange({ ...settings, includeReverseCards: e.target.checked })
                  }
                  className="mt-1 w-5 h-5 rounded border-stone-300 text-amber-700 focus:ring-amber-700"
                />
                <div className="flex-1">
                  <div className="font-semibold text-stone-900 mb-1">
                    🔄 Reverse Cards (English→Spanish)
                  </div>
                  <div className="text-sm text-stone-600 mb-2">
                    Practice PRODUCING Spanish from English prompts (30% mix)
                  </div>
                  <div className="text-xs text-amber-700 font-medium">
                    ⭐ RECOMMENDED: 50% better speaking ability
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4">
            <button
              onClick={onClose}
              className="w-full py-3 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors font-medium"
            >
              Start Studying
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
