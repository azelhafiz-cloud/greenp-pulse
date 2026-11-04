import { EmissionFactor, Challenge, KnowledgeCard, Badge, QuickAction } from '@/types';

// CO2 Emission Factors
export const EMISSION_FACTORS: EmissionFactor[] = [
  // Transport
  {
    label: 'Car (petrol)',
    unit: 'km',
    factor: 0.192,
    category: 'transport',
    action: 'car-petrol',
    icon: 'directions_car',
    description: 'Driving a petrol/gasoline car',
  },
  {
    label: 'Car (diesel)',
    unit: 'km',
    factor: 0.168,
    category: 'transport',
    action: 'car-diesel',
    icon: 'local_shipping',
    description: 'Driving a diesel car',
  },
  {
    label: 'Bus',
    unit: 'km',
    factor: 0.089,
    category: 'transport',
    action: 'bus',
    icon: 'directions_bus',
    description: 'Riding a public bus',
  },
  {
    label: 'Train / Metro',
    unit: 'km',
    factor: 0.041,
    category: 'transport',
    action: 'train',
    icon: 'train',
    description: 'Taking a train or metro',
  },
  {
    label: 'Motorcycle',
    unit: 'km',
    factor: 0.114,
    category: 'transport',
    action: 'motorcycle',
    icon: 'two_wheeler',
    description: 'Riding a motorcycle',
  },
  {
    label: 'Flight (short haul)',
    unit: 'km',
    factor: 0.255,
    category: 'transport',
    action: 'flight-short',
    icon: 'flight',
    description: 'Short-haul flight (< 3 hrs)',
  },
  {
    label: 'Cycling',
    unit: 'km',
    factor: 0.0,
    category: 'transport',
    action: 'cycling',
    icon: 'pedal_bike',
    description: 'Zero-emission cycling',
  },
  {
    label: 'Walking',
    unit: 'km',
    factor: 0.0,
    category: 'transport',
    action: 'walking',
    icon: 'directions_walk',
    description: 'Walking — zero emissions',
  },

  // Food
  {
    label: 'Beef meal',
    unit: 'meals',
    factor: 3.0,
    category: 'food',
    action: 'beef',
    icon: 'restaurant',
    description: 'A beef-based meal',
  },
  {
    label: 'Pork / Chicken meal',
    unit: 'meals',
    factor: 1.2,
    category: 'food',
    action: 'chicken',
    icon: 'set_meal',
    description: 'A pork or chicken meal',
  },
  {
    label: 'Plant-based meal',
    unit: 'meals',
    factor: 0.3,
    category: 'food',
    action: 'plant-based',
    icon: 'eco',
    description: 'A fully plant-based meal',
  },
  {
    label: 'Fish / Seafood',
    unit: 'meals',
    factor: 0.6,
    category: 'food',
    action: 'fish',
    icon: 'set_meal',
    description: 'Fish or seafood meal',
  },
  {
    label: 'Dairy (milk/cheese)',
    unit: 'servings',
    factor: 0.9,
    category: 'food',
    action: 'dairy',
    icon: 'local_drink',
    description: 'Dairy serving (glass of milk or slice of cheese)',
  },

  // Energy
  {
    label: 'Electricity (grid)',
    unit: 'kWh',
    factor: 0.233,
    category: 'energy',
    action: 'electricity',
    icon: 'bolt',
    description: 'Electricity from the power grid',
  },
  {
    label: 'Natural gas heating',
    unit: 'kWh',
    factor: 0.184,
    category: 'energy',
    action: 'gas-heating',
    icon: 'local_fire_department',
    description: 'Home heating with natural gas',
  },
  {
    label: 'Solar electricity',
    unit: 'kWh',
    factor: 0.011,
    category: 'energy',
    action: 'solar',
    icon: 'solar_power',
    description: 'Solar-generated electricity',
  },

  // Waste
  {
    label: 'General waste',
    unit: 'kg',
    factor: 0.43,
    category: 'waste',
    action: 'general-waste',
    icon: 'delete',
    description: 'General household waste to landfill',
  },
  {
    label: 'Recycled waste',
    unit: 'kg',
    factor: 0.02,
    category: 'waste',
    action: 'recycling',
    icon: 'recycling',
    description: 'Waste sent to recycling',
  },
  {
    label: 'Composting',
    unit: 'kg',
    factor: 0.01,
    category: 'waste',
    action: 'composting',
    icon: 'yard',
    description: 'Organic waste composted',
  },
];

