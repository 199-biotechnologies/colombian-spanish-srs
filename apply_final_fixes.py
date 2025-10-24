#!/usr/bin/env python3
"""
Apply final comprehensive fixes from REMAINING_INCOMPLETE_FIXES.csv
"""

import csv
from pathlib import Path

def apply_remaining_fixes():
    """Apply remaining incomplete fixes"""

    # Load fixes
    fixes = {}
    fix_file = 'REMAINING_INCOMPLETE_FIXES.csv'

    if not Path(fix_file).exists():
        print(f"❌ {fix_file} not found!")
        return

    print(f"📖 Loading {fix_file}...")
    with open(fix_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            spanish = row.get('Spanish', '').strip()
            english = row.get('New_English', '').strip()
            context = row.get('Cultural_Context', '').strip()
            example = row.get('Example_Sentence', '').strip()
            notes = row.get('Colombian_Notes', '').strip()

            # Combine context, example, and notes
            full_notes = f"{context} | Example: {example} | {notes}" if context else ""

            if spanish and english:
                fixes[spanish] = {
                    'english': english,
                    'notes': full_notes
                }

    print(f"   ✓ Loaded {len(fixes)} fixes\n")

    # Load main CSV
    rows = []
    with open('public/cards.csv', 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        header = next(reader)
        rows.append(header)

        for row in reader:
            rows.append(row)

    # Apply fixes
    updated = 0
    for i, row in enumerate(rows[1:], 1):
        if len(row) < 9:
            continue

        spanish = row[0].strip()

        # Try exact match first
        if spanish in fixes:
            fix = fixes[spanish]
            row[1] = fix['english']
            if fix['notes']:
                row[3] = fix['notes']
            updated += 1
            print(f"✓ {spanish[:60]}")
            continue

        # Try partial match for truncated Spanish
        for fix_spanish, fix_data in fixes.items():
            if spanish.startswith(fix_spanish[:20]) or fix_spanish.startswith(spanish[:20]):
                row[1] = fix_data['english']
                if fix_data['notes']:
                    row[3] = fix_data['notes']
                updated += 1
                print(f"✓ {spanish[:60]} (partial match)")
                break

    # Write updated CSV
    with open('public/cards.csv', 'w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f)
        writer.writerows(rows)

    print(f"\n{'='*80}")
    print(f"✅ Applied {updated} final fixes")
    print(f"{'='*80}\n")

    # Check remaining incomplete
    remaining = 0
    with open('public/cards.csv', 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        next(reader)  # skip header
        for row in reader:
            if len(row) > 1:
                english = row[1]
                if '[' in english and ']' in english:
                    remaining += 1
                elif english.endswith('...'):
                    remaining += 1

    print(f"📊 Remaining incomplete translations: {remaining}")
    print()

if __name__ == '__main__':
    apply_remaining_fixes()
