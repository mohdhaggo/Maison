// The Maison Lumière collection.
// Each fragrance carries a story meant to touch the wearer, with a full
// breakdown of its ingredients (top / heart / base notes).

export const products = [
  {
    slug: "nuit-de-velours",
    name: "Nuit de Velours",
    tagline: "A Velvet Night",
    price: 185,
    family: "Amber Floral",
    accent: "#7b4ea8",
    accent2: "#e8a0bf",
    image:
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=80",
    story:
      "The first time you wore it, the room went quiet. Nuit de Velours is the memory of a midnight that refused to end — warm skin against cool silk, a secret you were not ready to share. It does not announce you. It lingers, the way a glance lingers, long after you have left the room.",
    description:
      "An opulent amber floral built for slow evenings and faster heartbeats. Bulgarian rose unfolds over a bed of vanilla and amber, while a whisper of black plum keeps it from ever feeling too sweet. Sensual, magnetic, unforgettable.",
    notes: {
      top: ["Black Plum", "Pink Pepper", "Bergamot"],
      heart: ["Bulgarian Rose", "Jasmine Sambac", "Orris Butter"],
      base: ["Amber", "Madagascar Vanilla", "Sandalwood", "White Musk"],
    },
    mood: ["Sensual", "Warm", "Evening"],
  },
  {
    slug: "lumiere-doree",
    name: "Lumière Dorée",
    tagline: "Golden Light",
    price: 210,
    family: "Warm Citrus",
    accent: "#d4af65",
    accent2: "#f2e2bd",
    image:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1200&q=80",
    story:
      "Some mornings the sun finds you before your alarm does, spilling gold across the floor. Lumière Dorée bottles that exact minute — the one where everything still feels possible. Wear it when you want to remember that you are the light in the room, not the one chasing it.",
    description:
      "A radiant, sun-warmed citrus wrapped in soft amber and neroli. Sicilian bergamot sparkles at first contact, then mellows into honeyed orange blossom and a golden, skin-like base. Optimistic and quietly luxurious.",
    notes: {
      top: ["Sicilian Bergamot", "Blood Orange", "Neroli"],
      heart: ["Orange Blossom", "Honey", "Mimosa"],
      base: ["Amber", "Tonka Bean", "Cedarwood"],
    },
    mood: ["Radiant", "Fresh", "Daytime"],
  },
  {
    slug: "jardin-secret",
    name: "Jardin Secret",
    tagline: "The Secret Garden",
    price: 168,
    family: "Green Floral",
    accent: "#1f6f6b",
    accent2: "#a8d5c8",
    image:
      "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=1200&q=80",
    story:
      "There is a garden only you know about — behind a gate you forgot you had the key to. Jardin Secret is rain on green leaves, the cool hush under old trees, the freedom of being completely unobserved. It smells like the version of you that exists before the world asks anything of you.",
    description:
      "A dewy green floral that feels like breathing for the first time all day. Crushed fig leaf and violet leaf open over lily of the valley, settling into a clean, mossy base. Calm, grounding, and quietly alive.",
    notes: {
      top: ["Fig Leaf", "Violet Leaf", "Green Mandarin"],
      heart: ["Lily of the Valley", "Peony", "White Tea"],
      base: ["Oakmoss", "Vetiver", "Soft Musk"],
    },
    mood: ["Calm", "Green", "Grounding"],
  },
  {
    slug: "oud-royal",
    name: "Oud Royal",
    tagline: "The Royal Oud",
    price: 295,
    family: "Woody Oud",
    accent: "#3d1142",
    accent2: "#d4af65",
    image:
      "https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?auto=format&fit=crop&w=1200&q=80",
    story:
      "This is the scent of someone who has nothing to prove. Oud Royal is heritage worn on the skin — smoke from a fire that has burned for centuries, leather softened by time, a confidence that does not need to raise its voice. Put it on and stand a little taller.",
    description:
      "A regal, smoky oud composition with depth that unfolds for hours. Rare agarwood meets saffron and rose, grounded by leather and resins. Commanding, refined, and built to be remembered.",
    notes: {
      top: ["Saffron", "Pink Pepper", "Bergamot"],
      heart: ["Agarwood (Oud)", "Bulgarian Rose", "Patchouli"],
      base: ["Leather", "Amber", "Sandalwood", "Labdanum"],
    },
    mood: ["Bold", "Smoky", "Luxurious"],
  },
  {
    slug: "reverie-blanche",
    name: "Rêverie Blanche",
    tagline: "White Daydream",
    price: 175,
    family: "White Floral",
    accent: "#e8a0bf",
    accent2: "#f7f1e6",
    image:
      "https://images.unsplash.com/photo-1619994403073-2cec844b8e63?auto=format&fit=crop&w=1200&q=80",
    story:
      "He kept the note you wrote. Rêverie Blanche is tenderness made visible — soft petals on warm skin, the blush of being adored, a love letter you can wear. It is gentle without being shy, the kind of beauty that makes people lean in closer.",
    description:
      "A luminous white floral built around tuberose and jasmine, softened with cashmere musk and a drop of coconut milk. Romantic, creamy, and impossibly soft. The fragrance equivalent of being held.",
    notes: {
      top: ["Pear", "Pink Freesia", "Coconut Milk"],
      heart: ["Tuberose", "Jasmine", "Gardenia"],
      base: ["Cashmere Musk", "Sandalwood", "Vanilla Orchid"],
    },
    mood: ["Romantic", "Soft", "Feminine"],
  },
  {
    slug: "ambre-nomade",
    name: "Ambre Nomade",
    tagline: "The Wanderer's Amber",
    price: 198,
    family: "Spicy Amber",
    accent: "#b5651d",
    accent2: "#f2e2bd",
    image:
      "https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&w=1200&q=80",
    story:
      "You were never meant to stay in one place. Ambre Nomade is the spice market at dusk, the warmth of a stranger's kindness in a country you cannot name, the thrill of not knowing where tomorrow leads. It is for the restless heart that calls the whole world home.",
    description:
      "A warm, spiced amber threaded with cinnamon, labdanum and a curl of smoke. Cardamom and clove ignite the opening before a rich, resinous drydown takes over. Adventurous, enveloping, and deeply comforting.",
    notes: {
      top: ["Cardamom", "Cinnamon", "Bitter Orange"],
      heart: ["Clove", "Carnation", "Olibanum"],
      base: ["Labdanum", "Benzoin", "Amber", "Tobacco"],
    },
    mood: ["Spicy", "Warm", "Adventurous"],
  },
  {
    slug: "eau-de-minuit",
    name: "Eau de Minuit",
    tagline: "Midnight Water",
    price: 160,
    family: "Aromatic Fresh",
    accent: "#1a4f8a",
    accent2: "#9fc7f0",
    image:
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1200&q=80",
    story:
      "The city is asleep and the streets are yours. Eau de Minuit is a cool breath of sea air at midnight, salt on your skin, the clarity that only comes when no one is watching. It is fresh the way a deep breath is fresh — like a reset, like permission to begin again.",
    description:
      "A crisp aromatic fresh scent with marine accords, mint and sage over a clean woody base. Invigorating and modern, it feels like cold water and clear thinking. Effortless, confident, endlessly wearable.",
    notes: {
      top: ["Sea Salt", "Mint", "Grapefruit"],
      heart: ["Clary Sage", "Lavender", "Rosemary"],
      base: ["Driftwood", "Vetiver", "Ambroxan"],
    },
    mood: ["Fresh", "Cool", "Modern"],
  },
  {
    slug: "rose-imperiale",
    name: "Rose Impériale",
    tagline: "The Imperial Rose",
    price: 220,
    family: "Rose Chypre",
    accent: "#9b1d4e",
    accent2: "#e8a0bf",
    image:
      "https://images.unsplash.com/photo-1557170334-a9632e77c6e4?auto=format&fit=crop&w=1200&q=80",
    story:
      "A rose with a spine of steel. Rose Impériale is elegance that refuses to apologize — petals layered over dark woods and a trail of patchouli that follows you like quiet authority. It is for the woman, or the man, who is soft and unbreakable at once.",
    description:
      "A sophisticated rose chypre where Turkish rose absolute meets patchouli, oud and a velvet of dark fruits. Rich, regal and timeless — a modern heirloom you wear on the days that matter most.",
    notes: {
      top: ["Raspberry", "Pink Pepper", "Bergamot"],
      heart: ["Turkish Rose Absolute", "Geranium", "Peony"],
      base: ["Patchouli", "Oud", "Amber", "Vanilla"],
    },
    mood: ["Elegant", "Powerful", "Timeless"],
  },
  {
    slug: "rouge-desir",
    name: "Rouge Désir",
    tagline: "The Colour of Wanting",
    price: 205,
    family: "Fruity Gourmand",
    accent: "#d11f3a",
    accent2: "#ff7a8a",
    image:
      "https://images.unsplash.com/photo-1592914610354-fd354ea45e48?auto=format&fit=crop&w=1200&q=80",
    story:
      "Desire has a colour, and it is this red. Rouge Désir is the half-second before a first kiss — heat rising to the surface, the dare in someone's smile, the thrill of finally letting yourself want what you want. It is not subtle, and it was never meant to be.",
    description:
      "A decadent fruity gourmand that opens on crushed red cherry and pomegranate, melting into a heart of praline and rose before a warm, edible drydown of vanilla and tonka. Juicy, addictive, and unapologetically bold.",
    notes: {
      top: ["Red Cherry", "Pomegranate", "Pink Pepper"],
      heart: ["Praline", "Rose", "Iris"],
      base: ["Vanilla", "Tonka Bean", "Cacao", "Benzoin"],
    },
    mood: ["Bold", "Sweet", "Magnetic"],
  },
];

export function getProduct(slug) {
  return products.find((p) => p.slug === slug);
}
