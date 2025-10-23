#!/usr/bin/env python3
"""
Reorganize cards from bloated 'general' category into proper categories
Based on user's intelligent mapping strategy
"""

import csv
import re

# Category mapping rules - Spanish phrase patterns → new category tag
REORGANIZATION_RULES = {
    # INTIMATE (sexual/very intimate) → intimate
    'intimate': [
        'hagamos el amor', 'acuéstate conmigo', 'me prendiste', 'me calienta',
        'me excita', 'quiero hacerte', 'te deseo', 'desnud', 'beso', 'besar'
    ],

    # ROMANCE & RELATIONSHIP (feelings, romantic, affection) → romance
    'romance': [
        'te amo', 'te quiero', 'mi amor', 'mi vida', 'envejezcamos juntos',
        'eres mi debilidad', 'pienso en ti', 'te extraño', 'me gusta', 'hermosa',
        'hermoso', 'preciosa', 'precioso', 'cariño', 'amor de mi vida',
        'enamorad', 'corazón', 'contigo', 'aprecio', 'me importas',
        'te sientes bien', 'duerme rico', 'que tengas', 'cuídate'
    ],

    # SOCIAL LUBRICANTS (compliments, pleasantries, social grease) → social
    'social': [
        'hablas muy bonito', 'qué bien', 'súper bien', 'bacán', 'chévere',
        'de maravilla', 'qué chimba', 'qué rico', 'bien hecho', 'felicidades',
        'salud', 'buen provecho', 'gracias', 'disculpa', 'perdón', 'qué pena',
        'con permiso', 'mucho gusto', 'un placer', 'igualmente'
    ],

    # TIME & PLANNING (coordinating, scheduling) → time_planning
    'time_planning': [
        'a qué hora', 'cuando', 'dónde nos vemos', 'te sirve', 'cuadramos',
        'nos vemos', 'quedamos', 'ya llegaste', 'ya llegué', 'avísame',
        'te recojo', 'paso por', 'ahorita', 'más tarde', 'ahí hablamos',
        'mañana', 'hoy', 'ayer', 'antier', 'ratico', 'un momento',
        'ahí vamos', 'ya voy', 'ya casi', 'voy saliendo', 'voy llegando'
    ],

    # REQUESTS & OFFERS (transactional, asking, offering) → requests_offers
    'requests_offers': [
        'me ayudas', 'me colaboras', 'nos trae', 'aceptan tarjeta',
        'aceptan transferencia', 'tienes efectivo', 'junto o separado',
        'cuánto cuesta', 'cuánto vale', 'cuánto es', 'a cómo está',
        'me prestas', 'me regalas', 'te sirvo', 'quieres', 'te ofrezco',
        'porfa', 'por favor', 'te invito', 'puedes', 'podrías'
    ],

    # REACTIONS & EXCLAMATIONS → reactions
    'reactions': [
        'qué va', 'ay dios', 'ay sí', 'ay no', 'uy', 'wow', 'épale',
        'qué jartera', 'qué pereza', 'qué chimba', 'bacán', 'berraco',
        'obvio', 'claro', 'por supuesto', 'dale', 'listo', 'ya',
        'así está perfecto', 'así me gusta', 'bien o qué', 'normal',
        'tranqui', 'suave'
    ],

    # HEALTH & WELLNESS → health
    'health': [
        'me duele', 'me siento', 'estoy enfermo', 'estoy cansad',
        'estoy agotad', 'tengo sueño', 'tengo hambre', 'tengo sed',
        'te sientes', 'cómo sigues', 'estás bien', 'te mejoras',
        'descansa', 'cuídate', 'si te sientes mejor'
    ],

    # ACTIVITIES & GOING OUT → activities
    'activities': [
        'vamos a rumbear', 'salimos', 'pasemos el rato', 'tomemos algo',
        'descansar es seguir la rumba', 'una pola', 'un tinto',
        'prefiero algo tranquilo', 'rumba', 'fiesta', 'parche',
        'nos tomamos', 'bailamos', 'comamos'
    ],

    # FOOD & DINING → food (already exists)
    'food': [
        'almorzamos', 'almorzaste', 'almuerzo', 'desayuno', 'cena',
        'comes', 'comiste', 'hambre', 'algo suave o con alcohol',
        'buen provecho', 'qué quieres pedir', 'el plato del día',
        'nos trae', 'la cuenta', 'otro jugo', 'otra cerveza'
    ],

    # HELP & ASSISTANCE → help (already exists)
    'help': [
        'me ayudas', 'me colaboras', 'ayúdame', 'colaborame',
        'necesito ayuda', 'me haces el favor', 'puedes ayudarme'
    ],

    # DIRECTIONS & LOCATION → directions (already exists)
    'directions': [
        'al frente de', 'al lado de', 'en la esquina', 'para en',
        'cruzando', 'cuántas cuadras', 'por acá', 'por allá',
        'derecha', 'izquierda', 'recto', 'dónde queda', 'cómo llego'
    ],
}

def categorize_card(spanish_text):
    """Determine best category for a card based on its Spanish text"""
    text_lower = spanish_text.lower()

    # Check each category's patterns
    for category, patterns in REORGANIZATION_RULES.items():
        for pattern in patterns:
            if pattern in text_lower:
                return category

    return None  # Keep in general if no match

def reorganize_csv():
    """Apply reorganization to cards.csv"""

    # Read CSV
    rows = []
    with open('public/cards.csv', 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        header = next(reader)
        rows.append(header)

        for row in reader:
            rows.append(row)

    # Track changes
    moves = {}
    unchanged = 0

    # Process each row
    for i, row in enumerate(rows[1:], 1):  # Skip header
        if len(row) < 9:
            continue

        spanish = row[0]
        current_tags = row[7]

        # Only reorganize if currently tagged 'general'
        if 'general' not in current_tags:
            unchanged += 1
            continue

        # Determine new category
        new_category = categorize_card(spanish)

        if new_category:
            # Replace 'general' with new category in tags
            old_tags = current_tags
            new_tags = current_tags.replace('general', new_category)
            rows[i][7] = new_tags

            # Track for reporting
            if new_category not in moves:
                moves[new_category] = []
            moves[new_category].append(spanish[:60])

    # Write updated CSV
    with open('public/cards.csv', 'w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f)
        writer.writerows(rows)

    # Report results
    print("="*80)
    print("CATEGORY REORGANIZATION COMPLETE")
    print("="*80)
    print()

    total_moved = sum(len(cards) for cards in moves.values())
    print(f"📊 Total cards moved: {total_moved}")
    print(f"📌 Cards unchanged: {unchanged}")
    print()

    for category in sorted(moves.keys()):
        cards = moves[category]
        print(f"\n✅ {category.upper()} ({len(cards)} cards)")
        print("-" * 60)
        for card in cards[:5]:  # Show first 5
            print(f"   • {card}")
        if len(cards) > 5:
            print(f"   ... and {len(cards) - 5} more")

    print()
    print("="*80)
    print(f"✅ Updated public/cards.csv")
    print("="*80)

if __name__ == '__main__':
    reorganize_csv()
