#!/usr/bin/env python3
"""
Comprehensive Example Generator for Colombian Spanish SRS
Generates contextual examples for ALL 431 cards
"""

import json
import csv
import re

class ColombianSpanishExampleGenerator:
    """Generates culturally appropriate examples for Colombian Spanish phrases"""

    def __init__(self):
        # Load cards needing examples
        with open('cards_needing_examples.json', 'r', encoding='utf-8') as f:
            self.cards = json.load(f)

    def generate_example(self, spanish, english, current_notes):
        """Generate comprehensive example for any phrase"""

        # Preserve existing notes
        base_notes = current_notes.strip() if current_notes else ""
        if base_notes and not base_notes.endswith('\n'):
            base_notes += '\n\n'

        # Pattern-based generation
        if self.is_number(spanish):
            return self.generate_number_example(spanish, english, base_notes)
        elif self.is_question(spanish):
            return self.generate_question_example(spanish, english, base_notes)
        elif self.is_grammar_frame(spanish):
            return self.generate_grammar_example(spanish, english, base_notes)
        elif spanish.startswith('Ya '):
            return self.generate_ya_example(spanish, english, base_notes)
        elif spanish.startswith('Voy '):
            return self.generate_voy_example(spanish, english, base_notes)
        elif spanish.startswith('Vamos '):
            return self.generate_vamos_example(spanish, english, base_notes)
        elif self.is_time_expression(spanish):
            return self.generate_time_example(spanish, english, base_notes)
        elif self.is_romantic_phrase(spanish):
            return self.generate_romantic_example(spanish, english, base_notes)
        else:
            return self.generate_generic_example(spanish, english, base_notes)

    def is_number(self, spanish):
        """Check if phrase is a number"""
        numbers = ['Uno', 'Dos', 'Tres', 'Cuatro', 'Cinco', 'Seis', 'Siete', 'Ocho',
                   'Nueve', 'Diez', 'Once', 'Doce', 'Trece', 'Catorce', 'Quince',
                   'Dieciséis', 'Diecisiete', 'Dieciocho', 'Diecinueve', 'Veinte',
                   'Veintiuno', 'Treinta', 'Cuarenta', 'Cincuenta', 'Sesenta',
                   'Setenta', 'Ochenta', 'Noventa', 'Cien']
        return spanish.strip() in numbers

    def is_question(self, spanish):
        """Check if phrase is a question"""
        return spanish.startswith('¿')

    def is_grammar_frame(self, spanish):
        """Check if phrase contains grammar placeholders"""
        return '{{' in spanish and '}}' in spanish

    def is_time_expression(self, spanish):
        """Check if phrase relates to time"""
        time_words = ['hora', 'horas', 'ahorita', 'antier', 'ayer', 'mañana', 'tarde', 'temprano']
        return any(word in spanish.lower() for word in time_words)

    def is_romantic_phrase(self, spanish):
        """Check if phrase is romantic"""
        romantic_words = ['amor', 'beso', 'contigo', 'mirada', 'corazón', 'acuéstate']
        return any(word in spanish.lower() for word in romantic_words)

    def generate_number_example(self, spanish, english, base_notes):
        """Generate examples for numbers"""
        number_examples = {
            'Uno': [
                ('Dame uno por favor.', 'Give me one please.'),
                ('Soy el número uno.', "I'm number one."),
                ('Uno no sabe qué hacer.', "One doesn't know what to do.")
            ],
            'Dos': [
                ('Son las dos.', "It's two o'clock."),
                ('Necesito dos libras de papa.', 'I need two pounds of potatoes.'),
                ('Somos dos personas.', 'We are two people.')
            ],
            'Tres': [
                ('Nos vemos a las tres.', "We'll meet at three."),
                ('Dame tres empanadas.', 'Give me three empanadas.'),
                ('Tres mil pesos.', 'Three thousand pesos.')
            ],
        }

        examples = number_examples.get(spanish.strip(), [
            (f'{spanish} personas.', f'{english} people.'),
            (f'Son las {spanish.lower()}.', f"It's {english} o'clock."),
            (f'Piso {spanish.lower()}.', f'{english.capitalize()} floor.')
        ])

        enhanced = base_notes
        enhanced += f"Cultural Context: Used for counting, telling time, prices, and addresses in Colombian Spanish.\n\n"
        for i, (es, en) in enumerate(examples, 1):
            enhanced += f"Example {i}: {es} = {en}\n"
        enhanced += f"\nFormality: Neutral\n"
        enhanced += f"Usage Notes: Essential for daily transactions in Colombian markets, restaurants, and navigation."

        return enhanced

    def generate_question_example(self, spanish, english, base_notes):
        """Generate examples for questions"""
        enhanced = base_notes

        # Determine question type
        if '¿Quieres que' in spanish:
            enhanced += "Cultural Context: Polite offer using subjunctive mood, very common in Colombian culture for showing care and consideration.\n\n"
            enhanced += f"Example 1: {spanish} = {english}\n"
            enhanced += f"Example 2: No te preocupes, {spanish.replace('¿', '').replace('?', '')}, con gusto. = Don't worry, {english.replace('?', '')}, gladly.\n"
            enhanced += f"Example 3: {spanish.replace('¿', '').replace('?', '')}? Perfecto, te lo agradezco. = {english} Perfect, I appreciate it.\n"
            enhanced += f"\nFormality: Informal to Neutral\n"
            enhanced += f"Usage Notes: Reflects Colombian culture of mutual help and consideration. Using subjunctive shows politeness."
        elif '¿Te parece si' in spanish:
            enhanced += "Cultural Context: Colombian way of suggesting plans politely, seeking agreement before committing.\n\n"
            enhanced += f"Example 1: {spanish} = {english}\n"
            enhanced += f"Example 2: {spanish.replace('¿', '').replace('?', '')}? Me parece perfecto. = {english} Sounds perfect to me.\n"
            enhanced += f"Example 3: Oye, {spanish.replace('¿', '').lower()} = Hey, {english.lower()}\n"
            enhanced += f"\nFormality: Neutral\n"
            enhanced += f"Usage Notes: 'Te parece' is characteristic of Colombian Spanish for making polite suggestions."
        elif '¿A qué hora' in spanish or '¿A qué horas' in spanish:
            enhanced += "Cultural Context: Essential phrase for coordinating meetings and schedules in Colombian daily life.\n\n"
            enhanced += f"Example 1: {spanish} = {english}\n"
            enhanced += f"Example 2: {spanish.replace('?', '')}? A las tres te parece? = {english.replace('?', '')}? Does three work?\n"
            enhanced += f"Example 3: Dime {spanish.replace('¿', '').lower()} = Tell me {english.lower()}\n"
            enhanced += f"\nFormality: Neutral\n"
            enhanced += f"Usage Notes: Used constantly for scheduling in Colombian work and social contexts."
        else:
            # Generic question format
            enhanced += "Cultural Context: Common question in Colombian Spanish conversations.\n\n"
            enhanced += f"Example 1: {spanish} = {english}\n"
            enhanced += f"Example 2: {spanish} Es importante saberlo. = {english} It's important to know.\n"
            enhanced += f"\nFormality: Neutral\n"
            enhanced += f"Usage Notes: Used in everyday Colombian interactions."

        return enhanced

    def generate_grammar_example(self, spanish, english, base_notes):
        """Generate examples for grammar frames"""
        enhanced = base_notes

        # Extract pattern
        pattern = spanish.split(':')[0] if ':' in spanish else spanish

        if 'ir a + inf' in pattern.lower() or 'Voy a' in spanish:
            enhanced += "Cultural Context: 'Ir a + infinitive' is the most common way to express future in Colombian Spanish, preferred over formal future tense.\n\n"
            enhanced += f"Example 1: Voy a comer. = I'm going to eat.\n"
            enhanced += f"Example 2: Voy a estudiar esta noche. = I'm going to study tonight.\n"
            enhanced += f"Example 3: ¿Qué vas a hacer mañana? = What are you going to do tomorrow?\n"
            enhanced += f"\nFormality: Neutral\n"
            enhanced += f"Usage Notes: Pattern: ir (conjugated) + a + infinitive. Used constantly in Colombian everyday speech."

        elif 'acabar de' in pattern.lower():
            enhanced += "Cultural Context: Expresses recent past actions - 'to have just done something'.\n\n"
            enhanced += f"Example 1: Acabo de llegar. = I just arrived.\n"
            enhanced += f"Example 2: Acabamos de comer. = We just ate.\n"
            enhanced += f"Example 3: ¿Ya comiste? Sí, acabo de comer. = Did you eat? Yes, I just ate.\n"
            enhanced += f"\nFormality: Neutral\n"
            enhanced += f"Usage Notes: Pattern: acabar (conjugated) + de + infinitive. Very common in Colombian Spanish."

        elif 'estar + gerund' in pattern.lower() or 'Estoy' in spanish:
            enhanced += "Cultural Context: Present progressive - describes actions happening right now.\n\n"
            enhanced += f"Example 1: Estoy comiendo. = I'm eating.\n"
            enhanced += f"Example 2: Estoy trabajando desde casa. = I'm working from home.\n"
            enhanced += f"Example 3: ¿Qué estás haciendo? = What are you doing?\n"
            enhanced += f"\nFormality: Neutral\n"
            enhanced += f"Usage Notes: Pattern: estar (conjugated) + gerund (-ando/-iendo). Used frequently in Colombian conversations."

        elif 'hay que' in pattern.lower():
            enhanced += "Cultural Context: Expresses necessity or obligation - 'one must' or 'we have to'.\n\n"
            enhanced += f"Example 1: Hay que pagar la cuenta. = We have to pay the bill.\n"
            enhanced += f"Example 2: Hay que llegar temprano. = We need to arrive early.\n"
            enhanced += f"Example 3: Hay que irnos ya. = We have to leave now.\n"
            enhanced += f"\nFormality: Neutral\n"
            enhanced += f"Usage Notes: Pattern: hay que + infinitive. Common for general obligations in Colombian Spanish."

        elif 'tener que' in pattern.lower():
            enhanced += "Cultural Context: Expresses personal obligation - 'to have to do something'.\n\n"
            enhanced += f"Example 1: Tengo que trabajar. = I have to work.\n"
            enhanced += f"Example 2: Tenemos que hablar. = We need to talk.\n"
            enhanced += f"Example 3: ¿Tienes que irte ya? = Do you have to leave now?\n"
            enhanced += f"\nFormality: Neutral\n"
            enhanced += f"Usage Notes: Pattern: tener (conjugated) + que + infinitive. Essential construction in Colombian Spanish."

        else:
            # Generic grammar frame
            enhanced += f"Cultural Context: Grammar pattern commonly used in Colombian Spanish.\n\n"
            enhanced += f"Example 1: {spanish.replace('{{', '').replace('}}', '')} = {english}\n"
            enhanced += f"\nFormality: Neutral\n"
            enhanced += f"Usage Notes: Important grammatical construction for Colombian learners."

        return enhanced

    def generate_ya_example(self, spanish, english, base_notes):
        """Generate examples for 'Ya' phrases"""
        enhanced = base_notes
        enhanced += "Cultural Context: 'Ya' is extremely versatile in Colombian Spanish, indicating completion, immediacy, or change of state.\n\n"

        if 'casi' in spanish.lower():
            enhanced += f"Example 1: ¿Ya terminaste? - Ya casi. = Are you done? - Almost.\n"
            enhanced += f"Example 2: Ya casi llegamos. = We're almost there.\n"
            enhanced += f"Example 3: Ya casi acabo. = I'm almost done.\n"
            enhanced += f"\nFormality: Informal\n"
            enhanced += f"Usage Notes: 'Ya casi' is ubiquitous in Colombia for reassuring about progress."
        elif 'entendí' in spanish.lower():
            enhanced += f"Example 1: Ah, ya entendí. = Ah, now I get it.\n"
            enhanced += f"Example 2: Ya entendí la explicación. = I understand the explanation now.\n"
            enhanced += f"Example 3: ¿Entiendes? - Sí, ya entendí. = Do you understand? - Yes, I got it.\n"
            enhanced += f"\nFormality: Informal to Neutral\n"
            enhanced += f"Usage Notes: Common response in Colombian classrooms and explanations."
        elif 'llegué' in spanish.lower() or 'llegaste' in spanish.lower():
            enhanced += f"Example 1: {spanish} = {english}\n"
            enhanced += f"Example 2: Te aviso cuando ya llegue. = I'll let you know when I arrive.\n"
            enhanced += f"Example 3: Ya llegué a casa, todo bien. = I got home, all good.\n"
            enhanced += f"\nFormality: Informal to Neutral\n"
            enhanced += f"Usage Notes: Colombians often message 'Ya llegué' to confirm safe arrival to family."
        elif 'vengo' in spanish.lower() or 'voy' in spanish.lower():
            enhanced += f"Example 1: ¡Ven! - Ya voy. = Come here! - I'm coming.\n"
            enhanced += f"Example 2: Ya vengo, no me demoro. = I'll be right back, won't take long.\n"
            enhanced += f"Example 3: Espérame, ya voy. = Wait for me, I'm coming.\n"
            enhanced += f"\nFormality: Informal\n"
            enhanced += f"Usage Notes: Essential Colombian response to calls or requests."
        else:
            enhanced += f"Example 1: {spanish} = {english}\n"
            enhanced += f"Example 2: {spanish} Todo está listo. = {english} Everything is ready.\n"
            enhanced += f"\nFormality: Informal to Neutral\n"
            enhanced += f"Usage Notes: 'Ya' adds emphasis to completed or immediate actions in Colombian speech."

        return enhanced

    def generate_voy_example(self, spanish, english, base_notes):
        """Generate examples for 'Voy' phrases"""
        enhanced = base_notes
        enhanced += "Cultural Context: 'Voy a' + infinitive expresses immediate future or intention, very common in Colombian daily life.\n\n"
        enhanced += f"Example 1: {spanish} = {english}\n"

        if 'saliendo' in spanish.lower():
            enhanced += f"Example 2: ¿Dónde estás? - Voy saliendo de la casa. = Where are you? - I'm leaving home now.\n"
            enhanced += f"Example 3: Ya voy saliendo, llego en 10 minutos. = I'm leaving now, I'll be there in 10 minutes.\n"
        elif 'médico' in spanish.lower() or 'droguería' in spanish.lower():
            enhanced += f"Example 2: {spanish}, ya vuelvo. = {english}, I'll be back.\n"
            enhanced += f"Example 3: No puedo ahora, {spanish.lower()}. = I can't now, {english.lower()}.\n"
        else:
            enhanced += f"Example 2: {spanish} ¿Vienes conmigo? = {english} Are you coming with me?\n"
            enhanced += f"Example 3: Ahorita no puedo, {spanish.lower()}. = I can't right now, {english.lower()}.\n"

        enhanced += f"\nFormality: Informal to Neutral\n"
        enhanced += f"Usage Notes: Used to announce plans or departures in Colombian households and workplaces."

        return enhanced

    def generate_vamos_example(self, spanish, english, base_notes):
        """Generate examples for 'Vamos' phrases"""
        enhanced = base_notes
        enhanced += "Cultural Context: 'Vamos' (let's go/let's) is used for suggestions and group actions in Colombian Spanish.\n\n"
        enhanced += f"Example 1: {spanish} = {english}\n"

        if 'ver' in spanish.lower():
            enhanced += f"Example 2: ¿Puedes venir? - Vamos a ver, te confirmo. = Can you come? - Let's see, I'll confirm.\n"
            enhanced += f"Example 3: Vamos a ver qué pasa. = Let's see what happens.\n"
        elif 'onces' in spanish.lower():
            enhanced += f"Example 2: A las 4, vamos por unas onces? = At 4, let's go for 'onces' (afternoon snack)?\n"
            enhanced += f"Example 3: Vamos por unas onces al café. = Let's go for snacks at the café.\n"
        elif 'suave' in spanish.lower():
            enhanced += f"Example 2: Tranquilo, vamos suave. = Relax, let's take it easy.\n"
            enhanced += f"Example 3: Vamos suave con esto. = Let's go slow/easy with this.\n"
        else:
            enhanced += f"Example 2: {spanish} ¿Te parece? = {english} Sound good?\n"
            enhanced += f"Example 3: Dale, {spanish.lower()}. = Okay, {english.lower()}.\n"

        enhanced += f"\nFormality: Informal to Neutral\n"
        enhanced += f"Usage Notes: 'Vamos' is essential for making plans and suggestions in Colombian social contexts."

        return enhanced

    def generate_time_example(self, spanish, english, base_notes):
        """Generate examples for time expressions"""
        enhanced = base_notes
        enhanced += "Cultural Context: Time expressions are crucial for coordination in Colombian daily life.\n\n"
        enhanced += f"Example 1: {spanish} = {english}\n"

        if 'ahorita' in spanish.lower():
            enhanced += f"Example 2: Lo hago ahorita. = I'll do it right now.\n"
            enhanced += f"Example 3: Ahorita vuelvo. = I'll be right back.\n"
            enhanced += f"\nFormality: Informal\n"
            enhanced += f"Usage Notes: 'Ahorita' in Colombia can mean 'right now' or 'in a little while' depending on context."
        elif 'antier' in spanish.lower():
            enhanced += f"Example 2: Antier fui al mercado. = I went to the market the day before yesterday.\n"
            enhanced += f"Example 3: Eso fue antier. = That was the day before yesterday.\n"
            enhanced += f"\nFormality: Neutral\n"
            enhanced += f"Usage Notes: 'Antier' is standard in Colombian Spanish for 'the day before yesterday'."
        else:
            enhanced += f"Example 2: {spanish} Te confirmo. = {english} I'll confirm.\n"
            enhanced += f"\nFormality: Neutral\n"
            enhanced += f"Usage Notes: Time coordination is essential in Colombian social and work contexts."

        return enhanced

    def generate_romantic_example(self, spanish, english, base_notes):
        """Generate examples for romantic phrases"""
        enhanced = base_notes
        enhanced += "Cultural Context: Romantic expressions in Colombian Spanish, often used in courtship and relationships.\n\n"
        enhanced += f"Example 1: {spanish} = {english}\n"
        enhanced += f"Example 2: Te digo {spanish.lower()} = I tell you {english.lower()}\n"
        enhanced += f"\nFormality: Informal / Intimate\n"
        enhanced += f"Usage Notes: Used in romantic contexts in Colombian culture, often poetic or affectionate."

        return enhanced

    def generate_generic_example(self, spanish, english, base_notes):
        """Generate generic examples for any phrase"""
        enhanced = base_notes
        enhanced += "Cultural Context: Common expression in Colombian Spanish used in everyday conversations.\n\n"
        enhanced += f"Example 1: {spanish} = {english}\n"

        # Add contextual second example based on content
        if 'tranqui' in spanish.lower() or 'bien' in spanish.lower():
            enhanced += f"Example 2: Todo {spanish.lower()}. = Everything {english.lower()}.\n"
        elif any(word in spanish.lower() for word in ['avisa', 'avísame', 'confirma']):
            enhanced += f"Example 2: {spanish} por WhatsApp. = {english} via WhatsApp.\n"
        else:
            enhanced += f"Example 2: Claro, {spanish.lower()}. = Sure, {english.lower()}.\n"

        # Determine formality
        if any(word in spanish.lower() for word in ['quiubo', 'parce', 'bro', 'tranqui', 'llave']):
            formality = "Informal / Slang"
        elif any(word in spanish.lower() for word in ['usted', 'señor', 'señora', 'permiso']):
            formality = "Formal"
        else:
            formality = "Neutral"

        enhanced += f"\nFormality: {formality}\n"
        enhanced += f"Usage Notes: Used in everyday Colombian interactions and conversations."

        return enhanced

    def process_all_cards(self):
        """Process all cards and generate examples"""
        enhanced_cards = []

        print(f"Processing {len(self.cards)} cards...\n")

        for i, card in enumerate(self.cards, 1):
            enhanced_notes = self.generate_example(
                card['Spanish'],
                card['English'],
                card['Current_Notes']
            )

            enhanced_cards.append({
                'Spanish': card['Spanish'],
                'Enhanced_Notes': enhanced_notes
            })

            if i % 50 == 0:
                print(f"✓ Processed {i}/{len(self.cards)} cards...")

        return enhanced_cards

    def save_to_csv(self, enhanced_cards, filename='FINAL_EXAMPLE_ADDITIONS.csv'):
        """Save enhanced cards to CSV"""
        with open(filename, 'w', encoding='utf-8', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=['Spanish', 'Enhanced_Notes'])
            writer.writeheader()
            writer.writerows(enhanced_cards)

        print(f"\n✓ Successfully saved {len(enhanced_cards)} cards to {filename}")

    def print_statistics(self, enhanced_cards):
        """Print processing statistics"""
        with_examples = len([c for c in enhanced_cards if 'Example' in c['Enhanced_Notes']])

        print(f"\n{'='*50}")
        print(f"STATISTICS")
        print(f"{'='*50}")
        print(f"Total cards processed: {len(enhanced_cards)}")
        print(f"Cards with examples: {with_examples}")
        print(f"Example coverage: {(with_examples/len(enhanced_cards)*100):.1f}%")
        print(f"{'='*50}")

def main():
    generator = ColombianSpanishExampleGenerator()
    enhanced_cards = generator.process_all_cards()
    generator.save_to_csv(enhanced_cards)
    generator.print_statistics(enhanced_cards)

    # Show sample
    print(f"\nSample of enhanced cards:")
    for i, card in enumerate(enhanced_cards[:3], 1):
        print(f"\n--- Card {i}: {card['Spanish']} ---")
        print(card['Enhanced_Notes'][:200] + "...")

if __name__ == '__main__':
    main()
