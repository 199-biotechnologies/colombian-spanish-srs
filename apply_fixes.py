#!/usr/bin/env python3
"""
Apply translation fixes from markdown files to cards.csv
Includes: complete translations, context, examples, and Colombian notes
"""

import csv
import re
from pathlib import Path

def parse_fix_file(filename):
    """Parse a markdown fix file and extract fixes"""
    fixes = {}

    if not Path(filename).exists():
        print(f"Warning: {filename} not found, skipping...")
        return fixes

    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # Match card entries with pattern: #### Spanish phrase
    # Followed by: Current, Fixed, Context, Register, Example, Colombian Notes
    pattern = r'####\s+(.+?)\n\n-\s+\*\*Current:\*\*\s+`(.+?)`\n-\s+\*\*Fixed:\*\*\s+\*\*(.+?)\*\*\n-\s+\*\*Context:\*\*\s+(.+?)\n-\s+\*\*Register:\*\*\s+(.+?)\n-\s+\*\*Example:\*\*\s+_(.+?)_\n-\s+\*\*Colombian Notes:\*\*\s+(.+?)(?=\n\n|\Z)'

    matches = re.finditer(pattern, content, re.DOTALL)

    for match in matches:
        spanish = match.group(1).strip()
        current = match.group(2).strip()
        fixed = match.group(3).strip()
        context = match.group(4).strip()
        register = match.group(5).strip()
        example = match.group(6).strip()
        notes = match.group(7).strip()

        # Create comprehensive note for Extra field
        extra_note = f"Context: {context} | Register: {register} | Example: {example} | Notes: {notes}"

        fixes[spanish] = {
            'translation': fixed,
            'extra': extra_note
        }

    return fixes

def apply_fixes_to_csv(csv_path, all_fixes):
    """Apply all fixes to the cards.csv file"""

    # Read current CSV
    rows = []
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        header = next(reader)
        rows.append(header)

        for row in reader:
            if len(row) >= 9:  # Valid row
                spanish = row[0].strip()

                # Check if we have a fix for this card
                if spanish in all_fixes:
                    fix = all_fixes[spanish]
                    # Update English translation (column 1)
                    row[1] = fix['translation']
                    # Update Extra field (column 4) with context
                    row[4] = fix['extra']
                    print(f"✓ Fixed: {spanish[:50]}")

                rows.append(row)

    # Write updated CSV
    with open(csv_path, 'w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f)
        writer.writerows(rows)

    return len([r for r in rows[1:] if r[0] in all_fixes])

def main():
    print("=" * 80)
    print("APPLYING TRANSLATION FIXES TO CARDS.CSV")
    print("=" * 80)

    # Parse all fix files
    fix_files = [
        'GENERAL_CATEGORY_FIXES.md',
        'DAILY_CATEGORY_FIXES.md',
        'ROMANCE_CATEGORY_FIXES.md',
        'QUESTIONS_CATEGORY_FIXES.md',
        'COLOMBIAN_SLANG_FIXES.md',
        'VERB_PATTERN_FIXES.md'
    ]

    all_fixes = {}

    for fix_file in fix_files:
        print(f"\nParsing {fix_file}...")
        fixes = parse_fix_file(fix_file)
        all_fixes.update(fixes)
        print(f"  → Found {len(fixes)} fixes")

    print(f"\n{'='*80}")
    print(f"TOTAL FIXES TO APPLY: {len(all_fixes)}")
    print(f"{'='*80}\n")

    # Apply fixes to CSV
    csv_path = 'public/cards.csv'
    cards_updated = apply_fixes_to_csv(csv_path, all_fixes)

    print(f"\n{'='*80}")
    print(f"✅ COMPLETE: {cards_updated} cards updated in {csv_path}")
    print(f"{'='*80}\n")

if __name__ == '__main__':
    main()
