#!/usr/bin/env python3
"""
Enhance intimate vocabulary additions with proper example sentences
"""

import csv

# Enhanced versions with full example sentences
INTIMATE_ENHANCEMENTS = {
    "Abre las piernas": {
        "example": "Abre las piernas para mí = Spread your legs for me"
    },
    "Arrodíllate": {
        "example": "Arrodíllate aquí = Get on your knees here"
    },
    "¿Acabaste?": {
        "example": "¿Ya acabaste mi amor? = Did you finish already my love?"
    },
    "Chúpamela": {
        "example": "Chúpamela rico = Suck it good"
    },
    "Chupa profundo": {
        "example": "Chupa profundo bebé = Suck deep baby"
    },
    "Dame duro": {
        "example": "Dame duro papi = Give it to me hard daddy"
    },
    "Dame oral": {
        "example": "Dame oral por favor = Go down on me please"
    },
    "Dedéame": {
        "example": "Dedéame despacio = Finger me slowly"
    },
    "Estás bien duro": {
        "example": "Ay papi estás bien duro = Oh daddy you're really hard"
    },
    "Estás bien grande": {
        "example": "Uy estás bien grande = Wow you're really big"
    },
    "Estás bien mojada": {
        "example": "Bebé estás bien mojada = Baby you're so wet"
    },
    "Estás empapado": {
        "example": "Estás empapado mi amor = You're soaking wet my love"
    },
    "Estoy a punto de venirme": {
        "example": "Papi estoy a punto de venirme = Daddy I'm about to cum"
    },
    "Estoy bien mojada": {
        "example": "Estoy bien mojada por ti = I'm so wet for you"
    },
    "Hacemos sin condón": {
        "example": "¿Hacemos sin condón? Estoy tomando pastillas = Let's do it without a condom? I'm on the pill"
    },
    "Hazme el amor": {
        "example": "Hazme el amor despacio = Make love to me slowly"
    },
    "Hazme tuya": {
        "example": "Hazme tuya esta noche = Make me yours tonight"
    },
    "Hazme venir": {
        "example": "Hazme venir con tu lengua = Make me cum with your tongue"
    },
    "La tengo bien parada": {
        "example": "Me tienes la tengo bien parada = You got me really hard"
    },
    "La tienes enorme": {
        "example": "Ay papi la tienes enorme = Oh daddy you have it enormous"
    },
    "Más duro": {
        "example": "Sí papi más duro = Yes daddy harder"
    },
    "Más rápido": {
        "example": "Más rápido bebé = Faster baby"
    },
    "Me encanta cómo me tocas": {
        "example": "Me encanta cómo me tocas ahí = I love how you touch me there"
    },
    "Me excita cuando...": {
        "example": "Me excita cuando me hablas así = It turns me on when you talk to me like that"
    },
    "Me gusta como lo haces": {
        "example": "Me gusta como lo haces mi amor = I like how you do it my love"
    },
    "Me haces venir": {
        "example": "Así me haces venir = Like that you make me cum"
    },
    "Me la chupas": {
        "example": "¿Me la chupas un ratito? = Will you suck it for a bit?"
    },
    "Me la mamas": {
        "example": "Me la mamas muy rico = You suck me really good"
    },
    "Me pones bien duro": {
        "example": "Bebé me pones bien duro = Baby you make me really hard"
    },
    "Me voy a venir": {
        "example": "Ay me voy a venir ya = Oh I'm going to cum now"
    },
    "Métela": {
        "example": "Métela toda = Put it all in"
    },
    "Méteme los dedos": {
        "example": "Méteme los dedos despacio = Put your fingers in me slowly"
    },
    "No pares": {
        "example": "No pares ahí está rico = Don't stop that feels good there"
    },
    "Párate en los tacones": {
        "example": "Párate en los tacones bebé = Stand on your heels baby"
    },
    "Ponte en cuatro": {
        "example": "Ponte en cuatro mami = Get on all fours mami"
    },
    "Quiero chupártela": {
        "example": "Quiero chupártela toda = I want to suck it all"
    },
    "Quiero hacerte venir": {
        "example": "Quiero hacerte venir con mi boca = I want to make you cum with my mouth"
    },
    "Quiero lamerte": {
        "example": "Quiero lamerte toda = I want to lick you all over"
    },
    "Quiero probarte": {
        "example": "Quiero probarte bebé = I want to taste you baby"
    },
    "Quiero que me la mames": {
        "example": "Quiero que me la mames bien rico = I want you to suck me really good"
    },
    "Quiero sentirte adentro": {
        "example": "Quiero sentirte adentro de mí = I want to feel you inside me"
    },
    "Quítate la ropa": {
        "example": "Quítate la ropa despacio = Take off your clothes slowly"
    },
    "Sácala": {
        "example": "Sácala un momento = Take it out for a moment"
    },
    "Se me paró": {
        "example": "Apenas te vi se me paró = As soon as I saw you it got hard"
    },
    "Sigue así": {
        "example": "Sigue así bebé está rico = Keep going like that baby it feels good"
    },
    "Sin goma": {
        "example": "¿Lo hacemos sin goma? = Should we do it without a condom?"
    },
    "Te chupo": {
        "example": "Te chupo si tú me chupas a mí = I'll suck you if you suck me"
    },
    "Te hago el oral": {
        "example": "Te hago el oral si quieres = I'll give you oral if you want"
    },
    "Te la como": {
        "example": "Déjame que te la como = Let me eat you out"
    },
    "Te la mamo": {
        "example": "Te la mamo hasta que te vengas = I'll suck it until you cum"
    },
    "Te quiero comer": {
        "example": "Te quiero comer toda = I want to eat you all up"
    },
    "Te quiero hacer el oral": {
        "example": "Te quiero hacer el oral bien rico = I want to go down on you really good"
    },
    "Te quiero sentir": {
        "example": "Te quiero sentir dentro de mí = I want to feel you inside me"
    },
    "Te vas a venir": {
        "example": "Ya te vas a venir ¿no? = You're going to cum now, right?"
    },
    "¿Te gusta así?": {
        "example": "¿Te gusta así bebé? = Do you like it like this baby?"
    },
    "¿Tienes condones?": {
        "example": "¿Tienes condones o gomas? = Do you have condoms?"
    },
    "Tócame": {
        "example": "Tócame aquí = Touch me here"
    },
    "Tócame ahí": {
        "example": "Sí tócame ahí mismo = Yes touch me right there"
    },
    "Úsame": {
        "example": "Úsame como quieras = Use me however you want"
    },
    "Ven en mi boca": {
        "example": "Ven en mi boca papi = Cum in my mouth daddy"
    },
    "Ven en mis nalgas": {
        "example": "Ven en mis nalgas bebé = Cum on my ass baby"
    },
    "Ven en mis tetas": {
        "example": "Ven en mis tetas = Cum on my tits"
    },
    "Voltéate": {
        "example": "Voltéate boca abajo = Turn around face down"
    },
    "¿Andas en tus días?": {
        "example": "¿Andas en tus días o podemos? = Are you on your period or can we?"
    },
    "¿Me vengo adentro?": {
        "example": "¿Me vengo adentro o afuera? = Should I cum inside or outside?"
    },
    "¿Puedo acabar adentro?": {
        "example": "¿Puedo acabar adentro mi amor? = Can I finish inside my love?"
    },
    "¿Puedo venirme adentro?": {
        "example": "¿Puedo venirme adentro? Estás tomando pastillas = Can I cum inside? Are you on the pill?"
    },
    "¿Qué tan mojada estás?": {
        "example": "¿Qué tan mojada estás bebé? = How wet are you baby?"
    },
    "¿Quieres que pare?": {
        "example": "¿Quieres que pare o sigo? = Do you want me to stop or keep going?"
    },
    "¿Te gusta?": {
        "example": "¿Te gusta así mi amor? = Do you like it like this my love?"
    },
    "¿Te veniste?": {
        "example": "¿Ya te veniste o quieres más? = Did you cum already or do you want more?"
    }
}

# Read the CSV
rows = []
with open('intimate_vocabulary_additions.csv', 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    header = next(reader)
    rows.append(header)

    for row in reader:
        if len(row) >= 4:
            spanish = row[0].strip()

            # Add example to notes
            if spanish in INTIMATE_ENHANCEMENTS:
                enhancement = INTIMATE_ENHANCEMENTS[spanish]
                current_notes = row[3]

                # Append example to existing notes
                if current_notes and not current_notes.endswith('.'):
                    current_notes += '.'

                row[3] = f"{current_notes} Example: {enhancement['example']}"

            rows.append(row)

# Write enhanced version
with open('intimate_vocabulary_additions.csv', 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(rows)

print(f"✅ Enhanced {len(INTIMATE_ENHANCEMENTS)} intimate cards with example sentences!")