// Daily & Weekly Challenges
export const CHALLENGES: Challenge[] = [
  {
    id: 'c1',
    title: 'Walk or Cycle Today',
    description: 'Skip the car and walk or cycle for at least one trip today.',
    category: 'transport',
    points: 30,
    icon: 'pedal_bike',
    difficulty: 'easy',
    co2SavedKg: 1.5,
  },
  {
    id: 'c2',
    title: 'No Single-Use Plastic',
    description: 'Refuse all single-use plastic items today — bring your own bag and bottle.',
    category: 'waste',
    points: 25,
    icon: 'water_drop',
    difficulty: 'easy',
    co2SavedKg: 0.5,
  },
  {
    id: 'c3',
    title: 'Plant-Based Meal Day',
    description: 'Eat fully plant-based for at least one meal today.',
    category: 'food',
    points: 20,
    icon: 'eco',
    difficulty: 'easy',
    co2SavedKg: 2.7,
  },
  {
    id: 'c4',
    title: 'Turn Off Unused Lights',
    description: 'Switch off all lights and appliances when leaving a room.',
    category: 'energy',
    points: 15,
    icon: 'lightbulb',
    difficulty: 'easy',
    co2SavedKg: 0.3,
  },
  {
    id: 'c5',
    title: 'Use Public Transport',
    description: 'Take a bus, train, or metro instead of driving a private vehicle.',
    category: 'transport',
    points: 25,
    icon: 'train',
    difficulty: 'easy',
    co2SavedKg: 1.2,
  },
  {
    id: 'c6',
    title: 'Cold Shower Challenge',
    description: 'Take a cold or cool shower to save hot water energy.',
    category: 'energy',
    points: 20,
    icon: 'shower',
    difficulty: 'medium',
    co2SavedKg: 0.6,
  },
  {
    id: 'c7',
    title: 'Meatless Monday',
    description: 'Go completely meat-free for the entire day.',
    category: 'food',
    points: 35,
    icon: 'spa',
    difficulty: 'medium',
    co2SavedKg: 3.5,
  },
  {
    id: 'c8',
    title: 'Zero Food Waste Day',
    description: "Finish all your food — no waste goes to the bin today.",
    category: 'waste',
    points: 30,
    icon: 'recycling',
    difficulty: 'medium',
    co2SavedKg: 0.8,
  },
  {
    id: 'c9',
    title: 'Unplug Standby Devices',
    description: 'Unplug phone chargers, TVs, and other standby devices when not in use.',
    category: 'energy',
    points: 15,
    icon: 'power_off',
    difficulty: 'easy',
    co2SavedKg: 0.2,
  },
  {
    id: 'c10',
    title: 'Plastic-Free Shopping',
    description: 'Complete your grocery shopping with zero plastic packaging.',
    category: 'waste',
    points: 40,
    icon: 'shopping_bag',
    difficulty: 'hard',
    co2SavedKg: 0.4,
  },
  {
    id: 'c11',
    title: 'Plant Something',
    description: 'Plant a seed, sapling, or herb — even a windowsill pot counts!',
    category: 'nature',
    points: 50,
    icon: 'yard',
    difficulty: 'medium',
    co2SavedKg: 0.1,
  },
  {
    id: 'c12',
    title: 'Carpool or Rideshare',
    description: 'Share a car journey with at least one other person.',
    category: 'transport',
    points: 20,
    icon: 'group',
    difficulty: 'easy',
    co2SavedKg: 0.9,
  },
];

