#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Final 12 card fixes - these had truncated Spanish in original CSV
Inferred complete Spanish from context and audio filenames
"""

final_12_fixes = {
    # These are the truncated versions as they appear in CSV
    # Full Spanish inferred from audio filenames and logical completion

    "Si fueras lluvia yo sería Bogotá para te": {
        "back": "If you were rain I'd be Bogotá to have you all the time",
        "notes": "Romantic Colombian pickup line. Bogotá is very rainy. Means: If you were rain, I'd be Bogotá (rainy city) so I could have you all the time. Poetic cheesy compliment.",
        "alt_example": "Romantic Bogotá rain pickup line"
    },
    "Si fueras una arepa te comería todos los": {
        "back": "If you were an arepa I'd eat you every day",
        "notes": "Romantic food metaphor. Arepas are eaten daily in Colombia. Means: I'd want you every day like Colombians want arepas. Playful/cheesy pickup line.",
        "alt_example": "Romantic arepa daily metaphor"
    },
    "Si fueras una palabra estarías en el dic": {
        "back": "If you were a word you'd be in the dictionary under 'perfect'",
        "notes": "Cheesy romantic compliment/pickup line. Implies you're the definition of perfection. Classic corny line still used playfully.",
        "alt_example": "Cheesy dictionary perfect line"
    },
    "Si la belleza fuera delito yo te daría c": {
        "back": "If beauty were a crime I'd give you life in prison",
        "notes": "Flirtatious pickup line. 'Cadena perpetua' = life sentence. Exaggerated compliment about extreme beauty being criminal. Colombian flirt culture.",
        "alt_example": "Flirty beauty criminal pickup line"
    },
    "Solo míomía": {
        "back": "Only mine",
        "notes": "Possessive romantic statement. Gender-neutral version with both mío/mía. Example: 'Eres solo mío/mía, de nadie más' (You're only mine, nobody else's)",
        "alt_example": "Possessive romantic | Only mine"
    },
    "Tu belleza es la octava maravilla del mu": {
        "back": "Your beauty is the eighth wonder of the world",
        "notes": "Romantic exaggeration. Seven wonders officially exist, so eighth = beyond all known wonders. Cheesy but endearing pickup line.",
        "alt_example": "Romantic eighth wonder compliment"
    },
    "Tu mirada me pega más duro que el sol en": {
        "back": "Your gaze hits me harder than the sun in Cartagena",
        "notes": "Colombian romantic metaphor. Cartagena sun is intensely hot. Your look affects me more powerfully than intense Caribbean sun. Poetic/playful.",
        "alt_example": "Colombian intense gaze metaphor"
    },
    "Tu papá es ladrón Porque robó las estrel": {
        "back": "Your dad is a thief because he stole the stars from the sky to put them in your eyes",
        "notes": "Classic ultra-cheesy pickup line. Implies eyes sparkle like stars stolen from sky. Very cliché but still used playfully in Colombian flirting.",
        "alt_example": "Classic cheesy star eyes pickup"
    },
    "Tus ojos son como el café colombiano osc": {
        "back": "Your eyes are like Colombian coffee, dark and addictive",
        "notes": "Colombian romantic coffee metaphor. Compares dark eyes to Colombia's famous dark addictive coffee. Patriotic poetic compliment.",
        "alt_example": "Colombian coffee eyes comparison"
    },
    "Tus ojos tienen más magia que el Carnava": {
        "back": "Your eyes have more magic than the Carnaval de Barranquilla",
        "notes": "Colombian romantic reference. Carnaval de Barranquilla = Colombia's magical famous carnival. Eyes more magical than legendary festival. Patriotic flirt.",
        "alt_example": "Colombian carnival eyes metaphor"
    },
    "Vamos conociendonos más": {
        "back": "Let's get to know each other more",
        "notes": "Dating/relationship progression suggestion. Example: 'Vamos conociéndonos más antes de definir la relación' (Let's get to know each other more before defining the relationship)",
        "alt_example": "Dating: get to know each other"
    },
    "Yo pongo la música tú eliges el lugar": {
        "back": "I'll provide the music, you choose the place",
        "notes": "Collaborative planning. Division of responsibilities for date/gathering. Example: 'Yo pongo la música tú eliges el lugar para la fiesta' (I'll provide the music, you choose the place for the party)",
        "alt_example": "Collaborative date planning"
    },
}

print(f"Final 12 fixes: {len(final_12_fixes)} cards")
