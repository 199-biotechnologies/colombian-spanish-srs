#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
FINAL COMPREHENSIVE fix for ALL 414 general category cards
Merges all fixes and handles truncated Spanish entries
"""

import csv
import sys

# Import both fix dictionaries
from fix_general_comprehensive import fixes as main_fixes
from additional_fixes import additional_fixes

# Merge all fixes
all_fixes = {**main_fixes, **additional_fixes}

# Additional fixes for truncated entries (these map truncated to full Spanish)
truncated_mapping = {
    "Ay papámamá": "Ay papá/mamá",
    "Debe ser ilegal ser tan lindalindo": "Debe ser ilegal ser tan linda/lindo",
    "DiablaDiablo": "Diabla/Diablo",
    "El cielo está de luto porque perdió una": "El cielo está de luto porque perdió una estrella",
    "Eres como el aguardiente me subes direct": "Eres como el aguardiente me subes directo",
    "Eres la razón por la que el café colombi": "Eres la razón por la que el café colombiano es tan bueno",
    "Eres míomía": "Eres mío/mía",
    "Eres una diosadios": "Eres una diosa/dios",
    "Eres únicoúnica": "Eres único/única",
    "Hice algo para que te emberracaras conmi": "Hice algo para que te emberracaras conmigo",
    "Me derrites más rápido que el queso en u": "Me derrites más rápido que el queso en una arepa",
    "Me vuelves locoloca": "Me vuelves loco/loca",
    "Necesito un doctordoctora": "Necesito un doctor/doctora",
    "Perdí mi número de teléfono me das el tu": "Perdí mi número de teléfono me das el tuyo",
    "Policía te arrestó por estar tan buenobu": "Policía te arrestó por estar tan bueno/buena",
    "Quedé muertomuerta": "Quedé muerto/muerta",
    "Quisiera ser tu almohada para estar en t": "Quisiera ser tu almohada para estar en tus sueños",
    "Viejovieja": "Viejo/vieja",
    "Ñeroñera": "Ñero/ñera",
}

def process_all_cards():
    """Process all general category cards with comprehensive fixes"""
    input_file = '/tmp/general_cards.csv'
    output_file = '/Users/biobook/Projects/anki/colombian_spanish/spanish-srs/GENERAL_COMPLETE_FIXES.csv'

    with open(input_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames
        cards = list(reader)

    # Track statistics
    fixed_count = 0
    already_complete = 0
    not_found = []

    # Apply fixes to cards
    for card in cards:
        front = card['Front (ES)'].strip()

        # Check if truncated, map to full version
        if front in truncated_mapping:
            full_front = truncated_mapping[front]
        else:
            full_front = front

        # Try to find fix
        if full_front in all_fixes:
            fix_data = all_fixes[full_front]

            # Apply translation
            card['Back (EN)'] = fix_data['back']

            # Apply cultural context to Notes field
            card['Notes'] = fix_data['notes']

            # Use Alternative field for additional context if empty
            if not card['Alternative'].strip():
                card['Alternative'] = fix_data.get('alt_example', '')

            fixed_count += 1
        else:
            # Check if already has complete data
            back = card['Back (EN)'].strip()
            notes = card['Notes'].strip()

            is_complete = (
                back and
                not back.startswith('[') and
                not back.startswith('I eat...') and
                not back.startswith('How...') and
                not back.startswith('Who...') and
                not back.startswith('What...') and
                notes
            )

            if is_complete:
                already_complete += 1
            else:
                not_found.append(front)

    # Write output
    with open(output_file, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(cards)

    # Print statistics
    print(f"\n{'='*70}")
    print(f"GENERAL CATEGORY - COMPLETE FIX REPORT")
    print(f"{'='*70}")
    print(f"Total cards processed:      {len(cards)}")
    print(f"Cards fixed in this run:    {fixed_count}")
    print(f"Cards already complete:     {already_complete}")
    print(f"Cards still incomplete:     {len(not_found)}")
    print(f"\nFix coverage: {(fixed_count + already_complete) / len(cards) * 100:.1f}%")

    if not_found:
        print(f"\nStill need attention ({len(not_found)} cards):")
        for i, card in enumerate(not_found[:20], 1):
            print(f"  {i}. {card}")
        if len(not_found) > 20:
            print(f"  ... and {len(not_found) - 20} more")

    print(f"\nOutput written to:")
    print(f"{output_file}")
    print(f"{'='*70}\n")

    return fixed_count, already_complete, len(not_found)

if __name__ == '__main__':
    process_all_cards()