// Knowledge Cards
export const KNOWLEDGE_CARDS: KnowledgeCard[] = [
  {
    id: 'k1',
    title: 'Solar Power is Booming',
    content:
      'Solar energy is now the cheapest electricity source in history. In 2023, solar installations grew by 87% globally, powering over 1 billion homes worldwide.',
    category: 'clean-energy',
    icon: 'solar_power',
    fact: 'One hour of sunlight could power the entire world for a year.',
    color: 'from-amber-400 to-yellow-500',
  },
  {
    id: 'k2',
    title: 'Forests are Our Lungs',
    content:
      'Tropical rainforests produce 20% of the world\'s oxygen and absorb billions of tonnes of CO₂ each year. A single mature tree can absorb up to 22 kg of CO₂ annually.',
    category: 'nature-facts',
    icon: 'forest',
    fact: 'A single tree can absorb up to 22 kg of CO₂ per year.',
    color: 'from-forest-600 to-forest-800',
  },
  {
    id: 'k3',
    title: 'The Power of Plant-Based Eating',
    content:
      'Switching from a meat-heavy diet to a plant-rich diet can reduce your food carbon footprint by up to 73%. Plant proteins require up to 18 times less land than beef.',
    category: 'daily-habits',
    icon: 'eco',
    fact: 'Going vegan for one day saves 4,000 litres of water.',
    color: 'from-sage-500 to-forest-600',
  },
  {
    id: 'k4',
    title: 'Wind Energy Revolution',
    content:
      'Modern wind turbines can generate enough electricity for 1,400 homes per year. Wind power is now the largest source of renewable electricity in many countries.',
    category: 'clean-energy',
    icon: 'air',
    fact: 'Wind energy grew by 50% in 2023 alone.',
    color: 'from-mint-500 to-mint-700',
  },
  {
    id: 'k5',
    title: 'Ocean Carbon Sinks',
    content:
      'The world\'s oceans absorb about 25% of all CO₂ emissions and 90% of excess heat from climate change. Healthy marine ecosystems are essential for our climate.',
    category: 'conservation',
    icon: 'water',
    fact: 'Oceans cover 71% of Earth and regulate our entire climate.',
    color: 'from-blue-500 to-cyan-600',
  },
  {
    id: 'k6',
    title: 'Composting Magic',
    content:
      'Composting food scraps keeps them out of landfill, reducing methane emissions. Compost also enriches soil, reducing the need for chemical fertilizers.',
    category: 'daily-habits',
    icon: 'compost',
    fact: 'Food waste in landfills generates 8% of global greenhouse gases.',
    color: 'from-green-600 to-emerald-700',
  },
  {
    id: 'k7',
    title: 'Electric Vehicles are Greening Up',
    content:
      'EVs emit 50–70% less CO₂ over their lifetime compared to petrol cars, even accounting for battery production. As grids get greener, this gap keeps widening.',
    category: 'clean-energy',
    icon: 'electric_car',
    fact: 'EV sales grew 35% in 2023 to 14 million vehicles worldwide.',
    color: 'from-forest-500 to-mint-600',
  },
  {
    id: 'k8',
    title: 'Biodiversity Supports Life',
    content:
      'Over 75% of global food crops depend on pollinators like bees and butterflies. Loss of biodiversity directly threatens global food security and human health.',
    category: 'conservation',
    icon: 'local_florist',
    fact: 'Bees pollinate 1/3 of all the food we eat.',
    color: 'from-yellow-500 to-amber-600',
  },
  {
    id: 'k9',
    title: 'The 3Rs: Reduce, Reuse, Recycle',
    content:
      'Reducing consumption is the most powerful of the 3Rs. Recycling one aluminium can saves enough energy to run a TV for 3 hours. Reusing items can cut your waste footprint by 40%.',
    category: 'daily-habits',
    icon: 'recycling',
    fact: 'Recycling saves 30% of the energy needed to make new materials.',
    color: 'from-sage-400 to-sage-600',
  },
  {
    id: 'k10',
    title: 'Urban Green Spaces Matter',
    content:
      'City trees reduce urban temperatures by up to 5°C through shade and evapotranspiration. Green spaces improve air quality, reduce flooding, and boost mental wellbeing.',
    category: 'nature-facts',
    icon: 'park',
    fact: 'One city tree provides ecosystem services worth \$272/year.',
    color: 'from-forest-400 to-sage-600',
  },
  {
    id: 'k11',
    title: 'Geothermal Energy',
    content:
      'Earth\'s core is as hot as the surface of the sun. Geothermal energy already heats over 90% of homes in Iceland and can provide reliable baseload renewable power globally.',
    category: 'clean-energy',
    icon: 'volcano',
    fact: 'Iceland runs on nearly 100% renewable energy thanks to geothermal.',
    color: 'from-orange-500 to-red-600',
  },
  {
    id: 'k12',
    title: 'Water Conservation',
    content:
      'Less than 3% of Earth\'s water is fresh, and only 0.5% is easily accessible. Fixing a dripping tap can save over 3,000 litres of water per year.',
    category: 'conservation',
    icon: 'water_drop',
    fact: 'A 5-minute shower uses 45 litres vs 120 for a bath.',
    color: 'from-cyan-500 to-blue-600',
  },
];

// Daily CO2 budget target (average sustainable level)
export const DAILY_CO2_TARGET_KG = 5.0;
export const WEEKLY_CO2_TARGET_KG = 35.0;

// Points to tree equivalent
export const POINTS_PER_TREE = 500;
export const CO2_PER_TREE_KG = 22;

