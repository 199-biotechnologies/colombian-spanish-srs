#!/usr/bin/env python3
"""
Comprehensive fix applier for Colombian Spanish flashcards
Handles multiple markdown formats and applies fixes with context
"""

import csv
import re
from pathlib import Path
from typing import Dict, List, Tuple

class FixExtractor:
    """Extract fixes from various markdown formats"""

    @staticmethod
    def extract_general_format(content: str) -> Dict:
        """Extract fixes from GENERAL_CATEGORY_FIXES.md format"""
        fixes = {}
        # Pattern: #### Spanish\n\n- **Current:** `...`\n- **Fixed:** **...**
        pattern = r'####\s+(.+?)\n\n-\s+\*\*Current:\*\*\s+`(.+?)`\n-\s+\*\*Fixed:\*\*\s+\*\*(.+?)\*\*\n-\s+\*\*Context:\*\*\s+(.+?)\n-\s+\*\*Register:\*\*\s+(.+?)\n-\s+\*\*Example:\*\*\s+_(.+?)_\n-\s+\*\*Colombian Notes:\*\*\s+(.+?)(?=\n\n|\n####|\Z)'

        for match in re.finditer(pattern, content, re.DOTALL):
            spanish = match.group(1).strip()
            fixed = match.group(3).strip()
            context = match.group(4).strip()
            register = match.group(5).strip()
            example = match.group(6).strip()
            notes = match.group(7).strip()

            extra = f"Context: {context} | Register: {register} | Example: {example} | Colombian: {notes}"
            fixes[spanish] = {'translation': fixed, 'extra': extra}

        return fixes

    @staticmethod
    def extract_numbered_format(content: str) -> Dict:
        """Extract fixes from numbered format (DAILY, ROMANCE, etc.)"""
        fixes = {}
        # Pattern: ### N. **Spanish phrase**
        pattern = r'###\s+\d+\.\s+\*\*(.+?)\*\*.*?\n\*\*Current Translation:\*\*\s+`(.+?)`.*?\n\*\*Complete Translation:\*\*\s+"(.+?)".*?\n\*\*Context & Usage:\*\*(.+?)\n\*\*Example Sentences?:\*\*(.+?)\n\*\*Colombian Notes:\*\*(.+?)(?=\n---|\n###|\Z)'

        for match in re.finditer(pattern, content, re.DOTALL):
            spanish = match.group(1).strip()
            fixed = match.group(3).strip()
            context = match.group(4).strip()[:200]  # Limit length
            examples = match.group(5).strip()[:200]
            notes = match.group(6).strip()[:200]

            extra = f"Context: {context}... | Examples: {examples}... | Colombian: {notes}..."
            fixes[spanish] = {'translation': fixed, 'extra': extra}

        return fixes

    @staticmethod
    def extract_card_format(content: str) -> Dict:
        """Extract from Card: format (QUESTIONS, VERB_PATTERN)"""
        fixes = {}
        # Look for Spanish phrases and their fixed translations
        # More lenient pattern
        patterns = [
            r'##\s+Card:\s+(.+?)\n.*?Current:\s+(.+?)\n.*?Fixed:\s+(.+?)\n.*?Context:(.+?)\n',
            r'###\s+Card\s+\d+:\s+(.+?)\n.*?Current.*?`(.+?)`.*?Fixed.*?`(.+?)`',
            r'\*\*(.+?)\*\*\s+\[Line.*?\]\s*\n\*\*Current Translation:\*\*\s+`(.+?)`.*?\n\*\*Complete Translation:\*\*\s+"(.+?)"'
        ]

        for pattern in patterns:
            for match in re.finditer(pattern, content, re.DOTALL | re.MULTILINE):
                spanish = match.group(1).strip()
                fixed = match.group(3).strip() if len(match.groups()) >= 3 else match.group(2).strip()

                # Try to extract context
                try:
                    remaining_text = content[match.end():match.end()+500]
                    context_match = re.search(r'Context[:\s]+(.{10,200}?)[\n\*]', remaining_text, re.DOTALL)
                    context = context_match.group(1).strip() if context_match else "See notes for usage"

                    extra = f"Context: {context}"
                    fixes[spanish] = {'translation': fixed, 'extra': extra}
                except:
                    fixes[spanish] = {'translation': fixed, 'extra': ""}

        return fixes

