#!/usr/bin/env python3
"""
Direct fix application - manually curated fixes from agent reports
"""

import csv

# Manual fixes extracted from agent reports
# Format: (spanish, english_translation, extra_context)
FIXES = [
    # GENERAL CATEGORY - Critical fixes
    ("A cómo está", "How much is it?", "Colombian informal price question | More common than '¿Cuánto cuesta?'"),
    ("A qué hora es la función", "What time is the show?", "Asking about movie/theater showtime"),
    ("A qué hora te sirve", "What time works for you?", "Polite availability question | 'Servir' = to suit/work for someone"),
    ("A ver si puedes", "Let's see if you can", "Challenge or encouragement | Can be playful or confrontational"),
    ("Abrázame", "Hug me", "Intimate imperative | Between close people"),
    ("Aceptan tarjeta", "Do you accept card?", "Payment method question | Short for credit/debit card"),
    ("Aceptan transferencia o Nequi", "Do you accept transfer or Nequi?", "Digital payment | Nequi is Colombian digital wallet by Bancolombia"),
    ("Acepto la invitación", "I accept the invitation", "Formal acceptance of invite"),
    ("Acuéstate conmigo", "Lie down with me", "Intimate request | Romantic/close relationship"),
    ("Acércate", "Come closer / Get closer", "Imperative to move nearer | Can be romantic or neutral"),
    ("Ahí hablamos", "We'll talk then / Talk to you later", "Casual goodbye | Implies future conversation"),
    ("Ahí vamos", "We're going / Let's go / Here we go", "Multiple uses: departure, progress, encouragement"),
    ("Al frente de", "In front of", "Location preposition"),
    ("Al lado de", "Next to / Beside", "Location preposition"),
    ("Algo suave o con alcohol", "Something soft (non-alcoholic) or with alcohol?", "Drink preference question | 'Suave' = non-alcoholic in Colombian Spanish"),
    ("Almorzamos juntos mañana", "Let's have lunch together tomorrow", "Informal lunch invitation"),
    ("Almorzaste ya", "Did you already eat lunch? / Have you had lunch?", "Checking if someone has eaten"),
    ("Almuerzo y cena también", "Lunch and dinner too", "Meal plans confirmation"),
    ("Nos trae agua porfa", "Can you bring us water please?", "Casual restaurant request | 'Porfa' = shortened 'por favor'"),
    ("Otro jugo/cerveza porfa", "Another juice/beer please", "Casual reorder | 'Porfa' = shortened 'por favor'"),

    # GENERAL - More critical fixes
    ("Alquilamos sombrilla", "Should we rent an umbrella?", "Beach question about umbrella rental"),
    ("Caminamos por la orilla", "Let's walk along the shore", "Beach/riverside walk suggestion"),
    ("Cruzando la calle", "Crossing the street", "Location/direction"),
    ("Cuántas cuadras", "How many blocks?", "Distance question"),
    ("En la esquina", "On/At the corner", "Location description"),
    ("Para en la esquina", "Stop at the corner", "Direction to taxi/driver"),
    ("Por acá", "This way / Over here", "Directional indication"),

    # ROMANCE CATEGORY
    ("911 necesito un beso", "911 I need a kiss", "Playful emergency language | Very romantic/flirty"),
    ("Hagamos el amor", "Let's make love", "Intimate/sexual | Very intimate register"),
    ("Si el amor fuera agua yo te daría el mar", "If love were water, I would give you the sea", "Poetic romantic expression"),
    ("Crees en el amor a primera vista o paso", "Do you believe in love at first sight, or should I walk by again?", "Classic pickup line"),
    ("Duerme rico mi amor", "Sleep well my love", "'Rico' = well/sweetly in Colombian Spanish | Bedtime endearment"),
    ("Te extraño un resto", "I miss you a ton", "'Un resto' = a lot (Medellín slang)"),

    # DAILY LIFE
    ("Así me gusta", "That's how I like it / That's what I like", "Approval expression | Common in romantic contexts"),
    ("Dónde nos vemos", "Where should we meet?", "Planning meetup location | Very common in WhatsApp"),
    ("Hasta luego un abrazo", "See you later, a hug", "Warm affectionate goodbye | Common in Colombian texting"),
    ("Llegué al hotel todo bien", "I arrived at the hotel, all good", "Safe arrival message | 'Todo bien' = everything's okay"),
    ("Me gusta cómo me miras", "I like the way you look at me", "Romantic/flirty | Expressing attraction"),
    ("Quiubo todo bien", "What's up, all good?", "Super informal Colombian greeting"),
    ("Tranqui todo bien", "Chill, all good", "Quintessential Colombian reassurance"),
    ("Te recojo o nos vemos allá", "Should I pick you up or meet there?", "Plan coordination question"),

    # COLOMBIAN SLANG
    ("Ni por el putas", "Not for shit / No fucking way", "Strong negative | Vulgar expression"),
    ("Parce suave", "Easy buddy / Relax dude / Chill bro", "Calming expression | Paisa slang"),
    ("Parceroparcera", "Buddy / Partner / My friend", "Paisa term of friendship"),
    ("Quiubo parce", "What's up buddy / Hey dude", "Paisa greeting | Very informal"),
    ("Qué pena llego tarde", "I'm so sorry I'm late", "'Qué pena' = Colombian politeness expression"),
    ("Qué pena no entendí", "I'm sorry, I didn't understand", "'Qué pena' = Colombian apology"),
    ("Un tinto porfa", "A coffee please / A black coffee please", "'Tinto' = black coffee in Colombia | 'Porfa' = please (casual)"),
    ("Una chimba de", "An awesome [something] / A badass [something]", "'Chimba' = awesome/cool (can be vulgar in some contexts)"),
    ("Una pola", "A beer / A cold one", "Colombian beer slang"),
    ("Uy qué chimba", "Wow, how awesome! / Holy shit, that's cool!", "Excitement expression | Mild vulgarity"),

    # VERB PATTERNS
    ("Quiero que estemos bien", "I want us to be well", "Desire for relationship harmony | Uses subjunctive"),
    ("¿Quieres que pase?", "Do you want me to come by?", "Offering to visit | Uses subjunctive"),
    ("Te parece si nos vemos", "How about we meet", "Proposal pattern | Very common for plans"),
    ("Voy saliendo", "I'm leaving now", "Progressive 'ir + gerund' | Colombian time expression"),
    ("Voy llegando", "I'm arriving", "Progressive 'ir + gerund' | Imminent arrival"),
    ("Acabo de llegar", "I just arrived", "'Acabar de' + infinitive | Recent past"),
    ("Se me olvidó", "I forgot", "Accidental 'se me' pattern"),
    ("Se me descargó el celular", "My phone died", "Accidental pattern | Battery died"),
    ("Tengo ganas de verte", "I want to see you", "Desire pattern | Romantic/friendly"),
    ("Tengo muchas ganas", "I really want to", "Strong desire expression"),
]

def apply_fixes():
    """Apply manual fixes to cards.csv"""

    # Read current CSV
    rows = []
    with open('public/cards.csv', 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        header = next(reader)
        rows.append(header)
        for row in reader:
            rows.append(row)

    # Create lookup dict
    card_index = {row[0].strip(): i for i, row in enumerate(rows[1:], 1) if len(row) > 0}

    # Apply fixes
    fixed_count = 0
    for spanish, english, extra in FIXES:
        if spanish in card_index:
            idx = card_index[spanish]
            # Update English translation (column 1)
            rows[idx][1] = english
            # Update Extra field (column 4) with context
            rows[idx][4] = extra
            fixed_count += 1
            print(f"✓ Fixed: {spanish[:50]}")
        else:
            print(f"⚠️  Not found: {spanish}")

    # Write updated CSV
    with open('public/cards.csv', 'w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f)
        writer.writerows(rows)

    print(f"\n{'='*80}")
    print(f"✅ Applied {fixed_count} critical fixes to cards.csv")
    print(f"{'='*80}")

if __name__ == '__main__':
    apply_fixes()