// Category colors
export const CATEGORY_COLORS = {
  transport: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', icon: 'text-blue-500' },
  food:      { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300', icon: 'text-amber-500' },
  energy:    { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-300', icon: 'text-yellow-500' },
  waste:     { bg: 'bg-sage-100 dark:bg-sage-900/30', text: 'text-sage-700 dark:text-sage-300', icon: 'text-sage-500' },
  nature:    { bg: 'bg-forest-100 dark:bg-forest-900/30', text: 'text-forest-700 dark:text-forest-300', icon: 'text-forest-500' },
};

export const KNOWLEDGE_CATEGORY_LABELS = {
  'clean-energy':  'Clean Energy',
  'conservation':  'Conservation',
  'daily-habits':  'Daily Habits',
  'nature-facts':  'Nature Facts',
};

// ─── Quick Log Actions ────────────────────────────────────────────────────────
export const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'q-walk',
    label: 'Walked / Cycled',
    icon: 'pedal_bike',
    emoji: '🚲',
    category: 'transport',
    action: 'cycling',
    quantity: 5,
    unit: 'km',
    co2Kg: 0.96, // 5 km avoided driving @ 0.192 kg/km
    points: 20,
    color: 'from-blue-400 to-blue-600',
  },
  {
    id: 'q-plant-meal',
    label: 'Plant-based meal',
    icon: 'eco',
    emoji: '🥗',
    category: 'food',
    action: 'plant-based',
    quantity: 1,
    unit: 'meals',
    co2Kg: 1.85, // Avoided beef/meat emission difference
    points: 15,
    color: 'from-forest-500 to-forest-700',
  },
  {
    id: 'q-no-plastic',
    label: 'No single-use plastic',
    icon: 'water_drop',
    emoji: '♻️',
    category: 'waste',
    action: 'recycling',
    quantity: 0.5,
    unit: 'kg',
    co2Kg: 0.45, // Lifecycle plastic manufacturing avoided
    points: 15,
    color: 'from-cyan-500 to-cyan-700',
  },
  {
    id: 'q-electricity',
    label: 'Saved electricity',
    icon: 'bolt',
    emoji: '💡',
    category: 'energy',
    action: 'solar',
    quantity: 2,
    unit: 'kWh',
    co2Kg: 0.85, // Grid average ~0.42 kg CO2/kWh
    points: 10,
    color: 'from-amber-400 to-amber-600',
  },
  {
    id: 'q-public-transport',
    label: 'Public transport',
    icon: 'train',
    emoji: '🚌',
    category: 'transport',
    action: 'train',
    quantity: 10,
    unit: 'km',
    co2Kg: 1.45, // 10 km train/bus vs private combustion car
    points: 15,
    color: 'from-sage-500 to-sage-700',
  },
];

// ─── Collectible Leaves (Herbarium) ───────────────────────────────────────────
import { CollectibleLeaf, ForestFlora, PlantSkinId } from '@/types';

export const COLLECTIBLE_LEAVES: CollectibleLeaf[] = [
  {
    id: 'leaf-ginkgo',
    name: 'Golden Ginkgo Fan',
    rarity: 'common',
    icon: 'eco',
    color: 'from-amber-400 to-yellow-500',
    description: 'An ancient living fossil leaf celebrating zero-emission pedestrian journeys.',
    discoveryHint: 'Awarded on your first walk or cycling log.',
  },
  {
    id: 'leaf-basil',
    name: 'Dewdrop Basil Leaf',
    rarity: 'common',
    icon: 'spa',
    color: 'from-emerald-400 to-green-600',
    description: 'Fresh aromatic leaf honoring plant-forward, water-conscious nutrition.',
    discoveryHint: 'Awarded when choosing a plant-based meal.',
  },
  {
    id: 'leaf-fern',
    name: 'Sunfire Fern Frond',
    rarity: 'uncommon',
    icon: 'bolt',
    color: 'from-amber-500 to-orange-600',
    description: 'Vibrant frond that sparkles with conserved electrical energy.',
    discoveryHint: 'Awarded when logging electricity savings.',
  },
  {
    id: 'leaf-ocean',
    name: 'Ocean Glass Kelp',
    rarity: 'uncommon',
    icon: 'water_drop',
    color: 'from-cyan-400 to-blue-600',
    description: 'A translucent sea frond celebrating rivers and oceans kept free of plastics.',
    discoveryHint: 'Awarded when logging plastic-free habits.',
  },
  {
    id: 'leaf-clover',
    name: 'Morning Mist Clover',
    rarity: 'rare',
    icon: 'local_florist',
    color: 'from-teal-400 to-emerald-600',
    description: 'A delicate quadruple clover found when showering your plant with gentle hydration.',
    discoveryHint: 'Awarded when using plant care tools.',
  },
  {
    id: 'leaf-maple',
    name: 'Commuter Birch Leaf',
    rarity: 'rare',
    icon: 'train',
    color: 'from-indigo-400 to-purple-600',
    description: 'Shimmering leaf representing collective shared transit across cityscapes.',
    discoveryHint: 'Awarded when logging public transportation.',
  },
  {
    id: 'leaf-starlight',
    name: 'Starlight Willow Foliage',
    rarity: 'rare',
    icon: 'auto_awesome',
    color: 'from-rose-400 to-purple-600',
    description: 'Luminescent leaf that radiates softly under consecutive days of green dedication.',
    discoveryHint: 'Awarded upon reaching a 3-day green streak.',
  },
  {
    id: 'leaf-world',
    name: '✦ Celestial World-Leaf',
    rarity: 'legendary',
    icon: 'diamond',
    color: 'from-amber-300 via-emerald-400 to-teal-500',
    description: 'A mythic shimmering relic grown only in the crown of a fully ascended living grove.',
    discoveryHint: 'Awarded upon reaching Level 7 or Special Evolution.',
  },
];

