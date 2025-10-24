#!/usr/bin/env python3
"""Fix the final 6 incomplete cards"""

import csv

FINAL_FIXES = {
    "No estoy listalisto": {
        "english": "I'm not ready",
        "notes": "Gender forms: lista (feminine) / listo (masculine). Common when declining plans or intimacy. Example: 'No estoy lista para eso todavía' = I'm not ready for that yet."
    },
    "Soy todatodo tuyo": {
        "english": "I'm all yours",
        "notes": "Romantic/intimate declaration of devotion. Gender forms: toda (feminine) / todo (masculine). Very passionate statement. Example: 'Soy toda tuya mi amor, haz conmigo lo que quieras' = I'm all yours my love, do with me what you want."
    },
    "Otro jugocerveza porfa": {
        "english": "Another juice/beer please (casual)",
        "notes": "Casual restaurant/bar request. 'Porfa' = shortened 'por favor'. Jugo = juice, cerveza = beer. Example: 'Otro jugo porfa, con hielo' = Another juice please, with ice."
    },
    "Una chimba de": {
        "english": "An awesome [something] / A badass [something]",
        "notes": "Colombian slang intensifier. 'Chimba' = awesome/cool. Used before nouns. Example: 'Una chimba de rumba' = An awesome party. Can be mildly vulgar depending on context."
    },
    "Creo que...": {
        "english": "I think that... / I believe that...",
        "notes": "Sentence frame for opinions. Less formal than 'pienso'. Example: 'Creo que deberíamos vernos mañana' = I think we should meet tomorrow."
    },
    "Pienso que...": {
        "english": "I think that... / I believe that...",
        "notes": "Sentence frame for considered opinions. More thoughtful than 'creo'. Example: 'Pienso que eres una persona increíble' = I think you're an incredible person."
    }
}

# Read CSV
rows = []
with open('public/cards.csv', 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    header = next(reader)
    rows.append(header)
    for row in reader:
        rows.append(row)

# Apply fixes
fixed = 0
for i, row in enumerate(rows[1:], 1):
    if len(row) < 9:
        continue

    spanish = row[0].strip()

    if spanish in FINAL_FIXES:
        fix = FINAL_FIXES[spanish]
        row[1] = fix['english']
        row[3] = fix['notes']
        fixed += 1
        print(f"✓ Fixed: {spanish}")

# Write
with open('public/cards.csv', 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(rows)

print(f"\n✅ Fixed final {fixed} cards!")
print("🎉 ALL translations now complete!")