def normalize_spanish(text: str) -> str:
    """Normalize Spanish text for matching"""
    return text.strip().lower()

def load_all_fixes() -> Dict:
    """Load fixes from all markdown files"""
    all_fixes = {}

    fix_files = {
        'GENERAL_CATEGORY_FIXES.md': 'general',
        'DAILY_CATEGORY_FIXES.md': 'numbered',
        'ROMANCE_CATEGORY_FIXES.md': 'numbered',
        'QUESTIONS_CATEGORY_FIXES.md': 'card',
        'COLOMBIAN_SLANG_FIXES.md': 'card',
        'VERB_PATTERN_FIXES.md': 'card'
    }

    extractor = FixExtractor()

    for filename, format_type in fix_files.items():
        filepath = Path(filename)
        if not filepath.exists():
            print(f"⚠️  Warning: {filename} not found")
            continue

        print(f"📖 Reading {filename}...")
        content = filepath.read_text(encoding='utf-8')

        if format_type == 'general':
            fixes = extractor.extract_general_format(content)
        elif format_type == 'numbered':
            fixes = extractor.extract_numbered_format(content)
        else:
            fixes = extractor.extract_card_format(content)

        print(f"   ✓ Extracted {len(fixes)} fixes")
        all_fixes.update(fixes)

    return all_fixes

def apply_fixes_to_csv(csv_path: str, fixes: Dict) -> Tuple[int, List[str]]:
    """Apply all fixes to cards.csv"""

    # Create lookup with normalized keys
    normalized_fixes = {normalize_spanish(k): v for k, v in fixes.items()}

    rows = []
    updated_count = 0
    updated_cards = []

    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        header = next(reader)
        rows.append(header)

        for row in reader:
            if len(row) < 9:
                rows.append(row)
                continue

            spanish = row[0]
            normalized = normalize_spanish(spanish)

            if normalized in normalized_fixes:
                fix = normalized_fixes[normalized]
                # Update English translation
                row[1] = fix['translation']
                # Add/update Extra field with context
                if fix['extra']:
                    row[4] = fix['extra'] if not row[4] else f"{row[4]} | {fix['extra']}"

                updated_count += 1
                updated_cards.append(spanish[:60])

            rows.append(row)

    # Write updated CSV
    with open(csv_path, 'w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f)
        writer.writerows(rows)

    return updated_count, updated_cards

def main():
    print("=" * 80)
    print("🇨🇴 COLOMBIAN SPANISH FLASHCARD FIX APPLIER")
    print("=" * 80)
    print()

    # Load all fixes
    print("📚 Loading fixes from all markdown files...\n")
    all_fixes = load_all_fixes()

    print(f"\n{'='*80}")
    print(f"📊 TOTAL FIXES LOADED: {len(all_fixes)}")
    print(f"{'='*80}\n")

    # Apply to CSV
    print("✏️  Applying fixes to public/cards.csv...\n")
    csv_path = 'public/cards.csv'
    updated_count, updated_cards = apply_fixes_to_csv(csv_path, all_fixes)

    print(f"\n{'='*80}")
    print(f"✅ SUCCESS: Updated {updated_count} cards in {csv_path}")
    print(f"{'='*80}\n")

    if updated_cards:
        print("📋 Sample of updated cards:")
        for card in updated_cards[:10]:
            print(f"   ✓ {card}")
        if len(updated_cards) > 10:
            print(f"   ... and {len(updated_cards) - 10} more")

    print(f"\n🎉 Complete! Your flashcard deck now has:")
    print(f"   • Complete, natural translations")
    print(f"   • Cultural context and usage notes")
    print(f"   • Example sentences")
    print(f"   • Colombian-specific insights")
    print()

if __name__ == '__main__':
    main()