export function checkCollectibleLeaves(
  stats: { activities: { action?: string; category?: string; isQuickLog?: boolean }[]; currentStreak: number; collectedLeaves?: string[] },
  plantLevel: number
): string[] {
  const current = new Set(stats.collectedLeaves ?? []);
  const newlyFound: string[] = [];

  const discover = (id: string, condition: boolean) => {
    if (condition && !current.has(id)) {
      newlyFound.push(id);
    }
  };

  const acts = stats.activities;
  discover('leaf-ginkgo', acts.some((a) => a.action === 'cycling' || a.action === 'walking'));
  discover('leaf-basil', acts.some((a) => a.category === 'food'));
  discover('leaf-fern', acts.some((a) => a.category === 'energy'));
  discover('leaf-ocean', acts.some((a) => a.category === 'waste'));
  discover('leaf-maple', acts.some((a) => a.action === 'train' || a.action === 'bus'));
  discover('leaf-clover', acts.some((a) => a.action?.startsWith('Plant Care') || a.isQuickLog));
  discover('leaf-starlight', stats.currentStreak >= 3);
  discover('leaf-world', plantLevel >= 7);

  return newlyFound;
}

// ─── Virtual Forest Companion Flora ───────────────────────────────────────────
export const VIRTUAL_FOREST_FLORA: ForestFlora[] = [
  {
    id: 'flora-fern',
    name: 'Whispering Fern',
    stageName: 'Dewy Fronds',
    levelRequired: 3,
    icon: 'park',
    color: 'from-emerald-400 to-forest-600',
    description: 'Carpet of resilient wild ferns that shade soil roots and release sweet forest ozone.',
    unlocked: true,
  },
  {
    id: 'flora-succulent',
    name: 'Sunstone Succulent',
    stageName: 'Crystal Rosette',
    levelRequired: 5,
    icon: 'yard',
    color: 'from-amber-400 to-orange-500',
    description: 'Stores solar energy during daylight and emits a calming warm thermal radiance at night.',
    unlocked: false,
  },
  {
    id: 'flora-orchid',
    name: 'Moonlit Epiphyte Orchid',
    stageName: 'Silver Petals',
    levelRequired: 7,
    icon: 'local_florist',
    color: 'from-purple-400 to-indigo-600',
    description: 'Rare canopy orchid pollinated only by nocturnal forest moths under starry night skies.',
    unlocked: false,
  },
  {
    id: 'flora-mushroom',
    name: 'Bioluminescent Ring',
    stageName: 'Fungal Network',
    levelRequired: 8,
    icon: 'flare',
    color: 'from-teal-400 to-cyan-500',
    description: 'Symbiotic mycorrhizal ring providing nutrient flow and deep teal ground illumination.',
    unlocked: false,
  },
  {
    id: 'flora-bonsai',
    name: 'Redwood Bonsai Companion',
    stageName: 'Ancient Miniature',
    levelRequired: 9, // Ascension
    icon: 'forest',
    color: 'from-emerald-500 to-teal-700',
    description: 'A miniature clone of a Pacific coast redwood, living for centuries in miniature majesty.',
    unlocked: false,
  },
];

// ─── Plant Cosmetic Skins ─────────────────────────────────────────────────────
export interface PlantSkinConfig {
  id: PlantSkinId;
  name: string;
  themeTitle: string;
  levelRequired: number;
  icon: string;
  primary: string;
  secondary: string;
  leaf: string;
  glow: string;
  trunk: string;
  blossom?: string;
  description: string;
}

