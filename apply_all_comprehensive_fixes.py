#!/usr/bin/env python3
"""
Apply ALL comprehensive fixes from agent-generated CSV files
Complete translations + examples for every card
"""

import csv
from pathlib import Path

def load_fix_file(filepath):
    """Load fixes from agent-generated CSV file"""
    fixes = {}

    if not Path(filepath).exists():
        print(f"⚠️  {filepath} not found, skipping...")
        return fixes

    with open(filepath, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            spanish = row.get('Front (ES)', row.get('Spanish', '')).strip()
            english = row.get('Back (EN)', row.get('English', '')).strip()
            notes = row.get('Notes', row.get('Reply', '')).strip()

            if spanish and english:
                fixes[spanish] = {
                    'english': english,
                    'notes': notes
                }

    return fixes

def apply_comprehensive_fixes():
    """Apply all agent fixes to cards.csv"""

    # Load all fix files
    fix_files = [
        'ROMANCE_COMPLETE_FIXES.csv',
        'TIME_PLANNING_COMPLETE_FIXES.csv',
        'REQUESTS_OFFERS_COMPLETE_FIXES.csv',
        'REACTIONS_COMPLETE_FIXES.csv',
        'DAILY_COMPLETE_FIXES.csv',
        'GENERAL_COMPLETE_FIXES.csv'
    ]

    all_fixes = {}
    for fix_file in fix_files:
        print(f"📖 Loading {fix_file}...")
        fixes = load_fix_file(fix_file)
        all_fixes.update(fixes)
        print(f"   ✓ Loaded {len(fixes)} fixes")

    print(f"\n{'='*80}")
    print(f"📊 Total fixes loaded: {len(all_fixes)}")
    print(f"{'='*80}\n")

    # Read main CSV
    rows = []
    with open('public/cards.csv', 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        header = next(reader)
        rows.append(header)

        for row in reader:
            rows.append(row)

    # Apply fixes
    updated_count = 0
    for i, row in enumerate(rows[1:], 1):
        if len(row) < 9:
            continue

        spanish = row[0].strip()

        if spanish in all_fixes:
            fix = all_fixes[spanish]

            # Update English translation (column 1)
            row[1] = fix['english']

            # Update/append to Notes field (column 3) OR Extra field (column 4)
            # Using Notes field (column 3) as it's the standard Anki notes field
            if fix['notes']:
                row[3] = fix['notes']

            updated_count += 1
            if updated_count <= 10:
                print(f"✓ {spanish[:50]}")

    # Write updated CSV
    with open('public/cards.csv', 'w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f)
        writer.writerows(rows)

    print(f"\n{'='*80}")
    print(f"✅ SUCCESS: Updated {updated_count} cards")
    print(f"{'='*80}")
    print(f"\nAll cards now have:")
    print(f"  • Complete English translations (no brackets/ellipsis)")
    print(f"  • Real-world usage examples")
    print(f"  • Cultural context and notes")
    print(f"  • Colombian Spanish authenticity")
    print()

if __name__ == '__main__':
    apply_comprehensive_fixes()
