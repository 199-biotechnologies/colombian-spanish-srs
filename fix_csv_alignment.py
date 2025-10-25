#!/usr/bin/env python3
"""
Fix CSV alignment issues - remove extra empty fields
"""

import csv

print("Fixing CSV alignment issues...")

# Read all rows
rows = []
fixed_count = 0

with open('public/cards.csv', 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    header = next(reader)
    rows.append(header)

    for row in reader:
        # If row has 10+ fields and field 6 (Type column) is empty
        # it means there's an extra empty field before Type
        if len(row) == 10 and row[6] == '':
            # Remove the empty field at index 6
            fixed_row = row[:6] + row[7:]
            rows.append(fixed_row)
            fixed_count += 1
        elif len(row) == 11:
            # Try to fix 11-field rows
            # Look for empty fields and remove them
            if row[6] == '':
                fixed_row = row[:6] + row[7:]
                rows.append(fixed_row)
                fixed_count += 1
            else:
                rows.append(row[:9])  # Truncate to 9 fields
                fixed_count += 1
        elif len(row) == 12:
            # Truncate to 9 fields
            rows.append(row[:9])
            fixed_count += 1
        elif len(row) >= 9:
            # Keep first 9 fields
            rows.append(row[:9])
        else:
            # Row too short, keep as is (will be skipped by app)
            rows.append(row)

print(f"Fixed {fixed_count} misaligned rows")

# Write back
with open('public/cards.csv', 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(rows)

print("✅ CSV alignment fixed!")

# Verify
with open('public/cards.csv', 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    header = next(reader)
    field_counts = {}
    for row in reader:
        count = len(row)
        field_counts[count] = field_counts.get(count, 0) + 1

print("\nField distribution after fix:")
for count, num in sorted(field_counts.items()):
    print(f"  {count} fields: {num} rows")