export const PLANT_SKINS: PlantSkinConfig[] = [
  {
    id: 'emerald',
    name: 'Verdant Emerald',
    themeTitle: 'Classic Forest Sanctuary',
    levelRequired: 1,
    icon: 'eco',
    primary: '#16a34a',
    secondary: '#22c55e',
    leaf: '#4ade80',
    glow: 'rgba(34, 197, 94, 0.4)',
    trunk: '#78350f',
    description: 'The natural deep vitality of untouched ancient woodlands.',
  },
  {
    id: 'autumn',
    name: 'Autumn Amber',
    themeTitle: 'Golden Equinox Harvest',
    levelRequired: 3,
    icon: 'wb_sunny',
    primary: '#d97706',
    secondary: '#f59e0b',
    leaf: '#fbbf24',
    glow: 'rgba(245, 158, 11, 0.45)',
    trunk: '#713f12',
    blossom: '#ea580c',
    description: 'Sun-drenched golden foliage celebrating the bounty of earth cycles.',
  },
  {
    id: 'sakura',
    name: 'Sakura Blossom',
    themeTitle: 'Spring Renewal Grove',
    levelRequired: 5,
    icon: 'spa',
    primary: '#db2777',
    secondary: '#ec4899',
    leaf: '#f472b6',
    glow: 'rgba(244, 114, 182, 0.45)',
    trunk: '#581c87',
    blossom: '#fbcfe8',
    description: 'Delicate pink floral canopy symbolising fresh beginnings and gentle breezes.',
  },
  {
    id: 'midnight',
    name: 'Bioluminescent Neon',
    themeTitle: 'Nocturnal Starlight Grove',
    levelRequired: 6,
    icon: 'dark_mode',
    primary: '#0d9488',
    secondary: '#14b8a6',
    leaf: '#2dd4bf',
    glow: 'rgba(45, 212, 191, 0.55)',
    trunk: '#1e293b',
    blossom: '#67e8f9',
    description: 'Glowing bio-phosphorescent canopy that lights up tranquil night gardens.',
  },
  {
    id: 'celestial',
    name: 'Solar Celestial',
    themeTitle: 'Mythic Cosmos World-Tree',
    levelRequired: 7,
    icon: 'auto_awesome',
    primary: '#7c3aed',
    secondary: '#a855f7',
    leaf: '#f59e0b',
    glow: 'rgba(168, 85, 247, 0.6)',
    trunk: '#312e81',
    blossom: '#fef08a',
    description: 'An ethereal radiant entity crowned in starlight and solar warmth.',
  },
];

// ─── Plant Evolution Stages ───────────────────────────────────────────────────
export interface PlantStageConfig {
  level: number;
  name: string;
  stageName: string;
  threshold: number;
  description: string;
  formTitle: string;
  isSpecial?: boolean;
}

export const PLANT_STAGES: PlantStageConfig[] = [
  {
    level: 1,
    name: 'Seed of Hope',
    stageName: 'Just Planted',
    threshold: 0,
    description: 'A tiny seed resting in nutrient-rich soil, holding immense potential for our planet.',
    formTitle: 'Base Seedling',
  },
  {
    level: 2,
    name: 'First Sprout',
    stageName: 'Unfolding Green',
    threshold: 100,
    description: 'Bright twin cotyledons opening towards the light, fueled by your first conscious choices.',
    formTitle: 'Young Sprout',
  },
  {
    level: 3,
    name: 'Young Sapling',
    stageName: 'Reaching Upward',
    threshold: 250,
    description: 'Firm woody stem and delicate branchlets establishing a lifelong root in sustainable habits.',
    formTitle: 'Resilient Sapling',
  },
  {
    level: 4,
    name: 'Healthy Grove Plant',
    stageName: 'Thriving Foliage',
    threshold: 500,
    description: 'Broad green leaves respirating fresh clean air, actively cooling the micro-climate around you.',
    formTitle: 'Lush Foliage',
  },
  {
    level: 5,
    name: 'Flourishing Tree',
    stageName: 'Majestic Canopy',
    threshold: 900,
    description: 'A strong sheltering trunk with a wide living canopy that absorbs carbon and shelters nature.',
    formTitle: 'Forest Pillar',
  },
  {
    level: 6,
    name: 'Ancient Forest Elder',
    stageName: 'Living Legend',
    threshold: 1500,
    description: 'A venerable old-growth icon with deep ancient root networks connecting the entire ecosystem.',
    formTitle: 'Elder Oak',
  },
  {
    level: 7,
    name: 'Solar Bloom Wonder',
    stageName: 'Special Evolution · Stage I',
    threshold: 2400,
    description: 'An enlightened eco-tree adorned with glowing solar blossoms and glistening nectar droplets.',
    formTitle: '✦ Solar Bloom Form',
    isSpecial: true,
  },
  {
    level: 8,
    name: 'Celestial Biosphere',
    stageName: 'Special Evolution · Stage II',
    threshold: 3500,
    description: 'The pinnacle of ecological harmony — glowing starlight fruit and an aura of pure bio-luminescence.',
    formTitle: '✧ Celestial Biosphere',
    isSpecial: true,
  },
];

// ─── Plant Personality Expressions ───────────────────────────────────────────
export interface PlantDialogueRule {
  status?: 'thriving' | 'healthy' | 'needs-water' | 'wilting';
  minStreak?: number;
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  quotes: string[];
}

