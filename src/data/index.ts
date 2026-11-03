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
    co2Kg: 0,
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
    co2Kg: 0.3,
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
    quantity: 0.1,
    unit: 'kg',
    co2Kg: 0.002,
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
    quantity: 1,
    unit: 'kWh',
    co2Kg: 0.011,
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
    co2Kg: 0.41,
    points: 15,
    color: 'from-sage-500 to-sage-700',
  },
];

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
    description: 'Kept your green streak alive for 3 days.',
    icon: 'local_fire_department',
    color: 'from-orange-400 to-red-500',
  },
  {
    id: 'streak-7',
    title: 'Week Warrior',
    description: 'Maintained a 7-day green streak.',
    icon: 'military_tech',
    color: 'from-forest-500 to-mint-600',
  },
  {
    id: 'streak-14',
    title: 'Fortnight Hero',
    description: 'A 14-day streak — you\'re unstoppable!',
    icon: 'workspace_premium',
    color: 'from-purple-500 to-indigo-600',
  },
  {
    id: 'challenges-5',
    title: 'Challenge Chaser',
    description: 'Completed 5 green challenges.',
    icon: 'verified',
    color: 'from-mint-500 to-forest-600',
  },
  {
    id: 'challenges-10',
    title: 'Eco Champion',
    description: 'Completed 10 green challenges — incredible!',
    icon: 'star',
    color: 'from-yellow-400 to-amber-600',
  },
  {
    id: 'challenges-25',
    title: 'Green Legend',
    description: 'Completed 25 challenges. You\'re a legend!',
    icon: 'diamond',
    color: 'from-cyan-400 to-blue-600',
  },
  {
    id: 'plant-protector',
    title: 'Plant Protector',
    description: 'Your plant grew to level 3 or above.',
    icon: 'forest',
    color: 'from-forest-600 to-forest-800',
  },
  {
    id: 'ancient-forest',
    title: 'Ancient Forest',
    description: 'Reached the highest plant level. Legendary!',
    icon: 'park',
    color: 'from-forest-700 to-sage-800',
  },
  {
    id: 'co2-saver',
    title: 'Carbon Cutter',
    description: 'Saved your first 10 kg of CO₂.',
    icon: 'air',
    color: 'from-sky-400 to-cyan-600',
  },
  {
    id: 'tree-planter',
    title: 'Tree Planter',
    description: 'Your impact is equivalent to planting 1 tree.',
    icon: 'nature',
    color: 'from-forest-500 to-sage-600',
  },
  {
    id: 'quick-logger',
    title: 'Quick Green',
    description: 'Used quick log buttons 10 times.',
    icon: 'flash_on',
    color: 'from-lime-400 to-forest-500',
  },
  {
    id: 'points-500',
    title: 'Rising Green',
    description: 'Earned 500 total green points.',
    icon: 'trending_up',
    color: 'from-emerald-400 to-forest-600',
  },
  {
    id: 'points-1000',
    title: 'Green Guardian',
    description: 'Earned 1,000 green points. Amazing!',
    icon: 'shield',
    color: 'from-forest-500 to-mint-500',
  },
];

// Badge checking logic — returns badge IDs newly earned
export function checkBadges(
  stats: { totalPoints: number; challengesCompleted: number; currentStreak: number; activities: { isQuickLog?: boolean }[]; earnedBadges: string[]; totalCo2SavedKg: number },
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
  check('challenges-5', stats.challengesCompleted >= 5);
  check('challenges-10', stats.challengesCompleted >= 10);
  check('challenges-25', stats.challengesCompleted >= 25);
  check('plant-protector', plantLevel >= 3);
  check('ancient-forest', plantLevel >= 6);
  check('co2-saver', stats.totalCo2SavedKg >= 10);
  check('tree-planter', stats.totalCo2SavedKg >= 22);
  check('quick-logger', stats.activities.filter(a => a.isQuickLog).length >= 10);
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
