#!/usr/bin/env python3
"""
Apply all improvements: enhancements to existing cards + new card additions
"""

import csv
from pathlib import Path

def apply_enhancements():
    """Apply enhanced notes to existing cards"""

    # Load enhancements
    enhancements = {}
    if Path('EXISTING_CARDS_ENHANCEMENTS.csv').exists():
        print("📖 Loading existing card enhancements...")
        with open('EXISTING_CARDS_ENHANCEMENTS.csv', 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                spanish = row.get('Spanish', '').strip()
                enhanced_notes = row.get('Enhanced_Notes', '').strip()
                if spanish and enhanced_notes:
                    enhancements[spanish] = enhanced_notes
        print(f"   ✓ Loaded {len(enhancements)} enhancements\n")

    # Load main CSV
    rows = []
    with open('public/cards.csv', 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        header = next(reader)
        rows.append(header)

        for row in reader:
            rows.append(row)

    # Apply enhancements
    enhanced_count = 0
    for i, row in enumerate(rows[1:], 1):
        if len(row) < 9:
            continue

        spanish = row[0].strip()

        # Apply enhancement if available
        if spanish in enhancements:
            row[3] = enhancements[spanish]  # Update Notes column
            enhanced_count += 1
            if enhanced_count <= 5:
                print(f"✓ Enhanced: {spanish[:50]}")

    print(f"\n✅ Enhanced {enhanced_count} existing cards")

    # Write updated CSV
    with open('public/cards.csv', 'w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f)
        writer.writerows(rows)

    return enhanced_count

def add_new_cards():
    """Add new cards from all addition files"""

    addition_files = [
        'HEALTH_HYGIENE_BODY_ADDITIONS.csv',
        'WORK_STUDY_ACTIVITIES_ADDITIONS.csv',
        'TRAFFIC_TRANSIT_ERRANDS_ADDITIONS.csv'
    ]

    all_new_cards = []

    print("\n" + "=" * 80)
    print("ADDING NEW CARDS")
    print("=" * 80 + "\n")

    for filename in addition_files:
        if Path(filename).exists():
            with open(filename, 'r', encoding='utf-8') as f:
                reader = csv.reader(f)
                next(reader)  # Skip header
                cards = list(reader)
                all_new_cards.extend(cards)
                print(f"✓ {filename}: {len(cards)} cards")

    # Append to main CSV
    with open('public/cards.csv', 'a', encoding='utf-8', newline='') as f:
        writer = csv.writer(f)
        writer.writerows(all_new_cards)

    print(f"\n✅ Added {len(all_new_cards)} new cards to main CSV")
    return len(all_new_cards)

if __name__ == '__main__':
    print("=" * 80)
    print("APPLYING ALL IMPROVEMENTS")
    print("=" * 80 + "\n")

    # Step 1: Enhance existing cards
    enhanced = apply_enhancements()

    # Step 2: Add new cards
    added = add_new_cards()

    # Summary
    print("\n" + "=" * 80)
    print("COMPLETE!")
    print("=" * 80)
    print(f"✅ Enhanced {enhanced} existing cards with better examples/context")
    print(f"✅ Added {added} new cards to expand categories")
    print(f"📊 Total improvements: {enhanced + added}")
    print()