export const PLANT_PERSONALITY_QUOTES = {
  thriving: [
    "I'm glowing because of you! Every green action gives me life ✨",
    "Feel that fresh oxygen? We're breathing easier together today 🌿",
    "Look at my new leaves unfolding — we're unstoppable! 🍃",
    "You are my favorite human on this beautiful planet 💚",
  ],
  healthy: [
    "Growing stronger day by day. Thank you for caring for me 🌱",
    "Ready for our next green step whenever you are!",
    "Looking strong today — let's keep blooming together 🌿",
    "Every sustainable choice you make nourishes my roots 🌳",
  ],
  'needs-water': [
    "I'm feeling a little thirsty... A quick eco-action will revive me! 💧",
    "I missed you! Even a quick walk or meatless meal gives me energy 🍃",
    "A small green choice today will restore my bright color 🌤️",
    "Waiting for your gentle touch — let's log something green today!",
  ],
  wilting: [
    "My leaves are drooping... but your care can bring me right back 🥺💧",
    "I missed your kindness! One quick tap restores my full vitality 🌿",
    "Please don't forget me — let's take a small eco action together today!",
    "I believe in you! Water me with an eco action and watch me rise 🌧️",
  ],
  morning: [
    "Good morning! The fresh morning sunlight feels wonderful with you ☀️",
    "A brand new dawn for the planet. Let's make it count!",
    "Morning dew on my leaves, ready for a green day ahead 🌿",
  ],
  afternoon: [
    "Soaking in the afternoon warmth! How's your carbon footprint today? 🌤️",
    "Peak photosynthesis hours! Feeling radiant thanks to you 🍃",
  ],
  evening: [
    "Evening breeze is so calming. Thank you for protecting our Earth today 🌙",
    "Reflecting on all the carbon we saved together today ✨",
  ],
  nurtured: [
    "Ahhh, that feels so refreshing! Thank you! 💧✨",
    "Fresh vitality coursing through my branches! 🌿",
    "Sparkling with gratitude for your loving care! 💚",
  ],
};

// ─── Badge Definitions ────────────────────────────────────────────────────────
export const BADGE_DEFINITIONS: Omit<Badge, 'earned' | 'earnedAt'>[] = [
  {
    id: 'first-step',
    title: 'First Step',
    description: 'Logged your very first eco action.',
    icon: 'footprint',
    color: 'from-forest-400 to-forest-600',
  },
  {
    id: 'first-challenge',
    title: 'Challenge Accepted',
    description: 'Completed your first green challenge.',
    icon: 'emoji_events',
    color: 'from-amber-400 to-amber-600',
  },
  {
    id: 'streak-3',
    title: '3-Day Streak',
    description: 'Kept your green streak alive for 3 consecutive days.',
    icon: 'local_fire_department',
    color: 'from-orange-400 to-red-500',
  },
  {
    id: 'streak-7',
    title: 'Week Warrior',
    description: 'Maintained a 7-day unbroken green streak.',
    icon: 'military_tech',
    color: 'from-forest-500 to-mint-600',
  },
  {
    id: 'streak-14',
    title: 'Fortnight Hero',
    description: 'A 14-day streak — sustained environmental commitment.',
    icon: 'workspace_premium',
    color: 'from-purple-500 to-indigo-600',
  },
  {
    id: 'streak-30',
    title: 'Earth Champion',
    description: 'A full 30-day streak of sustainable daily habits.',
    icon: 'diamond',
    color: 'from-emerald-400 to-teal-600',
  },
  {
    id: 'challenges-5',
    title: 'Challenge Chaser',
    description: 'Completed 5 green challenges across categories.',
    icon: 'verified',
    color: 'from-mint-500 to-forest-600',
  },
  {
    id: 'challenges-10',
    title: 'Eco Champion',
    description: 'Completed 10 green challenges — inspiring dedication!',
    icon: 'star',
    color: 'from-yellow-400 to-amber-600',
  },
  {
    id: 'challenges-25',
    title: 'Green Legend',
    description: 'Completed 25 challenges. You are an eco trailblazer!',
    icon: 'military_tech',
    color: 'from-cyan-400 to-blue-600',
  },
  {
    id: 'plant-protector',
    title: 'Sapling Nurturer',
    description: 'Your plant grew to Level 3 (Young Sapling).',
    icon: 'forest',
    color: 'from-forest-600 to-forest-800',
  },
  {
    id: 'ancient-forest',
    title: 'Ancient Guardian',
    description: 'Cultivated your plant into a magnificent Level 6 Forest Elder.',
    icon: 'park',
    color: 'from-forest-700 to-sage-800',
  },
  {
    id: 'evolved-form',
    title: 'Special Evolution',
    description: 'Awakened a mythical Special Evolved plant form (Level 7+).',
    icon: 'auto_awesome',
    color: 'from-amber-400 to-rose-500',
  },
  {
    id: 'plant-whisperer',
    title: 'Plant Whisperer',
    description: 'Restored a thirsty or wilted plant back to thriving vitality.',
    icon: 'water_drop',
    color: 'from-sky-400 to-cyan-600',
  },
  {
    id: 'climate-watcher',
    title: 'Climate Pulse Watcher',
    description: 'Explored real-time NOAA atmospheric CO₂ concentrations.',
    icon: 'public',
    color: 'from-teal-400 to-emerald-600',
  },
  {
    id: 'co2-saver',
    title: 'Carbon Cutter',
    description: 'Saved your first 10 kg of CO₂ emissions.',
    icon: 'air',
    color: 'from-sky-400 to-cyan-600',
  },
  {
    id: 'tree-planter',
    title: 'Living Tree Equivalent',
    description: 'Saved 22 kg of CO₂ — equal to a mature tree working for 1 year.',
    icon: 'nature',
    color: 'from-forest-500 to-sage-600',
  },
  {
    id: 'carbon-master',
    title: 'Century Cutter',
    description: 'Prevented over 50 kg of greenhouse gas emissions.',
    icon: 'cloud_done',
    color: 'from-indigo-400 to-cyan-600',
  },
  {
    id: 'quick-logger',
    title: 'Quick Green',
    description: 'Logged 10 quick eco-actions on the dashboard.',
    icon: 'flash_on',
    color: 'from-lime-400 to-forest-500',
  },
  {
    id: 'zero-waste-hero',
    title: 'Zero Waste Pioneer',
    description: 'Logged 5 plastic-free or waste-reduction actions.',
    icon: 'recycling',
    color: 'from-emerald-400 to-teal-500',
  },
  {
    id: 'points-500',
    title: 'Rising Green',
    description: 'Accumulated 500 total sustainability points.',
    icon: 'trending_up',
    color: 'from-emerald-400 to-forest-600',
  },
  {
    id: 'points-1000',
    title: 'Green Guardian',
    description: 'Earned 1,000 points. You are a cornerstone of our future!',
    icon: 'shield',
    color: 'from-forest-500 to-mint-500',
  },
];

// Badge checking logic — returns badge IDs newly earned
export function checkBadges(
  stats: {
    totalPoints: number;
    challengesCompleted: number;
    currentStreak: number;
    activities: { category?: string; isQuickLog?: boolean }[];
    earnedBadges: string[];
    totalCo2SavedKg: number;
    viewedClimateData?: boolean;
    revivedPlantCount?: number;
  },
  plantLevel: number
): string[] {
  const earned = new Set(stats.earnedBadges);
  const newlyEarned: string[] = [];

  const check = (id: string, condition: boolean) => {
    if (condition && !earned.has(id)) newlyEarned.push(id);
  };

  check('first-step', stats.activities.length >= 1);
  check('first-challenge', stats.challengesCompleted >= 1);
  check('streak-3', stats.currentStreak >= 3);
  check('streak-7', stats.currentStreak >= 7);
  check('streak-14', stats.currentStreak >= 14);
  check('streak-30', stats.currentStreak >= 30);
  check('challenges-5', stats.challengesCompleted >= 5);
  check('challenges-10', stats.challengesCompleted >= 10);
  check('challenges-25', stats.challengesCompleted >= 25);
  check('plant-protector', plantLevel >= 3);
  check('ancient-forest', plantLevel >= 6);
  check('evolved-form', plantLevel >= 7);
  check('plant-whisperer', (stats.revivedPlantCount ?? 0) >= 1);
  check('climate-watcher', Boolean(stats.viewedClimateData));
  check('co2-saver', stats.totalCo2SavedKg >= 10);
  check('tree-planter', stats.totalCo2SavedKg >= 22);
  check('carbon-master', stats.totalCo2SavedKg >= 50);
  check('quick-logger', stats.activities.filter((a) => a.isQuickLog).length >= 10);
  check('zero-waste-hero', stats.activities.filter((a) => a.category === 'waste').length >= 5);
  check('points-500', stats.totalPoints >= 500);
  check('points-1000', stats.totalPoints >= 1000);

  return newlyEarned;
}

// Motivational lines for weekly summary
export const MOTIVATIONAL_LINES = [
  "Every green action you take makes our world a little brighter. 🌿",
  "You're building a greener future, one day at a time. 🌱",
  "Small habits, big impact. Keep growing! 🌳",
  "Your planet thanks you. Keep up the incredible work! 💚",
  "Consistency is the key — you're proving it every day. 🍃",
  "Like a tree, your commitment to the planet grows stronger. 🌲",
  "You're not just saving the planet — you're inspiring others. ✨",
  "Another great week for you and the Earth. Keep shining! 🌍",
];
